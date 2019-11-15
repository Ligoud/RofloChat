const webSocket=require('ws')
const wss=new webSocket.Server({port:8080})
var socketList=new Set()    //Уникальность
var Names={}
var Chats={}

function addMessageToMem(fio,type,text){
    ////Запоминаю для отправителя
    //type - название чата (уникальный идентификатор)
    if(Chats[type]===undefined)
        Chats[type]={}
    if(Chats[type].text===undefined)
        Chats[type].text=[]
    
    Chats[type].text.push({
        from: fio,        
        str:text    //Текст
    })
   // console.log('endOFShit')
    // 
}
function getType(msg)
{
    let conv='none'
    let conv1=msg.from+'-'+msg.to,
        conv2=msg.to+'-'+msg.from
    if(Chats[conv1]!==undefined)
        conv=conv1
    else if(Chats[conv2]!==undefined)
        conv=conv2
    return conv
}
wss.on('connection',(ws) =>{
    //socketList.add(ws)
    //console.log(ws)
    ws.on('message',(mm)=>{
        var msg=JSON.parse(mm)
        //console.log(msg)
        if(msg.type=='init'){   //Инициализация пользователя            
            var res='Пользователь с таким именем уже зарегистрирован'            
            if(Names[msg.fio]===undefined){
                socketList.add(ws)
                Names[msg.fio]={}
                Names[msg.fio].socket=ws;            
                res='Регистрация прошла успешно'
            }
            msg.alert=res
            ws.send(JSON.stringify(msg))
        }
        else if(msg.type=='public'){//Отправка всем сообщений            
            addMessageToMem(msg.fio,'public',msg.text)

            for(el in Names) {   //!!!!!ПЕРЕБИРАЕТ ПОЛЯ (ИМЕНА ПОЛЬЗОВАТЕЛЕЙ)
                if(Names[el].socket!==ws)
                {                                
                    Names[el].socket.send(JSON.stringify(msg))
                }
            }
        }else if(msg.type=='private'){
            let conversationName=msg.from+'-'+msg.to
            let conv=getType(msg)
            if(conv=='none')
                conv=conversationName
            //console.log(conv)
            addMessageToMem(msg.from,conv,msg.text) //сообщение добавляю
            Names[msg.to].socket.send(JSON.stringify(msg))
        }else if(msg.type=='getConv'){
            if(msg.extra=='public')
                ws.send(JSON.stringify({chat:Chats['public'],type:'conversation'}))
            else{
                let conv=getType(msg)
                if(conv!=='none')
                    ws.send(JSON.stringify({chat:Chats[conv],type:'conversation'}))
                else
                    ws.send(JSON.stringify({extra:conv,type:'conversation'}))
            }
//            if()
        }
    })
})
