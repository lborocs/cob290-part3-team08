<?php
/**
 * Database.php
 * This file handles all database operations for the chat system
 * 
 * How to use:
 * 1. Make sure you have XAMPP installed
 * 2. Place this file in your XAMPP htdocs folder
 * 3. Create a new database named 'team08' in phpMyAdmin (go to localhost/phpmyadmin with apache and mysql running on XAMPP
 * create new database, then go to SQL tab and input all of schema.sql, press go and the tables will be created with input data)
 * Need to update SQL structure using schema.sql - may need to be further refined. 
 */

 class Database {
    private $conn;
    private $host = 'localhost';
    private $db_name = 'team08';
    private $username = 'root';
    private $password = '';

    public function __construct() {
        try {
            $this->conn = new PDO(
                "mysql:host={$this->host};dbname={$this->db_name}",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            echo "Connection Error: " . $e->getMessage();
        }
    }

    // -------------------- CHAT SYSTEM --------------------

    public function createChatWithCreator($creatorId, $chatName = null) {
        $stmt = $this->conn->prepare("INSERT INTO Chats (chat_name) VALUES (:chatName)");
        $stmt->bindParam(':chatName', $chatName);
        if ($stmt->execute()) {
            $chatId = $this->conn->lastInsertId();
            $this->addUserToChat($chatId, $creatorId, true); // Creator is admin
            return $chatId;
        }
        return false;
    }

    public function addUserToChat($chatId, $userId, $isAdmin = false) {
        $stmt = $this->conn->prepare("INSERT IGNORE INTO ChatMembers (chat_id, employee_id, is_admin) VALUES (:chatId, :userId, :isAdmin)");
        $stmt->bindParam(':chatId', $chatId);
        $stmt->bindParam(':userId', $userId);
        $stmt->bindParam(':isAdmin', $isAdmin, PDO::PARAM_BOOL);
        return $stmt->execute();
    }

    public function removeUserFromChat($chatId, $userId) {
        $stmt = $this->conn->prepare("DELETE FROM ChatMembers WHERE chat_id = :chatId AND employee_id = :userId");
        $stmt->bindParam(':chatId', $chatId);
        $stmt->bindParam(':userId', $userId);
        return $stmt->execute();
    }

    public function setAdminStatus($chatId, $userId, $status) {
        $stmt = $this->conn->prepare("UPDATE ChatMembers SET is_admin = :status WHERE chat_id = :chatId AND employee_id = :userId");
        $stmt->bindParam(':chatId', $chatId);
        $stmt->bindParam(':userId', $userId);
        $stmt->bindParam(':status', $status, PDO::PARAM_BOOL);
        return $stmt->execute();
    }

    public function renameChat($chatId, $newName) {
        $stmt = $this->conn->prepare("UPDATE Chats SET chat_name = :newName WHERE chatID = :chatId");
        $stmt->bindParam(':newName', $newName);
        $stmt->bindParam(':chatId', $chatId);
        return $stmt->execute();
    }

    public function deleteMessage($messageId, $requesterId) {
        $stmt = $this->conn->prepare("
            SELECT sender_id, chat_id FROM ChatMessages WHERE message_id = :msgId
        ");
        $stmt->bindParam(':msgId', $messageId);
        $stmt->execute();
        $msg = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$msg) return false;

        // Check if requester is sender or admin
        if ($msg['sender_id'] == $requesterId || $this->isAdmin($msg['chat_id'], $requesterId)) {
            $stmt = $this->conn->prepare("UPDATE ChatMessages SET status = 'deleted' WHERE message_id = :msgId");
            $stmt->bindParam(':msgId', $messageId);
            return $stmt->execute();
        }

        return false;
    }

    public function isAdmin($chatId, $userId) {
        $stmt = $this->conn->prepare("SELECT is_admin FROM ChatMembers WHERE chat_id = :chatId AND employee_id = :userId");
        $stmt->bindParam(':chatId', $chatId);
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ? (bool)$result['is_admin'] : false;
    }

    public function canLeaveChat($chatId, $userId) {
        if (!$this->isAdmin($chatId, $userId)) return true;
        $stmt = $this->conn->prepare("
            SELECT COUNT(*) as admin_count 
            FROM ChatMembers WHERE chat_id = :chatId AND is_admin = 1
        ");
        $stmt->bindParam(':chatId', $chatId);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result && $result['admin_count'] > 1;
    }

    public function leaveChat($chatId, $userId) {
        if ($this->canLeaveChat($chatId, $userId)) {
            return $this->removeUserFromChat($chatId, $userId);
        }
        return false;
    }

    // -------------------- DATA ANALYTICS --------------------

    public function getTasks($filters = []) {
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

    public function getProjects($filters = []) {
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

    public function getTasksOverrunning() {
        $stmt = $this->conn->prepare("
            SELECT * FROM Tasks WHERE time_taken > time_allocated
        ");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getTasksNearDeadline($daysAhead = 5) {
        $stmt = $this->conn->prepare("
            SELECT * FROM Tasks 
            WHERE DATEDIFF(finish_date, CURDATE()) BETWEEN 0 AND :days
        ");
        $stmt->bindParam(':days', $daysAhead);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getEmployeeWorkload($employeeId, $startDate, $endDate) {
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