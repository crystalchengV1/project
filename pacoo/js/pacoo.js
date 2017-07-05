window.onload=function()
{
	window.onscroll=function(){
		var top=document.documentElement.scrollTop||document.body.scrollTop;
		var stairMain=document.getElementById("stairMain");
		var a=stairMain.getElementsByTagName("a");
		var all=document.getElementById("all");
		var lis=all.getElementsByClassName("find");
		var currentid=" ";
		for(var i=0;i<lis.length;i++){
			if(top>lis[i].offsetTop-200){
				currentid=lis[i].id;
			}else{
				break;
			}
		}
		if(currentid!=null){
			for(var i=0;i<a.length;i++){
				var href=a[i].href.split("#");
				if(href[href.length-1]!=currentid){
					a[i].className=" ";
					a[i].parentNode.className=" ";
				}else{
					a[i].className="active";
					a[i].parentNode.className="active";
				}
				
			}
		}

		
		
		var bHeight=banner.offsetTop;
		var bHeight=banner.offsetHeight;
		
	}
	
}