<?php
    // Database connection details
    $host = 'localhost';
    $username = 'root';
    $password = '';
    $database = 'team08part3';

    // Connect to MySQL
    $conn = new mysqli($host, $username, $password);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Create the database if it does not exist
    $conn->query("CREATE DATABASE IF NOT EXISTS $database");
    $conn->select_db($database);

    // Path to your SQL schema file
    $sqlFile = 'schema.sql';

    // Read the SQL file
    $sql = file_get_contents($sqlFile);
    if (!$sql) {
        die("Error reading SQL file.");
    }

    // Split SQL commands (for multi-query execution)
    $queries = explode(";", $sql);

    // Execute each query
    foreach ($queries as $query) {
        $trimmedQuery = trim($query);
        if (!empty($trimmedQuery)) {
            if ($conn->query($trimmedQuery) === FALSE) {
                echo "Error executing query: " . $conn->error . "<br>";
            }
        }
    }

    echo "Database schema imported successfully.";

    $conn->close();
?>