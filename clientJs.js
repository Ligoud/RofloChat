const url = 'ws://localhost:8080'
const connection = new WebSocket(url)
/*
connection.onopen=()=>{
    connection.send('somethin sent')
}
*/
function addMessage(message,pos)
{
    var chat=document.getElementById('chat')
    var newMsg=''
    if(pos=='leftpos'){
        var lmsg=JSON.parse(message)    
        newMsg='<div class="'+pos+'" title="От: '+lmsg.fio+'"><span>'+lmsg.text+'</span></div>'
    }else{
        var lmsg=message
        newMsg='<div class="'+pos+'"><span>'+message+'</span></div>'
    }
    chat.innerHTML+=newMsg
}
connection.onmessage=(msg)=>{
    addMessage(msg.data,'leftpos')
}
function sendMessage(){
    var inpF=document.getElementById('msgToSend'),name=document.getElementById('namePlace').value
    var inp=inpF.value
    var obj={
        text:inp,
        fio:name
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
//document.getElementById('send').addEventListener('click',sendMessage)
document.getElementById('msgToSend').addEventListener('keyup',enterSentMessage)