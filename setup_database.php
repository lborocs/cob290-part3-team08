<?php
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'my_project';

// Connect to MySQL
$conn = new mysqli($host, $username, $password);

// Create the database if it doesn’t exist
$conn->query("CREATE DATABASE IF NOT EXISTS $database");
$conn->select_db($database);

// Create tables
$conn->query("CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
)");

// Insert sample data (if not already present)
$conn->query("INSERT IGNORE INTO users (id, name, email) VALUES
    (1, 'John Doe', 'john@example.com'),
    (2, 'Jane Doe', 'jane@example.com')");

echo "Database setup complete!";
$conn->close();
?>
