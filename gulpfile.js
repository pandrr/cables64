import gulp from "gulp";
import concat from "gulp-concat";
import cables from "@cables/cables";
import {exec} from 'node:child_process';
import webpack from "webpack";
import webpackConfig from "./webpack.config.js";

function _export_patch(done) {
    cables._cli._baseUrl="https://local.cables.local"
    cables.export({
        "patchId": "xTZgE5",
        "destination": "patch",
        "noMinify": true,
        "combineJs": true,
        "apiKey":"7bf3b8d08127602c0ac0230bf30fdc06325134f4cccf975a6a68a4ac02805da1eda4e9bc69353e368162dedb077541e2"
        // "dev": true
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

export default gulp.series(_export_patch, _combine_js, _run_webpack, _run_websqz);

