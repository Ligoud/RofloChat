const webSocket=require('ws')
const wss=new webSocket.Server({port:8080})
var socketList=new Set()    //Уникальность
wss.on('connection',(ws) =>{
    socketList.add(ws)
    ws.on('message',(msg)=>{
        //console.log(msg)
        for(let el of socketList)
        {
            if(el!==ws)
            {   
                el.send(msg)
            }
        }
    })
})
