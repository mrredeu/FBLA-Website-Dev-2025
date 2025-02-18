import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import "../assets/css/jobslist.css";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  // Fetch jobs from the backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/jobs.php");
        const data = await response.json();
        setJobs(data.jobs || []);
        setUserRole(data.role || null);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  // Instead of calling a direct backend endpoint, we navigate to "/apply/:jobId"
  const handleApplyClick = (jobId) => {
    // If not logged in or not a student, handle accordingly
    const studentEmail = localStorage.getItem("email");
    if (!studentEmail || userRole !== "student") {
      alert("Please log in as a student to apply.");
      return;
    }
    // Navigate to the ApplyJob page, passing the jobId
    navigate(`/apply/${jobId}`);
  };

  return (
    <>
      <Navbar />

      <section className="jobslist-section">
        <div className="jobslist-container">
          <h1>Available Jobs</h1>

          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="jobslist-jobListing">
                <h2>{job.title}</h2>
                <p>
                  <strong>Location:</strong> {job.location}
                </p>
                <p>
                  <strong>Description:</strong> {job.description}
                </p>
                <p>
                  <strong>Pay:</strong> {job.pay}
                </p>

                {userRole === "student" ? (
                  <button
                    onClick={() => handleApplyClick(job.id)}
                    className="jobslist-applyButton"
                  >
                    Apply Now
                  </button>
                ) : userRole ? (
                  <button disabled className="jobslist-disabledButton">
                    Only students can apply
                  </button>
                ) : (
                  <button disabled className="jobslist-disabledButton">
                    Please log in to apply
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No jobs available at the moment.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Jobs;
