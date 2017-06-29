$(function(){
	$('#box').progressbar({
		value:60,
		width:300,
		height:30,
		text:'{value}%',
		onChange:function(newValue,oldValue){
			console.log('new'+newValue+'old'+oldValue);
		},
	});
	setTimeout(function(){
		$('#box').progressbar('setValue',80);
	},1000);
//	setInterval(function(){
//		$('#box').progressbar('setValue',$('#box').progressbar('getValue')+5);
//	},200);
});
