<?php
require 'db.php'; // Your PDO instance
header('Content-Type: application/json');

$response = ["success" => false, "message" => ""];

// Determine the action from the query parameters
$action = $_GET['action'] ?? '';

try {
    if ($action === 'listByEmployer') {
        $employerEmail = $_GET['email'] ?? '';

        if (empty($employerEmail)) {
            $response["message"] = "Missing employer email.";
            echo json_encode($response);
            exit;
        }

        // Fetch all applications for jobs where poster_email = $employerEmail
        // This joins job_applications -> jobs -> users to get the student's name
        $sql = "
            SELECT
                a.id AS applicationId,
                j.title AS jobTitle,
                a.student_email AS studentEmail,
                IFNULL(u.full_name, a.student_email) AS studentName,
                a.created_at AS submittedAt
            FROM job_applications a
            JOIN jobs j ON a.job_id = j.id
            LEFT JOIN users u ON a.student_email = u.email
            WHERE j.poster_email = :posterEmail
            ORDER BY a.created_at DESC
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':posterEmail' => $employerEmail]);
        $submissions = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $response["success"] = true;
        $response["submissions"] = $submissions;
        echo json_encode($response);
        exit;
    } elseif ($action === 'getSubmissionDetails') {
        // Example: GET /job-submissions.php?action=getSubmissionDetails&appId=123
        $appId = $_GET['appId'] ?? '';

        if (empty($appId)) {
            $response["message"] = "Missing application ID.";
            echo json_encode($response);
            exit;
        }

        // 1) Fetch the main application record + job + user data
        // This gives us jobTitle, student info, etc.
        $sqlApp = "
            SELECT
                a.id AS applicationId,
                j.title AS jobTitle,
                a.student_email AS studentEmail,
                IFNULL(u.full_name, a.student_email) AS studentName,
                a.created_at AS submittedAt
            FROM job_applications a
            JOIN jobs j ON a.job_id = j.id
            LEFT JOIN users u ON a.student_email = u.email
            WHERE a.id = :appId
            LIMIT 1
        ";
        $stmtApp = $pdo->prepare($sqlApp);
        $stmtApp->execute([':appId' => $appId]);
        $appRow = $stmtApp->fetch(PDO::FETCH_ASSOC);

        if (!$appRow) {
            $response["message"] = "Application not found.";
            echo json_encode($response);
            exit;
        }

        // 2) Fetch the survey answers with question text
        $sqlAns = "
            SELECT
                aa.question_id,
                q.question_text,
                aa.answer_text
            FROM job_application_answers aa
            JOIN survey_questions q ON aa.question_id = q.id
            WHERE aa.application_id = :appId
        ";
        $stmtAns = $pdo->prepare($sqlAns);
        $stmtAns->execute([':appId' => $appId]);
        $answers = $stmtAns->fetchAll(PDO::FETCH_ASSOC);

        // 3) Fetch any file attachments for this application
        $sqlFiles = "
            SELECT
                f.id,
                f.original_filename,
                f.saved_path,
                f.created_at
            FROM job_application_files f
            WHERE f.application_id = :appId
        ";
        $stmtFiles = $pdo->prepare($sqlFiles);
        $stmtFiles->execute([':appId' => $appId]);
        $attachments = $stmtFiles->fetchAll(PDO::FETCH_ASSOC);

        // 4) Build final response structure
        $response["success"] = true;
        $response["submission"] = [
            "applicationId" => $appRow["applicationId"],
            "jobTitle"      => $appRow["jobTitle"],
            "studentEmail"  => $appRow["studentEmail"],
            "studentName"   => $appRow["studentName"],
            "created_at"    => $appRow["submittedAt"],
            "answers"       => $answers,
            "attachments"   => $attachments
        ];

        echo json_encode($response);
        exit;
    } elseif ($action === 'delete') {
        $applicationId = $_GET['applicationId'] ?? '';
        if (empty($applicationId)) {
            $response["message"] = "Missing application ID.";
            echo json_encode($response);
            exit;
        }
        $sqlDelete = "DELETE FROM job_applications WHERE id = :appId";
        $stmtDelete = $pdo->prepare($sqlDelete);
        $stmtDelete->execute([':appId' => $applicationId]);
        if ($stmtDelete->rowCount() > 0) {
            $response["success"] = true;
            $response["message"] = "Submission deleted successfully.";
        } else {
            $response["message"] = "Failed to delete submission.";
        }
        echo json_encode($response);
        exit;
    } else {
        $response["message"] = "Invalid action.";
        echo json_encode($response);
    }
} catch (PDOException $e) {
    $response["message"] = "Database error: " . $e->getMessage();
    echo json_encode($response);
}
