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
    context === "Manager" ? "completionChartManager" : "completionChartEmployee";
  destroyChart(chartID);

  // Classify tasks based on their completion status and due date
  const completed = tasks.filter((t) => t.completed === 1);
  const pending = tasks.filter((t) => t.completed === 0 && new Date(t.finish_date) > new Date());
  const overdue = tasks.filter(
    (t) => t.completed === 0 && new Date(t.finish_date) < new Date()
  );

  // Add colors for the tasks
  const taskColors = tasks.map((task) => {
    if (task.completed === 1) {
      return "#4caf50"; // Green for completed tasks
    } else if (new Date(task.finish_date) < new Date()) {
      return "#f44336"; // Red for overdue tasks
    } else {
      return "#ff9800"; // Orange for pending tasks
    }
  });

  // Render the pie chart
  charts[chartID] = new Chart(
    document.getElementById(chartID).getContext("2d"),
    {
      type: "pie",
      data: {
        labels: ["Completed", "Pending", "Overdue"],
        datasets: [
          {
            data: [completed.length, pending.length, overdue.length],
            backgroundColor: ["#4caf50", "#ff9800", "#f44336"], // Green, Orange, Red
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: "Task Completion Status" },
          tooltip: {
            callbacks: {
              label: (ctx) => `Tasks (${ctx.dataset.data[ctx.dataIndex]})`,
              afterLabel: (ctx) => {
                const isCompleted = ctx.dataIndex === 0;
                const isOverdue = ctx.dataIndex === 2;
                const isPending = ctx.dataIndex === 1;
                return (isCompleted
                  ? completed
                  : isOverdue
                  ? overdue
                  : isPending
                  ? pending
                  : []
                ).map(
                  (t) =>
                    `• ${t.task_name}` +
                    (isCompleted
                      ? ""
                      : ` (Due: ${formatDate(t.finish_date)})`)
                );
              },
            },
          },
        },
      },
    }
  );
}


export function renderTimeStatsChart(tasks, context = "Employee") {
  const chartID =
    context === "Manager" ? "timeStatsChartManager" : "timeStatsChartEmployee"
  destroyChart(chartID)
  // Ensure tasks is an array
  if (!Array.isArray(tasks)) {
    console.error("Expected tasks to be an array, but received:", tasks)
    return
  }
  console.log(tasks)

  // Calculate the total time allocated and time taken
  const totalAllocated = tasks
    .filter((task) => task.completed === 1) // Filter for completed tasks
    .reduce((acc, task) => acc + task.time_allocated, 0)
  const totalTaken = tasks
    .filter((task) => task.completed === 1) // Filter for completed tasks
    .reduce((acc, task) => acc + task.time_taken, 0)

  // Calculate the average time allocated and time taken
  const avgTimeAllocated = totalAllocated / tasks.length || 0
  const avgTimeTaken = totalTaken / tasks.length || 0

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
        maintainAspectRatio: false,

        plugins: { title: { display: true, text: "Average Time per Task" } },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Hours" },
          },
        },
      },
    }
  )
}

export function renderDeadlineChart(tasks, context = "Employee") {
  const chartID =
    context === "Manager" ? "deadlineChartManager" : "deadlineChartEmployee"
  destroyChart(chartID)

  // Define the color scale based on days remaining
  const getColor = (daysRemaining) => {
    if (daysRemaining <= 3) {
      return "#ff0000" // Red for close deadlines (2 days or less)
    } else if (daysRemaining <= 7) {
      return "#ff4d00" // Yellow for medium deadlines (3-7 days)
    } else {
      return "#4caf50" // Green for far deadlines (more than 7 days)
    }
  }
  tasks.forEach(t => {
    const daysRemaining = Math.ceil(
      (new Date(t.finish_date) - new Date()) / (1000 * 60 * 60 * 24)
    );
    
    // Log whether the task is due within 11 days
    console.log(daysRemaining);
  });
  
  
  const incompleteTasks = tasks.filter((t) => t.completed === 0 && Math.ceil(
    (new Date(t.finish_date) - new Date()) / (1000 * 60 * 60 * 24)
  ) < 11 );


  charts[chartID] = new Chart(
    document.getElementById(chartID).getContext("2d"),
    {
      type: "bar",
      data: {
        labels: incompleteTasks.map((t) => t.task_name),
        datasets: [
          {
            label: "Days Remaining",
            data: incompleteTasks.map((t) =>
              Math.ceil(
                (new Date(t.finish_date) - new Date()) / (1000 * 60 * 60 * 24)
              )
            ),
            backgroundColor: incompleteTasks.map((t) =>
              getColor(
                Math.ceil(
                  (new Date(t.finish_date) - new Date()) / (1000 * 60 * 60 * 24)
                )
              )
            ), 
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
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

  const timePeriod = "week"; // Group by week
  const groupedData = groupTasksByTimePeriod(tasks, timePeriod);

  // Calculate weekly workload and weekly hours worked
  const { weeklyWorkload, weeklyWorkedHours } = calculateWeeklyWorkload(tasks);

  // Get labels (weeks/months)
  const labels = groupedData.map((period) => {
    const startDate = new Date(period.tasks[0].start_date); // Ensure this is correct, using the first task's start date
    const monday = getMonday(startDate); // Get Monday for that week
    if (isNaN(monday.getTime())) {
      console.error("Invalid date:", monday);
      return "Invalid Date"; // In case the date is invalid
    }
    return `${formatDate(monday)}`;  // Format as dd/mm/yy
  });

  // Define chart
  charts[chartID] = new Chart(document.getElementById(chartID).getContext("2d"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Expected Weekly Workload",
          data: weeklyWorkload,
          borderColor: "#3f51b5",
          fill: false,
        },
        {
          label: "Actual Weekly Workload (Hours Worked)",
          data: weeklyWorkedHours,
          borderColor: "#f44336",
          fill: false,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Workload Over Time (Weekly)",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Hours",
          },
        },
      },
    },
  });
}

// Helper function to format the date to dd/mm/yy
function formatDate(date) {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear().toString().slice(-2);  // Get last 2 digits of the year
  return `${day}/${month}/${year}`;
}

// Helper function to get the Monday of the week from a given date
function getMonday(date) {
  const day = date.getDay(),
    diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  const monday = new Date(date.setDate(diff));
  return monday;
}

// Function to calculate the weekly workload based on task start and end dates
function calculateWeeklyWorkload(tasks) {
  const weeklyWorkload = [];
  const weeklyWorkedHours = [];

  tasks.forEach((task) => {
    const startDate = new Date(task.start_date);
    const endDate = new Date(task.finish_date);
    const expectedTime = task.time_allocated || 0; // Expected time allocated for the task
    const workedTime = task.time_taken || 0; // Actual time worked on the task

    // Calculate the number of weeks this task spans
    const diffInTime = endDate.getTime() - startDate.getTime();
    const numberOfWeeks = Math.ceil(diffInTime / (1000 * 3600 * 24 * 7)); // Convert time to weeks

    // Distribute the task's expected time across the weeks
    const weeklyHours = expectedTime / numberOfWeeks;
    const workedHours = workedTime / numberOfWeeks;

    // Loop through the weeks and add the weekly hours to the appropriate weeks
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const weekLabel = getWeekLabel(currentDate); // Get the label for the current week
      if (!weeklyWorkload[weekLabel]) {
        weeklyWorkload[weekLabel] = 0;
        weeklyWorkedHours[weekLabel] = 0;
      }

      // Add the expected and worked hours to the weekly workload
      weeklyWorkload[weekLabel] += weeklyHours;
      weeklyWorkedHours[weekLabel] += workedHours;

      // Move to the next week
      currentDate.setDate(currentDate.getDate() + 7); // Add 7 days for the next week
    }
  });

  return { weeklyWorkload: Object.values(weeklyWorkload), weeklyWorkedHours: Object.values(weeklyWorkedHours) };
}

// Helper function to get the week label (ISO week number)
function getWeekLabel(date) {
  const startDate = new Date(date.getFullYear(), 0, 1); // Start of the year
  const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000)); // Days from start of the year
  const weekNumber = Math.ceil((days + 1) / 7); // Calculate ISO week number

  return `Week ${weekNumber}`;
}

// Helper function to group tasks by week/month
function groupTasksByTimePeriod(tasks, period = "month") {
  const grouped = tasks.reduce((result, task) => {
    const date = new Date(task.start_date);
    const label =
      period === "month"
        ? `${date.getFullYear()}-${date.getMonth() + 1}` // Group by month "YYYY-MM"
        : getWeekLabel(date); // Group by week "Week X"

    if (!result[label]) {
      result[label] = { timePeriodLabel: label, tasks: [] };
    }

    result[label].tasks.push(task);
    return result;
  }, {});

  return Object.values(grouped);
}


export function renderTeamCompletionChart(data, context = "TL") {
  const chartID =
    context === "Manager"
      ? "teamCompletionChartManager"
      : "teamCompletionChartTL"
  destroyChart(chartID)

  // Prepare the task data
  const completedTasks = []
  const pendingTasks = []
  const overdueTasks = []

  // Categorize tasks into completed, pending, and overdue
  data.forEach((emp) => {
    emp.tasks?.forEach((t) => {
      const daysRemaining = Math.ceil(
        (new Date(t.finish_date) - new Date()) / (1000 * 60 * 60 * 24)
      )

      // Categorize based on task completion and due date
      if (t.completed === 1) {
        completedTasks.push(t)
      } else if (t.completed === 0 && daysRemaining < 0) {
        overdueTasks.push(t) // Task is overdue
      } else {
        pendingTasks.push(t) // Task is pending
      }
    })
  })

  // Count the number of tasks in each category
  const completed = completedTasks.length
  const pending = pendingTasks.length
  const overdue = overdueTasks.length

  // Define colors for each category
  const colors = ["#4caf50", "#ff9800", "#f44336"] // Green for completed, Orange for pending, Red for overdue

  // Create pie chart
  charts[chartID] = new Chart(document.getElementById(chartID), {
    type: "pie",
    data: {
      labels: ["Completed", "Pending", "Overdue"],
      datasets: [
        {
          data: [completed, pending, overdue],
          backgroundColor: colors,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: "Task Completion Status" },
        tooltip: {
          callbacks: {
            label: (ctx) => `Tasks (${ctx.dataset.data[ctx.dataIndex]})`,
            afterLabel: (ctx) => {
              const isCompleted = ctx.dataIndex === 0
              const isOverdue = ctx.dataIndex === 2
              const isPending = ctx.dataIndex === 1
              return (
                (isCompleted ? completedTasks : isOverdue ? overdueTasks : pendingTasks)
                  .map(
                    (t) =>
                      `• ${t.task_name}` +
                      (isCompleted
                        ? ""
                        : ` (Due: ${new Date(t.finish_date).toLocaleDateString()})`)
                  )
              )
            },
          },
        },
      },
    },
  })
}


export function renderTeamBreakdownChart(data, context = "TL") {
  const chartID =
    context === "Manager" ? "teamBreakdownChartManager" : "teamBreakdownChartTL"
  destroyChart(chartID)
  console.log("Render teambreakdown:", data)
  const labels = data.map(
    (emp) => emp.employee_name || emp.name || `ID ${emp.employee_id}`
  )

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
      maintainAspectRatio: false,

      plugins: {
        title: {
          display: true,
          text: `Tasks by Team Member`,
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
      maintainAspectRatio: false,

      plugins: {
        title: { display: true, text: `Project Progress` },
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
      maintainAspectRatio: false,

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
        maintainAspectRatio: false,
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
      maintainAspectRatio: false,
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
