$(function(){
	$('#box').tabs({
		width:300,
//		height:300,
//		plain:true,
//		tabWidth:80,
//		tabHeight:50,
//		scrollIncrement:50,
//		scrollDuration:10,
		tools:
		[
			{
				iconCls:'icon-add',
				handler:function(){
					alert('help!');
				}
			}
		],
//		toolPosition:'left',
//		tabPosition:'right',
		selected:1,
//		onSelect:function(title,index){
//			alert("title"+title+'index'+index);
//		}
		onClose:function(title,index){
			alert("close");
		},
		onContextMenu:function(e,title,index){
			alert(e + '|' + title + '|'+ index);
		}
		
		
	})
})
