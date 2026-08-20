import fs from "fs"
import path from "path"
import {optJson} from "./optjson.js"



export function mergeall()
{

    console.log("merge all........")

    let targetDir="patch/js/"

    let jsonFileName = "patch.json"
    const jsonFile = path.resolve(path.join(targetDir, jsonFileName));
    let proJson = fs.readFileSync(jsonFile);

    proJson=optJson(jsonFile);
    // proJson=JSON.stringify(optJson(JSON.parse(proJson)));

    fs.writeFileSync(path.join(targetDir, "optimized.json"),proJson );

    const opsCode = fs.readFileSync(path.join(targetDir, "ops.js"));
    const shortId="0"

    let jsCode = "";

    jsCode += fs.readFileSync(path.join(targetDir, "cables.js"));
    jsCode += "\n";
    jsCode += "CABLES.exportedPatch="+proJson+";";
    jsCode += "\n";
    jsCode += opsCode;
    jsCode += "\n";
    jsCode += fs.readFileSync(path.join(targetDir, "minigpu.js"));
    jsCode += fs.readFileSync(path.join(targetDir, "shadergraph.js"));
    // jsCode += fs.readFileSync(path.join(targetDir, "cgl.js"));

    jsCode = jsCode.replaceAll(/[\u2028]/g, " ");
    jsCode = jsCode.replaceAll(/[\u2029]/g, " ");
    jsCode = jsCode.replaceAll(/[\u00A0]/g, " ");

    jsCode += 'function showError(initiator,...args)\n';
    jsCode += '{\n';
    jsCode += '    CABLES.logErrorConsole("[" + initiator + "]", ...args);\n';
    jsCode += '}\n';
    jsCode += '\n';
    jsCode += 'window.CABLES=CABLES;\n';
    jsCode += 'window.Ops =Ops;\n';
    jsCode += '\n';
    jsCode += 'CABLES.patch = new CABLES.Patch({\n';
    jsCode += '    patch: CABLES.exportedPatch,\n';
    // jsCode += '    "prefixAssetPath": "",\n';
    // jsCode += '    "jsPath": "js/",\n';
    // jsCode += '    "glCanvasResizeToWindow": true,\n';
    jsCode += '    "onError": showError,\n';
    jsCode += '});\n';

    if (!fs.existsSync("dist/")){
        fs.mkdirSync("dist/");
    }
    fs.writeFileSync(path.join(targetDir, "complete.js"), jsCode);
    fs.writeFileSync(path.join("dist/", "patch.js"), jsCode);

    console.log("finished", jsCode.length);

}
