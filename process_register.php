<?php
require 'db.php';
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $full_name = htmlspecialchars($_POST['full_name']);
    $email = htmlspecialchars($_POST['email']);
    $password = password_hash(htmlspecialchars($_POST['password']), PASSWORD_BCRYPT);
    $role = htmlspecialchars($_POST['role']);

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

        // Send email to the user
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'pashatestermails@gmail.com'; // Your email
            $mail->Password   = 'zyvnuncmydpegrhf'; // App password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port       = 465;

            $mail->setFrom('pashatestermails@gmail.com', 'Beehive Academy');
            $mail->addAddress($email, $full_name);

            $mail->isHTML(true);
            $mail->Subject = 'Thank You for Registering at Beehive Academy Job Portal';
            $mail->Body    = "
                <h1>Welcome to Beehive Academy!</h1>
                <p>Hi <b>$full_name</b>,</p>
                <p>Thank you for registering. Your account is pending approval by the administrator.</p>
                <p>Please wait for further updates.</p>
                <br>
                <p>Best regards,</p>
                <p>Beehive Science & Technology Academy</p>
            ";

            $mail->send();

            // Redirect to account page with a success message
            header("Location: account.php?status=registered");
            exit();
        } catch (Exception $e) {
            echo "Registration successful, but email could not be sent. Mailer Error: {$mail->ErrorInfo}";
        }
    } catch (PDOException $e) {
        die("Database error: " . $e->getMessage());
    }
}
?>