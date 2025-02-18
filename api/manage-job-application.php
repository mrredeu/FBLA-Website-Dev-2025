<?php
require 'db.php';
header('Content-Type: application/json');

$response = ["success" => false, "message" => ""];

// Get the action from the query parameter
$action = $_GET['action'] ?? '';

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Decode JSON input
        $input = json_decode(file_get_contents('php://input'), true);
        $email = $input['email'] ?? null;

        if (!$email) {
            $response["message"] = "Employer email is required.";
            echo json_encode($response);
            exit;
        }

        if ($action === '') {
            // -----------------------------------
            // FETCH JOB LISTINGS
            // -----------------------------------
            $stmt = $pdo->prepare("SELECT id, title, location, description, pay
                                   FROM jobs
                                   WHERE poster_email = ?");
            $stmt->execute([$email]);
            $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $response["success"] = true;
            $response["jobs"] = $jobs;
        } elseif ($action === 'deleteJob') {
            // -----------------------------------
            // DELETE A JOB
            // -----------------------------------
            $jobId = $input['jobId'] ?? null;
            error_log("======================= $jobId");

            if (!$jobId) {
                $response["message"] = "Job ID is required to delete a job.";
                echo json_encode($response);
                exit;
            }

            $pdo->beginTransaction();

            try {
                $stmt = $pdo->prepare("SELECT id FROM jobs WHERE id = ? AND poster_email = ?");
                $stmt->execute([$jobId, $email]);
                $job = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!$job) {
                    $pdo->rollBack();
                    $response["message"] = "Job not found or you do not have permission to delete it.";
                    echo json_encode($response);
                    exit;
                }

                // Delete files from server
                $stmt = $pdo->prepare("SELECT file_path FROM attachments WHERE job_id = ?");
                $stmt->execute([$jobId]);
                $attachments = $stmt->fetchAll(PDO::FETCH_ASSOC);

                foreach ($attachments as $attachment) {
                    if (file_exists($attachment['file_path'])) {
                        unlink($attachment['file_path']);
                    }
                }

                // Delete related data
                $stmt = $pdo->prepare("DELETE FROM survey_questions WHERE job_id = ?");
                $stmt->execute([$jobId]);

                $stmt = $pdo->prepare("DELETE FROM attachments WHERE job_id = ?");
                $stmt->execute([$jobId]);

                // Finally, delete the job record itself
                $stmt = $pdo->prepare("DELETE FROM jobs WHERE id = ? AND poster_email = ?");
                $stmt->execute([$jobId, $email]);

                if ($stmt->rowCount() > 0) {
                    $pdo->commit();
                    $response["success"] = true;
                    $response["message"] = "Job and all related data deleted successfully.";
                } else {
                    $pdo->rollBack();
                    $response["message"] = "Failed to delete job.";
                }
            } catch (Exception $e) {
                $pdo->rollBack();
                $response["message"] = "An error occurred: " . $e->getMessage();
            }
        } elseif ($action === 'getJobDetails') {
            // -----------------------------------
            // GET A JOB'S DETAILS
            // -----------------------------------
            $jobId = $input['jobId'] ?? null;
            $status = $input['status'] ?? null;

            if (!$jobId || !$email) {
                $response["message"] = "Job ID and employer email are required.";
                echo json_encode($response);
                exit;
            }

            // Depending on the status, handle different conditions
            if ($status === 'employer') {
                // Employers must pass their email.
                if (!$email) {
                    $response["message"] = "Employer email is required for employer status.";
                    echo json_encode($response);
                    exit;
                }

                // Fetch job details only if it belongs to this employer
                $stmt = $pdo->prepare("SELECT id, title, location, description, pay
                               FROM jobs
                               WHERE id = ? AND poster_email = ?");
                $stmt->execute([$jobId, $email]);
            } elseif ($status === 'student') {
                // Fetch job details (possibly add `AND is_published = 1` if needed)
                $stmt = $pdo->prepare("SELECT id, title, location, description, pay
                               FROM jobs
                               WHERE id = ?");
                $stmt->execute([$jobId]);
            } else {
                // Handle invalid or missing status
                $response["message"] = "Invalid status. Must be 'employer' or 'student'.";
                echo json_encode($response);
                exit;
            }
            $job = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($job) {
                // Fetch survey questions related to this job
                $stmt = $pdo->prepare("SELECT id, question_text
                                        FROM survey_questions
                                        WHERE job_id = ?");
                $stmt->execute([$jobId]);
                $surveyQuestions = $stmt->fetchAll(PDO::FETCH_ASSOC);

                // Fetch attachments related to this job
                $stmt = $pdo->prepare("SELECT id, title, file_path
                                        FROM attachments
                                        WHERE job_id = ?");
                $stmt->execute([$jobId]);
                $attachments = $stmt->fetchAll(PDO::FETCH_ASSOC);

                $response["success"] = true;
                $response["job"] = $job;
                $response["surveyQuestions"] = $surveyQuestions;
                $response["attachments"] = $attachments;
            } else {
                $response["message"] = "Job not found or you do not have permission to view it.";
            }
        } elseif ($action === 'updateJobDetails') {
            // -----------------------------------
            // UPDATE JOB DETAILS
            // -----------------------------------
            $jobId      = $input['jobId'] ?? null;
            $title      = $input['title'] ?? '';
            $location   = $input['location'] ?? '';
            $description = $input['description'] ?? '';
            $pay        = $input['pay'] ?? '';

            // Arrays for new questions & attachments
            $questions  = $input['questions'] ?? [];         // e.g. array of question strings
            $charLimits = $input['character_limit'] ?? [];   // e.g. array of character limits
            $attachments = $input['attachments'] ?? [];       // e.g. array of attachment titles

            if (!$jobId) {
                $response["message"] = "Job ID is required to update a job.";
                echo json_encode($response);
                exit;
            }

            $pdo->beginTransaction();

            try {
                // 1) Confirm ownership
                $stmt = $pdo->prepare("SELECT id FROM jobs WHERE id = ? AND poster_email = ?");
                $stmt->execute([$jobId, $email]);
                $job = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!$job) {
                    $pdo->rollBack();
                    $response["message"] = "Job not found or you do not have permission to update it.";
                    echo json_encode($response);
                    exit;
                }

                // 2) Update main job fields
                $stmt = $pdo->prepare("
                    UPDATE jobs
                    SET title = ?, location = ?, description = ?, pay = ?
                    WHERE id = ? AND poster_email = ?
                ");
                $stmt->execute([$title, $location, $description, $pay, $jobId, $email]);

                // 3) Replace survey questions
                $stmt = $pdo->prepare("DELETE FROM survey_questions WHERE job_id = ?");
                $stmt->execute([$jobId]);

                $stmt = $pdo->prepare("
                    INSERT INTO survey_questions (job_id, question_text, character_limit)
                    VALUES (?, ?, ?)
                ");

                foreach ($questions as $index => $questionText) {
                    $limitValue = isset($charLimits[$index]) ? $charLimits[$index] : 999999;
                    $stmt->execute([$jobId, $questionText, $limitValue]);
                }

                // 4) Replace attachments
                $stmt = $pdo->prepare("DELETE FROM attachments WHERE job_id = ?");
                $stmt->execute([$jobId]);

                $stmt = $pdo->prepare("
                    INSERT INTO attachments (job_id, title, file_path)
                    VALUES (?, ?, '')
                ");
                foreach ($attachments as $attTitle) {
                    $stmt->execute([$jobId, $attTitle]);
                }

                // Commit on success
                $pdo->commit();
                $response["success"] = true;
                $response["message"] = "Job updated successfully.";
            } catch (Exception $e) {
                // Roll back if an error occurred
                $pdo->rollBack();
                $response["message"] = "An error occurred: " . $e->getMessage();
            }
        } elseif ($action === 'apply') {
            // -----------------------------------
            // STUDENT APPLIES FOR A JOB
            // -----------------------------------
            // We expect:
            //   - jobId, 
            //   - studentEmail,
            //   - optional 'responses': array of { questionId, answer }
            $responses = $input['responses'] ?? [];

            // Basic validation
            if (!$jobId || !$studentEmail) {
                $response["message"] = "jobId and studentEmail are required to apply.";
                echo json_encode($response);
                exit;
            }

            $pdo->beginTransaction();
            try {
                // 1) Validate the job
                $stmt = $pdo->prepare("SELECT id FROM jobs WHERE id = ?");
                $stmt->execute([$jobId]);
                $jobRow = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!$jobRow) {
                    $pdo->rollBack();
                    $response["message"] = "Job not found.";
                    echo json_encode($response);
                    exit;
                }

                // 2) (Optional) Check if the student has already applied

                // 3) Insert into 'applications'
                $stmt = $pdo->prepare("
                    INSERT INTO applications (job_id, student_email, created_at)
                    VALUES (?, ?, NOW())
                ");
                $stmt->execute([$jobId, $studentEmail]);
                $applicationId = $pdo->lastInsertId();

                // 4) Insert each survey answer (if any)
                if (!empty($responses)) {
                    $answerStmt = $pdo->prepare("
                        INSERT INTO application_answers (application_id, question_id, answer)
                        VALUES (?, ?, ?)
                    ");
                    foreach ($responses as $r) {
                        $questionId = $r['questionId'] ?? null;
                        $answer     = $r['answer'] ?? '';
                        if ($questionId) {
                            $answerStmt->execute([$applicationId, $questionId, $answer]);
                        }
                    }
                }

                $pdo->commit();
                $response["success"] = true;
                $response["message"] = "Application submitted successfully.";
            } catch (Exception $e) {
                $pdo->rollBack();
                $response["message"] = "An error occurred: " . $e->getMessage();
            }
        } else {
            // -----------------------------------
            // UNKNOWN ACTION
            // -----------------------------------
            $response["message"] = "Invalid action.";
        }
    } else {
        $response["message"] = "Invalid request method.";
    }
} catch (Exception $e) {
    // Catch any unexpected top-level exceptions
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    $response["message"] = "An error occurred: " . $e->getMessage();
}

// Finally, echo out the JSON response
echo json_encode($response);
