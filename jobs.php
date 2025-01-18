<?php
session_start();
require 'db.php'; // Include database connection

// Fetch approved jobs from the database
$query = $pdo->query("SELECT id, title, location, description, pay FROM jobs WHERE is_approved = 1");
$jobs = $query->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Job Listings</title>
    <link rel="stylesheet" href="assets/css/jobs.css">
</head>
<body>
    <?php include 'navbar.php'; ?>
    
    <div class="container-jobs">
        <h1>Available Jobs</h1>

        <?php foreach ($jobs as $job): ?>
            <div class="job-listing">
                <h2><?= htmlspecialchars($job['title']) ?></h2>
                <p><strong>Location:</strong> <?= htmlspecialchars($job['location']) ?></p>
                <p><strong>Description:</strong> <?= htmlspecialchars($job['description']) ?></p>
                <p><strong>Pay:</strong> <?= htmlspecialchars($job['pay']) ?></p>
                <?php if (isset($_SESSION['role']) && $_SESSION['role'] === 'student'): ?>
                    <button onclick="applyForJob(<?= $job['id'] ?>)">Apply Now</button>
                <?php elseif (isset($_SESSION['user_id'])): ?>
                    <button disabled>Only students can apply</button>
                <?php else: ?>
                    <button disabled>Please log in to apply</button>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>
    </div>
</body>
</html>
