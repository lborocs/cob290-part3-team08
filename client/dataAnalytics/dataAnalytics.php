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
  <link rel="stylesheet" href="css/analytics.css" />
</head>

<body>
  <?php include __DIR__ . '/../includes/navbar.php'; ?>

  <div class="container">
    <h1>Data Analytics Page</h1>

    <div id="analyticsOutput">
      <!-- Manager Panel -->
      <div id="managerPanel" class="hidden">
        <div id="managerViewSwitcher" class="view-switcher">
          <button id="leftArrow" class="arrow-button">←</button>
          <span id="currentViewLabel">Manager View</span>
          <button id="rightArrow" class="arrow-button">→</button>
        </div>

        <div id="managerViews">
          <!-- Manager Overview -->
          <div id="managerView" class="manager-subview">
            <div class="chart-grid">
              <div class="graph-card">
                <canvas id="orgTaskSummaryChart"></canvas>
                <p class="chart-description">Organization-wide task completion status across all employees.</p>
              </div>
              <div class="graph-card">
                <canvas id="teamComparisonChart"></canvas>
                <p class="chart-description">Compare completed tasks by team leader.</p>
              </div>
              <div class="graph-card">
                <canvas id="projectCompletionOverviewChart"></canvas>
                <p class="chart-description">Progress chart showing project completion.</p>
              </div>
            </div>
          </div>

          <!-- Projects View -->
          <div id="projectsView" class="manager-subview hidden">
            <select id="projectSelect">
              <option value="">-- Select a project --</option>
            </select>
            <!-- Info Icon (could be placed near project name or in header) -->
            <button id="infoIcon" class="info-icon hidden">ℹ️</button>

            <!-- Project Info Modal -->
            <div id="projectInfoModal" class="modal hidden">
              <div class="modal-content">
                <span id="closeModal" class="close-button">&times;</span>
                <h2>Project Info</h2>
                <p><strong>Project Name:</strong> <span id="projectName"></span></p>
                <p><strong>Project ID:</strong> <span id="projectId"></span></p>
                <p><strong>Team Leader:</strong> <span id="teamLeaderName"></span> (ID: <span id="teamLeaderId"></span>)
                </p>
                <p><strong>Start Date:</strong> <span id="startDate"></span></p>
                <p><strong>Due Date:</strong> <span id="dueDate"></span></p>
                <p><strong>Completion:</strong> <span id="completionPercentage"></span>%</p>
                <div id="teamMembersContainer"></div>
              </div>
            </div>
            <div class="chart-grid">
              <div class="graph-card">
                <canvas id="teamCompletionChartManager"></canvas>
              </div>
              <div class="graph-card">
                <canvas id="teamBreakdownChartManager"></canvas>
              </div>
              <div class="graph-card">
                <canvas id="projectProgressChartManager"></canvas>
              </div>
            </div>
          </div>

          <!-- Employees View -->
          <div id="employeesView" class="manager-subview hidden">
            <select id="projectFilter">
              <option value="">-- All Projects --</option>
            </select>
            <select id="employeeSelect">
              <option value="">-- Select an employee --</option>
            </select>
            <div class="chart-grid">
              <div class="graph-card"><canvas id="completionChartManager"></canvas></div>
              <div class="graph-card"><canvas id="timeStatsChartManager"></canvas></div>
              <div class="graph-card"><canvas id="deadlineChartManager"></canvas></div>
              <div class="graph-card"><canvas id="workloadChartManager"></canvas></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Leader View -->
      <div id="teamLeaderStats" class="hidden">
        <div class="chart-grid">
          <div class="graph-card"><canvas id="teamCompletionChartTL"></canvas></div>
          <div class="graph-card"><canvas id="teamBreakdownChartTL"></canvas></div>
          <div class="graph-card"><canvas id="projectProgressChartTL"></canvas></div>
        </div>
      </div>

      <!-- Employee View -->
      <div id="employeeStats" class="hidden">
        <div class="chart-grid">
          <div class="graph-card"><canvas id="completionChartEmployee"></canvas></div>
          <div class="graph-card"><canvas id="timeStatsChartEmployee"></canvas></div>
          <div class="graph-card"><canvas id="deadlineChartEmployee"></canvas></div>
          <div class="graph-card"><canvas id="workloadChartEmployee"></canvas></div>
        </div>
      </div>
    </div>
  </div>

  <script>
    window.currentUserId = <?= json_encode($userId) ?>;
    window.currentUserType = <?= json_encode($userType) ?>;
    window.currentPageId = <?= json_encode($pageId) ?>;
    window.currentPageType = <?= json_encode($pageType) ?>;
  </script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script type="module" src="javaScript/dataAnalytics.js"></script>
</body>

</html>