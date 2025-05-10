<?php


$userId = $_GET['user_id'] ?? null;


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
                <p class="chart-description">Compare completed tasks by team leader.<br> Efficiency= Total Completed Tasks / On Time Tasks x 100</p>
              </div>
              <div class="graph-card">
                <canvas id="projectCompletionOverviewChart"></canvas>
                <p class="chart-description">Progress chart showing project completion.</p>
              </div>
            </div>
          </div>

          <!-- Projects View -->
          <div id="projectsView" class="manager-subview hidden">
            <input list="projects" id="projectSearch" placeholder="Search Projects..." />
            <datalist id="projects">
              <!-- Project options will be dynamically added here -->
            </datalist>

            <!-- Info Icon -->
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
                <div id="teamMembersContainer"></div>
              </div>
            </div>

            <!-- Graph Cards -->
            <div class="chart-grid">
              <div class="graph-card"><canvas id="teamCompletionChartManager"></canvas></div>
              <div class="graph-card"><canvas id="teamBreakdownChartManager"></canvas></div>
              <div class="graph-card"><canvas id="projectProgressChartManager"></canvas></div>
            </div>
          </div>

          <!-- Employees View -->
          <!-- Employees View -->
          <div id="employeesView" class="manager-subview hidden">
            <input list="projectsList" id="projectFilter" placeholder="Search Projects..." />
            <datalist id="projectsList">
              <!-- Project options will be dynamically added here -->
            </datalist>

            <input list="employeesList" id="employeeSearch" placeholder="Search Employees..." />
            <datalist id="employeesList">
              <!-- Employee options will be dynamically added here -->
            </datalist>

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
    // Pass user_id and user_type to JavaScript from PHP
    window.currentUserId = <?= json_encode($userId) ?>;



  </script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script type="module" src="javaScript/dataAnalytics.js"></script>
</body>

</html>