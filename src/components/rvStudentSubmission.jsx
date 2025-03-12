import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import styles from "../assets/css/rvStudentSubmission.module.css";

const JobSubmissionDetails = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add helper function to format date as MM/DD/YYYY, HH:mm
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    return `${month}/${day}/${year} - ${hours}:${minutes}`;
  };

  useEffect(() => {
    // Possibly check if employer is logged in
    const employerEmail = localStorage.getItem("email");
    if (!employerEmail) {
      alert("Please log in as an employer.");
      navigate("/login-mobile");
      return;
    }

    const fetchSubmissionDetails = async () => {
      try {
        const response = await fetch(
          `/api/job-submissions.php?action=getSubmissionDetails&appId=${applicationId}`
        );
        const data = await response.json();
        if (data.success) {
          setSubmission(data.submission);
        } else {
          alert(data.message || "Failed to load submission details.");
        }
      } catch (error) {
        console.error("Error fetching submission details:", error);
        alert("An error occurred while loading the submission details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissionDetails();
  }, [applicationId, navigate]);

  if (loading) {
    return <div>Loading submission details...</div>;
  }

  if (!submission) {
    return <div>Submission not found or an error occurred.</div>;
  }

  const {
    jobTitle,
    studentName,
    studentEmail,
    created_at,
    answers,
    attachments,
  } = submission;

  return (
    <>
      <Navbar />
      <div className={styles.submissionDetailsContainer}>
        <h1 className={styles.submissionDetailsTitle}>Submission Details</h1>
        <p className={styles.submissionDetailsText}>
          <strong>Job:</strong> {jobTitle}
        </p>
        <p className={styles.submissionDetailsText}>
          <strong>Student Name:</strong> {studentName}
        </p>
        <p className={styles.submissionDetailsText}>
          <strong>Student Email:</strong> {studentEmail}
        </p>
        <p className={styles.submissionDetailsText}>
          <strong>Submitted At:</strong> {formatDate(created_at)}
        </p>

        <h2 className={styles.submissionDetailsSubtitle}>Survey Answers</h2>
        {answers && answers.length > 0 ? (
          <table className={styles.submissionDetailsTable}>
            <thead>
              <tr>
                <th className={styles.submissionDetailsTableHeader}>
                  Question
                </th>
                <th className={styles.submissionDetailsTableHeader}>Answer</th>
              </tr>
            </thead>
            <tbody>
              {answers.map((ans) => (
                <tr key={ans.question_id}>
                  <td className={styles.submissionDetailsTableCell}>
                    {ans.question_text}
                  </td>
                  <td className={styles.submissionDetailsTableCell}>
                    {ans.answer_text}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.submissionDetailsText}>No answers recorded.</p>
        )}

        <h2 className={styles.submissionDetailsSubtitle}>Attachments</h2>
        {attachments && attachments.length > 0 ? (
          <ul className={styles.submissionDetailsList}>
            {attachments.map((file) => (
              <li key={file.id} className={styles.submissionDetailsListItem}>
                {file.title && (
                  <span className={styles.attachmentTitle}>{file.title}: </span>
                )}
                <a
                  href={`/api/uploads/${file.saved_path}`}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.submissionDetailsLink}
                >
                  {file.original_filename}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.submissionDetailsText}>No attachments.</p>
        )}

        <button
          className={styles.submissionDetailsButton}
          onClick={() => navigate(-1)}
        >
          Back to Submissions
        </button>
      </div>
    </>
  );
};

export default JobSubmissionDetails;
