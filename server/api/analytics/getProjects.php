<?php
require_once '../../includes/Database_Enhanced.php';
require_once '../../includes/headers.php';

$db = new Database();
$filters = $_GET;

$projects = $db->getProjects($filters);
echo json_encode($projects);
