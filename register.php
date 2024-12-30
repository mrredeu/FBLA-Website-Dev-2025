<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - Beehive Job Portal</title>
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
            </div>
        </div>
        <nav class="navbar">
            <div class="container">
                <ul>
                    <li><a href="index.php">Home</a></li>
                    <li><a href="students/jobs.php">Job Listings</a></li>
                    <li><a href="employers/submit-job.php">Submit a Job</a></li>
                    <li><a href="login.php">Login</a></li>
                </ul>
            </div>
        </nav>
    </header>

    <!-- Registration Form -->
    <section class="register">
        <div class="container">
            <h1>Create an Account</h1>
            <form action="process_register.php" method="POST">
                <label for="full-name">Full Name</label>
                <input type="text" id="full-name" name="full_name" required>

                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>

                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>

                <label for="role">Register As:</label>
                <select id="role" name="role">
                    <option value="student">Student</option>
                    <option value="employer">Employer</option>
                </select>

                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <a href="login.php">Login here</a></p>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2024 Beehive Science & Technology Academy</p>
        </div>
    </footer>

</body>
</html>
