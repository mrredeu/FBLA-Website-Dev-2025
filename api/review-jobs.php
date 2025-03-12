<?php
require 'db.php';
require 'email.php';
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

try {
    if ($action === '') {
        $stmt = $pdo->query("SELECT * FROM jobs WHERE is_approved = 0");
        $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($jobs as &$job) {
            // Fetch survey questions
            $stmt = $pdo->prepare("SELECT question_text, character_limit FROM survey_questions WHERE job_id = ?");
            $stmt->execute([$job['id']]);
            $job['questions'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Fetch attachments for each job
            $stmt = $pdo->prepare("SELECT title FROM attachments WHERE job_id = ?");
            $stmt->execute([$job['id']]);
            $job['attachments'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        echo json_encode(["jobs" => $jobs]);
    } elseif ($action === 'approve' || $action === 'deny') {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? 0;

        if ($action === 'approve') {
            // Fetch job details prior to updating
            $stmtDetails = $pdo->prepare("SELECT poster_email, title FROM jobs WHERE id = ?");
            $stmtDetails->execute([$id]);
            $jobDetails = $stmtDetails->fetch(PDO::FETCH_ASSOC);
        }

        $status = $action === 'approve' ? 1 : -1;
        $stmt = $pdo->prepare("UPDATE jobs SET is_approved = ? WHERE id = ?");
        $stmt->execute([$status, $id]);

        if ($action === 'approve' && $jobDetails) {
            $subject = "Job Posting Approved";
            $body = "
                <h2 style='color:#FE9B22;'>Job Posting Approved</h2>
                <p>Your job posting '<strong>{$jobDetails['title']}</strong>' has been approved and is now visible to the public.</p>
                <p>Visit our website to see your posting live!</p>
                <br>
                <p>Best regards,</p>
                <p>Beehive Science & Technology Academy</p>
            ";
            sendEmail($jobDetails['poster_email'], $subject, $body);
        }

        echo json_encode(["success" => true]);
    }
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
