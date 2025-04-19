<?php
//tells the browser that responses contain JSON
header('Content-Type: application/json');
//this basically allows the server to accept requests from any origin (CORS)
//when accessing the API we tell it the METHODS are permitted (GET, POST, PATCH, DELETE, OPTIONS)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
?>
