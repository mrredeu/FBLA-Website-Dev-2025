<?php
session_start();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beehive Academy Job Portal</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

    <header>
        <div class="top-bar">
            <div class="logo">
                <a href="index.php"><img src="assets/images/beehive-logo.png" alt="Beehive Academy Logo"></a>
            </div>
            <div class="contact-info">
                <span>📞 (801) 576-0070</span>
                <div class="social-links">
                    <a href="#">🔵</a>
                    <a href="#">🐦</a>
                    <a href="#">▶️</a>
                </div>
            </div>
        </div>

        <!-- Navigation Bar -->
        <nav class="navbar">
            <div class="container">
                <ul>
                    <li><a href="index.php">Home</a></li>
                    <li><a href="students/jobs.php">Job Listings</a></li>
                    <li><a href="employers/submit-job.php">Submit a Job</a></li>

                    <!-- Welcome Message for Logged-In Users -->
                    <?php if (isset($_SESSION['username'])): ?>
                        <li>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?></li>
                        <li><a href="logout.php" class="logout-btn">Logout</a></li>
                    <?php else: ?>
                        <li><button onclick="toggleLoginBox()" class="login-btn">Login</button></li>
                    <?php endif; ?>
                </ul>
            </div>
        </nav>
    </header>

    <!-- Login Box -->
    <div id="login-box" class="login-box" style="display: none;">
        <div class="box-content">
            <form id="login-form" class="form" action="process_login.php" method="POST">
                <h2>Login</h2>
                <input type="email" name="email" placeholder="Email" required>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit">Login</button>
                <p>Don't have an account? <a href="register.php">Register here</a></p>
            </form>
        </div>
    </div>

    <!-- Main Section -->
    <section class="hero">
        <div class="container">
            <h1>Beehive Academy Job Portal</h1>
            <p>Connecting students to opportunities – Apply for jobs or internships today!</p>
            <a href="students/jobs.php" class="btn">View Jobs</a>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2024 Beehive Science & Technology Academy</p>
        </div>
    </footer>

    <script>
        // Toggle Login Box
        function toggleLoginBox() {
            const loginBox = document.getElementById('login-box');
            loginBox.style.display = (loginBox.style.display === 'block') ? 'none' : 'block';
        }
    </script>

</body>
</html>
