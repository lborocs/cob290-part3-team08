<?php
require_once '../../includes/Database_Enhanced.php';
header('Content-Type: application/json');

$db = new Database();

$employeeId = $_GET['employee_id'] ?? null;
$start = $_GET['start_date'] ?? null;
$end = $_GET['end_date'] ?? null;

if (!$employeeId || !$start || !$end) {
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$data = $db->getEmployeeWorkload($employeeId, $start, $end);
echo json_encode($data);
