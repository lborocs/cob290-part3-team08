<?php
require_once '../../includes/database.php';
require_once '../../includes/headers.php';

$db = new Database();
try {
    $users = $db->getAllEmployees();
    echo json_encode($users);
} catch (Exception $e) {
    echo json_encode(['error' => 'Failed to retrieve users']);
}
?>
