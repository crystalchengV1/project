<?php
	require 'config.php';
	
	$page = $_POST['page'];
	$pageSize = $_POST['rows'];
	$first = $pageSize * ($page - 1);
	
	$order = $_POST['order'];
	$sort = $_POST['sort'];
	
	$sql = '';
	$user = '';
	$date_from = '';
	$date_to = '';
	
	if (isset($_POST['user']) && !empty($_POST['user'])) {
		$user = "manager LIKE '%{$_POST['user']}%' AND ";
		$sql .= $user;
	}
	
	if (isset($_POST['date_from']) && !empty($_POST['date_from'])) {
		$date_from = "createTime>='{$_POST['date_from']}' AND ";
		$sql .= $date_from;
	}
	
	if (isset($_POST['date_to']) && !empty($_POST['date_to'])) {
		$date_to = "createTime<='{$_POST['date_to']}' AND ";
		$sql .= $date_to;
	}
	
	if (!empty($sql)) {
		$sql = 'WHERE '.substr($sql, 0, -4);
	}
	
//	$query = mysql_query("SELECT id,manager,createTime,author FROM easyui $sql ORDER BY $sort $order LIMIT $first,$pageSize") or die('SQL 错误！');
//	$total = mysql_num_rows(mysql_query("SELECT id,manager,createTime,author FROM easyui $sql"));
	
	$query = mysql_query("SELECT id,manager,createTime,author FROM easyui $sql") or die('SQL 错误！');
	$total = mysql_num_rows(mysql_query("SELECT id,manager,createTime,author FROM easyui $sql"));
	
	
	$json = '';
	
	while (!!$row = mysql_fetch_array($query, MYSQL_ASSOC)) {
		$json .= json_encode($row).',';
	}

	$json = substr($json, 0, -1);
	echo '{"total" : '.$total.', "rows" : ['.$json.'], "footer" : [{"user" : "统计","email" : "统计","date" : "统计"}]}';
	mysql_close();
	
////	$query = mysql_query("SELECT id,manager,auth,date FROM easyui ORDER BY $sort $order LIMIT $first,$pageSize") or die('SQL 错误！');
////	$total = mysql_num_rows(mysql_query("SELECT id,manager,auth,date FROM easyui_admin"));
//	$query = mysql_query("SELECT id,manager,createTime,author FROM easyui") or die('SQL 错误！');
//	$total = mysql_num_rows(mysql_query("SELECT id,manager,createTime,author FROM easyui"));
//	
//	$json = '';
//	
//	while (!!$row = mysql_fetch_array($query, MYSQL_ASSOC)) {
//		$json .= json_encode($row).',';
//	}
//
//	$json = substr($json, 0, -1);
//	echo '{"total" : '.$total.', "rows" : ['.$json.']}';
//	mysql_close();
?>