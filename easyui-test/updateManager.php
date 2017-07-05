<?php
	require 'config.php';
	
	$id = $_POST['id'];
	$auth = $_POST['auth'];
	
	if (!empty($_POST['password'])) {
		$password =$_POST['password'];
		mysql_query("UPDATE easyui SET password='$password',author='$auth' WHERE id='$id'") or die('SQL 错误！');
	} else {
		mysql_query("UPDATE easyui SET author='$auth' WHERE id='$id'") or die('SQL 错误！');
	}

	echo mysql_affected_rows();
	
	mysql_close();
?>