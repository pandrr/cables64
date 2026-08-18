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
        "patch": "bDVLts",
      "type": "patch",
        "destination": "gen/export",
        "jsonfilename": "patch.cables",
        "allops": true,
    }
      ).then((r) => {
          console.log("done!",r)
        done()
      }).catch((e) => {

        console.log("err", e)
        done(e);
      })
}

function _add_websqz_inc_js() {
    return gulp
        .src(["gen/patch/js/patch_webpack.js", "inc_start.js"])
        .pipe(concat("complete.js"))
        .pipe(gulp.dest("gen/patch/js/"));
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
    optJson("gen/patch/js/patch.json")
    done()
}

function _run_websqz(done) {
    exec('websqz --js-main gen/patch/js/complete.js --output-directory gen/dist/',
        function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            done();
        });
}

const fetch = gulp.series(_export_patch)
// const crunch = gulp.series(_add_websqz_inc_js, _run_webpack, _run_optJson,_run_websqz);
const crunch = gulp.series(_run_webpack, _add_websqz_inc_js, _run_websqz);
const build = gulp.series(fetch, crunch);
const squeeze = gulp.series(_run_websqz);
export {
    build,
    fetch,
    crunch,
    squeeze
}
