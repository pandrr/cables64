import gulp from "gulp";
import concat from "gulp-concat";
import cables from "@cables/cables";
import { exec } from 'node:child_process'

function _html_ui(done)
{
}

export default function defaultTask(cb)
{

    cables.export({
        "patchId": "7KM4J5",
        "destination": "patch",
        "noMinify":false,
        "combineJs":true,
        "dev":true
    },
         ()=>{
        console.log("yay")


     gulp
        .src(["patch/js/patch.js",  "inc_start.js"])
        .pipe(concat("patch.js"))
        .pipe(gulp.dest("dist/"));
       
      exec('websqz --js-main dist/patch.js --output-directory dist/',
                 function (err, stdout, stderr)
                 {
                    console.log(stdout);
                    console.log(stderr);
                    cb();

                });
        
    
  }, (e)=>{
        console.log("err",e)
      cb();

  });

}


 
