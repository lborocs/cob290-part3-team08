<?php
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $userId = $_SESSION['user_id'] ?? null;
    $pageId = $_SESSION['page_id'] ?? null;
    $pageType = $_SESSION['page_type'] ?? null;
    if (!$userId) {
        echo "No user selected.";
        exit;
    }

    require_once __DIR__ . '/../server/includes/database.php';
    include __DIR__ . '/includes/navbar.php';

    echo "<h1>Data Analytics Page</h1>";
    echo "<p>Welcome to the data analytics section of Made It All.</p>";
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Chat System (Full)</title>
  <link rel="stylesheet" href="chatSystem.css"/>
</head>
<body>



<script>
  let currentUserId   = <?= json_encode($userId) ?>;
  let currentPageId   = <?= json_encode($pageId) ?>;
  let currentPageType = <?= json_encode($pageType) ?>;
</script>
<script src="dataAnalytics.js"></script>
</body>
</html>
