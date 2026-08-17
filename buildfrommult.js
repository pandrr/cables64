import fs from "fs"    
import path from "path"    
import {optJson} from "./optjson.js"



export function mergeall()
{

    console.log("merge all........")

    let targetDir="patch/js/"

    let jsonFileName = "copy_of_graceful_branch.json"
    const jsonFile = path.resolve(path.join(targetDir, jsonFileName));
    let proJson = fs.readFileSync(jsonFile);

    proJson=optJson(jsonFile);
    // proJson=JSON.stringify(optJson(JSON.parse(proJson)));

    const opsCode = fs.readFileSync(path.join(targetDir, "ops.js"));
    const shortId="0"

    let jsCode = "";


    jsCode += fs.readFileSync(path.join(targetDir, "cables.js"));
    jsCode += "\n";
    jsCode += opsCode;
    jsCode += "\n";
    // jsCode += "if(!CABLES.exportedPatches) CABLES.exportedPatches={};";
    // jsCode += "CABLES.exportedPatches['" + shortId + "']=" + proJson + ";";
jsCode+="\nconsole.log(1234);"
    jsCode += "CABLES.exportedPatch="+proJson+";";
    // jsCode += "\n";
    // jsCode += "if(!CABLES.exportedPatch){CABLES.exportedPatch=CABLES.exportedPatches['" + shortId + "']}";

jsCode+="console.log(CABLES.OPS);\n"

// jsCode+="window.CABLES.OPS=Ops;\n"
    jsCode += "window.addEventListener('load', function(event) {\n";
    jsCode += "CABLES.jsLoaded=new Event('CABLES.jsLoaded');\n";
    jsCode += "document.dispatchEvent(CABLES.jsLoaded);\n";
    jsCode += "});\n";


    jsCode += fs.readFileSync(path.join(targetDir, "minigpu.js"));
    jsCode += fs.readFileSync(path.join(targetDir, "shadergraph.js"));

jsCode+="function showError(initiator,...args)"
jsCode+="{"
jsCode+="CABLES.logErrorConsole( initiator , ...args);"
jsCode+="}\n"

jsCode+="console.log(CABLES.OPS);\n"
jsCode+="CABLES.patch = new CABLES.Patch({ "
jsCode+="    patch: CABLES.exportedPatch,"
jsCode+="    'prefixAssetPath': '',"
jsCode+="    'glCanvasResizeToWindow': true,"
jsCode+="    'onError': showError"
// jsCode+="    'onPatchLoaded': patchInitialized,"
// jsCode+="    'onFinishedLoading': patchFinishedLoading"
jsCode+="});"
    jsCode = jsCode.replaceAll(/[\u2028]/g, " ");
    jsCode = jsCode.replaceAll(/[\u2029]/g, " ");
    jsCode = jsCode.replaceAll(/[\u00A0]/g, " ");


    fs.writeFileSync(path.join(targetDir, "complete.js"), jsCode);
    fs.writeFileSync(path.join("dist/", "patch.js"), jsCode);

console.log("finished",jsCode.length)

}
