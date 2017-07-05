$(function(){
	//登录界面
	var username="";
	$('#login').dialog({
		title:'登录后台',
		width:300,
		height:180,
		modal:true,
		iconCls:'icon-login',
		buttons:'#btn',
	});
	//管理员账号验证
	$('#text').validatebox({
		required:true,
		missingMessage:'请输入管理员账号',
		invalidMessage:'管理员账号不得为空',
	});
	$('#password').validatebox({
		required:true,
//		validType:'length[6,30]',
		missingMessage:'请输入管理员密码',
		invalidMessage:'管理员密码不得为空',
	});
	//加载时判断登录
	//加载时判断验证
	if (!$('#text').validatebox('isValid')) {
		$('#text').focus();
	} else if (!$('#password').validatebox('isValid')) {
		$('#password').focus();
	}
	
	//单击登录
	$('#btn a').click(function(){
		var flag=$('#text').validatebox('isValid');
		var name=$('#text').val();
		var pswflag=$('#password').validatebox('isValid');
		if(!flag){
			$('#text').focus();
		}else if(!pswflag){
			$('#password').focus();
		}else{
			$.ajax({
				type:"post",
				url:"checklogin.php",
				data:{
					manager: $('#text').val(),
					password: $('#password').val(),
				},
				
				beforeSend:function(){
					$.messager.progress({
						text:'正在登录中',
					});
				},
				success:function(data,reaponse,status){
					$.messager.progress('close');
					if (data > 0) 
					{
						document.location.href ="main.html?username="+name;
					} else 
					{
						$.messager.alert('登录失败！', '用户名或密码错误！', 'warning', function () {
							$('#password').select();
						});
					}
				}
			});
		}
	});
});
