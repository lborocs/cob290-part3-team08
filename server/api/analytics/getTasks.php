<?php
session_start();
require_once __DIR__ . '/../../includes/database.php';
require_once __DIR__ . '/../../includes/headers.php';

$db = new Database();
$filters = $_GET;



if (isset($_SESSION['page_type']) && $_SESSION['page_type'] === 'project') {
    $filters['project_id'] = $_SESSION['page_id'];
} else{
    $filters['employee_id'] = $_SESSION['page_id'];
}

$tasks = $db->getTasks($filters);
echo json_encode($tasks);
