<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

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

                    // Return success response
                    echo json_encode([
                        'success' => true,
                        'session' => [
                            'email' => $email,
                            'username' => $firstName,
                            'role' => $user['role'],
                        ],
                    ]);
                    exit();
                } else {
                    // Account pending approval
                    if ($user['is_approved'] == 0) {
                        echo json_encode([
                            'success' => false,
                            'error' => 'Account is pending approval.',
                        ]);
                    } else {
                        echo json_encode([
                            'success' => false,
                            'error' => 'Account has been denied.',
                        ]);
                    }
                    exit();
                }
            } else {
                // Invalid password
                echo json_encode([
                    'success' => false,
                    'error' => 'Invalid password.',
                ]);
                exit();
            }
        } else {
            // User not found
            echo json_encode([
                'success' => false,
                'error' => 'User not found.',
            ]);
            exit();
        }
    } catch (PDOException $e) {
        error_log("Login error: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'error' => 'An error occurred while processing your request.',
        ]);
        exit();
    }
}
