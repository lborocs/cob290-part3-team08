<?php
require_once '../../includes/Database_Enhanced.php';
require_once '../../includes/headers.php';

$db = new Database();
$days = $_GET['days'] ?? 5;

$data = $db->getTasksNearDeadline($days);
echo json_encode($data);
