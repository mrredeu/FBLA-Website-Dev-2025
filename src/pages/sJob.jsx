import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import "../assets/css/submitapplication.css";

const LOCAL_STORAGE_KEY = "jobFormData";

const SubmitApplication = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    return savedData?.questions || [{ text: "", charLimit: "" }];
  });
  const [attachments, setAttachments] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    return savedData?.attachments || [{ title: "" }];
  });
  const [formFields, setFormFields] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    return (
      savedData?.formFields || {
        title: "",
        location: "",
        description: "",
        pay: "",
      }
    );
  });

  // Save to local storage whenever form data changes
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ questions, attachments, formFields })
    );
  }, [questions, attachments, formFields]);

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

  const handleFormFieldChange = (field, value) => {
    setFormFields({ ...formFields, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve poster email from localStorage
    const posterEmail = localStorage.getItem("email");
    const formData = new FormData();
    formData.append("title", formFields.title);
    formData.append("location", formFields.location);
    formData.append("description", formFields.description);
    formData.append("pay", formFields.pay);
    formData.append("email", posterEmail);
    formData.append("username", localStorage.getItem("username"));

    questions.forEach((question) => {
      formData.append(`questions[]`, question.text);
      formData.append(`character_limit[]`, question.charLimit || 5000);
    });

    try {
      const response = await fetch("/api/submit-application.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        navigate("/account_status?status=job-success");
      } else {
        alert(result.message || "Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting job:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="submitapplication-container">
        <h1>Create Job Listing</h1>
        <form onSubmit={handleSubmit}>
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
              <label htmlFor={`question_${index}`}>Question {index + 1}:</label>
              <input
                type="text"
                id={`question_${index}`}
                name={`questions[${index}]`}
                value={question.text}
                onChange={(e) =>
                  handleQuestionChange(index, "text", e.target.value)
                }
                placeholder="Enter question"
                required
              />
              <label htmlFor={`char_limit_${index}`}>Character Limit:</label>
              <input
                type="number"
                id={`char_limit_${index}`}
                name={`character_limit[${index}]`}
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
              <label htmlFor={`attachment_${index}`}>Attachment Title:</label>
              <input
                type="text"
                id={`attachment_${index}`}
                name={`attachment_title[${index}]`}
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
            Submit Job
          </button>
        </form>
      </div>
    </>
  );
};

export default SubmitApplication;
