<?php
require_once __DIR__ . '/../../includes/database.php';
require_once __DIR__ . '/../../includes/headers.php';



$db = new Database();
header('Content-Type: application/json');

$base = '/server/api/analytics/index.php';
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = substr($uri, strlen($base));
$parts = array_values(array_filter(explode('/', $path)));
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {


    // GET /analytics/user-type
    if (count($parts) === 1 && $parts[0] === 'user-type') {
        $userId = $_GET['user_id'] ?? null;

        if (!$userId) {
            http_response_code(400);
            echo json_encode(['error' => 'user_id is required']);
            exit;
        }

        // Fetch user type from the database
        $userType = $db->getUserTypeById($userId);

        if ($userType !== null) {
            echo json_encode(['user_type' => $userType]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
        }
        exit;
    }

    // GET /analytics/team-leaders
    if (count($parts) === 1 && $parts[0] === 'team-leaders') {


        $leaders = $db->getAllTeamLeaders();
        echo json_encode($leaders);
        exit;
    }

    // GET /analytics/employees
    if (count($parts) === 1 && $parts[0] === 'employees') {
        $employees = $db->getAllEmployees();
        echo json_encode($employees);
        exit;
    }
    // GET /analytics/employee
    if (count($parts) === 1 && $parts[0] === 'employee') {
        $filters = $_GET;
        $filters['employee_id'] = $_SESSION['page_id'] ?? null;
        $employee = $db->getEmployee($filters);
        echo json_encode($employee);
        exit;
    }

    // GET /analytics/workload?employee_id=..&start_date=..&end_date=..
    if (count($parts) === 1 && $parts[0] === 'workload') {
        $employeeId = $_GET['employee_id'] ?? null;
        $start = $_GET['start_date'] ?? null;
        $end = $_GET['end_date'] ?? null;

        if (!$employeeId || !$start || !$end) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            exit;
        }

        $data = $db->getEmployeeWorkload($employeeId, $start, $end);
        echo json_encode($data);
        exit;
    }

    // GET /analytics/deadlines?days=5
    if (count($parts) === 1 && $parts[0] === 'deadlines') {
        $days = $_GET['days'] ?? 5;
        $employeeId = $_GET['employee_id'] ?? null;  // Get the employee_id from the query parameter
    
        $data = $db->getTasksNearDeadline($days, $employeeId); // Pass employee_id to the function
        echo json_encode($data);
        exit;
    }

    // GET /analytics/overruns
    if (count($parts) === 1 && $parts[0] === 'overruns') {
        $data = $db->getTasksOverrunning();
        echo json_encode($data);
        exit;
    }

    // GET /analytics/projects
    if (count($parts) === 1 && $parts[0] === 'projects') {
        $filters = $_GET;

        // Fetch projects based on filters
        $projects = $db->getProjects($filters);

        // For each project, get the team members and append to the project data
        foreach ($projects as &$project) {
            $teamMembers = $db->getEmployeesByProject($project['project_id']);
            $project['team_members'] = $teamMembers;
        }

        echo json_encode($projects);
        exit;
    }





    // GET /analytics/tasks
    if (count($parts) === 1 && $parts[0] === 'tasks') {
        $filters = [];

        // Use query parameter if it's provided
        if (!empty($_GET['project_id'])) {
            $filters['project_id'] = $_GET['project_id'];
        }
        if (!empty($_GET['employee_id'])) {
            $filters['employee_id'] = $_GET['employee_id'];
        }

        $tasks = $db->getTasks($filters);
        echo json_encode($tasks);
        exit;
    }


    // GET /analytics/completion?employee_id=..&project_id=..
    if (count($parts) === 1 && $parts[0] === 'completion') {
        $filters = $_GET;
        $data = $db->getTaskCompletionStats($filters);
        echo json_encode($data);
        exit;
    }

    // GET /analytics/avg-time?employee_id=..&project_id=..
    if (count($parts) === 1 && $parts[0] === 'avg-time') {
        $filters = $_GET;
        $data = $db->getAverageTimePerTask($filters);
        echo json_encode($data);
        exit;
    }

    // GET /analytics/performance?team_leader_id=..
    if (count($parts) === 1 && $parts[0] === 'performance') {
        $leaderId = $_GET['team_leader_id'] ?? null;
        if (!$leaderId) {
            http_response_code(400);
            echo json_encode(['error' => 'team_leader_id required']);
            exit;
        }
        $data = $db->getTeamPerformance($leaderId);
        echo json_encode($data);
        exit;
    }

    // GET /analytics/progress?team_leader_id=..
    if (count($parts) === 1 && $parts[0] === 'progress') {
        $projectId = $_GET['project_id'] ?? null;
        $teamLeaderId = $_GET['team_leader_id'] ?? null;

        if (!$projectId && !$teamLeaderId) {
            http_response_code(400);
            echo json_encode(['error' => 'Either project_id or team_leader_id is required']);
            exit;
        }

        // Choose which ID to use
        if ($projectId) {
            $data = $db->getProjectProgressByProject($projectId);  // For project_id
        } elseif ($teamLeaderId) {
            $data = $db->getProjectProgressByTeamLeader($teamLeaderId);  // For team_leader_id
        }

        echo json_encode($data);
        exit;
    }


}

http_response_code(404);
echo json_encode(['error' => 'Not Found']);
