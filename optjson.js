
import cables from "@cables/cables";
import jsonfile from "jsonfile";

cables._cli._baseUrl="https://local.cables.local"
cables.export({
    "patchId": "YIXVc6",
    "destination": "patch",
    "noMinify": true,
    "combinejs": false,
    "apiKey":"7bf3b8d08127602c0ac0230bf30fdc06325134f4cccf975a6a68a4ac02805da1eda4e9bc69353e368162dedb077541e2"
    // "dev": true
},
() => {

const fn="patch/js/voracious_mine.json"
jsonfile.readFile(fn, function (err, obj)
{
    if (err) console.error(err)
    const oldl=JSON.stringify(obj).length
    delete obj._id
    delete obj.export
    const replc=[]
    let countIds=0

    for(let i=0;i<obj.ops.length;i++)
    {
        const a= obj.ops[i] 
        replc.push({
          o:"\""+a.id+"\"",
          n:countIds
          });
          countIds++
        

        delete a.uiAttribs

        // if(obj.ops[i].portsOut)
        // {
        //     for(let c=0;c<obj.ops[i].portsOut.length;c++)
        //     {
        //         for(let j=0;j<obj.ops[i].portsOut[c].links.length;j++)
        //         {
        //             // obj.ops[i].portsOut[c].links[j].
        //            // console.log("text",obj.ops[i].portsOut[c].links)
        //             delete obj.ops[i].portsOut[c].links[j].objOut;
        //             delete obj.ops[i].portsOut[c].links[j].portOut;
        //         }
        //     }
        // }
    }

    let str=JSON.stringify(obj)
    for(let i=0;i<replc.length;i++)
    {
        str=str.replaceAll(replc[i].o,replc[i].n)
    }

    obj=JSON.parse(str)

    console.log(JSON.stringify(obj,null,4))
    const newl=JSON.stringify(obj).length
    // console.log("text",str)
    console.log("length "+oldl+" -> "+newl)


})
},

(e) => {
    console.log("err", e)
});
