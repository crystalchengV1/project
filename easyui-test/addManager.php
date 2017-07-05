<?php
	require 'config.php';
	
	$manager = $_POST['manager'];
	$password =$_POST['password'];
	$auth = $_POST['auth'];
	$date ="2017-06-10";

	mysql_query("INSERT INTO easyui(manager,password,createTime,author) VALUES ('$manager','$password','$date','$auth')") or die('SQL 错误！');

	echo mysql_affected_rows();
	
	mysql_close();
?>