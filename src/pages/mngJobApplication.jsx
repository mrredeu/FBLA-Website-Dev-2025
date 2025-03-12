import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import "../assets/css/mngJobApplication.css";
import ViewJobDetails from "../components/mngJobDetails.jsx";

const ManageJobApplications = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/manage-job-application.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (data.success) {
          setJobs(data.jobs || []);
        } else {
          alert(data.message || "Failed to fetch job applications.");
        }
      } catch (error) {
        console.error("Error fetching job applications:", error);
      }
    };

    if (email) {
      fetchJobs();
    } else {
      alert("Employer email not found. Please log in again.");
    }
  }, [email]);

  const handleViewApplications = (jobId) => {
    setSelectedJobId(jobId);
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this posting?")) {
      try {
        const response = await fetch(
          "/api/manage-job-application.php?action=deleteJob",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "deleteJob", email, jobId }),
          }
        );
        const data = await response.json();
        if (data.success) {
          alert("Job deleted successfully!");
          setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
        } else {
          alert(data.message || "Failed to delete job.");
        }
      } catch (error) {
        console.error("Error deleting posting:", error);
      }
    }
  };

  // Show ViewJobDetails if a job is selected
  if (selectedJobId) {
    return (
      <ViewJobDetails
        jobId={selectedJobId}
        onBack={() => setSelectedJobId(null)}
      />
    );
  }

  return (
    <>
      <Navbar />
      <div className="manage-jobs-container">
        <h1>Manage Job Postings</h1>
        <div className="manage-jobs-actions">
          <button
            className="create-application-btn"
            onClick={() => (window.location.href = "/submit-job-application")}
          >
            Create Posting
          </button>
        </div>
        {jobs.length > 0 ? (
          <div className="jobs-list">
            {jobs.map((job) => (
              <div key={job.id} className="job-card">
                <h2>
                  {job.title}{" "}
                  <span
                    className={
                      job.is_approved === 0 ? "status-pending" : "status-open"
                    }
                  >
                    ({job.is_approved === 0 ? "Pending" : "Open"})
                  </span>
                </h2>
                <p>
                  <strong>Location:</strong> {job.location}
                </p>
                <p>
                  <strong>Description:</strong> {job.description}
                </p>
                <p>
                  <strong>Pay:</strong> {job.pay}
                </p>
                <div className="job-card-actions">
                  <button
                    className="view-applications-btn"
                    onClick={() => handleViewApplications(job.id)}
                  >
                    View Posting
                  </button>
                  <button
                    className="delete-job-btn"
                    onClick={() => handleDeleteJob(job.id)}
                  >
                    Delete Posting
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No job applications to manage at the moment.</p>
        )}
      </div>
    </>
  );
};

export default ManageJobApplications;
