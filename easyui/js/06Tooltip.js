$(function(){
	$('#box').tooltip({
		content:'<strong>我是链接的内容显示哦~~~~~~~~</strong>',	
		position:'right',
		trackMouse:true,
		deltaX:120,
		deltaY:120,
//		showEvent:'click',
//		hideEvent:'dblclick',
//		onShow:function(e){
//			console.log("show");
//		},
//		onHide:function(e){
//			console.log("shide");
//		},
		onUpdate:function(content){
			alert("update:"+content);
		},
		onPosition:function(left,top){
			console.log("left:"+left+'top:'+top+);
		},
	});
	$('#box').click(function(){
		$(this).tooltip('update','change13131');
	});

});
