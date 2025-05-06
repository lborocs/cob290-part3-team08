// Adjust this if your path is different
const API_BASE = "/makeitall/cob290-part3-team08/server/api/analytics/index.php";

let currentPageType = "project"; // or "employee", mock value for this context
const $ = (sel) => document.querySelector(sel);

let analyticsData = {
  tasks: [],
  completionStats: {},
  avgTimeStats: {},
  overruns: [],
  deadlines: [],
  workload: [],
  teamPerformance: [],
  projectProgress: {}
};

//Load all analytics data when the page is ready
document.addEventListener("DOMContentLoaded", () => {
  loadAnalytics();
});

//Master function that resets the UI and triggers all analytics data fetches. Runs on page load.
function loadAnalytics() {
  resetUI();
  loadTasks();
  loadDetails();
  loadCompletionStats();
  loadAverageTimeStats();
  loadOverrunningTasks();
  loadDeadlineTasks(5);
  loadWorkload("6", "2024-04-01", "2024-06-30");
  loadTeamPerformance("12");
  loadProjectProgress("1");
}

//Clears the analytics output area (if you want to re-render content).
function resetUI() {
  $("#analyticsOutput").innerHTML = "";
}

//Fetches tasks for the current project or user based on session context. Stores and optionally renders a count breakdown.
function loadTasks() {
  fetch(`${API_BASE}/tasks`)
    .then(r => r.json())
    .then(data => {
      analyticsData.tasks = data;
      console.log("Tasks:", data);
      renderTaskCount(data);
    });
}

//Fetches information about the current project or employee, depending on page type.
function loadDetails() {
  const endpoint = currentPageType === "project" ? "projects" : "employee";
  fetch(`${API_BASE}/${endpoint}`)
    .then(r => r.json())
    .then(data => {
      console.log("Details:", data);
    });
}

//Fetches total count of completed and pending tasks for the current user or project. Useful for pie charts or summaries.
function loadCompletionStats() {
  fetch(`${API_BASE}/completion?employee_id=6`)
    .then(r => r.json())
    .then(data => {
      analyticsData.completionStats = data;
      console.log("Completion stats:", data);
    });
}

//Fetches average time_allocated vs time_taken across all tasks assigned to a user.
function loadAverageTimeStats() {
  fetch(`${API_BASE}/avg-time?employee_id=6`)
    .then(r => r.json())
    .then(data => {
      analyticsData.avgTimeStats = data;
      console.log("Average time stats:", data);
    });
}

//Gets all tasks where time_taken > time_allocated. Highlights bottlenecks or inefficiencies.
function loadOverrunningTasks() {
  fetch(`${API_BASE}/overruns`)
    .then(r => r.json())
    .then(data => {
      analyticsData.overruns = data;
      console.log("Overruns:", data);
    });
}

//Retrieves tasks due within the next 5days. Helps with urgency or upcoming deadlines.
function loadDeadlineTasks(days = 5) {
  fetch(`${API_BASE}/deadlines?days=${days}`)
    .then(r => r.json())
    .then(data => {
      analyticsData.deadlines = data;
      console.log("Deadlines:", data);
    });
}

//Gets task workload data for a specific employee within a date range — useful for time charts or tables.
function loadWorkload(empId, start, end) {
  fetch(`${API_BASE}/workload?employee_id=${empId}&start_date=${start}&end_date=${end}`)
    .then(r => r.json())
    .then(data => {
      analyticsData.workload = data;
      console.log("Workload:", data);
    });
}

//Fetches a list of all employees assigned to projects led by the given team_leader_id, 
// along with each employee's total number of tasks and number of completed tasks. 
// This is useful for displaying a team leaderboard, performance dashboard, or manager summary view.
function loadTeamPerformance(leaderId) {
  fetch(`${API_BASE}/performance?team_leader_id=${leaderId}`)
    .then(r => r.json())
    .then(data => {
      analyticsData.teamPerformance = data;
      console.log("Team performance:", data);
    });
}

//Retrieves the percentage of completed tasks in a specific project. 
// This function can be used for rendering a progress bar or KPI chart to visually show how close a project is to completion.
function loadProjectProgress(projectId) {
  fetch(`${API_BASE}/progress?project_id=${projectId}`)
    .then(r => r.json())
    .then(data => {
      analyticsData.projectProgress = data;
      console.log("Project progress:", data);
    });
}

//Calls countTasksByColumn() based on current page type and logs or displays a summary of tasks per user/project.
function renderTaskCount(tasks) {
  const key = currentPageType === "project" ? "employee_name" : "project_name";
  const taskCounts = countTasksByColumn(key, tasks);
  console.log("Task counts by", key, taskCounts);
  // Optional: update DOM
}

//Tallies the number of tasks grouped by a column (e.g., by employee_name or project_name)
function countTasksByColumn(column, tasks) {
  const result = {};
  tasks.forEach((task) => {
    if (task[column] in result) {
      result[task[column]]++;
    } else {
      result[task[column]] = 1;
    }
  });
  return result;
}
