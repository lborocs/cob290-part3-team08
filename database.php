<?php
/**
 * Database.php
 * This file handles all database operations for the chat system
 * 
 * How to use:
 * 1. Make sure you have XAMPP installed
 * 2. Place this file in your XAMPP htdocs folder
 * 3. Create a new database named 'chat_system' in phpMyAdmin
 * 4. Import the SQL structure from the comments below
 */

class Database {
    private $conn;
    private $host = 'localhost';
    private $db_name = 'chat_system';
    private $username = 'root';
    private $password = '';

    public function __construct() {
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            echo "Connection Error: " . $e->getMessage();
        }
    }

    // Chat Methods
    public function createChat($name) {
        $query = "INSERT INTO Chats (name) VALUES (:name)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':name', $name);
        return $stmt->execute();
    }

    public function getChat($chat_id) {
        $query = "SELECT * FROM Chats WHERE id = :chat_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':chat_id', $chat_id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getAllChats() {
        $query = "SELECT * FROM Chats";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Message Methods
    public function createMessage($chat_id, $sender_id, $message_text) {
        $query = "INSERT INTO Messages (chat_id, sender_id, message_text) 
                 VALUES (:chat_id, :sender_id, :message_text)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':chat_id', $chat_id);
        $stmt->bindParam(':sender_id', $sender_id);
        $stmt->bindParam(':message_text', $message_text);
        return $stmt->execute();
    }

    public function getMessages($chat_id) {
        $query = "SELECT * FROM Messages WHERE chat_id = :chat_id ORDER BY timestamp";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':chat_id', $chat_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // User Methods
    public function createUser($username) {
        $query = "INSERT INTO Users (username) VALUES (:username)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $username);
        return $stmt->execute();
    }

    public function getUser($user_id) {
        $query = "SELECT * FROM Users WHERE id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getAllUsers() {
        $query = "SELECT * FROM Users";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

/**
 * SQL Structure for the database:
 * 
 * CREATE DATABASE chat_system;
 * USE chat_system;
 * 
 * CREATE TABLE Users (
 *     id INT AUTO_INCREMENT PRIMARY KEY,
 *     username VARCHAR(255) NOT NULL,
 *     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 * );
 * 
 * CREATE TABLE Chats (
 *     id INT AUTO_INCREMENT PRIMARY KEY,
 *     name VARCHAR(255) NOT NULL,
 *     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 * );
 * 
 * CREATE TABLE Messages (
 *     id INT AUTO_INCREMENT PRIMARY KEY,
 *     chat_id INT NOT NULL,
 *     sender_id INT NOT NULL,
 *     message_text TEXT NOT NULL,
 *     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *     FOREIGN KEY (chat_id) REFERENCES Chats(id),
 *     FOREIGN KEY (sender_id) REFERENCES Users(id)
 * );
 */ 