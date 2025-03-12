<?php
require '../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function sendEmail($email, $subject, $body)
{
    $response = ["success" => false, "message" => ""];

    // Check for missing inputs
    if (empty($email) || empty($subject) || empty($body)) {
        $response["message"] = "Missing required email fields.";
        return $response;
    }

    try {
        // Initialize PHPMailer
        $mail = new PHPMailer(true);

        // Configure SMTP
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'pashatestermails@gmail.com'; // Your email
        $mail->Password   = 'zyvnuncmydpegrhf'; // App password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        // Set sender and recipient details
        $mail->setFrom('pashatestermails@gmail.com', 'Beehive Science & Technology Academy');
        $mail->addAddress($email);

        // Compose email content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $body;

        // Send the email
        $mail->send();

        $response["success"] = true;
        $response["message"] = "Email sent successfully to $email.";
    } catch (Exception $e) {
        $response["message"] = "Failed to send email. Error: " . $mail->ErrorInfo;
    }

    return $response;
}
