// dataLoaders.js

const API_BASE = "/makeitall/cob290-part3-team08/server/api/analytics/index.php"


export const analyticsData = {
  tasks: [],
  completionStats: {},
  avgTimeStats: {},
  overruns: [],
  deadlines: [],
  workload: [],
  teamPerformance: [],
  projectProgress: {},
}

export let currentProjectData = null;
export const leaderIdToName = {}

export const employeeIdToName = {}

export function loadAllEmployees() {
  return fetch(`${API_BASE}/employees`)
    .then((r) => r.json())
    .then((employees) => {
      employees.forEach((emp) => {
        employeeIdToName[
          emp.employee_id
        ] = `${emp.first_name} ${emp.second_name}`
      })
    })
}

export function loadTeamLeaderNames() {
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

export function loadTasks(query = "") {
  return fetch(`${API_BASE}/tasks${query}`)
    .then((r) => r.json())
    .then((data) => {
      analyticsData.tasks = data
      return data
    })
}


export function fetchProjectDetails(projectId) {
  // Fetch project details from the server (modify the endpoint as needed)
  fetch(`${API_BASE}/projects?project_id=${projectId}`)
    .then((response) => response.json())
    .then((projectData) => {

      // Store the project data for later use
      currentProjectData = projectData[0];  // Assuming it's an array with one project object

      // Populate project info tab with the fetched data
      document.getElementById("projectName").textContent = currentProjectData.project_name;
      document.getElementById("projectId").textContent = currentProjectData.project_id;
      document.getElementById("teamLeaderName").textContent = currentProjectData.team_leader_name;
      document.getElementById("teamLeaderId").textContent = currentProjectData.team_leader_id;
      document.getElementById("startDate").textContent = currentProjectData.start_date;
      document.getElementById("dueDate").textContent = currentProjectData.finish_date;

    
      // Create a hoverable title for team members
      const teamMembersContainer = document.getElementById("teamMembersContainer");

      // Create the team members title and set it as hoverable
      const teamMembersTitle = document.createElement("span");
      teamMembersTitle.classList.add("team-members-title");
      teamMembersTitle.textContent = `Team Members`;

      // Create the list container to show on hover
      const teamMembersList = document.createElement("div");
      teamMembersList.classList.add("team-members-list");
      teamMembersList.innerHTML = currentProjectData.team_members
        .map(
          (member) =>
            `<li>${member.employee_name} (ID: ${member.employee_id})</li>`
        )
        .join(""); // Map through team members and create list items

      // Append the title and list to the container
      teamMembersContainer.innerHTML = ""; // Clear any existing content
      teamMembersContainer.appendChild(teamMembersTitle);
      teamMembersContainer.appendChild(teamMembersList);
    })
    .catch((error) => {
      console.error("Error fetching project details:", error);
    });
}



export function loadAllTasks() {
  return loadTasks()
}

export function loadDetails() {
  const endpoint = currentUserType === 2 ? "projects" : "employee"
  return fetch(`${API_BASE}/${endpoint}`).then((r) => r.json())
}

export function loadCompletionStats(userId) {
  return fetch(`${API_BASE}/completion?employee_id=${userId}`)
    .then((r) => r.json())
    .then((data) => {
      analyticsData.completionStats = data
    })
}

export function loadAverageTimeStats(userId) {
  return fetch(`${API_BASE}/avg-time?employee_id=${userId}`)
    .then((r) => r.json())
    .then((data) => {
      analyticsData.avgTimeStats = data
    })
}

export function loadOverrunningTasks() {
  return fetch(`${API_BASE}/overruns`)
    .then((r) => r.json())
    .then((data) => {
      analyticsData.overruns = data
    })
}

export function loadDeadlineTasks(days = 5, employeeId = null) {
  let url = `${API_BASE}/deadlines?days=${days}`;
  
  if (employeeId) {
    url += `&employee_id=${employeeId}`;  
  }

  return fetch(url)
    .then((r) => r.json())
    .then((data) => {
      analyticsData.deadlines = data;
    });
}


export function loadWorkload(empId, start, end) {
  return fetch(
    `${API_BASE}/workload?employee_id=${empId}&start_date=${start}&end_date=${end}`
  )
    .then((r) => r.json())
    .then((data) => {
      analyticsData.workload = data
    })
}

export function loadTeamPerformance(leaderId) {
  return fetch(`${API_BASE}/performance?team_leader_id=${leaderId}`)
    .then((r) => {
      if (!r.ok) throw new Error(`Failed to fetch: ${r.status}`)
      return r.json()
    })
    .then((data) => {

      
      analyticsData.teamPerformance = data
      console.log("Team Performance for ", leaderId, ": ",data)
    })
}

export function loadTeamPerformanceOverview() {
  analyticsData.teamPerformance = []
  return fetch(`${API_BASE}/team-leaders`)
    .then((r) => r.json())
    .then((leaders) => {
      const fetches = leaders.map((leader) =>
        fetch(`${API_BASE}/performance?team_leader_id=${leader.employee_id}`)
          .then((r) => r.json())
          .then((data) => {
            analyticsData.teamPerformance.push({
              teamLeaderId: leader.employee_id,
              teamLeaderName: `${leader.first_name} ${leader.second_name}`,
              performance: data,
            })
            console.log("Team Performance Overall: ",data)

          })
      )
      return Promise.all(fetches)
    })
}

export function loadProjectProgress(currentUserId) {
  return fetch(`${API_BASE}/progress?team_leader_id=${currentUserId}`)
    .then((r) => r.json())
    .then((progress) => {
      analyticsData.projectProgress = {
        [currentUserId]: {
          project_name: progress.project_name,
          progress: progress.completed_percentage,
          project_due_date: progress.project_due_date,
        },
      }
    })
}

export function loadAllProjectProgress() {
  analyticsData.projectProgress = {}
  return fetch(`${API_BASE}/projects`)
    .then((r) => r.json())
    .then((projects) => {
      const fetches = projects.map((p) =>
        fetch(`${API_BASE}/progress?project_id=${p.project_id}`)
          .then((r) => r.json())
          .then((progress) => {
            analyticsData.projectProgress[p.project_id] = {
              projectName: p.project_name,
              progress: progress.completed_percentage,
              project_due_date: progress.project_due_date,
            }
          })
      )
      return Promise.all(fetches)
    })
}
