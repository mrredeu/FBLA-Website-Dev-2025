import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

const JobSubmissionsList = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We assume the employer's email is stored in localStorage
    const employerEmail = localStorage.getItem("email");
    if (!employerEmail) {
      alert("Please log in as an employer.");
      navigate("/login");
      return;
    }

    // Fetch the list of job submissions from the backend
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
      <div style={{ padding: "20px" }}>
        <h1>Job Submissions</h1>
        {submissions.length === 0 ? (
          <p>No submissions found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}
                >
                  Student Name
                </th>
                <th
                  style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}
                >
                  Student Email
                </th>
                <th
                  style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}
                >
                  Job Position
                </th>
                <th style={{ borderBottom: "1px solid #ccc" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.applicationId}>
                  <td style={{ padding: "8px" }}>{submission.studentName}</td>
                  <td style={{ padding: "8px" }}>{submission.studentEmail}</td>
                  <td style={{ padding: "8px" }}>{submission.jobTitle}</td>
                  <td style={{ padding: "8px", textAlign: "center" }}>
                    <button
                      onClick={() =>
                        navigate(
                          `/submission-details/${submission.applicationId}`
                        )
                      }
                    >
                      Review
                    </button>
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
