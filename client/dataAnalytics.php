<?php
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $userId = $_SESSION['user_id'] ?? null;
    if (!$userId) {
        echo "No user selected.";
        exit;
    }

require_once __DIR__ . '/../server/includes/database.php';
include __DIR__ . '/includes/navbar.php';

echo "<h1>Data Analytics Page</h1>";
echo "<p>Welcome to the data analytics section of Made It All.</p>";
?>
