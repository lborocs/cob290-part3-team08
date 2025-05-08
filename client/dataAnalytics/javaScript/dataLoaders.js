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

export const leaderIdToName = {}

export const employeeIdToName = {}

export function loadAllEmployees() {
  return fetch(`${API_BASE}/employees`)
    .then(r => r.json())
    .then(employees => {
      employees.forEach(emp => {
        console.log(emp)
        employeeIdToName[emp.employee_id] = `${emp.first_name} ${emp.second_name}`
      })
    })
}


export function loadTeamLeaderNames() {
  return fetch(`${API_BASE}/team-leaders`)
    .then(r => r.json())
    .then(leaders => {
      leaders.forEach(leader => {
        leaderIdToName[leader.employee_id] = `${leader.first_name} ${leader.second_name}`
      })
    })
}

export function loadTasks(query = "") {
  return fetch(`${API_BASE}/tasks${query}`)
    .then(r => r.json())
    .then(data => {
      analyticsData.tasks = data
      return data
    })
}

export function loadAllTasks() {
  return loadTasks()
}

export function loadDetails() {
  const endpoint = currentPageType === "project" ? "projects" : "employee"
  return fetch(`${API_BASE}/${endpoint}`).then(r => r.json())
}

export function loadCompletionStats(userId) {
  return fetch(`${API_BASE}/completion?employee_id=${userId}`)
    .then(r => r.json())
    .then(data => { analyticsData.completionStats = data })
}

export function loadAverageTimeStats(userId) {
  return fetch(`${API_BASE}/avg-time?employee_id=${userId}`)
    .then(r => r.json())
    .then(data => { analyticsData.avgTimeStats = data })
}

export function loadOverrunningTasks() {
  return fetch(`${API_BASE}/overruns`)
    .then(r => r.json())
    .then(data => { analyticsData.overruns = data })
}

export function loadDeadlineTasks(days = 5) {
  return fetch(`${API_BASE}/deadlines?days=${days}`)
    .then(r => r.json())
    .then(data => { analyticsData.deadlines = data })
}

export function loadWorkload(empId, start, end) {
  return fetch(`${API_BASE}/workload?employee_id=${empId}&start_date=${start}&end_date=${end}`)
    .then(r => r.json())
    .then(data => { analyticsData.workload = data })
}

export function loadTeamPerformance(leaderId) {
  return fetch(`${API_BASE}/performance?team_leader_id=${leaderId}`)
    .then(r => {
      if (!r.ok) throw new Error(`Failed to fetch: ${r.status}`)
      return r.json()
    })
    .then(data => { analyticsData.teamPerformance = data })
}

export function loadTeamPerformanceOverview() {
  analyticsData.teamPerformance = []
  return fetch(`${API_BASE}/team-leaders`)
    .then(r => r.json())
    .then(leaders => {
      const fetches = leaders.map(leader =>
        fetch(`${API_BASE}/performance?team_leader_id=${leader.employee_id}`)
          .then(r => r.json())
          .then(data => {
            analyticsData.teamPerformance.push({
              teamLeaderId: leader.employee_id,
              performance: data,
            })
          })
      )
      return Promise.all(fetches)
    })
}

export function loadProjectProgress(projectId) {
  return fetch(`${API_BASE}/progress?project_id=${projectId}`)
    .then(r => r.json())
    .then(progress => {
      analyticsData.projectProgress = {
        [projectId]: {
          projectName: "Current Project",
          progress: progress.completed_percentage,
          project_due_date: progress.project_due_date,
        },
      }
    })
}

export function loadAllProjectProgress() {
  analyticsData.projectProgress = {}
  return fetch(`${API_BASE}/projects`)
    .then(r => r.json())
    .then(projects => {
      const fetches = projects.map(p =>
        fetch(`${API_BASE}/progress?project_id=${p.project_id}`)
          .then(r => r.json())
          .then(progress => {
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
