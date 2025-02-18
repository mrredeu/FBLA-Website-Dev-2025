<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = 'localhost';  // The host for MySQL
$db = 'job_portal';   // The database name
$user = 'root';       // Root user (default for MySQL)
$pass = '';           // No password for local setup

try {
    // Create a PDO connection
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Pre-hash the admin password
    $adminPassword = password_hash('a1b2c3d4z5', PASSWORD_BCRYPT);

    // Insert the default admin user
    $adminQuery = "
        INSERT INTO users (full_name, email, password, role, is_approved)
        VALUES (:full_name, :email, :password, :role, :is_approved)
        ON DUPLICATE KEY UPDATE email = email;
    ";
    $stmt = $pdo->prepare($adminQuery);
    $stmt->bindValue(':full_name', 'Admin User');
    $stmt->bindValue(':email', 'bee_admin@beehiveacademy.org');
    $stmt->bindValue(':password', $adminPassword);
    $stmt->bindValue(':role', 'admin');
    $stmt->bindValue(':is_approved', 1);
    $stmt->execute();

    // Insert default jobs only if they do not already exist
    $jobs = [
        [
            'title' => 'Crew Member - McDonald\'s',
            'location' => 'Sandy, Utah',
            'description' => 'Join our team at McDonald\'s in Sandy, Utah! As a Crew Member, you will assist with food preparation, customer service, maintaining cleanliness, and ensuring a great guest experience.',
            'pay' => '$15/hour',
            'is_approved' => 1,
            'poster_email' => 'pashaflash211@gmail.com',
            'username' => 'Pasha Naruta'
        ],
        [
            'title' => 'Software Developer - Tech Inc.',
            'location' => 'New York City, New York',
            'description' => 'Remote job. Develop and maintain cutting-edge software solutions. Collaborate with teams to deliver high-quality code and meet deadlines.',
            'pay' => '$17/hour',
            'is_approved' => 1,
            'poster_email' => 'pashaflash211@gmail.com',
            'username' => 'Pasha Naruta'
        ],
        [
            'title' => 'Data Analyst - Big Data Solutions',
            'location' => 'San Francisco, California',
            'description' => 'Remote job. Analyze complex datasets, generate actionable insights, and create visual reports to support business decisions.',
            'pay' => '$25/hour',
            'is_approved' => 1,
            'poster_email' => 'pashaflash211@gmail.com',
            'username' => 'Pasha Naruta'
        ],
        [
            'title' => 'System Administrator - Adobe',
            'location' => 'Lehi, Utah',
            'description' => 'Monitor, maintain, and troubleshoot IT systems to ensure smooth operation. Support cloud infrastructure management.',
            'pay' => '$21/hour',
            'is_approved' => 1,
            'poster_email' => 'pashaflash211@gmail.com',
            'username' => 'Pasha Naruta'
        ]
    ];

    foreach ($jobs as $job) {
        $jobsQuery = "
            INSERT INTO jobs (title, location, description, pay, is_approved, poster_email, username)
            SELECT :title, :location, :description, :pay, :is_approved, :poster_email, :username
            FROM DUAL
            WHERE NOT EXISTS (
                SELECT 1 FROM jobs WHERE title = :title
            );
        ";
        $stmt = $pdo->prepare($jobsQuery);
        $stmt->bindValue(':title', $job['title']);
        $stmt->bindValue(':location', $job['location']);
        $stmt->bindValue(':description', $job['description']);
        $stmt->bindValue(':pay', $job['pay']);
        $stmt->bindValue(':is_approved', $job['is_approved']);
        $stmt->bindValue(':poster_email', $job['poster_email']);
        $stmt->bindValue(':username', $job['username']);
        $stmt->execute();
    }
} catch (PDOException $e) {
    // Handle errors
    die("Database error: " . $e->getMessage());
}
