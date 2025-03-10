import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import "../assets/css/mngJobs.css";

const ReviewJobDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.job) {
    navigate("/review-job-listings");
    return null;
  }

  const { job } = state;

  const handleApprove = async () => {
    try {
      const response = await fetch("/api/review-jobs.php?action=approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: job.id }),
      });
      const result = await response.json();
      if (result.success) {
        alert("Job approved successfully!");
        navigate("/review-job-listings");
      } else {
        alert(result.message || "Failed to approve the job.");
      }
    } catch (error) {
      console.error("Error approving job:", error);
    }
  };

  const handleDeny = async () => {
    try {
      const response = await fetch("/api/review-jobs.php?action=deny", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: job.id }),
      });
      const result = await response.json();
      if (result.success) {
        alert("Job denied successfully!");
        navigate("/review-jobs"); // Redirect back after denial
      } else {
        alert(result.message || "Failed to deny the job.");
      }
    } catch (error) {
      console.error("Error denying job:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="rjd-container">
        <div className="rjd-card">
          <h2 className="rjd-job-title">Company: {job.title}</h2>
          <p>
            <strong>Location:</strong> {job.location}
          </p>
          <p>
            <strong>Description:</strong> {job.description}
          </p>
          <p>
            <strong>Pay:</strong> {job.pay}
          </p>
          <p>
            <strong>Poster:</strong> {job.poster_email}
          </p>
          <div className="rjd-section">
            <h3 className="rjd-section-title">Survey Questions</h3>
            {job.questions.length > 0 ? (
              <ul className="rjd-list">
                {job.questions.map((q, index) => (
                  <li key={index} className="rjd-list-item">
                    {q.question_text} (Limit: {q.character_limit || "No limit"})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rjd-no-data">No survey questions provided.</p>
            )}
          </div>
          <div className="rjd-section">
            <h3 className="rjd-section-title">Attachments</h3>
            {job.attachments.length > 0 ? (
              <ul className="rjd-list">
                {job.attachments.map((a, index) => (
                  <li key={index} className="rjd-list-item">
                    {a.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rjd-no-data">No attachments provided.</p>
            )}
          </div>
          <div className="rjd-actions">
            <button onClick={handleApprove} className="rjd-approve-btn">
              Approve
            </button>
            <button onClick={handleDeny} className="rjd-deny-btn">
              Deny
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewJobDetails;
