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
import { fetchProjectDetails, currentProjectData } from "./dataLoaders.js"

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
  const projectSearch = document.getElementById("projectSearch");
  const projectsDatalist = document.getElementById("projects");

  fetch(`${apiBase}/projects`)
    .then((res) => res.json())
    .then((projects) => {
      // Populate the datalist with project options
      projects.forEach((p) => {
        const option = document.createElement("option");
        option.value = p.project_name; // Set the value of the option to the project name
        option.dataset.id = p.project_id; // Store the project ID in a data attribute
        projectsDatalist.appendChild(option);
      });

      // Add event listener for input change (on project selection)
      projectSearch.addEventListener("input", () => {
        const selectedProject = projects.find(
          (p) => p.project_name === projectSearch.value
        );
        if (selectedProject) {
          const projectId = selectedProject.project_id;
          const infoIcon = document.getElementById("infoIcon");
          infoIcon.classList.remove("hidden"); // Show the info icon when a project is selected

          // Fetch and store the project details when a project is selected
          fetchProjectDetails(projectId); // This function is defined elsewhere (check that it's working)

          // Fetch project progress
          fetch(`${apiBase}/progress?project_id=${projectId}`)
            .then((r) => r.json())
            .then((progress) => {
              analyticsData.projectProgress[projectId] = {
                projectName: selectedProject.project_name,
                progress: progress.completed_percentage,
              };

              // Now render the charts
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
                const grouped = groupTasksByEmployee(filteredTasks); // This function should be defined elsewhere
                console.log("Grouped Tasks:", grouped);

                // Render charts
                renderTeamBreakdownChart(grouped, "Manager");
                renderTeamCompletionChart(grouped, "Manager");
                renderProjectProgressChart(progressData, "Manager");
              });
            });
        }
      });
    });
}


// When the info icon is clicked, show the modal
document.getElementById("infoIcon").addEventListener("click", function () {
  if (currentProjectData) {
    document.getElementById("projectInfoModal").classList.remove("hidden")
  } else {
    console.log("No project data available.")
  }
})

// Close the modal when the close button is clicked
document.getElementById("closeModal").addEventListener("click", function () {
  document.getElementById("projectInfoModal").classList.add("hidden")
})

export function setupEmployeeSearch(apiBase) {
  const projectFilter = document.getElementById("projectFilter");
  const projectDataList = document.getElementById("projectsList")
  const employeeSearch = document.getElementById("employeeSearch");
  const employeesDatalist = document.getElementById("employeesList");

  let allEmployees = [];

  // Fetch all projects
  fetch(`${apiBase}/projects`)
  .then((res) => res.json())
  .then((projects) => {
    if (projects && Array.isArray(projects)) {
      // Clear any existing options to ensure fresh population
      projectFilter.innerHTML = "<option value=''>-- Select a project --</option>";
      
      // Populate the project filter dropdown
      projects.forEach((p) => {
        const option = document.createElement("option");
        option.value = p.project_id; // Use project_id for the value
        option.textContent = p.project_name; // Display project_name
        projectsList.appendChild(option);
      });
    } else {
      console.error("Projects data is not valid:", projects);
    }
  })
  .catch((err) => {
    console.error("Error fetching projects:", err);
  });

  // Fetch all employees
  fetch(`${apiBase}/employees`)
    .then((r) => r.json())
    .then((users) => {
      allEmployees = users;
      const regularEmployees = allEmployees.filter((e) => e.user_type_id === 2);

      // Add employees to the datalist
      renderEmployeeOptions(regularEmployees);

      regularEmployees.forEach((e) => {
        const option = document.createElement("option");
        option.value = `${e.first_name} ${e.second_name}`;
        option.dataset.id = e.employee_id;
        employeesDatalist.appendChild(option);
      });

      // Handle project filter changes
      projectFilter.addEventListener("change", () => {
            employeesDatalist.innerHTML = "";  // Clear existing options

        const projectId = projectFilter.value;
        if (!projectId) {
          renderEmployeeOptions(regularEmployees); // Show all employees if no project is selected
          return;
        }

        fetch(`${apiBase}/projects?project_id=${projectId}`)
          .then((res) => res.json())
          .then((projects) => {
            const assignedIds = projects[0]?.team_members?.map(
              (member) => member.employee_id
            ) || [];
            console.log("Assigned Employee IDs:", assignedIds);

            // Filter employees based on project selection
            const filtered = regularEmployees.filter((e) =>
              assignedIds.includes(e.employee_id)
            );

            renderEmployeeOptions(filtered); // Update employee options
          });
      });

      // Handle employee selection from the search input
      employeeSearch.addEventListener("input", () => {
        const selectedEmployee = regularEmployees.find(
          (e) => `${e.first_name} ${e.second_name}` === employeeSearch.value
        );
        if (selectedEmployee) {
          const employeeId = selectedEmployee.employee_id;
          fetchEmployeeData(employeeId);
        }
      });
    });

  // Function to render employee options in the datalist
  function renderEmployeeOptions(list) {
    employeesDatalist.innerHTML = ""; // Clear existing options
    list.forEach((e) => {
      const option = document.createElement("option");
      option.value = `${e.first_name} ${e.second_name}`;
      option.dataset.id = e.employee_id;
      employeesDatalist.appendChild(option);
    });
  }

  // Fetch employee data when an employee is selected
  function fetchEmployeeData(employeeId) {
    Promise.all([
      fetch(`${apiBase}/tasks?employee_id=${employeeId}`).then((r) => r.json()),
      fetch(`${apiBase}/avg-time?employee_id=${employeeId}`).then((r) => r.json()),
      fetch(`${apiBase}/deadlines`).then((r) => r.json()),
      fetch(`${apiBase}/workload?employee_id=${employeeId}&start_date=2024-04-01&end_date=2024-06-30`).then((r) => r.json()),
    ]).then(([tasks, avgTimeStats, deadlines, workload]) => {
      analyticsData.tasks = tasks;
      analyticsData.avgTimeStats = avgTimeStats;
      analyticsData.deadlines = deadlines;
      analyticsData.workload = workload;

      renderEmployeeCharts(tasks);
    });
  }

  // Function to render the employee charts
  function renderEmployeeCharts(tasks) {
    renderCompletionChart(tasks, "Manager");
    renderTimeStatsChart(tasks, "Manager");
    renderDeadlineChart(tasks, "Manager");
    renderWorkloadChart(tasks, "Manager");
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
