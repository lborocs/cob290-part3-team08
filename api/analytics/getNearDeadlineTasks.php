<?php
require_once '../../includes/Database_Enhanced.php';
header('Content-Type: application/json');

$db = new Database();
$days = $_GET['days'] ?? 5;

$data = $db->getTasksNearDeadline($days);
echo json_encode($data);
