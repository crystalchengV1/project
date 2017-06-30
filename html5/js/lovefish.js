/**
 * Created by Crystal on 2017/5/31.
 */
var can1;
var can2;
var ctx1;
var ctx2;
var lastTime;
var deltaTime;
var width;
var height;
var bgPic=new Image();
var ane;
var fruit;
var mom;
var mx;
var my;
var baby;
document.body.onload=game;
function game()
{
    init();
    lastTime=Date.now();
    deltaTime=0;
    gameloop();
}
function init()
{
    can1=document.getElementById("canvas1");
    ctx1=can1.getContext('2d');
    can2=document.getElementById("canvas2");
    ctx2=can2.getContext('2d');
    can1.addEventListener('mousemove',onMouseMove,false);
    width=can1.width;
    height=can1.height;
    bgPic.src="src/background.jpg";
    ane=new aneObj();
    ane.init();
    fruit=new fruitObj();
    fruit.init();
    mom=new momObj();
    mom.init();
    mx=width*0.5;
    my=height*0.5;
    baby=new babyObj();
    baby.init();
}
function gameloop()
{
    requestAnimFrame(gameloop);//setTimeout/setInterval/frame per second
    var now=Date.now();
    deltaTime=now-lastTime;
    lastTime=now;
    if(deltaTime>40){
        deltaTime=40;
    }
    drawBackground();
    ane.draw();
    fruit.draw();
    ctx1.clearRect(0,0,width,height);
    mom.draw();
    coll();
    baby.draw();
}
function onMouseMove(e)
{
    if(e.offSetX || e.layerX)
    {
        mx=e.offSetX==undefined?e.layerX:e.offSetX;
        my=e.offSetY==undefined?e.layerY:e.offSetY;
    }
}
