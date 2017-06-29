$(function(){
	$('#box').datagrid({
		width:300,
		url:'content.json',
		title:'用户列表11',
		iconCls:'icon-search',
		columns:[[
			{
				field:"user",
				title:"账号",
			},
			{
				field:"email",
				title:"邮件",
			},
			{
				field:"date",
				title:"注册时间",
			},
		]],
	});
	console.log("121");
	console.log($('#box').datagrid('options').url);
	console.log($('#box').datagrid({url:'content.json'}));
});