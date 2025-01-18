<?php
$success = isset($_GET['status']) ? $_GET['status'] : '';

if ($success === 'registered') {
    $message = "Thank you for registering! Your account is under review. You will receive an email notification within 2-5 business days.";
} elseif ($success === 'pending') {
    $message = "Your account is pending approval. Please wait 2-5 business days for updates.";
} else {
    $message = "Welcome to your account page.";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Page</title>
    <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #F3E3BC;
            color: #333;
        }

        .account-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 80vh;
            text-align: center;
        }

        .account-card {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            max-width: 500px;
        }

        .account-card h1 {
            font-size: 2rem;
            color: rgb(254, 155, 34);
            margin-bottom: 20px;
        }

        .account-card p {
            font-size: 1.2rem;
            line-height: 1.6;
            color: #555;
        }

        .account-card a {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: rgb(254, 155, 34);
            color: black;
            text-decoration: none;
            border-radius: 5px;
            font-size: 1rem;
            transition: color 0.2s ease;
        }

        .account-card a:hover {
            color: white;
        }
    </style>
</head>
<body>
    <?php include 'navbar.php'; ?>
    <div class="account-container">
        <div class="account-card">
            <h1>Account Page</h1>
            <p><?php echo htmlspecialchars($message); ?></p>
            <a href="index.php">Go Back to Home</a>
        </div>
    </div>
</body>
</html>