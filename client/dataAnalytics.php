<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$userId   = $_SESSION['user_id']   ?? null;
$pageId   = $_SESSION['page_id']   ?? null;
$pageType = $_SESSION['page_type'] ?? null;

if (!$userId) {
    echo "No user selected.";
    exit;
}

require_once __DIR__ . '/../server/includes/database.php';
include __DIR__ . '/includes/navbar.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Data Analytics</title>
  <link rel="stylesheet" href="analytics.css" />
</head>
<body>
  <div class="container">
    <h1>Data Analytics Page</h1>
    <p>Welcome to the data analytics section of Made It All.</p>

    <div id="analyticsOutput"></div>
  </div>

  <script>
    const currentUserId   = <?= json_encode($userId) ?>;
    const currentPageId   = <?= json_encode($pageId) ?>;
    const currentPageType = <?= json_encode($pageType) ?>;
  </script>
  <script src="dataAnalytics.js"></script>
</body>
</html>
