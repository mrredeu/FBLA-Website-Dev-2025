<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php';
require 'email.php';

$response = [
    "success" => false,
    "message" => "",
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read the raw input
    $input = file_get_contents('php://input');

    // Decode the JSON data
    $data = json_decode($input, true);

    // Access data from decoded JSON
    $full_name = htmlspecialchars($data['full_name'] ?? '');
    $email = htmlspecialchars($data['email'] ?? '');
    $password = password_hash(htmlspecialchars($data['password'] ?? ''), PASSWORD_BCRYPT);
    $role = htmlspecialchars($data['role'] ?? '');

    try {
        // Insert into the database using PDO
        $sql = "INSERT INTO users (full_name, email, password, role, is_approved) VALUES (:full_name, :email, :password, :role, 0)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':full_name' => $full_name,
            ':email' => $email,
            ':password' => $password,
            ':role' => $role,
        ]);

        $emailResponse = sendEmail($email, "Thank You for Registering at Beehive's Job Portal", "
                <h1>Welcome to BSTA!</h1>
                <p>Hi $full_name,</p>
                <p>Thank you for registering. Your account is pending approval by the administrator.</p>
                <p>Please wait for further updates.</p>
                <br>
                <p>Best regards,</p>
                <p>Beehive Science & Technology Academy</p>
            ");

        if ($emailResponse['success']) {
            $response["message"] = "Registration successful! Please check your email for confirmation.";
        } else {
            $response["message"] = "Registration successful, but email could not be sent: " . $emailResponse['message'];
        }

        $response["success"] = true;
    } catch (PDOException $e) {
        $response["message"] = "Database error: " . $e->getMessage();
    }
} else {
    $response["message"] = "Invalid request method.";
}

echo json_encode($response);
