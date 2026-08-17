
import jsonfile from "jsonfile";

// const fn="patch/js/graceful_branch.json"
// optJson(fn)

export function optJson(fn)
{
    

let obj=jsonfile.readFileSync(fn)
// , function (err, obj)
// {
    // if (err) console.error(err)
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
        
        if(a.attribs&&Object.keys(a.attribs).length==0) delete a.attribs

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

    // console.log(JSON.stringify(obj,null,4))
    const newl=JSON.stringify(obj).length
    // console.log("text",str)
    console.log("length "+oldl+" -> "+newl)
return JSON.stringify(obj)

// })

}
