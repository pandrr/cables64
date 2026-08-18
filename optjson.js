import jsonfile from "jsonfile";
import fs from "fs";
import path from "path";

const options={
    delPortNames:true,
    replaceOpIds:false
}

function optPorts(op,ports)
{
            const values=[]
            
            for(let j=0;j<ports.length;j++)
            {
                if(ports[j].multiPortNum||ports[j].links)
                {
                    if(Object.keys(ports[j].attribs).length ==0)delete ports[j].attribs;
                    values.push(ports[j])
                }
                else
                {
                    
                values.push(ports[j].attribs?.sg||ports[j].value)
                }

            }
return values
}


export function optJson(fn)
{
    let obj=jsonfile.readFileSync(fn)
    const oldl=JSON.stringify(obj).length
    delete obj._id
    delete obj.export
    const replc=[]
    let countIds=0

    for(let i=0;i<obj.ops.length;i++)
    {
       
        const op=obj.ops[i]
        if(Object.keys(op.attribs).length ==0)delete op.attribs
        
        if(op.portsIn)
        {
            op.valuesIn=optPorts(op,op.portsIn)
            delete op.portsIn
        }

        if(op.portsOut)
        {
            op.valuesOut=optPorts(op,op.portsOut)
            delete op.portsOut
        }

        // if(op.portsOut)
        //     for(let j=0;j<op.portsOut.length;j++)
        //         optPort(op.portsOut[j])
    }


    if(options.replaceOpIds)
    {
        for(let i=0;i<obj.ops.length;i++)
        {
            const a= obj.ops[i] 
            replc.push(
                {
                  o:"\""+a.id+"\"",
                  n:countIds
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

    // console.log(JSON.stringify(obj,null,4))
    const newl=JSON.stringify(obj).length
    // console.log("text",str)
     
    fs.writeFileSync(path.resolve("./patch/js/", "optimized_beauty.json"), JSON.stringify(obj,false,4) );

    console.log("length "+oldl+" -> "+newl)
    return JSON.stringify(obj)

}
