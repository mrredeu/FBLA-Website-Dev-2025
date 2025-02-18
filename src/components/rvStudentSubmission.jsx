import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

const JobSubmissionDetails = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Possibly check if employer is logged in
    const employerEmail = localStorage.getItem("email");
    if (!employerEmail) {
      alert("Please log in as an employer.");
      navigate("/login");
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
      <div style={{ padding: "20px" }}>
        <h1>Submission Details</h1>
        <p>
          <strong>Job Position:</strong> {jobTitle}
        </p>
        <p>
          <strong>Student Name:</strong> {studentName}
        </p>
        <p>
          <strong>Student Email:</strong> {studentEmail}
        </p>
        <p>
          <strong>Submitted At:</strong> {created_at}
        </p>

        <h2>Survey Answers</h2>
        {answers && answers.length > 0 ? (
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th
                  style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}
                >
                  Question
                </th>
                <th
                  style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}
                >
                  Answer
                </th>
              </tr>
            </thead>
            <tbody>
              {answers.map((ans) => (
                <tr key={ans.question_id}>
                  <td
                    style={{ padding: "8px", borderBottom: "1px solid #eee" }}
                  >
                    {ans.question_text}
                  </td>
                  <td
                    style={{ padding: "8px", borderBottom: "1px solid #eee" }}
                  >
                    {ans.answer_text}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No answers recorded.</p>
        )}

        <h2>Attachments</h2>
        {attachments && attachments.length > 0 ? (
          <ul>
            {attachments.map((file) => (
              <li key={file.id}>
                <a
                  href={`/uploads/${file.saved_path}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {file.original_filename}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No attachments.</p>
        )}

        <button onClick={() => navigate(-1)}>Back to Submissions</button>
      </div>
    </>
  );
};

export default JobSubmissionDetails;
