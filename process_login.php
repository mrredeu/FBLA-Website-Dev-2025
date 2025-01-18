<?php
session_start();
require 'db.php'; // Database connection

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    try {
        // Query user details, including full_name
        $stmt = $pdo->prepare("SELECT id, full_name, password, role, is_approved FROM users WHERE email = :email");
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch(mode: PDO::FETCH_ASSOC);

        if ($user) {
            // Check if password matches
            if (password_verify($password, $user['password'])) {
                if ($user['is_approved'] == 1) {
                    // Account is approved
                    $fullName = $user['full_name'];
                    $firstName = explode(' ', trim($fullName))[0];
                    $_SESSION['username'] = $firstName;
                    $_SESSION['role'] = $user['role'];
                    header("Location: index.php");
                    exit();
                } else {
                    // Account pending approval
                    header("Location: account.php?status=pending");
                    exit();
                }
            } else {
                // Invalid password
                header("Location: index.php?error=invalid");
                exit();
            }
        } else {
            // User not found
            header("Location: index.php?error=notfound");
            exit();
        }
    } catch (PDOException $e) {
        error_log("Login error: " . $e->getMessage());
        exit();
    }
}
?>
