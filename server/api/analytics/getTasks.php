<?php
require_once '../../includes/Database_Enhanced.php';
require_once '../../includes/headers.php';

$db = new Database();
$filters = $_GET;

$tasks = $db->getTasks($filters);
echo json_encode($tasks);
