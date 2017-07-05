$(function(){
	var thisURL = document.URL; 
	var  getval =thisURL.split('?')[1];  
  	var showval= getval.split("=")[1]; 
  	$('#name').text(showval);
  	
  		$('#nav').tree({
			url:'nav.php',
			lines:true,
			onLoadSuccess:function(node,data)
			{
				if(data)
				{
					$(data).each(function(index,value)
					{
						if(this.state=='closed')
						{
						$('#nav').tree('expandAll');
						}
					});
				}
			},
			onClick:function(node)
			{
				if(node.url=='manager' || node.url=='group'){
					if($('#tabs').tabs('exists',node.text)){
						$('#tabs').tabs('select',node.text);
					}else{
						var content ='<iframe scrolling="auto" frameborder="0"  src="'+node.url+'.html" style="width:100%;height:100%;"></iframe>';
						$('#tabs').tabs('add',{
							title:node.text,
							iconCls:node.iconCls,
							closable:true,
							content:content,
//							href:node.url+'.php',

						});
					}
				
				}
			}
	});
	
	$('#tabs').tabs({
		fit:true,
		border:false,
	});
})
