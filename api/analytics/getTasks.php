<?php
require_once '../../includes/Database_Enhanced.php';
header('Content-Type: application/json');

$db = new Database();
$filters = $_GET;

$tasks = $db->getTasks($filters);
echo json_encode($tasks);
