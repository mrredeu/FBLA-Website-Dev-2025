<?php
require 'db.php';
require 'email.php';
header('Content-Type: application/json');

$response = ["success" => false, "message" => ""];

// Get the action from the query parameter
$action = $_GET['action'] ?? '';

try {
    if ($action === 'getAccounts') {
        // Fetch all accounts with their statuses
        $sql = "SELECT id, full_name, email, role, is_approved FROM users WHERE role != 'admin'";
        $stmt = $pdo->query($sql);
        $accounts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["success" => true, "accounts" => $accounts]);
    } elseif ($action === 'approve' || $action === 'deny') {
        // Parse JSON input
        $input = json_decode(file_get_contents('php://input'), true);
        $id = intval($input['id'] ?? 0);

        if ($id > 0) {
            $isApproved = $action === 'approve' ? 1 : -1; // 1 for approve, -1 for deny
            $sql = "UPDATE users SET is_approved = :isApproved WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':isApproved' => $isApproved, ':id' => $id]);

            // Fetch the user's details
            $userQuery = "SELECT full_name, email FROM users WHERE id = :id";
            $userStmt = $pdo->prepare($userQuery);
            $userStmt->execute([':id' => $id]);
            $user = $userStmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                if ($action === 'approve') {
                    // Prepare approval email data
                    $email = $user['email'];
                    $subject = "Your Account Has Been Approved!";
                    $body = "
                        <h2 style='color:#FE9B22;'>Welcome to Beehive Job Portal!</h2>
                        <p>Hi {$user['full_name']},</p>
                        <p>Thank you for waiting! Your account has been approved, and you now have access to Beehive's Job Portal as an employer.</p>
                        <br>
                        <p>Best regards,</p>
                        <p>Beehive Science & Technology Academy</p>
                    ";

                    // Send the approval email
                    $emailResponse = sendEmail($email, $subject, $body);
                    if ($emailResponse['success']) {
                        $response["message"] = "Account approved and email sent.";
                    } else {
                        $response["message"] = "Account approved, but email could not be sent: " . $emailResponse['message'];
                    }
                } elseif ($action === 'deny') {
                    // Prepare denial email data
                    $email = $user['email'];
                    $subject = "Your Account Has Been Denied";
                    $body = "
                        <h2 style='color:#dc3545;'>Account Denied</h2>
                        <p>Hi {$user['full_name']},</p>
                        <p>We regret to inform you that your account request for Beehive's Job Portal has been denied.</p>
                        <p>If you believe this was a mistake, please contact our administration for further assistance.</p>
                        <br>
                        <p>Best regards,</p>
                        <p>Beehive Science & Technology Academy</p>
                    ";

                    // Send the denial email
                    $emailResponse = sendEmail($email, $subject, $body);
                    if ($emailResponse['success']) {
                        $response["message"] = "Account denied and email sent.";
                    } else {
                        $response["message"] = "Account denied, but email could not be sent: " . $emailResponse['message'];
                    }
                }
            }

            $response["success"] = true;
        } else {
            $response["message"] = "Invalid account ID.";
        }

        echo json_encode($response);
    } elseif ($action === 'remove') {
        // Parse JSON input
        $input = json_decode(file_get_contents('php://input'), true);
        $id = intval($input['id'] ?? 0);

        if ($id > 0) {
            $sql = "DELETE FROM users WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':id' => $id]);

            $response["success"] = true;
            $response["message"] = "Account removed successfully.";
        } else {
            $response["message"] = "Invalid account ID.";
        }

        echo json_encode($response);
    } elseif ($action === 'filter') {
        // Fetch accounts based on filter (approved, pending, or denied)
        $status = $_GET['status'] ?? 'all';
        $sql = "SELECT id, full_name, email, role, is_approved FROM users";

        if ($status === 'approved') {
            $sql .= " WHERE is_approved = 1";
        } elseif ($status === 'pending') {
            $sql .= " WHERE is_approved = 0";
        } elseif ($status === 'denied') {
            $sql .= " WHERE is_approved = -1";
        }

        $stmt = $pdo->query($sql);
        $accounts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["success" => true, "accounts" => $accounts]);
    } else {
        $response["message"] = "Invalid action.";
        echo json_encode($response);
    }
} catch (PDOException $e) {
    $response["message"] = "Database error: " . $e->getMessage();
    echo json_encode($response);
}
