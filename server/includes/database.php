
<?php
require_once __DIR__ . '/config.php';

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
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]
            );
        } catch (PDOException $e) {
            echo "Connection Error: " . $e->getMessage();
            exit;
        }
    }

    // ------ USERS ------

    public function getAllEmployees(): array
    {
        $stmt = $this->conn->prepare(
            "SELECT employee_id, first_name, second_name
               FROM Employees"
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
            $chatId = (int)$this->conn->lastInsertId();
            $this->addUserToChat($chatId, $creatorId, true);
            return $chatId;
        }
        return false;
    }

    public function getChatMessages(int $chatId): array
    {
        $stmt = $this->conn->prepare(
            "SELECT * 
               FROM ChatMessages
              WHERE chat_id = :chatId
           ORDER BY date_time ASC"
        );
        $stmt->bindParam(':chatId', $chatId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getChatMembers(int $chatId): array
    {
        $stmt = $this->conn->prepare(
            "SELECT e.employee_id,
                    e.first_name,
                    e.second_name,
                    cm.is_admin
               FROM ChatMembers cm
               JOIN Employees e ON e.employee_id = cm.employee_id
              WHERE cm.chat_id = :chat_id"
        );
        $stmt->execute(['chat_id' => $chatId]);
        return $stmt->fetchAll();
    }

    public function addUserToChat(int $chatId, int $userId, bool $isAdmin = false): bool
    {
        $stmt = $this->conn->prepare(
            "INSERT IGNORE INTO ChatMembers (chat_id, employee_id, is_admin)
             VALUES (:chatId, :userId, :isAdmin)"
        );
        $stmt->bindParam(':chatId', $chatId, PDO::PARAM_INT);
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':isAdmin', $isAdmin, PDO::PARAM_BOOL);
        return $stmt->execute();
    }

    public function removeUserFromChat(int $chatId, int $userId): bool
    {
        $stmt = $this->conn->prepare(
            "DELETE FROM ChatMembers
              WHERE chat_id = :chatId
                AND employee_id = :userId"
        );
        $stmt->bindParam(':chatId', $chatId, PDO::PARAM_INT);
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function setAdminStatus(int $chatId, int $userId, bool $status): bool
    {
        $stmt = $this->conn->prepare(
            "UPDATE ChatMembers
                SET is_admin = :status
              WHERE chat_id = :chatId
                AND employee_id = :userId"
        );
        $stmt->bindParam(':chatId', $chatId, PDO::PARAM_INT);
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':status', $status, PDO::PARAM_BOOL);
        return $stmt->execute();
    }

    public function renameChat(int $chatId, string $newName): bool
    {
        $stmt = $this->conn->prepare(
            "UPDATE Chats
                SET chat_name = :newName
              WHERE chatID = :chatId"
        );
        $stmt->bindParam(':newName', $newName);
        $stmt->bindParam(':chatId', $chatId, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function deleteMessage(int $messageId, int $requesterId): bool
    {
        $stmt = $this->conn->prepare(
            "SELECT sender_id, chat_id
               FROM ChatMessages
              WHERE message_id = :msgId"
        );
        $stmt->bindParam(':msgId', $messageId, PDO::PARAM_INT);
        $stmt->execute();
        $msg = $stmt->fetch();
        if (!$msg) {
            return false;
        }

        if (
            $msg['sender_id'] == $requesterId ||
            $this->isAdmin((int)$msg['chat_id'], $requesterId)
        ) {
            $upd = $this->conn->prepare(
                "UPDATE ChatMessages
                    SET status = 'deleted'
                  WHERE message_id = :msgId"
            );
            $upd->bindParam(':msgId', $messageId, PDO::PARAM_INT);
            return $upd->execute();
        }

        return false;
    }

    public function isAdmin(int $chatId, int $userId): bool
    {
        $stmt = $this->conn->prepare(
            "SELECT is_admin
               FROM ChatMembers
              WHERE chat_id = :chatId
                AND employee_id = :userId"
        );
        $stmt->bindParam(':chatId', $chatId, PDO::PARAM_INT);
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->execute();
        $res = $stmt->fetch();
        return $res ? (bool)$res['is_admin'] : false;
    }

    public function canLeaveChat(int $chatId, int $userId): bool
    {
        if (!$this->isAdmin($chatId, $userId)) {
            return true;
        }
        $stmt = $this->conn->prepare(
            "SELECT COUNT(*) AS admin_count
               FROM ChatMembers
              WHERE chat_id = :chatId
                AND is_admin = 1"
        );
        $stmt->bindParam(':chatId', $chatId, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch();
        return $row && $row['admin_count'] > 1;
    }

    public function leaveChat(int $chatId, int $userId): bool
    {
        if ($this->canLeaveChat($chatId, $userId)) {
            return $this->removeUserFromChat($chatId, $userId);
        }
        return false;
    }

    public function getUserChats(int $userId): array
    {
        $stmt = $this->conn->prepare(
            "SELECT C.chatID, C.chat_name
               FROM Chats C
               JOIN ChatMembers CM
                 ON C.chatID = CM.chat_id
              WHERE CM.employee_id = :userId"
        );
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function sendMessage(int $chatId, int $senderId, string $message): bool
    {
        $stmt = $this->conn->prepare(
            "INSERT INTO ChatMessages (chat_id, sender_id, message_contents)
             VALUES (:chatId, :senderId, :msg)"
        );
        $stmt->bindParam(':chatId', $chatId, PDO::PARAM_INT);
        $stmt->bindParam(':senderId', $senderId, PDO::PARAM_INT);
        $stmt->bindParam(':msg',      $message, PDO::PARAM_STR);
        return $stmt->execute();
    }

    public function markMessageRead(int $messageId): bool
    {
        $stmt = $this->conn->prepare(
            "UPDATE ChatMessages
                SET read_receipt = 1
              WHERE message_id = :msgId"
        );
        $stmt->bindParam(':msgId', $messageId, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function deleteChat(int $chatId): bool
    {
        $stmt = $this->conn->prepare(
            "DELETE FROM Chats
              WHERE chatID = :chatId"
        );
        $stmt->bindParam(':chatId', $chatId, PDO::PARAM_INT);
        return $stmt->execute();
    }

    // ------DATA ANALYTICS 

    #Function to get all tasks with filtering (start date, end date, by employee, by project id, by priority)
    public function getTasks($filters = [])
    {
        $sql = "SELECT * FROM Tasks WHERE 1=1";
        $params = [];

        if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
            $sql .= " AND start_date >= :start AND finish_date <= :end";
            $params[':start'] = $filters['start_date'];
            $params[':end'] = $filters['end_date'];
        }

        if (!empty($filters['employee_id'])) {
            $sql .= " AND assigned_employee = :emp";
            $params[':emp'] = $filters['employee_id'];
        }

        if (!empty($filters['project_id'])) {
            $sql .= " AND project_id = :proj";
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
    public function getEmployeeWorkload($employeeId, $startDate, $endDate)
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
}
?>

