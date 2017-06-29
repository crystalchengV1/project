$(function(){
	$('#box').panel({
		title:'title-crystal2017',
		width:600,
		height:200,
		closable:true,
		iconCls:'icon-search',
		left:300,
		top:100,
		content:'woshowwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
		cls:'panelclass',
		headerCls:'headerclass',
		bodyCls:'bodyclass',
		style:{
			'min-height':'300px',
		},
//		fit:true,
		collapsible:true,
//		tools:'#tt',
		tools:
		[
			{
				iconCls:'icon-add',
				handler:function(){
					alert('help!');
				}
			}
		],
		href:'01.php',
		extractor: function (data) {
			console.log("21");
			return data.substring(0,3);
		},
	});
	$('#box').panel('panel').css('position','absolute');
})
