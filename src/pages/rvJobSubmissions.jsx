import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import "../assets/css/rvJobSubmissions.css";

const JobSubmissionsList = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (applicationId) => {
    if (!window.confirm("Are you sure you want to delete this submission?"))
      return;
    try {
      const response = await fetch(
        `/api/job-submissions.php?action=delete&applicationId=${applicationId}`,
        { method: "POST" }
      );
      const data = await response.json();
      if (data.success) {
        setSubmissions((prev) =>
          prev.filter(
            (submission) => submission.applicationId !== applicationId
          )
        );
      } else {
        alert(data.message || "Failed to delete submission.");
      }
    } catch (error) {
      console.error("Error deleting submission:", error);
      alert("An error occurred while deleting submission.");
    }
  };

  useEffect(() => {
    const employerEmail = localStorage.getItem("email");
    if (!employerEmail) {
      alert("Please log in as an employer.");
      navigate("/login");
      return;
    }

    const fetchSubmissions = async () => {
      try {
        const response = await fetch(
          `/api/job-submissions.php?action=listByEmployer&email=${encodeURIComponent(
            employerEmail
          )}`
        );
        const data = await response.json();
        if (data.success) {
          setSubmissions(data.submissions || []);
        } else {
          alert(data.message || "Failed to load submissions.");
        }
      } catch (error) {
        console.error("Error fetching submissions:", error);
        alert("An error occurred while fetching submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [navigate]);

  if (loading) {
    return <div>Loading job submissions...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="rv-job-submission-container">
        <h1 className="rv-job-submission-title">Job Submissions</h1>
        {submissions.length === 0 ? (
          <p>No submissions submitted yet.</p>
        ) : (
          <table className="rv-job-submission-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Student Email</th>
                <th>Job Position</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.applicationId}>
                  <td>{submission.studentName}</td>
                  <td>{submission.studentEmail}</td>
                  <td>{submission.jobTitle}</td>
                  <td style={{ textAlign: "center" }}>
                    <div className="rv-job-submission-actions">
                      <button
                        className="rv-job-submission-button"
                        onClick={() =>
                          navigate(
                            `/submission-details/${submission.applicationId}`
                          )
                        }
                      >
                        Review
                      </button>
                      <button
                        className="rv-job-submission-delete-button"
                        onClick={() => handleDelete(submission.applicationId)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default JobSubmissionsList;
