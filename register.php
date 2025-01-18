<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - Beehive Job Portal</title>
    <link rel="stylesheet" href="assets/css/register.css">
</head>
<body>
    <?php include 'navbar.php'; ?>

    <!-- Registration Form -->
    <section class="register">
        <div class="container">
            <h1>Create an Account</h1>
            <form action="process_register.php" method="POST">
                <label for="full-name">Full Name</label>
                <input type="text" id="full-name" name="full_name" required autocomplete="off">

                <label for="email">Email</label>
                <input type="email" id="email" name="email" required autocomplete="off">

                <label for="password">Password</label>
                <input type="password" id="password" name="password" required autocomplete="off">

                <label for="role">Register As:</label>
                <select id="role" name="role">
                    <option value="student">Student</option>
                    <option value="employer">Employer</option>
                </select>

                <button type="submit">Register</button>
            </form>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2024 Beehive Science & Technology Academy</p>
        </div>
    </footer>
</body>
</html>
