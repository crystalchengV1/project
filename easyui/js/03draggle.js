$(function(){
	$.fn.draggable.defaults.cursor = 'string';

	$("#box").draggable({
//		handle:'#pox',
//		axis:'v',
		proxy:'clone',
//		deltaX:10,
//		deltaY:10,
		proxy:function(source){
			var p=$('<div style="border:1px solid #ccc;widyh:400px;height:200px;"></div>');
			p.html($(source).html()).appendTo('body');
			return p;
		},
//		onBeforeDrag:function(e){
//			alert('拖动之前触发');
//		},
//		onStarDrag:function(e){
//			alert('拖动时触发');
//		},
//		onDrag:function(e){
//			alert('拖动过程中触发');
//		},
//		onStopDrag:function(e){
//			alert('停止拖动时触发');
//		},
	});
})
