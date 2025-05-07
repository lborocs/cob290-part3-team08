<?php
if (session_status() === PHP_SESSION_NONE) {
  session_start();
}

$userId = $_SESSION['user_id'] ?? null;
$userType = $_SESSION['user_type'] ?? null;
$pageId = $_SESSION['page_id'] ?? null;
$pageType = $_SESSION['page_type'] ?? null;

if (!$userId) {
  echo "No user selected.";
  exit;
}

require_once __DIR__ . '/../../server/includes/database.php';
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
<?php include __DIR__ . '/includes/navbar.php'; ?>

  <div class="container">
    <h1>Data Analytics Page</h1>
    <p>Welcome to the data analytics section of Made It All.</p>

    <div id="analyticsOutput">
      <div id="managerPanel" class="hidden">
        <h2>Manager Overview</h2>
        <p>This section shows all project and team data across the organization.</p>
        <!-- Charts, team comparisons, etc. -->
      </div>

      <div id="teamLeaderStats" class="hidden">
        <h2>Team Leader Dashboard</h2>
        <p>Performance metrics for your assigned team and projects.</p>
        <!-- Team-specific stats -->
      </div>

      <div id="employeeStats" class="hidden">
        <h2>My Task Analytics</h2>
        <p>Your own workload, task completion, and deadlines.</p>
        <!-- Personal task charts -->
      </div>

    </div>
  </div>

  <script>
    const currentUserId = <?= json_encode($userId) ?>;
    const currentUserType = <?= json_encode($userType) ?>;
    const currentPageId = <?= json_encode($pageId) ?>;
    const currentPageType = <?= json_encode($pageType) ?>;
  </script>
  <script src="dataAnalytics.js"></script>
</body>

</html>