var el=document.getElementById('chatHolder')
var header=document.getElementById('chatHead')
header.onmousedown=function (event){
    const startPos={
        x:event.pageX,
        y:event.pageY
    }

    function onMouseMove(event){
        let tmpx=event.pageX-startPos.x,tmpy=event.pageY-startPos.y
        changePos(tmpx,tmpy)
        startPos.x=event.pageX
        startPos.y=event.pageY
    }
    function changePos(x,y){
        el.style.top=(el.getBoundingClientRect().top+y)+'px'
        el.style.left=(el.getBoundingClientRect().left+x)+'px'
    }

    document.addEventListener('mousemove',onMouseMove)

    document.onmouseup=function (){   //Зануляю
        document.removeEventListener('mousemove',onMouseMove)
        document.onmouseup=null
    }
}