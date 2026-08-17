import gulp from "gulp";
import concat from "gulp-concat";
import {Cables} from "@cables/cables";
import {exec} from 'node:child_process';
import webpack from "webpack";
import webpackConfig from "./webpack.config.js";
import {mergeall}from "./buildfrommult.js"

import {optJson} from "./optjson.js";

function _export_patch(done) {
  const cables=new Cables()
    cables.export({

    "url":"https://local.cables.local",
        "patch": "LMgots",
        "destination": "patch",
        "minify": false,
        "jsonfilename":"patch.json",
        "index":false,
        "combinejs": false,
        "apikey":"7bf3b8d08127602c0ac0230bf30fdc06325134f4cccf975a6a68a4ac02805da1eda4e9bc69353e368162dedb077541e2"
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

// function _combine_js() {
//     return gulp
//         .src(["patch/js/complete.js", "inc_start.js"])
//         .pipe(concat("patch.js"))
//         .pipe(gulp.dest("dist/"));
// }

function _run_webpack(done) {
    webpack(webpackConfig(), (err, stats) => {
        if (err) throw err;
        if (stats.hasErrors()) {
            done(stats);
        }
        done();
    });
}

function _run_merge(done) {
    mergeall()
    done()
}

function _run_websqz(done) {
    exec('websqz --js-main patch/js/patch_webpack.js --output-directory dist/',
        function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            done();
        });
}

const fetch = gulp.series(_export_patch)
// const crunch = gulp.series(_combine_js, _run_webpack, _run_optJson,_run_websqz);
const crunch = gulp.series(_run_merge, _run_webpack, _run_websqz);
const build = gulp.series(fetch, crunch);
export {
    build,
    fetch,
    crunch
}
