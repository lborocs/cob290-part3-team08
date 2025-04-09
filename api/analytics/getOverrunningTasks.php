<?php
require_once '../../includes/Database_Enhanced.php';
header('Content-Type: application/json');

$db = new Database();
$data = $db->getTasksOverrunning();
echo json_encode($data);
