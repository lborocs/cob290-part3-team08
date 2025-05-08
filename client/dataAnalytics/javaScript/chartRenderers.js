// chartRenderers.js

export const charts = {}

import { leaderIdToName } from "./dataLoaders.js"
import { employeeIdToName } from "./dataLoaders.js"

function destroyChart(id) {
  if (charts[id] instanceof Chart) {
    charts[id].destroy()
  }
}

export function renderCompletionChart(tasks, context = "Employee") {
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
              label: (ctx) => `Tasks (${ctx.dataset.data[ctx.dataIndex]})`,
              afterLabel: (ctx) => {
                const isCompleted = ctx.dataIndex === 0
                return (isCompleted ? completed : pending).map(
                  (t) =>
                    `• ${t.task_name}` +
                    (isCompleted
                      ? ""
                      : ` (Due: ${new Date(
                          t.finish_date
                        ).toLocaleDateString()})`)
                )
              },
            },
          },
        },
      },
    }
  )
}

export function renderTimeStatsChart(tasks, context = "Employee") {
  const chartID =
    context === "Manager" ? "timeStatsChartManager" : "timeStatsChartEmployee";
  destroyChart(chartID);
    // Ensure tasks is an array
    if (!Array.isArray(tasks)) {
      console.error("Expected tasks to be an array, but received:", tasks);
      return;
    }
  

  // Calculate the total time allocated and time taken
  const totalAllocated = tasks.reduce((acc, task) => acc + task.time_allocated, 0);
  const totalTaken = tasks.reduce((acc, task) => acc + (task.time_taken || 0), 0);

  // Calculate the average time allocated and time taken
  const avgTimeAllocated = totalAllocated / tasks.length || 0;
  const avgTimeTaken = totalTaken / tasks.length || 0;

  charts[chartID] = new Chart(
    document.getElementById(chartID).getContext("2d"),
    {
      type: "bar",
      data: {
        labels: ["Avg Time Allocated", "Avg Time Taken"],
        datasets: [
          {
            label: "Hours",
            data: [avgTimeAllocated, avgTimeTaken],
            backgroundColor: ["#2196f3", "#ff9800"],
          },
        ],
      },
      options: {
        plugins: { title: { display: true, text: "Average Time per Task" } },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Hours" },
          },
        },
      },
    }
  );
}


export function renderDeadlineChart(tasks, context = "Employee") {
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
            data: tasks.map((t) =>
              Math.ceil(
                (new Date(t.finish_date) - new Date()) / (1000 * 60 * 60 * 24)
              )
            ),
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

export function renderWorkloadChart(tasks, context = "Employee") {
  const chartID =
    context === "Manager" ? "workloadChartManager" : "workloadChartEmployee";
  destroyChart(chartID);

  // Ensure tasks is an array
  if (!Array.isArray(tasks)) {
    console.error("Expected tasks to be an array, but received:", tasks);
    return;
  }

  // Group tasks by week or month
  const timePeriod = "month";  // Change this to "week" if you'd prefer weeks
  const groupedData = groupTasksByTimePeriod(tasks, timePeriod);

  // Calculate total time allocated and time taken per time period
  const timeAllocated = groupedData.map((period) =>
    period.tasks.reduce((sum, task) => sum + task.time_allocated, 0)
  );
  const timeTaken = groupedData.map((period) =>
    period.tasks.reduce((sum, task) => sum + (task.time_taken || 0), 0)
  );

  // Get labels (weeks/months)
  const labels = groupedData.map((period) => period.timePeriodLabel);
  console.log("Tasks data for employee:", tasks);


  charts[chartID] = new Chart(document.getElementById(chartID).getContext("2d"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Time Allocated",
          data: timeAllocated,
          borderColor: "#3f51b5",
          fill: false,
        },
        {
          label: "Time Taken",
          data: timeTaken,
          borderColor: "#f44336",
          fill: false,
        },
      ],
    },
    options: {
      plugins: { title: { display: true, text: "Workload Over Time" } },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Hours" },
        },
      },
    },
  });
}

// Helper function to group tasks by week/month
function groupTasksByTimePeriod(tasks, period = "month") {
  const grouped = tasks.reduce((result, task) => {
    const date = new Date(task.start_date);
    const label = period === "month" ? `${date.getFullYear()}-${date.getMonth() + 1}` : getWeekNumber(date);
    
    if (!result[label]) {
      result[label] = { timePeriodLabel: label, tasks: [] };
    }

    result[label].tasks.push(task);
    return result;
  }, {});

  return Object.values(grouped);
}

// Helper function to get the week number of a date
function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + 1) / 7);
}


export function renderTeamCompletionChart(data, context = "TL") {
  const chartID =
    context === "Manager"
      ? "teamCompletionChartManager"
      : "teamCompletionChartTL"
  destroyChart(chartID)

  const total = data.reduce((sum, emp) => sum + (emp.tasks?.length || 0), 0)
  const completed = data.reduce(
    (sum, emp) =>
      sum + (emp.tasks?.filter((t) => t.completed === 1).length || 0),
    0
  )
  charts[chartID] = new Chart(document.getElementById(chartID), {
    type: "pie",
    data: {
      labels: ["Completed", "Pending"],
      datasets: [
        {
          data: [completed, total - completed],
          backgroundColor: ["#4caf50", "#f44336"],
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: `${context} Team Task Completion` },
      },
    },
  })
}

export function renderTeamBreakdownChart(data, context = "TL") {
  const chartID =
    context === "Manager" ? "teamBreakdownChartManager" : "teamBreakdownChartTL"
  destroyChart(chartID)
  console.log("Render teambreakdown:", data)
  const labels = data.map((emp) => emp.employee_name || `ID ${emp.employee_id}`)

  charts[chartID] = new Chart(document.getElementById(chartID), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Total Tasks",
          data: data.map((emp) => emp.total_tasks || emp.tasks?.length || 0),
          backgroundColor: "#90caf9",
        },
        {
          label: "Completed Tasks",
          data: data.map(
            (emp) =>
              emp.completed_tasks ??
              (emp.tasks?.filter((t) => t.completed === 1).length || 0)
          ),
          backgroundColor: "#4caf50",
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: `${context} Tasks by Team Member`,
        },
      },
      responsive: true,
      scales: { y: { beginAtZero: true } },
    },
  })
}

export function renderProjectProgressChart(progressData, context = "TL") {
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

export function renderOrgTaskSummaryChart(tasks) {
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

  // Display overdue team leaders
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
        leaderNames.length > 0
          ? leaderNames.map((name) => `<li>${name}</li>`).join("")
          : "<li>None</li>"
      }
    </ul>
  `
}

export function renderProjectCompletionOverviewChart(projectProgress) {
  destroyChart("projectCompletionOverviewChart")

  console.log("Rendering project overview chart:")
  const labels = Object.values(projectProgress).map(
    (p) => `${p.projectName}\n(${p.project_due_date}`
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

export function renderTeamComparisonChart(performanceData) {
  const chartID = "teamComparisonChart"
  destroyChart(chartID)

  const labels = []
  const efficiencyScores = []

  performanceData.forEach((entry) => {
    const { teamLeaderId, teamLeaderName, performance } = entry
    console.log("entry:", entry)

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

    labels.push(teamLeaderName)
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
