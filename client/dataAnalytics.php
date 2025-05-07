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

require_once __DIR__ . '/../server/includes/database.php';
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

    <div id="analyticsNav"
      style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
      <button id="prevPage">⬅</button>
      <span id="analyticsPageTitle" style="font-weight: bold;"></span>
      <button id="nextPage">➡</button>
    </div>
    <div id="analyticsOutput">
      <div id="managerPanel" class="analyticsPage hidden">
        <div class="chartGrid">
          <canvas id="projectProgressChart"></canvas>
          <canvas id="teamPerformanceChart"></canvas>
        </div>
      </div>

      <div id="teamLeaderStats" class="analyticsPage hidden">
        <div class="chartGrid customLayout">
          <div class="chart chart1">
            <canvas id="teamLeadPerformanceChart"></canvas>
          </div>
          <div class="chart chart2">
            <canvas id="teamLeadProjectProgressChart"></canvas>
          </div>
          <div class="chart chart3">
            <canvas id="teamLeadTaskCompletionChart"></canvas>
          </div>
        </div>
      </div>

      <div id="employeeStats" class="analyticsPage hidden">
        <div class="chartGrid customLayout">
          <div class="chart chart1">
            <canvas id="completionChart"></canvas>
          </div>
          <div class="chart chart2">
            <canvas id="avgTimeChart"></canvas>
          </div>
          <div class="chart chart3">
            <canvas id="workloadChart"></canvas>
          </div>

        </div>
      </div>

    </div>
  </div>

  <script>
    const currentUserId = <?= json_encode($userId) ?>;
    const currentUserType = <?= json_encode($userType) ?>;
    const currentPageId = <?= json_encode($pageId) ?>;
    const currentPageType = <?= json_encode($pageType) ?>;
  </script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <script src="dataAnalytics.js"></script>
</body>

</html>