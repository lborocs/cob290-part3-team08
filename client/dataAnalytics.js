// Adjust this if your path is different
const API_BASE = "/makeitall/cob290-part3-team08/server/api/analytics/index.php"

const $ = (sel) => document.querySelector(sel)

let analyticsData = {
  tasks: [],
  completionStats: {},
  avgTimeStats: {},
  overruns: [],
  deadlines: [],
  workload: [],
  teamPerformance: [],
  projectProgress: {},
}

let completionChart = null
let avgTimeChart = null
let workloadChart = null
let teamPerformanceChart = null
let projectProgressChart = null
let teamLeadTaskCompletionChart = null


// Loads page content and determines user access level
document.addEventListener("DOMContentLoaded", () => {
  showPanelsByUserType()
  loadAnalytics()
})

// Unhides relevant analytics panels based on user type
function showPanelsByUserType() {
  if (currentUserType === 0) {
    // Manager
    $("#managerPanel")?.classList.remove("hidden")
    $("#teamLeaderStats")?.classList.remove("hidden")
    $("#employeeStats")?.classList.remove("hidden")
  } else if (currentUserType === 1) {
    // Team Leader
    $("#teamLeaderStats")?.classList.remove("hidden")
    $("#employeeStats")?.classList.remove("hidden")
  } else {
    // Regular employee
    $("#employeeStats")?.classList.remove("hidden")
  }
}

// Load analytics depending on user type
function loadAnalytics() {
  if (currentUserType === 0) {
    // Manager
    loadAllTasks()
    loadAllProjectProgress()
    loadTeamPerformanceOverview()
    loadDetails()
  } else if (currentUserType === 1) {
    // Team Leader
    loadTasks();
    loadTeamPerformance(currentUserId);
    loadTeamLeaderProjectProgress(currentUserId);
    loadTeamLeadTaskCompletionStats(currentUserId);
    loadDetails();
  } else {
    // Regular Employee
    loadTasks()
    loadWorkload(currentUserId, "2024-04-01", "2024-06-30") // Example range
    loadCompletionStats()
    loadAverageTimeStats()
    loadOverrunningTasks()
    loadDeadlineTasks(5)
    loadDetails()
  }
}

// Clears the analytics output area (if you want to re-render content).
function resetUI() {
  $("#analyticsOutput").innerHTML = ""
}

// Fetches tasks for the current project or user based on session context. Stores and optionally renders a count breakdown.
function loadTasks() {
  fetch(`${API_BASE}/tasks`)
    .then((r) => r.json())
    .then((data) => {
      analyticsData.tasks = data
      console.log("Tasks:", data)
      renderTaskCount(data)
    })
}

// Manager-only: Fetches all tasks in the system and renders a summary breakdown across all users or projects.
function loadAllTasks() {
  fetch(`${API_BASE}/tasks`) // For now, this endpoint returns all if no filters
    .then((r) => r.json())
    .then((data) => {
      analyticsData.tasks = data
      console.log("All tasks (org-wide):", data)
      renderTaskCount(data) // Aggregate display
    })
}

// Fetches information about the current project or employee, depending on page type.
function loadDetails() {
  const endpoint = currentPageType === "project" ? "projects" : "employee"
  fetch(`${API_BASE}/${endpoint}`)
    .then((r) => r.json())
    .then((data) => {
      console.log("Details:", data)
    })
}

// Fetches total count of completed and pending tasks for the current user or project. Useful for pie charts or summaries.
function loadCompletionStats() {
  fetch(`${API_BASE}/completion?employee_id=${currentUserId}`)
    .then((r) => r.json())
    .then((data) => {
      analyticsData.completionStats = data
      console.log("Completion stats:", data)
      renderCompletionChart(data)
    })
}

// Fetches average time_allocated vs time_taken across all tasks assigned to a user.
function loadAverageTimeStats() {
  fetch(`${API_BASE}/avg-time?employee_id=${currentUserId}`)
    .then((r) => r.json())
    .then((data) => {
      analyticsData.avgTimeStats = data
      console.log("Average time stats:", data)
      renderAvgTimeChart(data)
    })
}

// Gets all tasks where time_taken > time_allocated. Highlights bottlenecks or inefficiencies.
function loadOverrunningTasks() {
  fetch(`${API_BASE}/overruns`)
    .then((r) => r.json())
    .then((data) => {
      analyticsData.overruns = data
      console.log("Overruns:", data)
    })
}

// Retrieves tasks due within the next 5days. Helps with urgency or upcoming deadlines.
function loadDeadlineTasks(days = 5) {
  fetch(`${API_BASE}/deadlines?days=${days}`)
    .then((r) => r.json())
    .then((data) => {
      analyticsData.deadlines = data
      console.log("Deadlines:", data)
    })
}

// Gets task workload data for a specific employee within a date range — useful for time charts or tables.
function loadWorkload(empId, start, end) {
  fetch(
    `${API_BASE}/workload?employee_id=${empId}&start_date=${start}&end_date=${end}`
  )
    .then((r) => r.json())
    .then((data) => {
      analyticsData.workload = data
      console.log("Workload:", data)
      renderWorkloadChart(data)
    })
}

// Fetches a list of all employees assigned to projects led by the given team_leader_id,
// along with each employee's total number of tasks and number of completed tasks.
// This is useful for displaying a team leaderboard, performance dashboard, or manager summary view.
function loadTeamPerformance(leaderId) {
  fetch(`${API_BASE}/performance?team_leader_id=${leaderId}`)
    .then((r) => r.json())
    .then((data) => {
      analyticsData.teamPerformance = data
      console.log("Team performance:", data)
      renderTeamLeadPerformanceChart(data)
    })
}

// Manager-only: Fetches team leaders from the server and loads each team’s performance for comparison.
function loadTeamPerformanceOverview() {
  analyticsData.teamPerformance = []

  // Step 1: Get all team leaders
  fetch(`${API_BASE}/team-leaders`)
    .then((r) => r.json())
    .then((leaders) => {
      console.log("Team leaders:", leaders)

      // Step 2: For each leader, load their team performance
      leaders.forEach((leader) => {
        const id = leader.employee_id
        fetch(`${API_BASE}/performance?team_leader_id=${id}`)
          .then((r) => r.json())
          .then((data) => {
            console.log(`Performance for team leader ${id}:`, data)
            analyticsData.teamPerformance.push({
              teamLeaderId: id,
              performance: data,
            })
          })
      })
    })
}

// Retrieves the percentage of completed tasks in a specific project.
// This function can be used for rendering a progress bar or KPI chart to visually show how close a project is to completion.
function loadProjectProgress(projectId) {
  fetch(`${API_BASE}/progress?project_id=${projectId}`)
    .then((r) => r.json())
    .then((data) => {
      analyticsData.projectProgress = data
      console.log("Project progress:", data)
    })
}

function loadTeamLeaderProjectProgress(leaderId) {
  analyticsData.projectProgress = {};

  fetch(`${API_BASE}/projects?team_leader_id=${leaderId}`)
    .then(r => r.json())
    .then(projects => {
      const fetches = projects.map(p =>
        fetch(`${API_BASE}/progress?project_id=${p.project_id}`)
          .then(r => r.json())
          .then(progress => {
            analyticsData.projectProgress[p.project_id] = {
              projectName: p.project_name,
              progress: progress.completed_percentage
            };
          })
      );

      Promise.all(fetches).then(() => {
        renderTeamLeadProjectProgressChart(analyticsData.projectProgress);
      });
    });
}


// Manager-only: Fetch progress for all projects in the system
function loadAllProjectProgress() {
  analyticsData.projectProgress = {}
  fetch(`${API_BASE}/projects`)
    .then((r) => r.json())
    .then((projects) => {
      const fetches = projects.map((proj) =>
        fetch(`${API_BASE}/progress?project_id=${proj.project_id}`)
          .then((r) => r.json())
          .then((progress) => {
            analyticsData.projectProgress[proj.project_id] = {
              projectName: proj.project_name,
              progress: progress.completed_percentage,
            }
          })
      )

      Promise.all(fetches).then(() => {
        renderProjectProgressChart(analyticsData.projectProgress) // NEW
      })
    })
}

// Calls countTasksByColumn() based on current page type and logs or displays a summary of tasks per user/project.
function renderTaskCount(tasks) {
  const key = currentPageType === "project" ? "employee_name" : "project_name"
  const taskCounts = countTasksByColumn(key, tasks)
  console.log("Task counts by", key, taskCounts)
}

// Tallies the number of tasks grouped by a column (e.g., by employee_name or project_name)
function countTasksByColumn(column, tasks) {
  const result = {}
  tasks.forEach((task) => {
    if (task[column] in result) {
      result[task[column]]++
    } else {
      result[task[column]] = 1
    }
  })
  return result
}

function loadTeamLeadTaskCompletionStats(leaderId) {
  fetch(`${API_BASE}/projects?team_leader_id=${leaderId}`)
    .then(r => r.json())
    .then(projects => {
      const projectIds = projects.map(p => p.project_id);
      let totalCompleted = 0;
      let totalPending = 0;

      const fetches = projectIds.map(pid =>
        fetch(`${API_BASE}/completion?project_id=${pid}`)
          .then(r => r.json())
          .then(data => {
            totalCompleted += data.completed;
            totalPending += data.pending;
          })
      );

      Promise.all(fetches).then(() => {
        renderTeamLeadTaskCompletionChart({ completed: totalCompleted, pending: totalPending });
      });
    });
}


//Graphs
function renderCompletionChart(data) {
  const ctx = document.getElementById("completionChart").getContext("2d")
  if (completionChart) completionChart.destroy()

  const total = data.completed + data.pending

  completionChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Completed", "Pending"],
      datasets: [
        {
          data: [data.completed, data.pending],
          backgroundColor: ["#4caf50", "#f44336"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Completed: ${data.completed} | Pending: ${data.pending}`,
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const value = ctx.raw
              const percent = ((value / total) * 100).toFixed(1)
              return `${ctx.label}: ${value} (${percent}%)`
            },
          },
        },
      },
    },
  })
}

function renderAvgTimeChart(data) {
  const ctx = document.getElementById("avgTimeChart").getContext("2d")
  if (avgTimeChart) avgTimeChart.destroy()

  const allocated = Number(data.avg_time_allocated)
  const taken = Number(data.avg_time_taken)
  const overrun = taken > allocated

  avgTimeChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Time Allocated", "Time Taken"],
      datasets: [
        {
          label: "Hours",
          data: [allocated, taken],
          backgroundColor: ["#2196f3", overrun ? "#e53935" : "#4caf50"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Average Time — ${overrun ? "⚠ Overrun" : "✓ On Track"}`,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  })
}

function renderWorkloadChart(data) {
  const ctx = document.getElementById("workloadChart").getContext("2d")
  if (workloadChart) workloadChart.destroy()

  const dayTotals = {}

  data.forEach((task) => {
    const date = task.start_date
    const hours = Number(task.time_taken || task.time_allocated || 0)
    if (!dayTotals[date]) dayTotals[date] = 0
    dayTotals[date] += hours
  })

  const labels = Object.keys(dayTotals).sort()
  const hours = labels.map((date) => dayTotals[date])
  const avg = hours.reduce((a, b) => a + b, 0) / hours.length

  workloadChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Workload (hrs)",
          data: hours,
          borderColor: "#3f51b5",
          fill: false,
        },
        {
          label: "Average",
          data: Array(hours.length).fill(avg),
          borderDash: [5, 5],
          borderColor: "#ff9800",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Workload Over Time (Aggregated by Start Date)",
        },
      },
    },
  })
}

function renderTeamPerformanceChart(data) {
  const ctx = document.getElementById("teamPerformanceChart").getContext("2d")
  if (teamPerformanceChart) teamPerformanceChart.destroy()

  const labels = data.map((p) => p.name)
  const completed = data.map((p) => p.completed_tasks)
  const total = data.map((p) => p.total_tasks)
  const remaining = total.map((t, i) => t - completed[i])

  teamPerformanceChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Completed",
          data: completed,
          backgroundColor: "#4caf50",
        },
        {
          label: "Remaining",
          data: remaining,
          backgroundColor: "#f44336",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Team Performance (Completed vs Remaining)",
        },
      },
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true },
      },
    },
  })
}

function renderProjectProgressChart(data) {
  const ctx = document.getElementById("projectProgressChart").getContext("2d")
  if (projectProgressChart) projectProgressChart.destroy()

  const sorted = Object.entries(data).sort(
    (a, b) => b[1].progress - a[1].progress
  )
  const labels = sorted.map(([_, p]) => p.projectName)
  const progress = sorted.map(([_, p]) => p.progress)

  projectProgressChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "% Completed",
          data: progress,
          backgroundColor: "#03a9f4",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Project Completion Progress (Sorted)",
        },
      },
      scales: {
        y: {
          max: 100,
          beginAtZero: true,
        },
      },
    },
  })
}

function renderTeamLeadPerformanceChart(data) {
  const ctx = document
    .getElementById("teamLeadPerformanceChart")
    .getContext("2d")
  if (teamPerformanceChart) teamPerformanceChart.destroy()

  const labels = data.map((p) => p.name)
  const completed = data.map((p) => p.completed_tasks)
  const total = data.map((p) => p.total_tasks)
  const remaining = total.map((t, i) => t - completed[i])

  teamPerformanceChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Completed Tasks",
          data: completed,
          backgroundColor: "#4caf50",
        },
        {
          label: "Remaining Tasks",
          data: remaining,
          backgroundColor: "#f44336",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Team Task Performance",
        },
      },
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true },
      },
    },
  })
}

function renderTeamLeadProjectProgressChart(data) {
  const ctx = document.getElementById("teamLeadProjectProgressChart").getContext("2d");
  if (projectProgressChart) projectProgressChart.destroy();

  const sorted = Object.entries(data).sort((a, b) => b[1].progress - a[1].progress);
  const labels = sorted.map(([_, p]) => p.projectName);
  const progress = sorted.map(([_, p]) => p.progress);

  projectProgressChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "% Completed",
        data: progress,
        backgroundColor: "#03a9f4"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Your Project Completion Progress"
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

function renderTeamLeadTaskCompletionChart(stats) {
  const ctx = document.getElementById("teamLeadTaskCompletionChart").getContext("2d");

  if (teamLeadTaskCompletionChart) {
    teamLeadTaskCompletionChart.destroy();
  }

  const completed = Number(stats.completed);
  const pending = Number(stats.pending);
  const total = completed + pending;
  const percent = (n) => ((n / total) * 100).toFixed(1);

  teamLeadTaskCompletionChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Completed", "Pending"],
      datasets: [{
        data: [completed, pending],
        backgroundColor: ["#4caf50", "#f44336"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Task Completion Overview — ${completed} of ${total} done (${percent(completed)}%)`
        }
      }
    }
  });
}



//Cycling through pages
let visiblePages = []
let currentPageIndex = 0

function updateAnalyticsPages() {
  // Get all analytics pages that are currently unhidden
  visiblePages = Array.from(document.querySelectorAll(".analyticsPage")).filter(
    (div) => !div.classList.contains("hidden")
  )

  if (visiblePages.length === 0) return

  // Show the first one and hide the rest
  currentPageIndex = 0
  showAnalyticsPage(currentPageIndex)
}

function showAnalyticsPage(index) {
  visiblePages.forEach((div, i) => {
    div.classList.remove("active")
  })

  const activePage = visiblePages[index]
  if (activePage) {
    activePage.classList.add("active")
  }

  const titles = {
    managerPanel: "Manager Overview",
    teamLeaderStats: "Team Leader Dashboard",
    employeeStats: "My Task Analytics",
  }

  const currentId = activePage?.id
  document.getElementById("analyticsPageTitle").textContent =
    titles[currentId] || "Analytics"
}

// Arrows
$("#prevPage").addEventListener("click", () => {
  if (visiblePages.length > 0) {
    currentPageIndex =
      (currentPageIndex - 1 + visiblePages.length) % visiblePages.length
    showAnalyticsPage(currentPageIndex)
  }
})

$("#nextPage").addEventListener("click", () => {
  if (visiblePages.length > 0) {
    currentPageIndex = (currentPageIndex + 1) % visiblePages.length
    showAnalyticsPage(currentPageIndex)
  }
})

// Modify existing DOMContentLoaded callback
document.addEventListener("DOMContentLoaded", () => {
  showPanelsByUserType()
  updateAnalyticsPages() // NEW
  loadAnalytics()
})
