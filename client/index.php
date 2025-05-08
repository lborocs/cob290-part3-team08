
<?php include_once __DIR__ . '/../server/includes/set_user_session.php'; ?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Make-It-All</title>
  <style>
    body {
      font-family: "Times New Roman", Times, serif;
      text-align: center;
      margin: 0;
      padding: 0;
      background-image: url("../server/pictures/computer.jpg");
      background-color: #007BFF;
    }
    nav {
      background: #00032D;
      padding: 15px;
    }
    nav a {
      color: white;
      text-decoration: none;
      margin: 0 15px;
      font-size: 18px;
    }
    .container {
      margin-top: 150px;
      display: flex;
      justify-content: center;
      gap: 20px;
    }
    .box {
      width: 300px;
      height: 100px;
      margin: 20px;
      background: white;
      opacity: 0.5;
      color: #007BFF;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      cursor: pointer;
    }
    h1 {
      margin-top: 150px;
      color: white;
    }
  </style>
</head>
<body>
  <?php include __DIR__ . '/includes/navbar.php'; ?>
  <?php include __DIR__ . '/includes/user_selector.php'; ?>

  <h1>Make-It-All</h1>
  <div class="container">
    <div class="box" onclick="window.location.href='dataAnalytics/dataAnalytics.php'">
      Team Analytics
    </div>
    <div class="box" onclick="window.location.href='chatSystem/chatSystem.php'">
      Chat System
    </div>
  </div>
</body>
</html>
