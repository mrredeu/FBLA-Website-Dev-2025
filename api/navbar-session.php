<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Start or resume the session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Build session response
$response = [
    'username' => $_SESSION['username'] ?? null,
    'role' => $_SESSION['role'] ?? null,
];

// Send JSON response
echo json_encode($response);
