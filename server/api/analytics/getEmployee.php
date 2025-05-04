<?php
session_start();
require_once __DIR__ . '/../../includes/database.php';
require_once __DIR__ . '/../../includes/headers.php';

$db = new Database();
$filters = $_GET;




$filters['employee_id'] = $_SESSION['page_id'];


$employee = $db->getEmployee($filters);
echo json_encode($employee);