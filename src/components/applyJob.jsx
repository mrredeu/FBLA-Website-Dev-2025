import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import "../assets/css/applyjob.css";

// ApplyJob component to handle job application process
const ApplyJob = () => {
  // Extract job ID from URL parameters
  const { jobId } = useParams();
  const navigate = useNavigate();
  // State variables
  const [job, setJob] = useState(null);
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [attachmentsRequired, setAttachmentsRequired] = useState([]);
  const [answers, setAnswers] = useState({});
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);

  // useEffect hook to fetch job details on component mount
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // Check if student is logged in
        const email = localStorage.getItem("email");
        if (!email) {
          alert("Please log in as a student to apply.");
          navigate("/login");
          return;
        }

        // Retrieve job details, attachments, and survey questions from API
        const response = await fetch(
          "/api/manage-job-application.php?action=getJobDetails",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobId, email, status: "student" }),
          }
        );

        const data = await response.json();
        if (data.success && data.job) {
          // Update state with fetched data
          setJob(data.job);
          setSurveyQuestions(data.surveyQuestions || []);
          setAttachmentsRequired(data.attachments || []);
        } else {
          alert(data.message || "Failed to fetch job details.");
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, navigate]);

  // Handle changes in the text fields for each question
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Handle changes in file inputs
  const handleFileChange = (attachmentId, file) => {
    setFiles((prev) => ({
      ...prev,
      [attachmentId]: file,
    }));
  };

  // Submit the form along with files
  const handleSubmitApplication = async (e) => {
    e.preventDefault();

    const studentEmail = localStorage.getItem("email");
    if (!studentEmail) {
      alert("Please log in as a student to apply.");
      return;
    }

    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("studentEmail", studentEmail);

    // Include survey responses
    surveyQuestions.forEach((q) => {
      const questionId = q.id;
      const answer = answers[questionId] || "";
      formData.append(`responses[${questionId}]`, answer);
    });

    // Append files based on attachments
    attachmentsRequired.forEach((att) => {
      const file = files[att.id];
      if (file) {
        formData.append(`attachments[${att.id}]`, file);
      }
    });

    try {
      const response = await fetch("/api/apply-job.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        alert("Application submitted successfully!");
        navigate("/jobs-list");
      } else {
        alert(result.message || "Failed to submit application.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="applyjob-container">
          <h2>Loading job details...</h2>
        </div>
      </>
    );
  }

  // Job not found or error occurred
  if (!job) {
    return (
      <>
        <Navbar />
        <div className="applyjob-container">
          <h2>Job not found or an error occurred.</h2>
        </div>
      </>
    );
  }

  // Render the application form
  return (
    <>
      <Navbar />
      <div className="applyjob-container">
        <h1>Apply for {job.title}</h1>
        <p>
          <strong>Location:</strong> {job.location}
        </p>
        <p>
          <strong>Description:</strong> {job.description}
        </p>
        <p>
          <strong>Pay:</strong> {job.pay}
        </p>

        {/* Application Form */}
        <form onSubmit={handleSubmitApplication} encType="multipart/form-data">
          {/* Survey Questions */}
          {surveyQuestions.length > 0 && (
            <>
              <h2>Survey Questions</h2>
              {surveyQuestions.map((question) => (
                <div key={question.id} className="applyjob-question">
                  <label>
                    {question.question_text} (Limit:{" "}
                    {(answers[question.id] || "").length}/
                    {question.character_limit})
                  </label>
                  <textarea
                    value={answers[question.id] || ""}
                    onChange={(e) =>
                      handleAnswerChange(question.id, e.target.value)
                    }
                    placeholder="Your answer..."
                    rows={3}
                    required
                    maxLength={question.character_limit}
                  />
                </div>
              ))}
            </>
          )}

          {/* Attachment Requirements */}
          {attachmentsRequired.length > 0 && (
            <>
              <h2>Attachments</h2>
              {attachmentsRequired.map((att) => (
                <div key={att.id} className="applyjob-attachment">
                  <label htmlFor={`attachment-${att.id}`}>
                    Please upload: {att.title}
                  </label>
                  <input
                    id={`attachment-${att.id}`}
                    type="file"
                    onChange={(e) =>
                      handleFileChange(att.id, e.target.files[0])
                    }
                    required
                  />
                </div>
              ))}
            </>
          )}

          {/* Submit Button */}
          <button type="submit" className="applyjob-submitButton">
            Submit Application
          </button>
        </form>
      </div>
    </>
  );
};

export default ApplyJob;
