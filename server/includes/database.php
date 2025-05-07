<?php
require_once __DIR__ . '/config.php';
/***
 * This file handles all database operations for the chat system 
 * How to use:
 * 1. Make sure you have XAMPP installed
 * 2. Place this file in your XAMPP htdocs folder
 * 3. Create a new database named 'team08' in phpMyAdmin (go to localhost/phpmyadmin with apache and mysql running on XAMPP
 * create new database, then go to SQL tab and input all of schema.sql, press go and the tables will be created with input data)
 * Need to update SQL structure using schema.sql - may need to be further refined. 
 ***/

class Database
{
    public $conn;

    public function __construct()
    {
        try {
            $this->conn = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]
            );
        } catch (PDOException $e) {
            error_log("Connection Error: " . $e->getMessage());
            exit;
        }
    }

    private function sanitize($value)
    {
        return htmlspecialchars(strip_tags($value));
    }

    // ------ USERS ------

    public function getAllEmployees(): array
    {
        $stmt = $this->conn->prepare(
            "SELECT employee_id, first_name, second_name FROM Employees"
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // ------ CHAT SYSTEM ------

    public function createChatWithCreator(int $creatorId, ?string $chatName = null)
    {
        $stmt = $this->conn->prepare(
            "INSERT INTO Chats (chat_name) VALUES (:chatName)"
        );
        $stmt->bindParam(':chatName', $chatName);
        if ($stmt->execute()) {
            $chatId = (int) $this->conn->lastInsertId();
            $this->addUserToChat($chatId, $creatorId, true);
            return $chatId;
        }
        return false;
    }

    public function getChatMessages(int $chatId): array
    {
        $stmt = $this->conn->prepare(
            "SELECT cm.*, e.first_name, e.second_name, e.profile_picture_path
              FROM ChatMessages cm
              JOIN Employees e ON cm.sender_id = e.employee_id
              WHERE cm.chat_id = :chatId
              ORDER BY cm.date_time ASC"
        );
        $stmt->bindParam(':chatId', $chatId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getMessageById(int $messageId): ?array
    {
        $stmt = $this->conn->prepare("SELECT * FROM ChatMessages WHERE message_id = :messageId");
        $stmt->bindParam(':messageId', $messageId, PDO::PARAM_INT);
        $stmt->execute();
        $message = $stmt->fetch();
        return $message ?: null;
    }

    public function getChatMembers(int $chatId): array
    {
        $stmt = $this->conn->prepare(
            "SELECT e.employee_id, e.first_name, e.second_name, cm.is_admin
              FROM ChatMembers cm
              JOIN Employees e ON e.employee_id = cm.employee_id
              WHERE cm.chat_id = :chat_id"
        );
        $stmt->execute(['chat_id' => $chatId]);
        return $stmt->fetchAll();
    }

    public function isUserInChat(int $chatId, int $userId): bool
    {
        $stmt = $this->conn->prepare(
            "SELECT 1 FROM ChatMembers WHERE chat_id = :chatId AND employee_id = :userId"
        );
        $stmt->bindParam(':chatId', $chatId);
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        return (bool) $stmt->fetchColumn();
    }

    public function addUserToChat(int $chatId, int $userId, bool $isAdmin = false): bool
    {
        if ($this->isUserInChat($chatId, $userId))
            return false;
        $stmt = $this->conn->prepare(
            "INSERT INTO ChatMembers (chat_id, employee_id, is_admin)
              VALUES (:chatId, :userId, :isAdmin)"
        );
        $stmt->bindParam(':chatId', $chatId);
        $stmt->bindParam(':userId', $userId);
        $stmt->bindParam(':isAdmin', $isAdmin, PDO::PARAM_BOOL);
        return $stmt->execute();
    }

    public function removeUserFromChat(int $chatId, int $userId): bool
    {
        $stmt = $this->conn->prepare(
            "DELETE FROM ChatMembers WHERE chat_id = :chatId AND employee_id = :userId"
        );
        $stmt->bindParam(':chatId', $chatId);
        $stmt->bindParam(':userId', $userId);
        return $stmt->execute();
    }

    public function setAdminStatus(int $chatId, int $userId, bool $status): bool
    {
        $stmt = $this->conn->prepare(
            "UPDATE ChatMembers SET is_admin = :status
              WHERE chat_id = :chatId AND employee_id = :userId"
        );
        $stmt->bindParam(':chatId', $chatId);
        $stmt->bindParam(':userId', $userId);
        $stmt->bindParam(':status', $status, PDO::PARAM_BOOL);
        return $stmt->execute();
    }

    public function isAdmin(int $chatId, int $userId): bool
    {
        $stmt = $this->conn->prepare(
            "SELECT is_admin FROM ChatMembers WHERE chat_id = :chatId AND employee_id = :userId"
        );
        $stmt->bindParam(':chatId', $chatId);
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        $res = $stmt->fetch();
        return $res ? (bool) $res['is_admin'] : false;
    }

    public function canLeaveChat(int $chatId, int $userId): bool
    {
        if (!$this->isAdmin($chatId, $userId))
            return true;

        $stmt = $this->conn->prepare(
            "SELECT COUNT(*) AS admin_count FROM ChatMembers WHERE chat_id = :chatId AND is_admin = 1"
        );
        $stmt->bindParam(':chatId', $chatId);
        $stmt->execute();
        $row = $stmt->fetch();
        return $row && $row['admin_count'] > 1;
    }

    public function leaveChat(int $chatId, int $userId): bool
    {
        return $this->canLeaveChat($chatId, $userId) && $this->removeUserFromChat($chatId, $userId);
    }

    public function renameChat(int $chatId, string $newName): bool
    {
        $stmt = $this->conn->prepare("UPDATE Chats SET chat_name = :newName WHERE chatID = :chatId");
        $stmt->bindParam(':newName', $newName);
        $stmt->bindParam(':chatId', $chatId);
        return $stmt->execute();
    }

    public function deleteChat(int $chatId): bool
    {
        $stmt = $this->conn->prepare("DELETE FROM Chats WHERE chatID = :chatId");
        $stmt->bindParam(':chatId', $chatId);
        return $stmt->execute();
    }

    public function getUserChats(int $userId): array
    {
        $stmt = $this->conn->prepare(
            "SELECT C.chatID, C.chat_name FROM Chats C JOIN ChatMembers CM ON C.chatID = CM.chat_id WHERE CM.employee_id = :userId"
        );
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function sendMessage(int $chatId, int $senderId, string $message): bool
    {
        $stmt = $this->conn->prepare(
            "INSERT INTO ChatMessages (chat_id, sender_id, message_contents)
              VALUES (:chatId, :senderId, :msg)"
        );
        $stmt->bindParam(':chatId', $chatId);
        $stmt->bindParam(':senderId', $senderId);
        $stmt->bindParam(':msg', $message);
        return $stmt->execute();
    }

    public function markMessageRead(int $messageId, int $userId): bool
    {
        $stmt = $this->conn->prepare("UPDATE ChatMessages SET read_receipt = 1 WHERE message_id = :msgId");
        $stmt->bindParam(':msgId', $messageId);
        return $stmt->execute();
    }

    public function deleteMessage(int $messageId, int $requesterId): bool
    {
        $stmt = $this->conn->prepare("SELECT sender_id, chat_id FROM ChatMessages WHERE message_id = :msgId");
        $stmt->bindParam(':msgId', $messageId);
        $stmt->execute();
        $msg = $stmt->fetch();
        if (!$msg)
            return false;

        if ($msg['sender_id'] == $requesterId || $this->isAdmin($msg['chat_id'], $requesterId)) {
            $upd = $this->conn->prepare("DELETE FROM ChatMessages WHERE message_id = :msgId");
            $upd->bindParam(':msgId', $messageId);
            return $upd->execute();
        }

        return false;
    }

    public function editMessage(int $messageId, string $newContent): bool
    {
        error_log("Editing message ID $messageId with new content: '$newContent'");

        $stmt = $this->conn->prepare(
            "UPDATE ChatMessages 
             SET message_contents = :msg, is_edited = 1 
             WHERE message_id = :msgId"
        );

        $stmt->bindParam(':msg', $newContent);
        $stmt->bindParam(':msgId', $messageId);

        $result = $stmt->execute();

        if (!$result) {
            $errorInfo = $stmt->errorInfo();
            error_log("SQL Error: " . print_r($errorInfo, true));
        }

        return $result;
    }


    // ------DATA ANALYTICS 

    #Function to get all tasks with filtering (start date, end date, by employee, by project id, by priority)
    public function getTasks($filters = [])
    {
        $sql = "SELECT tasks.*, CONCAT(employees.first_name, ' ', employees.second_name) AS employee_name, 
        projects.project_name AS project_name, projects.team_leader_id AS team_leader_id

        FROM Tasks tasks 
        LEFT JOIN employees ON tasks.assigned_employee = employees.employee_id 
        LEFT JOIN projects ON tasks.project_id = projects.project_id 
        WHERE 1=1";
        $params = [];

        if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
            $sql .= " AND start_date >= :start AND finish_date <= :end";
            $params[':start'] = $filters['start_date'];
            $params[':end'] = $filters['end_date'];
        }

        if (!empty($filters['employee_id'])) {
            $sql .= " AND tasks.assigned_employee = :emp";
            $params[':emp'] = $filters['employee_id'];
        }

        if (!empty($filters['project_id'])) {
            $sql .= " AND tasks.project_id = :proj";
            $params[':proj'] = $filters['project_id'];
        }

        if (!empty($filters['priority'])) {
            $sql .= " AND priority = :priority";
            $params[':priority'] = $filters['priority'];
        }

        $stmt = $this->conn->prepare($sql);
        foreach ($params as $key => &$val) {
            $stmt->bindParam($key, $val);
        }
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    #Function to get all projects with filtering (start date, end date, by team leader)
    public function getProjects($filters = [])
    {
        $sql = "SELECT * FROM Projects WHERE 1=1";
        $params = [];

        if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
            $sql .= " AND start_date >= :start AND finish_date <= :end";
            $params[':start'] = $filters['start_date'];
            $params[':end'] = $filters['end_date'];
        }
        if (!empty($filters['project_id'])) {
            $sql .= " AND project_id = :proj";
            $params[':proj'] = $filters['project_id'];
        }
        if (!empty($filters['team_leader_id'])) {
            $sql .= " AND team_leader_id = :lead";
            $params[':lead'] = $filters['team_leader_id'];
        }

        $stmt = $this->conn->prepare($sql);
        foreach ($params as $key => &$val) {
            $stmt->bindParam($key, $val);
        }
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getEmployee($filters = [])
    {
        $sql = "SELECT * FROM employees WHERE 1=1";
        $params = [];

        if (!empty($filters['employee_id'])) {
            $sql .= " AND employee_id = :emp";
            $params[':emp'] = $filters['employee_id'];
        }
        if (!empty($filters['user_type_id'])) {
            $sql .= " AND user_type_id = :type";
            $params[':type'] = $filters['user_type_id'];
        }

        $stmt = $this->conn->prepare($sql);
        foreach ($params as $key => &$val) {
            $stmt->bindParam($key, $val);
        }
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getEmployeesByProject($projectId)
    {
        $sql = "
            SELECT e.employee_id
            FROM Employees e
            JOIN EmployeeProjects ep ON ep.employee_id = e.employee_id
            WHERE ep.project_id = :projectId
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':projectId', $projectId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }



    function getAllTeamLeaders(): array
    {
        return $this->getEmployee(['user_type_id' => 1]);
    }

    #Function to get tasks that are taking longer than allocated time
    public function getTasksOverrunning()
    {
        $stmt = $this->conn->prepare("
            SELECT * FROM Tasks WHERE time_taken > time_allocated
        ");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    #Function to get tasks near deadline (within 5 days)
    public function getTasksNearDeadline($daysAhead = 5)
    {
        $stmt = $this->conn->prepare("
            SELECT * FROM Tasks 
            WHERE DATEDIFF(finish_date, CURDATE()) BETWEEN 0 AND :days
        ");
        $stmt->bindParam(':days', $daysAhead);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    #Function that gets information relating to employee workload in given time 
    public function getEmployeeWorkload(int $employeeId, string $startDate, string $endDate): array
    {
        $stmt = $this->conn->prepare("
        SELECT T.task_name, T.time_allocated, T.time_taken, T.start_date, T.finish_date
        FROM Tasks T
        JOIN EmployeeTasks ET ON T.task_id = ET.task_id
        WHERE ET.employee_id = :emp AND T.start_date >= :start AND T.finish_date <= :end
    ");
        $stmt->bindParam(':emp', $employeeId);
        $stmt->bindParam(':start', $startDate);
        $stmt->bindParam(':end', $endDate);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    public function getTaskCompletionStats($filters = [])
    {
        $sql = "SELECT 
                    SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) AS completed,
                    SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END) AS pending
                FROM tasks WHERE 1=1";
        $params = [];

        if (!empty($filters['employee_id'])) {
            $sql .= " AND assigned_employee = :emp";
            $params[':emp'] = $filters['employee_id'];
        }

        if (!empty($filters['project_id'])) {
            $sql .= " AND project_id = :proj";
            $params[':proj'] = $filters['project_id'];
        }

        $stmt = $this->conn->prepare($sql);
        foreach ($params as $k => &$v) {
            $stmt->bindParam($k, $v);
        }
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getAverageTimePerTask($filters = [])
    {
        $sql = "SELECT AVG(time_taken) AS avg_time_taken, AVG(time_allocated) AS avg_time_allocated FROM tasks WHERE 1=1";
        $params = [];

        if (!empty($filters['employee_id'])) {
            $sql .= " AND assigned_employee = :emp";
            $params[':emp'] = $filters['employee_id'];
        }

        if (!empty($filters['project_id'])) {
            $sql .= " AND project_id = :proj";
            $params[':proj'] = $filters['project_id'];
        }

        $stmt = $this->conn->prepare($sql);
        foreach ($params as $k => &$v) {
            $stmt->bindParam($k, $v);
        }
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getTeamPerformance($teamLeaderId)
    {
        // Step 1: Fetch all team members under the given leader
        $stmt = $this->conn->prepare("
            SELECT 
                E.employee_id,
                CONCAT(E.first_name, ' ', E.second_name) AS name
            FROM employees E
            JOIN EmployeeProjects EP ON E.employee_id = EP.employee_id
            JOIN Projects P ON EP.project_id = P.project_id
            WHERE P.team_leader_id = :lead
            GROUP BY E.employee_id
        ");
        $stmt->bindParam(':lead', $teamLeaderId);
        $stmt->execute();
        $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        // Step 2: Fetch tasks for each employee
        foreach ($employees as &$emp) {
            $taskStmt = $this->conn->prepare("
                SELECT 
                    T.task_id,
                    T.task_name,
                    T.completed,
                    T.completed_date,
                    T.time_taken
                FROM Tasks T
                WHERE T.assigned_employee = :emp_id
            ");
            $taskStmt->bindParam(':emp_id', $emp['employee_id']);
            $taskStmt->execute();
            $emp['tasks'] = $taskStmt->fetchAll(PDO::FETCH_ASSOC);
        }
    
        return $employees;
    }
    

    public function getProjectProgress($projectId)
    {
        $stmt = $this->conn->prepare("
            SELECT 
                COUNT(t.task_id) AS total,
                SUM(CASE WHEN t.completed = 1 THEN 1 ELSE 0 END) AS completed,
                p.finish_date AS project_due_date
            FROM projects p
            LEFT JOIN tasks t ON p.project_id = t.project_id
            WHERE p.project_id = :pid
        ");
        $stmt->bindParam(':pid', $projectId);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
        return [
            'completed_percentage' => $row['total'] ? round(($row['completed'] / $row['total']) * 100, 2) : 0,
            'project_due_date' => $row['project_due_date'] ?? null
        ];
    }
    

}
?>