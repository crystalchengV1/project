$(function(){
	$('#box').linkbutton({
		text:'提交',
		iconCls:'icon-add',
		iconAlign:'right',
		toggle:true,
		plain:true,
		selected:true,
		group:'sex',
	});
		$('#box1').linkbutton({
		text:'登录',
		iconCls:'icon-edit',
		iconAlign:'left',
		toggle:true,
		plain:false,
		group:'sex',
	});
	console.log($('#box').linkbutton('options'));
	console.log($('#box').linkbutton('disable'));
	console.log($('#box1').linkbutton('select'));
})
