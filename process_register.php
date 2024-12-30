<?php
// Include database connection and PHPMailer
require 'includes/db.php';
require 'vendor/autoload.php'; // Path to PHPMailer if installed via Composer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Form data
$full_name = $_POST['full_name'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
$role = $_POST['role'];

// Insert into the database
$sql = "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $full_name, $email, $password, $role);

// Execute and send email if registration is successful
if ($stmt->execute()) {

    // Send email to the user
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';  // SMTP server
        $mail->SMTPAuth   = true;
        $mail->Username   = 'your-email@gmail.com';  // Your Gmail address
        $mail->Password   = 'your-email-password';  // App password or your Gmail password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // Recipients
        $mail->setFrom('your-email@gmail.com', 'Beehive Academy');
        $mail->addAddress($email, $full_name);

        // Email content
        $mail->isHTML(true);
        $mail->Subject = 'Thank You for Registering at Beehive Academy Job Portal';
        $mail->Body    = "
            <h1>Welcome to Beehive Academy!</h1>
            <p>Hi <b>$full_name</b>,</p>
            <p>Thank you for registering. Please allow 1-2 business days for your account to be reviewed. You will receive another email once your account is activated.</p>
            <br>
            <p>Best regards,</p>
            <p>Beehive Science & Technology Academy</p>
        ";

        $mail->send();
        header("Location: login.php?success=registered");
    } catch (Exception $e) {
        echo "Registration successful, but email could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
} else {
    echo "Error: " . $stmt->error;
}

// Close connections
$stmt->close();
$conn->close();
?>
