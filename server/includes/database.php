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
require_once 'config.php';

class Database
{
    private $conn;

    public function __construct()
    {
        try {
            $this->conn = new PDO
            ("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);

            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo "Connection Error: " . $e->getMessage();
        }
    }

    // ------USERS
    public function getAllEmployees()
    {
        $stmt = $this->conn->prepare("SELECT employee_id, first_name, second_name FROM Employees");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    // ------CHAT SYSTEM

    #Function that creates a new chat and sets creator as admin
    public function createChatWithCreator($creatorId, $chatName = null)
    {
        $stmt = $this->conn->prepare("INSERT INTO Chats (chat_name) VALUES (:chatName)");
        $stmt->bindParam(':chatName', $chatName);
        if ($stmt->execute()) {
            $chatId = $this->conn->lastInsertId();
            $this->addUserToChat($chatId, $creatorId, true); // Creator is admin
            return $chatId;
        }
        return false;
    }



    public function getChatMessages($chatId)
    {
        $stmt = $this->conn->prepare("
            SELECT * FROM ChatMessages
            WHERE chat_id = :chatId
            ORDER BY date_time ASC
        ");
        $stmt->bindParam(':chatId', $chatId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    #Function that adds user to a chat
    public function addUserToChat($chatId, $userId, $isAdmin = false)
    {
        $stmt = $this->conn->prepare("INSERT IGNORE INTO ChatMembers (chat_id, employee_id, is_admin) VALUES (:chatId, :userId, :isAdmin)");
        $stmt->bindParam(':chatId', $chatId);
        $stmt->bindParam(':userId', $userId);
        $stmt->bindParam(':isAdmin', $isAdmin, PDO::PARAM_BOOL);
        return $stmt->execute();
    }

    #Function that removes user from chat
    public function removeUserFromChat($chatId, $userId)
    {
        $stmt = $this->conn->prepare("DELETE FROM ChatMembers WHERE chat_id = :chatId AND employee_id = :userId");
        $stmt->bindParam(':chatId', $chatId);
        $stmt->bindParam(':userId', $userId);
        return $stmt->execute();
    }

    #Function that sets a user to admin
    public function setAdminStatus($chatId, $userId, $status)
    {
        $stmt = $this->conn->prepare("UPDATE ChatMembers SET is_admin = :status WHERE chat_id = :chatId AND employee_id = :userId");
        $stmt->bindParam(':chatId', $chatId);
        $stmt->bindParam(':userId', $userId);
        $stmt->bindParam(':status', $status, PDO::PARAM_BOOL);
        return $stmt->execute();
    }

    #Function to rename chat
    public function renameChat($chatId, $newName)
    {
        $stmt = $this->conn->prepare("UPDATE Chats SET chat_name = :newName WHERE chatID = :chatId");
        $stmt->bindParam(':newName', $newName);
        $stmt->bindParam(':chatId', $chatId);
        return $stmt->execute();
    }

    #Function to delete messages
    public function deleteMessage($messageId, $requesterId)
    {
        $stmt = $this->conn->prepare("
            SELECT sender_id, chat_id FROM ChatMessages WHERE message_id = :msgId
        ");
        $stmt->bindParam(':msgId', $messageId);
        $stmt->execute();
        $msg = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$msg)
            return false;

        #Check if requester is sender or admin, admins can delete any messages, users only their own
        if ($msg['sender_id'] == $requesterId || $this->isAdmin($msg['chat_id'], $requesterId)) {
            $stmt = $this->conn->prepare("UPDATE ChatMessages SET status = 'deleted' WHERE message_id = :msgId");
            $stmt->bindParam(':msgId', $messageId);
            return $stmt->execute();
        }

        return false;
    }

    #Function to check if user is admin of chat
    public function isAdmin($chatId, $userId)
    {
        $stmt = $this->conn->prepare("SELECT is_admin FROM ChatMembers WHERE chat_id = :chatId AND employee_id = :userId");
        $stmt->bindParam(':chatId', $chatId);
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ? (bool) $result['is_admin'] : false;
    }

    #Function to check if user can leave chat (cannot leave if they are the only admin)
    public function canLeaveChat($chatId, $userId)
    {
        if (!$this->isAdmin($chatId, $userId))
            return true;
        $stmt = $this->conn->prepare("
            SELECT COUNT(*) as admin_count 
            FROM ChatMembers WHERE chat_id = :chatId AND is_admin = 1
        ");
        $stmt->bindParam(':chatId', $chatId);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result && $result['admin_count'] > 1;
    }

    #Function to leave chat
    public function leaveChat($chatId, $userId)
    {
        if ($this->canLeaveChat($chatId, $userId)) {
            return $this->removeUserFromChat($chatId, $userId);
        }
        return false;
    }

    #Function to get all chats for a user
    public function getUserChats($userId)
    {
        $stmt = $this->conn->prepare("
            SELECT C.chatID, C.chat_name
            FROM Chats C
            JOIN ChatMembers CM ON C.chatID = CM.chat_id
            WHERE CM.employee_id = :userId
        ");
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    #Function to send a message
    public function sendMessage($chatId, $senderId, $message)
    {
        $stmt = $this->conn->prepare("
                INSERT INTO ChatMessages (chat_id, sender_id, message_contents) 
                VALUES (:chatId, :senderId, :msg)
            ");
        $stmt->bindParam(':chatId', $chatId);
        $stmt->bindParam(':senderId', $senderId);
        $stmt->bindParam(':msg', $message);
        return $stmt->execute();
    }

    #Function to mark a message as read
    public function markMessageRead($messageId)
    {
        $stmt = $this->conn->prepare("
                UPDATE ChatMessages 
                SET read_receipt = 1 
                WHERE message_id = :msgId
            ");
        $stmt->bindParam(':msgId', $messageId);
        return $stmt->execute();
    }

    #Function to delete an entire chat
    public function deleteChat($chatId)
    {
        $stmt = $this->conn->prepare("DELETE FROM Chats WHERE chatID = :chatId");
        $stmt->bindParam(':chatId', $chatId);
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