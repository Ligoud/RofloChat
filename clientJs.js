const url = 'ws://localhost:8080'
const connection = new WebSocket(url)
/*
connection.onopen=()=>{
    connection.send('somethin sent')
}
*/
var currentConversation={
    type:'',
    from:'',
    to:'',
    text:'',
    fio:''
}
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
function toMain(){
    document.getElementById('chat').innerHTML=''
    var obj={
        type:'getConv',
        from: '',
        to:''    ,
        extra:'public'    
    }
    connection.send(JSON.stringify(obj)) 
}
function pm(spanEl){    
    var chat=document.getElementById('chat')
    var msgDiv=spanEl.parentElement
    //Тут можно проверку сделать, чтобы не постоянно обновлять
    chat.innerHTML=''
    var obj={
        type:'getConv',
        from: document.getElementById('namePlace').value,
        to:msgDiv.getAttribute('data-fio')        
    }
    connection.send(JSON.stringify(obj))    //Запрашиваю текст с сервера
    //
    /*
    connection.send(JSON.stringify(obj))*/
    var asds=document.querySelectorAll('a[data-convWIth]')
    var check=false
    if(asds.length>0){
        asds.forEach(el=>{
            if(el.getAttribute('data-convWith')==msgDiv.getAttribute('data-fio'))
                check=true
        })
    }
    if(!check){ //Создаю сбоку иконку если !check
        var span=document.createElement('span'),
            a=document.createElement('a'),
            aside=document.getElementById('map'),
            br=document.createElement('br')
        span.innerText=msgDiv.getAttribute('data-fio')
        a.setAttribute('href','#')
        a.setAttribute('data-convWith',msgDiv.getAttribute('data-fio'))
        a.classList.add('wodec')
        a.insertAdjacentElement('beforeend',span)
        aside.insertAdjacentElement('beforeend',a)
        aside.insertAdjacentElement('beforeend',br)
    }
    //

}
function addMessage(message,pos)    //В чат сообщение отправляет
{
    var chat=document.getElementById('chat')
    var newMsg=''
    if(pos=='leftpos'){
        var lmsg=JSON.parse(message)    
        newMsg='<div class="'+pos+'" title="От: '+lmsg.fio+'" data-fio="'+lmsg.fio+'"><span style="color:'+getColor(lmsg.fio)+';" onclick="pm(this)">'+lmsg.text+'</span></div>'
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
    }else if(msage.type==='conversation'){
        //Заново отрисовать тут
        if(msage.extra===undefined){
            let myName=document.getElementById('namePlace').value
            console.log(msage.chat)
            msage.chat.text.forEach(el=>{
                let pos='leftpos'
                if(myName==el.from)
                    addMessage(el.str,'rightpos')
                else{
                    addMessage(JSON.stringify({
                        fio:el.from,
                        text:el.str
                    }),pos)
                }
                
                
            })
            
        }
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
    currentConversation.text=inp
    currentConversation.fio=name
    currentConversation.type='public'
    connection.send(JSON.stringify(obj))
    addMessage(inp,'rightpos')
    //inpF.value=''
}
function enterSentMessage(e){
    if(e.keyCode==13)   //Нажат интер
    {
        //document.getElementById('msgToSend').innerText=''
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