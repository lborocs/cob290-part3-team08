<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['user_id'])) {
    $_SESSION['user_id'] = $_POST['user_id'];
    //jeven u can change v ==========================================================================================================
    $_SESSION['page_id'] = "1";
    $_SESSION['page_type'] = "project";
    header("Location:  index.php");
    exit;
}
