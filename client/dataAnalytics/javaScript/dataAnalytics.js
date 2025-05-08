// analytics_dashboard.js
const API_BASE = "/makeitall/cob290-part3-team08/server/api/analytics/index.php"

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
  fetchProjectDetails
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
  renderProjectCompletionOverviewChart
} from "./chartRenderers.js"

import {
  setupManagerViewSwitcher,
  setupProjectSearch,
  setupEmployeeSearch
} from "./uiController.js"


// Shortcut
const $ = sel => document.querySelector(sel)

// Load based on role
window.addEventListener("DOMContentLoaded", () => {
  showPanelsByUserType()
  loadAnalytics()
  if (currentUserType === 0) setupManagerViewSwitcher()
})

// Panel visibility
function showPanelsByUserType() {
  const panels = {
    0: "#managerPanel",
    1: "#teamLeaderStats",
    2: "#employeeStats"
  }
  $(panels[currentUserType])?.classList.remove("hidden")
}

// Load all analytics based on role
function loadAnalytics() {
  const loaders = {
    0: loadManagerAnalytics,
    1: loadTeamLeaderAnalytics,
    2: loadEmployeeAnalytics
  }
  loaders[currentUserType]?.()
}

// Manager logic
function loadManagerAnalytics() {
  setupEmployeeSearch(API_BASE)
  setupProjectSearch(API_BASE, leaderIdToName)

  Promise.all([
    loadTeamLeaderNames(),
    loadAllTasks(),
    loadAllProjectProgress(),
    loadTeamPerformanceOverview(),
    loadDetails(),
    loadAllEmployees()
  ]).then(renderManagerCharts)
}

// Team Leader logic
function loadTeamLeaderAnalytics() {
  Promise.all([
    loadTasks(),
    loadTeamPerformance(currentUserId),
    loadProjectProgress(currentPageId),
    loadDetails(),
    loadAllEmployees()
  ]).then(renderTeamLeaderCharts)
}

// Employee logic
function loadEmployeeAnalytics() {
  Promise.all([
    loadTasks(),
    loadWorkload(currentUserId, "2024-04-01", "2024-06-30"),
    loadCompletionStats(currentUserId),
    loadAverageTimeStats(currentUserId),
    loadOverrunningTasks(),
    loadDeadlineTasks(5),
    loadDetails(),
    loadAllEmployees()
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
    [currentPageId]: analyticsData.projectProgress[currentPageId] || {}
  }
  renderProjectProgressChart(progressData, "TL")
}

function renderEmployeeCharts() {
  renderCompletionChart(analyticsData.tasks, "Employee")
  renderTimeStatsChart(analyticsData.tasks, "Employee")
  renderDeadlineChart(analyticsData.deadlines, "Employee")
  renderWorkloadChart(analyticsData.tasks, "Employee")
}
