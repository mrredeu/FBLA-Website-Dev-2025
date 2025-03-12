<?php
session_start();
require 'db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $title = $_POST['title'];
        $location = $_POST['location'];
        $description = $_POST['description'];
        $pay = $_POST['pay'];
        $questions = $_POST['questions'];
        $characterLimits = $_POST['character_limit'];
        $posterEmail = $_POST['email'];
        $username = $_POST['username'];

        $pdo->beginTransaction();

        // Insert job
        $stmt = $pdo->prepare("INSERT INTO jobs (title, location, description, pay, is_approved, poster_email, username) VALUES (?, ?, ?, ?, 0, ?, ?)");
        $stmt->execute([$title, $location, $description, $pay, $posterEmail, $username]);
        $jobId = $pdo->lastInsertId();

        // Insert questions
        foreach ($questions as $index => $questionText) {
            $charLimit = $characterLimits[$index] ?? null;
            $stmt = $pdo->prepare("INSERT INTO survey_questions (job_id, question_text, character_limit) VALUES (?, ?, ?)");
            $stmt->execute([$jobId, $questionText, $charLimit]);
        }

        // Handle attachments insertion if provided
        if (isset($_POST['attachments'])) {
            $attachments = $_POST['attachments'];
            foreach ($attachments as $attachmentTitle) {
                if (!empty($attachmentTitle)) {
                    // Updated to match new attachments table schema (no file_path column)
                    $stmt = $pdo->prepare("INSERT INTO attachments (job_id, title) VALUES (?, ?)");
                    $stmt->execute([$jobId, $attachmentTitle]);
                }
            }
        }

        $pdo->commit();
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}
