import gulp from "gulp";
import concat from "gulp-concat";
import cables from "@cables/cables";
import {exec} from 'node:child_process';
import webpack from "webpack";
import webpackConfig from "./webpack.config.js";

function _export_patch(done) {
    cables.export({
        "patchId": "7KM4J5",
        "destination": "patch",
        "noMinify": true,
        "combineJs": true,
        "dev": true
    },
    () => {
        done();
    },
    (e) => {
        console.log("err", e)
        done(e);
    });
}

function _combine_js() {
    return gulp
        .src(["patch/js/patch.js", "inc_start.js"])
        .pipe(concat("patch.js"))
        .pipe(gulp.dest("dist/"));
}

function _run_webpack(done) {
    webpack(webpackConfig(), (err, stats) => {
        if (err) throw err;
        if (stats.hasErrors()) {
            done(stats);
        }
        done();
    });
}

function _run_websqz(done) {
    exec('websqz --js-main dist/patch.js --output-directory dist/',
        function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            done();
        });
}

const fetch = gulp.series(_export_patch)
const crunch = gulp.series(_combine_js, _run_webpack, _run_websqz);
const build = gulp.series(fetch, crunch);
export {
    build,
    fetch,
    crunch
}

