<?php
require 'db.php';
header('Content-Type: application/json');

session_start();

try {
    $query = $pdo->query("SELECT id, title, location, description, pay FROM jobs WHERE is_approved = 1");
    $jobs = $query->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "jobs" => $jobs,
        "role" => $_SESSION['role'] ?? null,
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "error" => "Database error: " . $e->getMessage(),
    ]);
}
