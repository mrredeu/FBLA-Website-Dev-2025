<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>

<link rel="stylesheet" href="assets/css/navbar.css">

<!-- Top Bar -->
<header>
    <div class="top-bar">
        <div class="academy-name">
            BEEHIVE SCIENCE & TECHNOLOGY ACADEMY
        </div>
        <div class="contact-info">
            <span><i class="fas fa-phone"></i> (801) 576-0070</span>
            <div class="social-links">
                <a href="#"><i class="fab fa-facebook"></i></a>
                <a href="#"><i class="fab fa-twitter"></i></a>
                <a href="#"><i class="fab fa-youtube"></i></a>
                <a href="#"><i class="fab fa-instagram"></i></a>
            </div>
        </div>
    </div>

    <!-- Navigation Bar -->
    <nav class="navbar">
        <div class="container">
            <div class="logo">
                <img src="assets/images/beehive-logo.png" alt="Beehive Logo">
            </div>
            <ul>
                <li><a href="index.php">Home</a></li>
                <li><a href="jobs.php">Job Listings</a></li>
                <li><a href="submit-job.php">Submit a Job</a></li>
                <?php if (isset($_SESSION['username'])): ?>
                    <li>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?></li>
                    <li><a href="logout.php" class="logout-btn">Logout</a></li>
                <?php else: ?>
                    <li><button class="login-btn">Login</button></li>
                <?php endif; ?>
            </ul>
        </div>
    </nav>
</header>

<!-- Login Box -->
<div id="login-box" class="login-box" style="display: none;">
    <div class="box-content">
        <form id="login-form" class="form" action="process_login.php" method="POST">
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Login</button>
            <p>Don't have an account? <a href="register.php">Register here</a></p>
        </form>
    </div>
</div>
