<?php
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'];
$basePath = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');

// Build dynamic base URL
$baseUrl = "{$protocol}://{$host}{$basePath}";
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Make-It-All | Select User</title>
  <link rel="stylesheet" href="<?= $baseUrl ?>/index.css">
</head>
<body>
  <div class="container">
    <h1> Welcome to Make-It-All </h1>
    <div class="user-selector-container">
      <?php include __DIR__ . '/includes/user_selector.php'; ?>
    </div>
    
    <?php 
      // Get the user ID from the URL query string
      $userId = $_GET['user_id'] ?? null;
    ?>

    <div class="nav-buttons">
      <!-- Pass the user_id in the URL query parameter -->
      <button onclick="window.location.href ='<?= $baseUrl ?>/client/dataAnalytics/dataAnalytics.php?user_id=<?= $userId ?>'">Data Analytics</button>
      <button onclick="window.location.href ='<?= $baseUrl ?>/client/chatSystem/chatSystem.php?user_id=<?= $userId ?>'">Chat System</button>
    </div>
  </div>
</body>
</html>
