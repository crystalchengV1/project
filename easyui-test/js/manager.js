$(function(){
	$('#manager').datagrid({
		url:'manager_data.php',
		fit : true,
		fitColumns : true,
		striped : true,
		rownumbers : true,
		border : false,
		pagination : true,
		pageSize : 5,
		pageList : [1, 2, 3, 4, 5],
		pageNumber : 1,
		sortName : 'date',
		sortOrder : 'desc',
		toolbar : '#manager_tool',
		columns:[[
		{
			field:'id',
			title:'自动编号',
			width:100,
			checkbox:true,
		},
			{
			field:'manager',
			title:'管理员账号',
			width:100,
		},
			{
			field:'createTime',
			title:'创建日期',
			width:100,
		},
		{
			field:'author',
			title:'备注',
			width:100,
		},
		]],
	});
	$('#add').dialog({
		title:'新增管理',
		width:305,
		iconCls:'icon-user-add',
		modal:true,
		closed : true,
		buttons:[
		{
			text:'提交',
			iconCls:'icon-add-new',
			handler:function(){
				 if($('#add').form('validate')){
				 	$.ajax({
				 		type:"post",
				 		url:"addManager.php",
				 		data:{
				 			manager:$('input[name=manager]').val(),
				 			password:$('input[name=password]').val(),
				 			auth:$('#auth').combotree('getText'),
				 		},
				 		beforeSend:function(){
				 			$.messager.progress({
				 				text:'正在新增中',
				 			});
				 		},
				 		success:function(data,response,status){
				 			$.messager.progress('close');
				 			if(data>0){
				 				$.messager.show({
				 					text:'提示',
				 					msg:'新增管理信息成功',
				 				});
				 				$('#add').dialog('close').form('reset');
				 				$('#manager').datagrid('reload');
				 			}else{
				 				$.messager.alert("新增失败！","未知原因导致，请重试！");
				 			}
				 		}
				 	});
				 }
			},
		},
		{
			text:'取消',
			iconCls:'icon-redo',
			handler:function(){
				$('#add').dialog('close').form('reset');
			},
		},
		]
	});
	
	$('#edit').dialog({
		title:'修改管理',
		width:305,
		iconCls:'icon-edit-new',
		modal:true,
		closed : true,
		buttons:[
		{
			text:'提交',
			iconCls:'icon-edit-new',
			handler:function(){
				if($('#edit').form('validate')){
					$.ajax({
						type:"post",
						url:"updateManager.php",
						data:{
							id:$('input[name="id"]').val(),
							password:$('input[name="password_edit"]').val(),
							auth:$('#auth_edit').combotree('getText'),
						},
							beforeSend:function(){
					 			$.messager.progress({
					 				text:'正在修改中.....',
					 			});
				 		},
				 		success:function(data,response,status){
				 			$.messager.progress('close');
				 			if(data>0){
				 				$.messager.show({
				 					text:'提示',
				 					msg:'修改管理信息成功',
				 				});
				 				$('#edit').dialog('close').form('reset');
				 				$('#manager').datagrid('reload');
				 			}else{
				 				$.messager.alert('修改失败！', '未知错误或没有任何修改，请重试！', 'warning');
				 			}
				 		}
						
					});
				}
			}
		},
		{
			text:'取消',
			iconCls:'icon-redo',
			handler:function(){
				$('#edit').dialog('close').form('reset');
			},
		},
		]
	});
	
	//管理帐号
	$('input[name="manager"]').validatebox({
		required : true,
		validType : 'length[2,20]',
		missingMessage : '请输入管理名称',
		invalidMessage : '管理名称在 2-20 位',
	});
	
	//管理密码
	$('input[name="password"]').validatebox({
		required : true,
		validType : 'length[6,30]',
		missingMessage : '请输入管理密码',
		invalidMessage : '管理密码在 6-30 位',
	});
	
//	//修改管理密码
//	$('input[name="password_edit"]').validatebox({
//		required : true,
//		validType : 'length[1,30]',
//		missingMessage : '请输入管理密码',
//		invalidMessage : '管理密码在 6-30 位',
//	});

//分配权限
	$('#auth').combotree({
		url : 'nav.php',
		required : true,
		lines : true,
		multiple : true,
		checkbox : true,
		onlyLeafCheck : true,
		onLoadSuccess : function (node, data) {
			var _this = this;
			if (data) {
				$(data).each(function (index, value) {
					if (this.state == 'closed') {
						$(_this).tree('expandAll');
					}
				});
			}
		},
	});
	
	
	tool={
		reload : function () {
			$('#manager').datagrid('reload');
		},
		redo : function () {
			$('#manager').datagrid('unselectAll');
		},
		add:function(){
			$('#add').dialog('open');
			$('input[name="manager"]').focus();
		},
		remove : function () {
			var rows = $('#manager').datagrid('getSelections');
			if (rows.length > 0) {
				$.messager.confirm('确定操作', '您正在要删除所选的记录吗？', function (flag) {
					if (flag) {
						var ids = [];
						for (var i = 0; i < rows.length; i ++) {
							ids.push(rows[i].id);
						}
						$.ajax({
							type : 'POST',
							url : 'deleteManager.php',
							data : {
								ids : ids.join(','),
							},
							beforeSend : function () {
								$('#manager').datagrid('loading');
							},
							success : function (data) {
								if (data) {
									$('#manager').datagrid('loaded');
									$('#manager').datagrid('load');
									$('#manager').datagrid('unselectAll');
									$.messager.show({
										title : '提示',
										msg : data + '个管理被删除成功！',
									});
								}
							},
						});
					}
				});
			} else {
				$.messager.alert('提示', '请选择要删除的记录！', 'info');
			}
		},
		
		edit:function(){
			var rows=$('#manager').datagrid('getSelections');
			if(rows.length>1){
				$.messager.alert('警告','编辑数据只能选择一条数据！');
			}else if(rows.length==1){
				$.ajax({
					url:'getManager.php',
					type:'post',
					data:{
						id:rows[0].id,
					},
					baforeSend:function(){
						$.messager.progress({
							text:'正在获取中.......',
						});
					},
					success:function(data,response,status){
						$.messager.progress('close');
						if(data){
							var obj=$.parseJSON(data);
							var auth=obj[0].author.split(',');
							$('#edit').form('load',{
								id:obj[0].id,
								manager_edit:obj[0].manager,
								password_edit:obj[0].password,
//								auth_edit:obj[0].author,
							}).dialog('open');
							//分配权限
							$('#auth_edit').combotree({
								url : 'nav.php',
								required : true,
								lines : true,
								multiple : true,
								checkbox : true,
								onlyLeafCheck : true,
								onLoadSuccess : function (node,data) {
									var _this = this;
									if (data) {
										$(data).each(function (index,value) {
											if($.inArray(value.text,auth) !=-1){
												var node1 =$(_this).tree('find',value.id);
												$(_this).tree('check',node1.target);
											}
											if (this.state == 'closed') {
												$(_this).tree('expandAll');
											}
										});
									}
								},
							});
						}else{
							$.messager.alert('失败信息','修改失败！');
						}
					},
				});
			}else if(rows.length<1){
				$.messager.alert('警告','编辑数据必须选择一条数据！');
			}
		}
	};
	obj = {
		editRow : undefined,
		search : function () {
			console.log("12");
			$('#manager').datagrid('load', {
				user : $.trim($('input[name="user"]').val()),
				date_from : $('input[name="date_from"]').val(),
				date_to : $('input[name="date_to"]').val(),
			});
		},
	};
});
