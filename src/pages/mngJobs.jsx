import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import "../assets/css/mngJobs.css";

const ReviewJobs = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  // Fetch all pending jobs with minimal details
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/review-jobs.php");
        const data = await response.json();
        setJobs(data.jobs || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const handleReview = (job) => {
    // Navigate to the detailed review page, passing the job details in state
    navigate("/review-job-details", { state: { job } });
  };

  return (
    <>
      <Navbar />
      <div className="rvjobs-container">
        <h1>Review Job Postings</h1>

        {/* List of jobs */}
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.id} className="rvjobs-card">
              <h2>{job.title}</h2>
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                <strong>Pay:</strong> {job.pay}
              </p>
              <p>
                <strong>Poster:</strong> {job.username} ({job.poster_email})
              </p>
              <button
                onClick={() => handleReview(job)}
                className="review-button"
              >
                Review
              </button>
            </div>
          ))
        ) : (
          <p>No jobs to review at the moment.</p>
        )}
      </div>
    </>
  );
};

export default ReviewJobs;
