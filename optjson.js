import jsonfile from "jsonfile";
import fs from "fs";
import path from "path";

const options={
    deleteOutPortValues:true,
    minifyShader:true,
    replaceOpIds:true
}

// function optPorts(op,ports)
// {
//     // this does not work.... ports are not in correct order because uiattr.order and multiports etc...
//     const values=[]

//     for(let j=0;j<ports.length;j++)
//     {
//         if(ports[j].multiPortNum||ports[j].links)
//         {
//             try{
//                 // if(ports[j].hasOwnProperty("attribs") )
//                     // if(Object.keys(ports[j].attribs).length ==0)delete ports[j].attribs;

//                 values.push(ports[j])
//             }
//             catch(e)
//             {
//                 console.log("text",e,ports[j])
//             }
//         }
//         else
//         {
        
//         values.push(ports[j].attribs?.sg||ports[j].value)
//         }

//     }
//     return values
// }


export function optJson(fn)
{
    let obj=jsonfile.readFileSync(fn)
    const oldl=JSON.stringify(obj).length
    delete obj._id
    delete obj.export
    const replc=[]
    let countIds=0

    // if(options.delPortNames)
    //     for(let i=0;i<obj.ops.length;i++)
    //     {
       
    //         const op=obj.ops[i]
    //         if(Object.keys(op.attribs).length ==0)delete op.attribs
        
    //         if(op.portsIn)
    //         {
    //             op.valuesIn=optPorts(op,op.portsIn)
    //             delete op.portsIn
    //         }

    //         if(op.portsOut)
    //         {
    //             op.valuesOut=optPorts(op,op.portsOut)
    //             delete op.portsOut
    //         }

    //         // if(op.portsOut)
    //         //     for(let j=0;j<op.portsOut.length;j++)
    //         //         optPort(op.portsOut[j])
    //     }

    // delete titles
    for(let i=0;i<obj.ops.length;i++)
    {
        if(obj.ops[i].portsIn)
            for(let j=0;j<obj.ops[i].portsIn.length;j++)
                if(obj.ops[i].portsIn[j].title) delete obj.ops[i].portsIn[j].title

        if(obj.ops[i].portsOut)
            for(let j=0;j<obj.ops[i].portsOut.length;j++)
                if(obj.ops[i].portsOut[j].title) delete obj.ops[i].portsOut[j].title
    }

    if(options.deleteOutPortValues)
        for(let i=0;i<obj.ops.length;i++)
        {
            if(obj.ops[i].portsOut)
                for(let j=0;j<obj.ops[i].portsOut.length;j++)
                    if(obj.ops[i].portsOut[j].value) delete obj.ops[i].portsOut[j]
        }


    //minify shader code
    if(options.minifyShader)
        for(let i=0;i<obj.ops.length;i++)
        {
            if(obj.ops[i].portsIn)
            for(let j=0;j<obj.ops[i].portsIn.length;j++)
            {
                const port=obj.ops[i].portsIn[j]
                if(port.value&&port.value.length&&port.value.length>20) 
                {
                    const s=port.value.replaceAll("\\n","_")
                    console.log("value",port.name,port.value.includes("f32")||port.name,port.value.includes("vec4"))
                    port.value=minifyWGSL(port.value)
                
                }
            }
        }

    //replace op ids
    if(options.replaceOpIds)
    {
        for(let i=0;i<obj.ops.length;i++)
        {
            const a= obj.ops[i] 
            replc.push(
                {
                  o:"\""+a.id+"\"",
                  n:"\""+String(countIds)+"\""
              });
              countIds++
        
            if(a.attribs&&Object.keys(a.attribs).length==0) delete a.attribs

            delete a.uiAttribs
        }
    }

    let str=JSON.stringify(obj)

    if(options.replaceOpIds)
    {
        for(let i=0;i<replc.length;i++)
        {
            str=str.replaceAll(replc[i].o,replc[i].n)
        }
    }

    obj=JSON.parse(str)

    const newl=JSON.stringify(obj).length
     
    fs.writeFileSync(path.resolve("./patch/js/", "optimized_beauty.json"), JSON.stringify(obj,false,4) );

    console.log("length "+oldl+" -> "+newl)
    return JSON.stringify(obj)

}

function minifyWGSL(source) {
  let out = "";
  let i = 0;
  const n = source.length;

  while (i < n) {
    const c = source[i];
    const c2 = source[i + 1];

    // Line comment: // ... (until newline)
    if (c === "/" && c2 === "/") {
      i += 2;
      while (i < n && source[i] !== "\n") i++;
      continue; // newline (if any) handled by next loop iteration
    }

    // Block comment: /* ... */ (WGSL allows nesting)
    if (c === "/" && c2 === "*") {
      let depth = 1;
      i += 2;
      while (i < n && depth > 0) {
        if (source[i] === "/" && source[i + 1] === "*") {
          depth++;
          i += 2;
        } else if (source[i] === "*" && source[i + 1] === "/") {
          depth--;
          i += 2;
        } else {
          i++;
        }
      }
      // A removed comment must not fuse two adjacent tokens
      // (e.g. `a/**/b` must not become `ab`), so emit one space.
      out += " ";
      continue;
    }

    out += c;
    i++;
  }

  // Collapse runs of horizontal whitespace to a single space
  out = out.replace(/[ \t]+/g, " ");

  // Trim each line, drop empty lines
  const lines = out
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return lines.join("\n");
}
