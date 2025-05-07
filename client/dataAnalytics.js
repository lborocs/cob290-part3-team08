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

const charts = {
  employeeCompletionChartManager: null,
  employeeCompletionChartEmployee: null,
  employeeWorkloadChartManager: null,
  employeeWorkloadChartEmployee: null,
  projectProgressChartTL: null,
  projectProgressChartManager: null,
  employeeDeadlineChartManager: null,
  employeeDeadlineChartEmployee: null,
  employeeTimeStatsChartManager: null,
  employeeTimeStatsChartEmployee: null,
  teamCompletionChartTL: null,
  teamBreakdownChartTL: null,
  teamCompletionChartManager: null,
  teamBreakdownChartManager: null,
  orgTaskSummaryChart: null,
  teamComparisonChart: null,
  projectCompletionOverviewChart: null,
}

const leaderIdToName = {}

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
  } else if (currentUserType === 1) {
    // Team Leader
    $("#teamLeaderStats")?.classList.remove("hidden")
  } else {
    // Regular employee
    $("#employeeStats")?.classList.remove("hidden")
  }
}

function loadTeamLeaderNames() {
  return fetch(`${API_BASE}/team-leaders`)
    .then((r) => r.json())
    .then((leaders) => {
      leaders.forEach((leader) => {
        leaderIdToName[
          leader.employee_id
        ] = `${leader.first_name} ${leader.second_name}`
      })
    })
}

// Load analytics depending on user type
function loadAnalytics() {
  if (currentUserType === 0) {
    setupEmployeeSearch()
    setupProjectSearch()
    Promise.all([
      loadTeamLeaderNames(),
      loadAllTasks(),
      loadAllProjectProgress(),
      loadTeamPerformanceOverview(),
      loadDetails(),
    ]).then(() => {
      renderOrgTaskSummaryChart(analyticsData.tasks)
      renderTeamComparisonChart(analyticsData.teamPerformance)
      renderProjectCompletionOverviewChart(analyticsData.projectProgress)
    })
  } else if (currentUserType === 1) {
    Promise.all([
      loadTasks(),
      loadTeamPerformance(currentUserId),
      loadProjectProgress(currentPageId),
      loadDetails(),
    ]).then(() => {
      renderTeamCompletionChart(analyticsData.teamPerformance, "TL")
      renderTeamBreakdownChart(analyticsData.teamPerformance, "TL")
      const progressData = { [currentPageId]: analyticsData.projectProgress }
      renderProjectProgressChart(progressData, "TL")
    })
  } else {
    Promise.all([
      loadTasks(),
      loadWorkload(currentUserId, "2024-04-01", "2024-06-30"),
      loadCompletionStats(),
      loadAverageTimeStats(),
      loadOverrunningTasks(),
      loadDeadlineTasks(5),
      loadDetails(),
    ]).then(() => {
      renderCompletionChart(analyticsData.tasks, "Employee")
      renderTimeStatsChart(analyticsData.avgTimeStats, "Employee")
      renderDeadlineChart(analyticsData.deadlines, "Employee")
      renderWorkloadChart(analyticsData.workload, "Employee")
    })
  }
}

// Clears the analytics output area (if you want to re-render content).
function resetUI() {
  $("#analyticsOutput").innerHTML = ""
}

// Fetches tasks for the current project or user based on session context. Stores and optionally renders a count breakdown.
function loadTasks() {
  return fetch(`${API_BASE}/tasks`)
    .then((r) => r.json())
    .then((data) => {
      analyticsData.tasks = data
      console.log("Tasks:", data)
      renderTaskCount(data)
      const completedTasks = analyticsData.tasks.filter(
        (t) => t.completed === 1
      )
      const pendingTasks = analyticsData.tasks.filter((t) => t.completed === 0)
    })
}

// Manager-only: Fetches all tasks in the system and renders a summary breakdown across all users or projects.
function loadAllTasks() {
  return fetch(`${API_BASE}/tasks`) // For now, this endpoint returns all if no filters
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
  return fetch(`${API_BASE}/${endpoint}`)
    .then((r) => r.json())
    .then((data) => {
      console.log("Details:", data)
    })
}

// Fetches total count of completed and pending tasks for the current user or project. Useful for pie charts or summaries.
function loadCompletionStats() {
  return fetch(`${API_BASE}/completion?employee_id=${currentUserId}`)
    .then((r) => r.json())
    .then((data) => {
      analyticsData.completionStats = data
      console.log("Completion stats:", data)
    })
}

// Fetches average time_allocated vs time_taken across all tasks assigned to a user.
function loadAverageTimeStats() {
  return fetch(`${API_BASE}/avg-time?employee_id=${currentUserId}`)
    .then((r) => r.json())
    .then((data) => {
      analyticsData.avgTimeStats = data
      console.log("Average time stats:", data)
    })
}

// Gets all tasks where time_taken > time_allocated. Highlights bottlenecks or inefficiencies.
function loadOverrunningTasks() {
  return fetch(`${API_BASE}/overruns`)
    .then((r) => r.json())
    .then((data) => {
      analyticsData.overruns = data
      console.log("Overruns:", data)
    })
}

// Retrieves tasks due within the next 5days. Helps with urgency or upcoming deadlines.
function loadDeadlineTasks(days = 5) {
  return fetch(`${API_BASE}/deadlines?days=${days}`)
    .then((r) => r.json())
    .then((data) => {
      analyticsData.deadlines = data
      console.log("Deadlines:", data)
    })
}

// Gets task workload data for a specific employee within a date range — useful for time charts or tables.
function loadWorkload(empId, start, end) {
  return fetch(
    `${API_BASE}/workload?employee_id=${empId}&start_date=${start}&end_date=${end}`
  )
    .then((r) => r.json())
    .then((data) => {
      analyticsData.workload = data
      console.log("Workload:", data)
    })
}

// Fetches a list of all employees assigned to projects led by the given team_leader_id,
// along with each employee's total number of tasks and number of completed tasks.
// This is useful for displaying a team leaderboard, performance dashboard, or manager summary view.
function loadTeamPerformance(leaderId) {
  return fetch(`${API_BASE}/performance?team_leader_id=${leaderId}`)
    .then((r) => r.json())
    .then((data) => {
      analyticsData.teamPerformance = data
      console.log("Team performance:", data)
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
  return fetch(`${API_BASE}/progress?project_id=${projectId}`)
    .then((r) => r.json())
    .then((data) => {
      analyticsData.projectProgress = data
      console.log("Project progress:", data)
    })
}

// Manager-only: Fetch progress for all projects in the system
function loadAllProjectProgress() {
  analyticsData.projectProgress = {}

  return fetch(`${API_BASE}/projects`)
    .then((r) => r.json())
    .then((projects) => {
      console.log("All projects:", projects)

      const fetches = projects.map((proj) => {
        const projectId = proj.project_id
        return fetch(`${API_BASE}/progress?project_id=${projectId}`)
          .then((r) => r.json())
          .then((progress) => {
            analyticsData.projectProgress[projectId] = {
              projectName: proj.project_name,
              progress: progress.completed_percentage,
              project_due_date: progress.project_due_date,
            }
            console.log(`Progress for project ${projectId}:`, progress)
          })
      })

      return Promise.all(fetches) 
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

document.addEventListener("DOMContentLoaded", () => {
  if (currentUserType === 0) {
    setupManagerViewSwitcher()
  }
})

///-------------------------------------Setting up views

function setupManagerViewSwitcher() {
  const views = ["managerView", "projectsView", "employeesView"]
  const labels = ["Manager View", "Projects View", "Employees View"]
  let currentIndex = 0

  const label = document.getElementById("currentViewLabel")
  const left = document.getElementById("leftArrow")
  const right = document.getElementById("rightArrow")

  const showView = (index) => {
    views.forEach((id, i) => {
      document.getElementById(id).classList.toggle("hidden", i !== index)
    })
    label.textContent = labels[index]
  }

  left.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + views.length) % views.length
    showView(currentIndex)
  })

  right.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % views.length
    showView(currentIndex)
  })

  // Initialize first view
  showView(currentIndex)
}

function setupProjectSearch() {
  const projectSelect = document.getElementById("projectSelect")

  fetch(`${API_BASE}/projects`)
    .then((res) => res.json())
    .then((projects) => {
      projects.forEach((p) => {
        const option = document.createElement("option")
        option.value = p.project_id
        option.textContent = p.project_name
        projectSelect.appendChild(option)
      })

      projectSelect.addEventListener("change", () => {
        const projectId = projectSelect.value
        if (!projectId) return

        const projectName =
          projectSelect.options[projectSelect.selectedIndex].textContent

        setTimeout(() => {
          const progressData = {
            [projectId]: analyticsData.projectProgress,
          }

          destroyChart(projectProgressChartManager)
          destroyChart(teamCompletionChartManager)
          destroyChart(teamBreakdownChartManager)

          // Use same approach as team leader view
          loadTasks()
          renderProjectProgressChart(progressData, "Manager")
          renderTeamCompletionChart(analyticsData.teamPerformance, "Manager")
          renderTeamBreakdownChart(analyticsData.teamPerformance, "Manager")
        })
      })
    })
}

function setupEmployeeSearch() {
  const projectFilter = document.getElementById("projectFilter")
  const employeeSelect = document.getElementById("employeeSelect")

  let allProjects = []
  let allEmployees = []

  // Load all projects for filter
  fetch(`${API_BASE}/projects`)
    .then((res) => res.json())
    .then((projects) => {
      allProjects = projects
      projects.forEach((p) => {
        const option = document.createElement("option")
        option.value = p.project_id
        option.textContent = p.project_name
        projectFilter.appendChild(option)
      })
    })

  // Load all employees
  fetch(`${API_BASE}/employees`)
    .then((r) => r.json())
    .then((users) => {
      console.log("Loaded all employees:", users)
      allEmployees = users
      renderEmployeeOptions(users)

      projectFilter.addEventListener("change", () => {
        const projectId = projectFilter.value
        if (!projectId) {
          renderEmployeeOptions(allEmployees)
          return
        }

        // Filter employees assigned to the selected project
        fetch(`${API_BASE}/projects?project_id=${projectId}`)
          .then((res) => res.json())
          .then((projects) => {
            console.log("Loaded projects: ", projects)

            const project = projects[0]
            const assignedIds = project.assigned_employee_ids || []
            console.log("All employees:", allEmployees)
            console.log("Assigned IDs:", assignedIds)
            const filtered = allEmployees.filter((e) =>
              assignedIds.map(String).includes(String(e.employee_id))
            )

            renderEmployeeOptions(filtered)
          })
      })

      employeeSelect.addEventListener("change", () => {
        const employeeId = employeeSelect.value
        if (!employeeId) return

        // Fetch all needed data first, then render
        Promise.all([
          fetch(`${API_BASE}/tasks?employee_id=${employeeId}`).then((r) =>
            r.json()
          ),
          fetch(`${API_BASE}/avg-time?employee_id=${employeeId}`).then((r) =>
            r.json()
          ),
          fetch(`${API_BASE}/deadlines`).then((r) => r.json()),
          fetch(
            `${API_BASE}/workload?employee_id=${employeeId}&start_date=2024-04-01&end_date=2024-06-30`
          ).then((r) => r.json()),
        ]).then(([tasks, avgTimeStats, deadlines, workload]) => {
          // Set in analyticsData so existing render functions can be reused
          analyticsData.tasks = tasks
          analyticsData.avgTimeStats = avgTimeStats
          analyticsData.deadlines = deadlines
          analyticsData.workload = workload

          // Now reuse the same renderers used for regular employees
          renderCompletionChart(tasks, "Manager")
          renderTimeStatsChart(avgTimeStats, "Manager")
          renderDeadlineChart(deadlines, "Manager")
          renderWorkloadChart(workload, "Manager")
        })
      })

      function renderEmployeeOptions(list) {
        employeeSelect.innerHTML =
          '<option value="">-- Select an employee --</option>'
        list.forEach((e) => {
          const option = document.createElement("option")
          option.value = e.employee_id
          option.textContent = e.first_name + " " + e.second_name
          employeeSelect.appendChild(option)
        })
      }
    })
}

function destroyChart(id) {
  if (charts[id] instanceof Chart) {
    charts[id].destroy()
  }
}

///-----------------Graphs
//Employee view
function renderCompletionChart(tasks, context = "Employee") {
  const chartID =
    context === "Manager" ? "completionChartManager" : "completionChartEmployee"

  destroyChart(chartID)
  const completed = tasks.filter((t) => t.completed === 1)
  const pending = tasks.filter((t) => t.completed === 0)

  charts[chartID] = new Chart(
    document.getElementById(chartID).getContext("2d"),
    {
      type: "pie",
      data: {
        labels: ["Completed", "Pending"],
        datasets: [
          {
            data: [completed.length, pending.length],
            backgroundColor: ["#4caf50", "#f44336"],
          },
        ],
      },
      options: {
        plugins: {
          title: { display: true, text: "Task Completion Status" },
          tooltip: {
            callbacks: {
              label: function (context) {
                const index = context.dataIndex
                const taskList = index === 0 ? completed : pending
                return `Tasks (${taskList.length})`
              },
              afterLabel: function (context) {
                const index = context.dataIndex
                const taskList = index === 0 ? completed : pending
                return taskList.map((t) => `• ${t.task_name}`)
              },
            },
          },
        },
      },
    }
  )
}

function renderTimeStatsChart(data, context = "Employee") {
  const chartID =
    context === "Manager" ? "timeStatsChartManager" : "timeStatsChartEmployee"

  destroyChart(chartID)
  charts[chartID] = new Chart(
    document.getElementById(chartID).getContext("2d"),
    {
      type: "bar",
      data: {
        labels: ["Avg Time Allocated", "Avg Time Taken"],
        datasets: [
          {
            label: "Hours",
            data: [data.avg_time_allocated, data.avg_time_taken],
            backgroundColor: ["#2196f3", "#ff9800"],
          },
        ],
      },
      options: {
        plugins: { title: { display: true, text: "Average Time per Task" } },
      },
    }
  )
}

function renderDeadlineChart(tasks, context = "Employee") {
  const chartID =
    context === "Manager" ? "deadlineChartManager" : "deadlineChartEmployee"
  destroyChart(chartID)
  charts[chartID] = new Chart(
    document.getElementById(chartID).getContext("2d"),
    {
      type: "bar",
      data: {
        labels: tasks.map((t) => t.task_name),
        datasets: [
          {
            label: "Days Remaining",
            data: tasks.map((t) => {
              const finish = new Date(t.finish_date)
              const today = new Date()
              return Math.ceil((finish - today) / (1000 * 60 * 60 * 24))
            }),
            backgroundColor: "#e91e63",
          },
        ],
      },
      options: {
        plugins: { title: { display: true, text: "Upcoming Deadlines" } },
        scales: {
          y: {
            beginAtZero: true,
            min: 1,
            max: 10,
            ticks: { stepSize: 1 },
            title: { display: true, text: "Days Left" },
          },
        },
      },
    }
  )
}

function renderWorkloadChart(data, context = "Employee") {
  const chartID =
    context === "Manager" ? "workloadChartManager" : "workloadChartEmployee"

  destroyChart(chartID)
  charts[chartID] = new Chart(
    document.getElementById(chartID).getContext("2d"),
    {
      type: "line",
      data: {
        labels: data.map((d) => d.start_date),
        datasets: [
          {
            label: "Time Allocated",
            data: data.map((d) => d.time_allocated),
            borderColor: "#3f51b5",
            fill: false,
          },
          {
            label: "Time Taken",
            data: data.map((d) => d.time_taken),
            borderColor: "#f44336",
            fill: false,
          },
        ],
      },
      options: {
        plugins: { title: { display: true, text: "Workload Over Time" } },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "Hours" } },
        },
      },
    }
  )
}
//Team Leader view
function renderTeamCompletionChart(data, context = "TL") {
  const chartID =
    context === "Manager"
      ? "teamCompletionChartManager"
      : "teamCompletionChartTL"

  destroyChart(chartID)
  const total = data.reduce((sum, emp) => sum + emp.total_tasks, 0)
  const completed = data.reduce((sum, emp) => sum + emp.completed_tasks, 0)
  const pending = total - completed

  charts[chartID] = new Chart(document.getElementById(chartID), {
    type: "pie",
    data: {
      labels: ["Completed", "Pending"],
      datasets: [
        { data: [completed, pending], backgroundColor: ["#4caf50", "#f44336"] },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: `${context} Team Task Completion` },
      },
    },
  })
}

function renderTeamBreakdownChart(data, context = "TL") {
  const chartID =
    context === "Manager" ? "teamBreakdownChartManager" : "teamBreakdownChartTL"

  destroyChart(chartID)
  const names = data.map((emp) => emp.name)
  const totals = data.map((emp) => emp.total_tasks)
  const completed = data.map((emp) => emp.completed_tasks)

  charts[chartID] = new Chart(document.getElementById(chartID), {
    type: "bar",
    data: {
      labels: names,
      datasets: [
        { label: "Total Tasks", data: totals, backgroundColor: "#90caf9" },
        {
          label: "Completed Tasks",
          data: completed,
          backgroundColor: "#4caf50",
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: `${context} Tasks by Team Member` },
      },
      responsive: true,
      scales: { y: { beginAtZero: true } },
    },
  })
}

function renderProjectProgressChart(progressData, context = "TL") {
  const chartID =
    context === "Manager"
      ? "projectProgressChartManager"
      : "projectProgressChartTL"

  destroyChart(chartID)
  const labels = Object.values(progressData).map((p) => p.projectName)
  const values = Object.values(progressData).map((p) => p.progress)

  charts[chartID] = new Chart(document.getElementById(chartID), {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Completion (%)", data: values, backgroundColor: "#2196f3" },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: `${context} Project Progress` },
      },
      scales: { y: { beginAtZero: true, max: 100 } },
    },
  })
}

//Manager view
function renderOrgTaskSummaryChart(tasks) {
  const chartID = "orgTaskSummaryChart"
  destroyChart(chartID)

  const now = new Date()

  const completed = tasks.filter((t) => t.completed === 1)
  const pending = tasks.filter(
    (t) => t.completed === 0 && new Date(t.finish_date) >= now
  )
  const overdue = tasks.filter(
    (t) => t.completed === 0 && new Date(t.finish_date) < now
  )

  const completedCount = completed.length
  const pendingCount = pending.length
  const overdueCount = overdue.length

  charts[chartID] = new Chart(document.getElementById(chartID), {
    type: "doughnut",
    data: {
      labels: ["Completed", "Pending", "Overdue"],
      datasets: [
        {
          data: [completedCount, pendingCount, overdueCount],
          backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Organization-wide Task Completion",
        },
      },
    },
  })

  // Get list of unique team_leader_ids with overdue tasks
  const overdueLeaderIds = [...new Set(overdue.map((t) => t.team_leader_id))]
  const leaderNames = overdueLeaderIds.map(
    (id) => leaderIdToName[id] || `ID ${id}`
  )

  const container = document.getElementById(chartID).parentElement
  let list = container.querySelector(".overdue-leader-list")
  if (!list) {
    list = document.createElement("div")
    list.className = "overdue-leader-list"
    container.appendChild(list)
  }

  list.innerHTML = `
    <p><strong>Team Leaders with Overdue Tasks:</strong></p>
    <ul>
      ${
        leaderNames.map((name) => `<li>${name}</li>`).join("") ||
        "<li>None</li>"
      }
    </ul>
  `
}

function renderTeamComparisonChart(performanceData) {
  const chartID = "teamComparisonChart"
  destroyChart(chartID)

  const labels = []
  const efficiencyScores = []

  performanceData.forEach((entry) => {
    const { teamLeaderId, performance } = entry

    let onTime = 0
    let totalCompleted = 0

    performance.forEach((emp) => {
      emp.tasks.forEach((t) => {
        if (t.completed === 1 && t.time_completed && t.finish_date) {
          const completedDate = new Date(t.time_completed)
          const dueDate = new Date(t.finish_date)

          if (!isNaN(completedDate) && !isNaN(dueDate)) {
            totalCompleted++
            if (completedDate <= dueDate) {
              onTime++
            }
          }
        }
      })
    })

    const efficiency =
      totalCompleted > 0 ? Math.round((onTime / totalCompleted) * 100) : 0

    labels.push(`TL ${teamLeaderId}`)
    efficiencyScores.push(efficiency)
  })

  charts[chartID] = new Chart(document.getElementById(chartID), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Efficiency (% of completed tasks on time)",
          data: efficiencyScores,
          backgroundColor: "#4caf50",
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Task Efficiency Leaderboard",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: "Efficiency (%)",
          },
        },
      },
    },
  })
}

function renderProjectCompletionOverviewChart(projectProgress) {
  destroyChart("projectCompletionOverviewChart")

  console.log("Rendering project overview chart:")
  const labels = Object.values(projectProgress).map((p) => 
    `${p.projectName}\n(${p.project_due_date})`
  )
  const values = Object.values(projectProgress).map((p) => p.progress)

  console.log("Labels:", labels)
  console.log("Values:", values)

  charts.projectCompletionOverviewChart = new Chart(
    document.getElementById("projectCompletionOverviewChart"),
    {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "% Completed",
            data: values,
            backgroundColor: "#ff9800",
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Project Completion Overview",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
          },
          x: {
            ticks: {
              callback: function (value, index, ticks) {
                const label = this.getLabelForValue(value)
                return label.split("\n")
              },
            },
          },
        },
      },
    }
  )
}
