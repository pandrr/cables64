import gulp from "gulp";
import concat from "gulp-concat";
import {Cables} from "@cables/cables";
import {exec} from 'node:child_process';
import webpack from "webpack";
import webpackConfig from "./webpack.config.js";

import {optJson} from "./optjson.js";

function _export_patch(done) {
  const cables=new Cables()
    cables.export({
        "url":"https://dev.cables.gl",
        "patch": "uyywZr",
        "type": "patch",
        "destination": "export",
        "allops": true,
        "apikey":"95059a7d927ac0ca89c440fc68574268076c37cfffcd257afa0b08b378c68ff58bcea44ea5f169e24c77eb8e115cc5a3"
        // "dev": true
    }
      ).then((r) => {
          console.log("done!",r)
        done()
      }).catch((e) => {

        console.log("err", e)
        done(e);
      })
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

function _run_optJson(done) {
    optJson("patch/js/graceful_branch.json")
    done()
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
// const crunch = gulp.series(_combine_js, _run_webpack, _run_optJson,_run_websqz);
const crunch = gulp.series(_run_webpack, _combine_js, _run_websqz);
const build = gulp.series(fetch, crunch);
const squeeze = gulp.series(_run_websqz);
export {
    build,
    fetch,
    crunch,
    squeeze
}
