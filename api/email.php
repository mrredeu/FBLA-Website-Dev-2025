<?php
require '../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function sendEmail($email, $subject, $body)
{
    $response = ["success" => false, "message" => ""];

    // Validate required fields
    if (empty($email) || empty($subject) || empty($body)) {
        $response["message"] = "Missing required email fields.";
        return $response;
    }

    try {
        $mail = new PHPMailer(true);

        // SMTP Configuration
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'pashatestermails@gmail.com'; // Your email
        $mail->Password   = 'zyvnuncmydpegrhf'; // App password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        // Email Metadata
        $mail->setFrom('pashatestermails@gmail.com', 'Beehive Science & Technology Academy');
        $mail->addAddress($email);

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
