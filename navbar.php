<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>

<link rel="stylesheet" href="assets/css/navbar.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

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
                
                <!-- Job Listings -->
                <?php if (!isset($_SESSION['role']) || $_SESSION['role'] === 'student'): ?>
                    <li><a href="jobs.php">Job Listings</a></li>
                <?php endif; ?>

                <!-- Admin: Review Accounts -->
                <?php if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin'): ?>
                    <li><a href="review_accounts.php">Review Accounts</a></li>
                <?php endif; ?>

                <!-- Admin: Review a Job -->
                <?php if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin'): ?>
                    <li><a href="review_job.php">Review Job Postings</a></li>
                <?php endif; ?>

                <!-- Employer: Submit a Job -->
                <?php if (isset($_SESSION['role']) && $_SESSION['role'] === 'employer'): ?>
                    <li><a href="submit_job.php">Submit Job Posting</a></li>
                <?php endif; ?>

                <!-- Common Links -->
                <?php if (isset($_SESSION['username'])): ?>
                    <li>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?>!</li>
                    <li><a href="logout.php" class="logout-btn">Logout</a></li>
                <?php else: ?>
                    <li><button class="login-btn" onclick="toggleLoginBox()">Login</button></li>
                <?php endif; ?>
            </ul>
        </div>
    </nav>
</header>

<!-- Login Box -->
<div id="login-box" class="login-box" style="display: <?php echo isset($_GET['error']) ? 'block' : 'none'; ?>;">
    <div class="box-content">
        <form id="login-form" class="form" action="process_login.php" method="POST">
            <input type="email" name="email" placeholder="Email" autocomplete="email" required>
            <input type="password" name="password" placeholder="Password" autocomplete="current-password" required>
            <button type="submit">Login</button>
            <?php if (isset($_GET['error'])): ?>
                <p class="error">
                    <?php 
                    switch ($_GET['error']) {
                        case 'invalid':
                            echo "Invalid email or password.";
                            break;
                        case 'notfound':
                            echo "No account found with this email.";
                            break;
                    }
                    ?>
                </p>
            <?php endif; ?>
            <p>Don't have an account? <a href="register.php">Register here</a></p>
        </form>
    </div>
</div>

<script src="assets/js/navbar.js"></script>