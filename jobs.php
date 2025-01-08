<?php
session_start();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Job Listings</title>
</head>
<body>
    <?php include 'navbar.php'; ?>
    
    <div class="container">
        <h1>Available Jobs</h1>

        <div class="job-listing">
            <p>Job 1: Software Developer</p>
            <?php if (isset($_SESSION['user_id'])): ?>
                <button onclick="applyForJob(1)">Apply Now</button>
            <?php else: ?>
                <button disabled>Please log in to apply</button>
            <?php endif; ?>
        </div>

        <div class="job-listing">
            <p>Job 2: Project Manager</p>
            <?php if (isset($_SESSION['user_id'])): ?>
                <button onclick="applyForJob(2)">Apply Now</button>
            <?php else: ?>
                <button disabled>Please log in to apply</button>
            <?php endif; ?>
        </div>

        <div class="job-listing">
            <p>Job 3: Data Analyst</p>
            <?php if (isset($_SESSION['user_id'])): ?>
                <button onclick="applyForJob(3)">Apply Now</button>
            <?php else: ?>
                <button disabled>Please log in to apply</button>
            <?php endif; ?>
        </div>
    </div>

    <script>
    function applyForJob(jobId) {
        alert("You have successfully applied for Job ID: " + jobId);
        // In a real scenario, you'd make an AJAX call to submit the application
    }
    
    function openLoginModal() {
        alert("Please log in or register to apply for jobs.");
    }
    </script>
</body>
</html>
