

window.onload=function(){
	var tab=document.getElementById("more_tab");
	var lis=tab.getElementsByTagName("li");
	var content=document.getElementById("more_content");
	var divs=content.getElementsByTagName("div");
   for(var i=0;i<lis.length;i++){
   	   lis[i].index=i;
   	   lis[i].onmouseover=function(){
	   	   for(var i=0;i<divs.length;i++){
	   	   		divs[i].style.display="none";
	   	   }
	   	     divs[this.index].style.display="block";
   	  
   	   }
   }
   
    var top=document.getElementById("top_tab");
	var li1=top.getElementsByTagName("li");
	var content=document.getElementById("top_content");
	var div=content.getElementsByTagName("div");
	for(var j=0;j<li1.length;j++){
   	   li1[j].index1=j;
   	   li1[j].onmouseover=function(){
	   	   for(var a=0;a<div.length;a++){
	   	   		div[a].style.display="none";
	   	   }
	   	     div[this.index1].style.display="block";
   	  
   	   }
   }
}
