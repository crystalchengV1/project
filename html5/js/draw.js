var canvas=document.getElementById("canvas");
var cxt=canvas.getContext("2d");

//获取工具
var Brush=document.getElementById("means_brush");
var Eraser=document.getElementById("means_eraser");
var Paint=document.getElementById("means_paint");
var Straw=document.getElementById("means_straw");
var Text=document.getElementById("means_text");
var Magnifier=document.getElementById("means_magnifier");
//获取形状
var Line=document.getElementById("sharp_line");
var Arc=document.getElementById("sharp_arc");
var Rect=document.getElementById("sharp_rect");
var Poly=document.getElementById("sharp_poly");
var Arcfill=document.getElementById("sharp_arcfill");
var Rectfill=document.getElementById("sharp_rectfill");
//把12个工具和形状放到一个数组中去
var actions=[Brush,Eraser,Paint,Straw,Text,Magnifier,Line,Arc,Rect,Poly,Arcfill,Rectfill];
//设置初始值，默认选择为画笔工具
	drawBrush(0);
function saving(){
	var imgData=canvas.toDataURL();
	var b64=imgData.substring(22);
	//将值传到text中
	var data=document.getElementById("data");
	data.value=b64;
	//将表单提交到后台http://localhost/down.php
	var form=document.getElementById("myform");
	form.submit();
}
function clearing(){
	cxt.clearRect(0,0,880,400);
}
 function setStatus(arr,num,type){//状态设置函数
 	for(var i=0;i<arr.length;i++){
 		if(i==num){//设置选中的标签
 			if(type==1){
 				arr[i].style.background="yellow";
 			}else{
 				arr[i].style.border="1px solid #000";
 			}
 		}else{//设置未选中的标签
 			if(type==1){
 				arr[i].style.background="#ccc";
 			}else{
 				arr[i].style.border="1px solid #ccc";
 			}
 		}
 	}
 }
 //铅笔
 function drawBrush(num)
 {
 	//actions[num].style.background="yellow";
 	setStatus(actions,num,1);
 		var flag=0;
    	//鼠标按下的时候设置开始点
    	canvas.onmousedown=function(e){
    		//获取鼠标事件（针对w3c和ie）
    		e=window.event||e;
    		//获取当前鼠标相对于canvans起始点0,0的坐标
    		//获取鼠标相对于鼠标顶端的距离
    		//获取当前对象（标签）相对于页面顶端的距离(this.offsetLeft)
    		var startX=e.pageX-this.offsetLeft;
    		var startY=e.pageY-this.offsetTop;
    		cxt.beginPath();
    		cxt.moveTo(startX,startY);
    		flag=1;
    	}
    	//鼠标移动的时候获取鼠标的位置
    	canvas.onmousemove=function(e){
    		e=window.event||e;
    		var endX=e.pageX-this.offsetLeft;
    		var endY=e.pageY-this.offsetTop;
    		if(flag){
    			cxt.lineTo(endX,endY);
//  			cxt.closePath();
    			cxt.stroke();
    		}
    	}
    	//鼠标抬起的时候获取鼠标的位置
    	canvas.onmouseup=function(){
    		flag=0;
    	}
    	//鼠标移出事件
    	canvas.onmouseout=function(){
    		flag=0;
    	}
 }
  //橡皮
 function drawEraser(num)
 {
 	setStatus(actions,num,1);
 	var eraserflag=0;
 	canvas.onmousedown=function(e){
 		e=window.event||e;
 		var EraserX=e.pageX-this.offsetLeft;
 		var EraserY=e.pageY-this.offsetTop;
 		//canvas的擦除事件cxt.clearRext（）；
 		cxt.clearRect(EraserX-cxt.lineWidth,EraserY-cxt.lineWidth,cxt.lineWidth*2,cxt.lineWidth*2);
 		eraserflag=1;
 	}
 	canvas.onmousemove=function(e){
 		e=window.event||e;
 		var EraserX=e.pageX-this.offsetLeft;
 		var EraserY=e.pageY-this.offsetTop;
 		if(eraserflag){
 			cxt.clearRect(EraserX-cxt.lineWidth,EraserY-cxt.lineWidth,cxt.lineWidth*2,cxt.lineWidth*2);
 		}
	}
 	canvas.onmouseup=function(e){
 		eraserflag=0;
 	}
 	canvas.onmouseout=function(){
 		eraserflag=0;
 	}
 }
  //油漆桶
 function drawPaint(num)
 {
 	setStatus(actions,num,1);
 	canvas.onmousedown=function(e){
 		//画一个填充颜色的矩形
 		cxt.fillRect(0,0,880,400);
 	}
 	canvas.onmouseup=null;
 	canvas.onmousemove=null;
 	canvas.onmouseout=null;
 }
  //吸管
 function drawStraw(num)
 {
 	setStatus(actions,num,1);
 	canvas.onmouseup=null;
 	canvas.onmousemove=null;
 	canvas.onmouseout=null;
 	canvas.onmousedown=function(e){
 		e=window.event||e;
 		var strawX=e.pageX-this.offsetLeft;
 		var strawY=e.pageY-this.offsetTop;
 		//获取该点颜色信息getImageData(开始点x，开始点y，宽度，高度)
 		var obj=cxt.getImageData(strawX,strawY,1,1);
		//alert(obj.data[3]);//ImageData对象
		//obj.data=[红,绿,蓝色,透明度]//1像素的数据
		//注意:在data数组中，每4个数组元素表示canvas画布中的一个像素点，
		//这4个元素的取值范围都是0-255
		/*obj.data=[
			红,绿,蓝色,透明度,
			红,绿,蓝色,透明度,
			红,绿,蓝色,透明度,
			红,绿,蓝色,透明度,
			红,绿,蓝色,透明度，
			红,绿,蓝色,透明度,
			红,绿,蓝色,透明度,
			红,绿,蓝色,透明度,
			]//多像素的数据
			
		*/
		//红色的RGB(255,0,0)
		//绿色的RGB(0,255,0);
		var color='rgb('+obj.data[0]+','+obj.data[1]+','+obj.data[2]+')';
		alert(color);
		//将吸管吸出的颜色设定到我们的应用中 
		cxt.strokeStyle=color;
		cxt.fillStyle=color;
		//颜色吸取吸取之后自动选中画笔工具
		drawBrush(0);
 	}
 }
  //文本
 function drawText(num)
 {
 	setStatus(actions,num,1);
 	canvas.onmousedown=function(e){
 		e=window.e||e;
 		//获取鼠标点击的位置
 		var textX=e.pageX-this.offsetLeft;
 		var textY=e.pageY-this.offsetTop;
 		//获取用户输入的信息
 		var value=window.prompt("在此输入您要输入的文本",' ');
 		//将用户输入的文字写到画布对于画布的位置中
 		if(value!=null){
 			cxt.fillText(value,textX,textY);//fillText(文本内容，x,y);
 		}
 	}
 }
  //放大镜
 function drawMagnifier(num)
 {
 	setStatus(actions,num,1);
 	var value=window.prompt("输入你要放大的画布倍数",'100');
 	var w=880*value/100;
 	var h=400*value/100;
 	canvas.style.width=parseInt(w)+'px';
 	canvas.style.height=parseInt(y)+'px';
 	
 }
   //线性
 function drawLine(num)
 {
 	setStatus(actions,num,1);
 	canvas.onmousedown=function(e){
 		e=window.event||e;
 		var startX=e.pageX-this.offsetLeft;
 		var startY=e.pageY-this.offsetTop;
 		cxt.beginPath();
 		cxt.moveTo(startX,startY);
 		canvas.onmousemove=null;
 		canvas.onmouseout=null;
 		canvas.onmouseup=function(e){
 			e=window.event||e;
	 		var endX=e.pageX-this.offsetLeft;
	 		var endY=e.pageY-this.offsetTop; 
	 		cxt.lineTo(endX,endY);
	 		cxt.stroke();
	 		cxt.closePath();
 		}
 	}
 }
   //圆形
   var arcX=0;
   var arctY=0;
 function drawArc(num)
 {
 	setStatus(actions,num,1);
 	canvas.onmousedown=function(e){
 		//获取圆心的位置
 		e=window.event||e;
 		arcX=e.pageX-this.offsetLeft;
 		arctY=e.pageY-this.offsetTop;
 		
 	}
 	canvas.onmouseup=function(e){
 		e=window.event||e;
	 	var endX=e.pageX-this.offsetLeft;
	 	var endY=e.pageY-this.offsetTop; 
	 	var a=endX-arcX;
	 	var b=endY-arctY;
	 	var radius=Math.sqrt(a*a+b*b);
	 	cxt.beginPath();
	 	cxt.arc(arcX,arctY,radius,0,360,false);
	 	cxt.closePath();
	 	cxt.stroke();
 	}
 	canvas.onmousemove=null;
 	canvas.onmouseout=null;
 }
   //矩形
   var rectX=0;
   var rectY=0;
 function drawRect(num)
 {
 	setStatus(actions,num,1);
 	canvas.onmousedown=function(e){
 		e=window.event||e;
 		rectX=e.pageX-this.offsetLeft;
 		rectY=e.pageY-this.offsetTop;
	}
 	canvas.onmousemove=null;
 	canvas.onmouseout=null;
 	canvas.onmouseup=function(e){
 		e=window.event||e;
 		var endX=e.pageX-this.offsetLeft;
 		var endY=e.pageY-this.offsetTop;
 		var w=endX-rectX;
 		var h=endY-rectY;
 		cxt.strokeRect(rectX,rectY,w,h);
 	}
 }
   //多边形
   var polyX=0;
   var polyY=0;
 function drawPoly(num)
 {
 	setStatus(actions,num,1);
 	canvas.onmousemove=null;
 	canvas.onmouseout=null;
 	canvas.onmousedown=function(e){
 		e=window.event||e;
 		polyX=e.pageX-this.offsetLeft;
 		polyY=e.pageY-this.offsetTop;
 	}
 	canvas.onmouseup=function(e){
 		e=window.event||e;
 		endX=e.pageX-this.offsetLeft;
 		endY=e.pageY-this.offsetTop;
 		cxt.beginPath();
 		//右下角
 		cxt.moveTo(endX,endY);
 		//左下角
 		var lbx=2*polyX-endX;
 		cxt.lineTo(lbx,endY);
 		//设置临时的
 		var tmpC=2*(endX-polyX);
 		var tmpA=endX-polyX;
 		var tmpB=Math.sqrt(tmpC*tmpC-tmpA*tmpA);
 		cxt.lineTo(polyX,endY-tmpB);
 		cxt.closePath();
 		cxt.stroke();
 	}
 }
   //圆形填充
 function drawArcfill(num)
 {
 	setStatus(actions,num,1);
 	canvas.onmousedown=function(e){
 		//获取圆心的位置
 		e=window.event||e;
 		arcX=e.pageX-this.offsetLeft;
 		arctY=e.pageY-this.offsetTop;
 		
 	}
 	canvas.onmouseup=function(e){
 		e=window.event||e;
	 	var endX=e.pageX-this.offsetLeft;
	 	var endY=e.pageY-this.offsetTop; 
	 	var a=endX-arcX;
	 	var b=endY-arctY;
	 	var radius=Math.sqrt(a*a+b*b);
	 	cxt.beginPath();
	 	cxt.arc(arcX,arctY,radius,0,360,false);
	 	cxt.closePath();
	 	cxt.fill();
 	}
 	canvas.onmousemove=null;
 	canvas.onmouseout=null;
 }
   //矩形填充
 function drawRectfill(num)
 {
 	setStatus(actions,num,1);
 	canvas.onmousedown=function(e){
 		e=window.event||e;
 		rectX=e.pageX-this.offsetLeft;
 		rectY=e.pageY-this.offsetTop;
	}
 	canvas.onmousemove=null;
 	canvas.onmouseout=null;
 	canvas.onmouseup=function(e){
 		e=window.event||e;
 		var endX=e.pageX-this.offsetLeft;
 		var endY=e.pageY-this.offsetTop;
 		var w=endX-rectX;
 		var h=endY-rectY;
 		cxt.fillRect(rectX,rectY,w,h);
 	}
 }
 //获取线条
var Line1px=document.getElementById("size_line1px");
var Line3px=document.getElementById("size_line3px");
var Line5px=document.getElementById("size_line5px");
var Line8px=document.getElementById("size_line8px");
//把12个工具和形状放到一个数组中去
var lines=[Line1px,Line3px,Line5px,Line8px];
//设置默认线宽
	setLine(0);
 //线框设置函数
 function setLine(num)
 {
 	setStatus(lines,num,1);
 	switch(num){
 		case 0:cxt.lineWidth=1;break;
 		case 1:cxt.lineWidth=3;break;
 		case 2:cxt.lineWidth=5;break;
 		case 3:cxt.lineWidth=8;break;
 		default:cxt.lineWidth=1;
 	}
 }

 //获取颜色
var ColorRed=document.getElementById("red");
var ColorYellow=document.getElementById("yellow");
var ColorBlack=document.getElementById("black");
var ColorWhite=document.getElementById("white");
var ColorPink=document.getElementById("pink");
var ColorGreen=document.getElementById("green");
var ColorCyan=document.getElementById("cyan");
var ColorBlue=document.getElementById("blue");
var ColorPurple=document.getElementById("purple");
var ColorOrange=document.getElementById("orange");
var Colors=[ColorRed,ColorYellow,ColorBlack,ColorWhite,ColorPink,ColorGreen,ColorCyan,ColorBlue,ColorPurple,ColorOrange];
 //设置默认颜色
 	setColor(ColorRed,0)
function setColor(obj,num){
	setStatus(Colors,num,0);
	cxt.strokeStyle=obj.id;
	cxt.fillStyle=obj.id;
}
