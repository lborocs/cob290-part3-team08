// analytics_dashboard.js
const API_BASE = "/makeitall/cob290-part3-team08/server/api/analytics/index.php"

console.log(currentUserId)
import {
  loadTasks,
  loadAllTasks,
  loadDetails,
  loadWorkload,
  loadAverageTimeStats,
  loadCompletionStats,
  loadOverrunningTasks,
  loadDeadlineTasks,
  loadTeamPerformance,
  loadTeamPerformanceOverview,
  loadProjectProgress,
  loadAllProjectProgress,
  loadTeamLeaderNames,
  loadAllEmployees,
  analyticsData,
  leaderIdToName,
  fetchProjectDetails,
} from "./dataLoaders.js"

import {
  renderCompletionChart,
  renderTimeStatsChart,
  renderDeadlineChart,
  renderWorkloadChart,
  renderTeamCompletionChart,
  renderTeamBreakdownChart,
  renderProjectProgressChart,
  renderOrgTaskSummaryChart,
  renderTeamComparisonChart,
  renderProjectCompletionOverviewChart,
} from "./chartRenderers.js"

import {
  setupManagerViewSwitcher,
  setupProjectSearch,
  setupEmployeeSearch,
} from "./uiController.js"

// Shortcut
const $ = (sel) => document.querySelector(sel)

// Load based on role
window.addEventListener("DOMContentLoaded", () => {
  // Fetch the user type from the backend if needed
  const userIdFromUrl = new URLSearchParams(window.location.search).get(
    "user_id"
  )
  if (userIdFromUrl) {
    fetch(
      `/makeitall/cob290-part3-team08/server/api/analytics/index.php/user-type?user_id=${userIdFromUrl}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data.user_type !== undefined) {
          window.currentUserType = data.user_type // Store the user type in JavaScript variable
          console.log("User Type:", window.currentUserType)
          showPanelsByUserType()
          loadAnalytics()
          if (currentUserType === 0) setupManagerViewSwitcher()
        } else {
          console.error("Error fetching user type:", data.error)
        }
      })
      .catch((error) => {
        console.error("Error:", error)
      })
  }
})

// Panel visibility
function showPanelsByUserType() {
  const panels = {
    0: "#managerPanel",
    1: "#teamLeaderStats",
    2: "#employeeStats",
  }
  if (panels[currentUserType]) {
    $(panels[currentUserType])?.classList.remove("hidden");
  } else {
    console.error('Invalid user type');
  }}

// Load all analytics based on role
function loadAnalytics() {
  const loaders = {
    0: loadManagerAnalytics,
    1: loadTeamLeaderAnalytics,
    2: loadEmployeeAnalytics,
  }
  loaders[currentUserType]?.()
}

// Manager logic
function loadManagerAnalytics() {
  setupEmployeeSearch(API_BASE)
  setupProjectSearch(API_BASE, leaderIdToName)

  Promise.all([
    loadTeamLeaderNames(),
    loadTasks(),
    loadAllProjectProgress(),
    loadTeamPerformanceOverview(),
    //loadDetails(),
    loadAllEmployees(),
  ]).then(renderManagerCharts)
}

// Team Leader logic
function loadTeamLeaderAnalytics() {
  Promise.all([
    loadTasks(),
    loadTeamPerformance(currentUserId),
    loadProjectProgress(currentUserId),
    //loadDetails(),
    loadAllEmployees(),
    console.log(analyticsData),
  ]).then(renderTeamLeaderCharts)
}

// Employee logic
function loadEmployeeAnalytics() {
  Promise.all([
    loadTasks(`?employee_id=${currentUserId}`),
    loadWorkload(currentUserId, "2024-04-01", "2024-06-30"),
    loadCompletionStats(currentUserId),
    loadAverageTimeStats(currentUserId),
    loadOverrunningTasks(),
    loadDeadlineTasks(10, currentUserId),
    //loadDetails(),
    loadAllEmployees(),
  ]).then(renderEmployeeCharts)
}

// Chart renderers per role
function renderManagerCharts() {
  renderOrgTaskSummaryChart(analyticsData.tasks)
  renderTeamComparisonChart(analyticsData.teamPerformance)
  renderProjectCompletionOverviewChart(analyticsData.projectProgress)
}

function renderTeamLeaderCharts() {
  renderTeamCompletionChart(analyticsData.teamPerformance, "TL")
  renderTeamBreakdownChart(analyticsData.teamPerformance, "TL")

  const progressData = {
    
    [currentUserId]: analyticsData.projectProgress[currentUserId] || {},
  }
  console.log(analyticsData.projectProgress[currentUserId])
  renderProjectProgressChart(progressData, "TL")
}

function renderEmployeeCharts() {
  renderCompletionChart(analyticsData.tasks, "Employee")
  renderTimeStatsChart(analyticsData.tasks, "Employee")
  renderDeadlineChart(analyticsData.deadlines, "Employee")
  console.log(analyticsData.deadlines)
  renderWorkloadChart(analyticsData.tasks, "Employee")
}
