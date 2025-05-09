<?php include_once __DIR__ . '/../server/includes/set_user_session.php'; ?>

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
    <h1>🎉 Welcome to Make-It-All 🎉</h1>
    <div class="user-selector-container">
      <?php include __DIR__ . '/includes/user_selector.php'; ?>
    </div>
    <div class="nav-buttons">
      <button onclick="window.location.href ='<?= $baseUrl ?>/dataAnalytics/dataAnalytics.php'">🚀 Data Analytics</button>
      <button onclick="window.location.href ='<?= $baseUrl ?>/chatSystem/chatSystem.php'">💬 Chat System</button>
    </div>
  </div>
</body>
</html>
