<?php
require_once __DIR__ . '/../server/includes/database.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['user_id'])) {
    $db = new Database();
    $userId = $_POST['user_id'];

    // Fetch user data from DB
    $userData = $db->getEmployee(['employee_id' => $userId]);
    if (!$userData || empty($userData[0])) {
        echo "Invalid user ID.";
        exit;
    }

    $_SESSION['user_id'] = $userId;
    $_SESSION['user_type'] = $userData[0]['user_type_id']; 
    $_SESSION['page_id'] = "1";       // hardcoded for now
    $_SESSION['page_type'] = "project";

    header("Location: index.php");
    exit;
}

