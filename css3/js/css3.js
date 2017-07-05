window.onload=function(){
	var music=document.getElementById("music");
	var page1=document.getElementById("page1");
	var page2=document.getElementById("page2");
	var page3=document.getElementById("page3");
	var audio1=document.getElementsByTagName("audio")[0];
	audio1.addEventListener("ended",function(event){
		music.setAttribute("class"," ");
		music.style.animationPlayState="paused";
	},false);
	
//	music.onclick = function(){
//		if(audio1.paused){
//			audio1.play();
//			this.setAttribute("class","play");
//		}else{
//			audio1.pause();
//			this.setAttribute("class"," ");
//		}
//	};
	music.addEventListener("touchstart",function(event){
		if(audio1.paused){
			audio1.play();
			this.setAttribute("class","play");
		}else{
			audio1.pause();
			this.setAttribute("class"," ");
		}
	},false);
	page1.addEventListener("touchstart",function(event){
		console.log("p1");
		page1.style.display="none";
		page2.style.display="block";
		page3.style.display="block";
		page3.style.top="100%";
		setTimeout(function(){
			page2.setAttribute("class","page fadeOut");
			page3.setAttribute("class","page fadeIn");
		},2000);
	},false);
	page3.addEventListener("touchstart",function(event){
		console.log("p3");
		page1.style.display="block";
		page2.style.display="none";
		page3.style.display="none";
		page2.setAttribute("class","page");
	},false);
};
