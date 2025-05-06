<?php
session_start();
require_once __DIR__ . '/../../includes/database.php';
require_once __DIR__ . '/../../includes/headers.php';

$currentUser = $_SESSION['user_id'] ?? null;
if (!$currentUser) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

$db = new Database();
header('Content-Type: application/json');

$base = '/makeitall/cob290-part3-team08/server/api/analytics/index.php';
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = substr($uri, strlen($base));
$parts = array_values(array_filter(explode('/', $path)));
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {


    // GET /analytics/team-leaders
    if (count($parts) === 1 && $parts[0] === 'team-leaders') {
        if ($_SESSION['user_type'] !== 0) {
            http_response_code(403);
            echo json_encode(['error' => 'Access denied']);
            exit;
        }

        $leaders = $db->getAllTeamLeaders();
        echo json_encode($leaders);
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
        $data = $db->getTasksNearDeadline($days);
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
        $filters['project_id'] = $_SESSION['page_id'] ?? null;
        $projects = $db->getProjects($filters);
        echo json_encode($projects);
        exit;
    }

    // GET /analytics/tasks
    if (count($parts) === 1 && $parts[0] === 'tasks') {
        $filters = $_GET;
        if (isset($_SESSION['page_type']) && $_SESSION['page_type'] === 'project') {
            $filters['project_id'] = $_SESSION['page_id'];
        } else {
            $filters['employee_id'] = $_SESSION['page_id'];
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

    // GET /analytics/progress?project_id=..
    if (count($parts) === 1 && $parts[0] === 'progress') {
        $projectId = $_GET['project_id'] ?? null;
        if (!$projectId) {
            http_response_code(400);
            echo json_encode(['error' => 'project_id required']);
            exit;
        }
        $data = $db->getProjectProgress($projectId);
        echo json_encode($data);
        exit;
    }

}

http_response_code(404);
echo json_encode(['error' => 'Not Found']);
