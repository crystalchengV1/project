$(function(){
	
	$('#box').resizable({
		maxWidth:600,
		maxHeight:600,
//		minWidth:400,
//		minHeight:400,
		handles:'se,e,s',
		edge:20,
		onStartResize:function(e){
			console.log("开始调整是触发");
		},
		onResize:function(e){
			console.log("调整期间触发");
		},
		onStopResize:function(e){
			console.log("停止调整触发");
		},
	});
	console.log($('#box').resizable('options'));
})
