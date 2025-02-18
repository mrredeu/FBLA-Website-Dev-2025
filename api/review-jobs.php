<?php
require 'db.php';
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

            // Fetch attachments
            $stmt = $pdo->prepare("SELECT title FROM attachments WHERE job_id = ?");
            $stmt->execute([$job['id']]);
            $job['attachments'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        echo json_encode(["jobs" => $jobs]);
    } elseif ($action === 'approve' || $action === 'deny') {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? 0;
        $status = $action === 'approve' ? 1 : -1;

        $stmt = $pdo->prepare("UPDATE jobs SET is_approved = ? WHERE id = ?");
        $stmt->execute([$status, $id]);

        echo json_encode(["success" => true]);
    }
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
