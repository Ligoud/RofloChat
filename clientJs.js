const url = 'ws://localhost:8080'
const connection = new WebSocket(url)
/*
connection.onopen=()=>{
    connection.send('somethin sent')
}
*/
var colorList=[]
function getColor(name){    //Цвет для чата генерит
    function randomColor(){
        return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)
    }
    if(colorList[name]==undefined){
        let clr=randomColor()  //Рандомный цвет генерю
        colorList[name]=clr        
    }
    return colorList[name]
}
function addMessage(message,pos)    //В чат сообщение отправляет
{
    var chat=document.getElementById('chat')
    var newMsg=''
    if(pos=='leftpos'){
        var lmsg=JSON.parse(message)    
        newMsg='<div class="'+pos+'" title="От: '+lmsg.fio+'"><span style="color:'+getColor(lmsg.fio)+';">'+lmsg.text+'</span></div>'
    }else{
        var lmsg=message
        newMsg='<div class="'+pos+'"><span>'+message+'</span></div>'
    }
    chat.innerHTML+=newMsg
}

//******************************************
connection.onmessage=(msg)=>{   //ПОЛУЧЕНИЕ СООБЩЕНИЯ С СЕРВЕРА
    var msage=JSON.parse(msg.data) 

    if(msage.type==='public'){
        addMessage(msg.data,'leftpos')
    }
    else if (msage.type==='init'){
        alert(msage.alert)
        if(msage.alert=='Регистрация прошла успешно')
            document.getElementById('msgToSend').disabled=false
    }
}
//******************************************

function sendMessage(){ //На сервер сообщение отправлем
    var inpF=document.getElementById('msgToSend'),name=document.getElementById('namePlace').value
    var inp=inpF.value
    var obj={
        text:inp,
        fio:name,
        type:'public'        
    }
    connection.send(JSON.stringify(obj))
    addMessage(inp,'rightpos')
    //inpF.value=''
}
function enterSentMessage(e){
    if(e.keyCode==13)   //Нажат интер
    {
        sendMessage()
    }    
}
function initUser(e){
    if(e.keyCode==13)   //Нажат интер
    {
        var inpF=document.getElementById('namePlace')
        var obj={
            type:'init',
            fio: inpF.value
        }
        connection.send(JSON.stringify(obj))
    }
}

function addChatLabel(name){
    var map=document.getElementById('map')
    var span=document.createElement('span'),
        a=document.createElement('a')
    span.innerText=name
    a.insertAdjacentElement('beforeend',span)
    a.addEventListener('click',()=>{    //Нажатие на название чата слева

    })
    map.insertAdjacentElement('beforeend',a)
}
//document.getElementById('send').addEventListener('click',sendMessage)
document.getElementById('msgToSend').addEventListener('keyup',enterSentMessage)
document.getElementById('namePlace').addEventListener('keyup',initUser)