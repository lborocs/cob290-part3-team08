// uiController.js

import { analyticsData } from "./dataLoaders.js"
import {
  renderCompletionChart,
  renderTimeStatsChart,
  renderDeadlineChart,
  renderWorkloadChart,
  renderProjectProgressChart,
  renderTeamCompletionChart,
  renderTeamBreakdownChart,
} from "./chartRenderers.js"
import { fetchProjectDetails,currentProjectData } from "./dataLoaders.js"

export function setupManagerViewSwitcher() {
  const views = ["managerView", "projectsView", "employeesView"]
  const labels = ["Manager View", "Projects View", "Employees View"]
  let currentIndex = 0

  const label = document.getElementById("currentViewLabel")
  const left = document.getElementById("leftArrow")
  const right = document.getElementById("rightArrow")

  const showView = (index) => {
    views.forEach((id, i) => {
      const el = document.getElementById(id)
      if (el) el.classList.toggle("hidden", i !== index)
    })
    label.textContent = labels[index]
  }

  left?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + views.length) % views.length
    showView(currentIndex)
  })

  right?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % views.length
    showView(currentIndex)
  })

  showView(currentIndex)
}

export function setupProjectSearch(apiBase, leaderIdToName) {
  const projectSelect = document.getElementById("projectSelect");

  fetch(`${apiBase}/projects`)
    .then((res) => res.json())
    .then((projects) => {
      // Populate project selection dropdown
      projects.forEach((p) => {
        const option = document.createElement("option");
        option.value = p.project_id;
        option.textContent = p.project_name;
        projectSelect.appendChild(option);
      });

      // Add event listener for project selection
      projectSelect.addEventListener("change", () => {
        const projectId = projectSelect.value;
        console.log("Current project ID:", projectId);
        const infoIcon = document.getElementById("infoIcon");
        infoIcon.classList.remove("hidden")

        // Make sure project ID is valid before fetching
        if (!projectId) return;

        // Fetch and store the project details when a project is selected
        fetchProjectDetails(projectId); // This is in dataLoaders.js

        // Fetch project progress
        const projectName = projectSelect.options[projectSelect.selectedIndex].textContent;
        fetch(`${apiBase}/progress?project_id=${projectId}`)
          .then((r) => r.json())
          .then((progress) => {
            analyticsData.projectProgress[projectId] = {
              projectName,
              progress: progress.completed_percentage,
            };

            const progressData = {
              [projectId]: analyticsData.projectProgress[projectId],
            };

            // Fetch filtered tasks for the selected project
            Promise.all([
              fetch(`${apiBase}/tasks?project_id=${projectId}`).then((r) =>
                r.json()
              ),
            ]).then(([filteredTasks]) => {
              analyticsData.tasks = filteredTasks;
              console.log("Filtered Tasks:", filteredTasks);

              // Group tasks by employee
              const grouped = groupTasksByEmployee(filteredTasks);
              console.log("Grouped Tasks:", grouped);

              // Show the project info modal
              const projectInfoModal = document.getElementById("projectInfoModal");
              projectInfoModal.classList.remove("hidden"); // Show modal

              // Render charts
              renderTeamBreakdownChart(grouped, "Manager");
              renderTeamCompletionChart(grouped, "Manager");
              renderProjectProgressChart(progressData, "Manager");
            });
          });
      });
    });
}

// When the info icon is clicked, show the modal
document.getElementById("infoIcon").addEventListener("click", function () {
  if (currentProjectData) {
    document.getElementById("projectInfoModal").classList.remove("hidden");
  } else {
    console.log("No project data available.");
  }
});

// Close the modal when the close button is clicked
document
  .getElementById("closeModal")
  .addEventListener("click", function () {
    document.getElementById("projectInfoModal").classList.add("hidden");
  });



export function setupEmployeeSearch(apiBase) {
  const projectFilter = document.getElementById("projectFilter")
  const employeeSelect = document.getElementById("employeeSelect")

  let allEmployees = []

  fetch(`${apiBase}/projects`)
    .then((res) => res.json())
    .then((projects) => {
      projects.forEach((p) => {
        const option = document.createElement("option")
        option.value = p.project_id
        option.textContent = p.project_name
        projectFilter.appendChild(option)
      })
    })

  fetch(`${apiBase}/employees`)
    .then((r) => r.json())
    .then((users) => {
      allEmployees = users
      renderEmployeeOptions(users)

      projectFilter.addEventListener("change", () => {
        const projectId = projectFilter.value
        if (!projectId) return renderEmployeeOptions(allEmployees)

        fetch(`${apiBase}/projects?project_id=${projectId}`)
          .then((res) => res.json())
          .then((projects) => {
            console.log(projects)
            const assignedIds = projects[0]?.team_members?.map(member => member.employee_id) || [];
            console.log("Assigned Employee IDs:", assignedIds);
            const filtered = allEmployees.filter((e) =>
              assignedIds.includes(e.employee_id)
            )
            renderEmployeeOptions(filtered)
          })
      })

      employeeSelect.addEventListener("change", () => {
        const employeeId = employeeSelect.value
        if (!employeeId) return

        Promise.all([
          fetch(`${apiBase}/tasks?employee_id=${employeeId}`).then((r) =>
            r.json()
          ),
          fetch(`${apiBase}/avg-time?employee_id=${employeeId}`).then((r) =>
            r.json()
          ),
          fetch(`${apiBase}/deadlines`).then((r) => r.json()),
          fetch(
            `${apiBase}/workload?employee_id=${employeeId}&start_date=2024-04-01&end_date=2024-06-30`
          ).then((r) => r.json()),
        ]).then(([tasks, avgTimeStats, deadlines, workload]) => {
          analyticsData.tasks = tasks
          analyticsData.avgTimeStats = avgTimeStats
          analyticsData.deadlines = deadlines
          analyticsData.workload = workload

          renderCompletionChart(tasks, "Manager")
          renderTimeStatsChart(tasks, "Manager")
          renderDeadlineChart(deadlines, "Manager")
          renderWorkloadChart(tasks, "Manager")
        })
      })
    })

  function renderEmployeeOptions(list) {
    employeeSelect.innerHTML =
      '<option value="">-- Select an employee --</option>'
    list.forEach((e) => {
      const option = document.createElement("option")
      option.value = e.employee_id
      option.textContent = `${e.first_name} ${e.second_name}`
      employeeSelect.appendChild(option)
    })
  }
}

export function groupTasksByEmployee(tasks) {
  const grouped = {}

  tasks.forEach((task) => {
    const empId = task.assigned_employee
    const empName = task.employee_name || `ID ${empId}`

    if (!grouped[empId]) {
      grouped[empId] = {
        employee_id: empId,
        employee_name: empName,
        tasks: [],
      }
    }

    grouped[empId].tasks.push(task)
  })

  return Object.values(grouped)
}
