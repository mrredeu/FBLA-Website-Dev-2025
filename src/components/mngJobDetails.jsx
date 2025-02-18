import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import "../assets/css/submitapplication.css";

const LOCAL_STORAGE_KEY = "jobFormData";

const UpdateJob = ({ jobId, onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [formFields, setFormFields] = useState({
    title: "",
    location: "",
    description: "",
    pay: "",
  });

  // Fetch existing job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      const email = localStorage.getItem("email");
      if (!email) {
        alert("Email not found. Please log in again.");
        return;
      }

      try {
        const response = await fetch(
          "/api/manage-job-application.php?action=getJobDetails",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobId, email, status: "employer" }),
          }
        );
        const data = await response.json();
        console.log(data);

        if (data.success && data.job) {
          // Pull relevant fields
          const { job, surveyQuestions, attachments } = data;

          // Populate main job fields
          setFormFields({
            title: job.title || "",
            location: job.location || "",
            description: job.description || "",
            pay: job.pay || "",
          });

          // Populate questions from data.surveyQuestions
          setQuestions(
            surveyQuestions?.map((q) => ({
              text: q.question_text || "",
              charLimit: q.character_limit || 5000,
            })) || []
          );

          // Populate attachments from data.attachments
          setAttachments(
            attachments?.map((att) => ({
              title: att.title || "",
            })) || []
          );
        } else {
          alert(data.message || "Failed to fetch job details.");
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  // Optionally persist data to localStorage if you want to preserve user input on refresh
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ questions, attachments, formFields })
    );
  }, [questions, attachments, formFields]);

  const handleFormFieldChange = (field, value) => {
    setFormFields({ ...formFields, [field]: value });
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: "", charLimit: "" }]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddAttachment = () => {
    setAttachments([...attachments, { title: "" }]);
  };

  const handleRemoveAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleAttachmentChange = (index, value) => {
    const updatedAttachments = [...attachments];
    updatedAttachments[index].title = value;
    setAttachments(updatedAttachments);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("email");
    if (!email) {
      alert("Email not found. Please log in again.");
      return;
    }

    // Build the payload
    const updatedData = {
      jobId,
      email,
      title: formFields.title,
      location: formFields.location,
      description: formFields.description,
      pay: formFields.pay,
      questions: questions.map((q) => q.text),
      character_limit: questions.map((q) => q.charLimit || 5000),
      attachments: attachments.map((a) => a.title),
    };

    try {
      const response = await fetch(
        "/api/manage-job-application.php?action=updateJobDetails",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Job updated successfully!");
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        onBack && onBack();
      } else {
        alert(result.message || "Failed to update job.");
      }
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="submitapplication-container">
        <button className="back-btn" onClick={onBack}>
          Back
        </button>
        <h1>Update Job Listing</h1>
        <form onSubmit={handleUpdate}>
          <label htmlFor="title">Job Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Job title"
            required
            value={formFields.title}
            onChange={(e) => handleFormFieldChange("title", e.target.value)}
          />

          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Location: city, state"
            required
            value={formFields.location}
            onChange={(e) => handleFormFieldChange("location", e.target.value)}
          />

          <label htmlFor="description">Job Description:</label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe the job responsibilities"
            rows="5"
            required
            value={formFields.description}
            onChange={(e) =>
              handleFormFieldChange("description", e.target.value)
            }
          ></textarea>

          <label htmlFor="pay">Pay:</label>
          <input
            type="text"
            id="pay"
            name="pay"
            placeholder="Pay rate: $/hr"
            required
            value={formFields.pay}
            onChange={(e) => handleFormFieldChange("pay", e.target.value)}
          />

          <h2>Survey Questions</h2>
          {questions.map((question, index) => (
            <div key={index} className="question">
              <label>Question {index + 1}:</label>
              <input
                type="text"
                value={question.text}
                onChange={(e) =>
                  handleQuestionChange(index, "text", e.target.value)
                }
                placeholder="Enter question"
                required
              />

              <label>Character Limit:</label>
              <input
                type="number"
                value={question.charLimit}
                onChange={(e) =>
                  handleQuestionChange(index, "charLimit", e.target.value)
                }
                placeholder="Optional"
                min="1"
                max="5000"
              />

              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(index)}
                  className="remove-button"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddQuestion}>
            + Add Question
          </button>

          <h2>Attachments (Optional)</h2>
          {attachments.map((attachment, index) => (
            <div key={index} className="attachment">
              <label>Attachment Title:</label>
              <input
                type="text"
                value={attachment.title}
                onChange={(e) => handleAttachmentChange(index, e.target.value)}
                placeholder="Attachment title"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(index)}
                  className="remove-button"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddAttachment}>
            + Add Attachment
          </button>

          <button type="submit" className="submit-button">
            Update Job
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateJob;
