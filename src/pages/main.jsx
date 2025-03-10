import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "/src/pages/homepage.jsx";
import Register from "/src/pages/register.jsx";
import SAccount from "/src/components/infoBox.jsx";
import RVAccount from "/src/pages/mngAccounts.jsx";
import JobsList from "/src/pages/jobsList.jsx";
import CApp from "/src/pages/sJobApplication.jsx";
import RVJobs from "/src/pages/mngJobs.jsx";
import RVJobDetails from "/src/pages/rvJobDetails.jsx";
import ManageJobApplications from "/src/pages/mngJobApplication.jsx";
import ApplyJob from "/src/components/applyJob.jsx";
import RVJobSubmissions from "/src/pages/rvJobSubmissions.jsx";
import RVStudentSubmission from "/src/components/rvStudentSubmission.jsx";
import LoginMobile from "/src/components/login-mobile.jsx";

// Function to initialize the database by calling index.php
const initializeDatabase = async () => {
  try {
    const response = await fetch("/api/index.php");

    // Check if the response is successful (HTTP status 200)
    if (response.status === 200) {
      const data = await response.json();
      if (data.error) {
        console.error("Database initialization failed:", data.error);
      }
    } else {
      console.error(
        "Database initialization failed. HTTP Status:",
        response.status
      );
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

// Trigger database initialization before rendering the app
initializeDatabase().then(() => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/register-account" element={<Register />} />
          <Route path="/account_status" element={<SAccount />} />
          <Route path="/manage-accounts" element={<RVAccount />} />
          <Route path="/jobs-list" element={<JobsList />} />
          <Route path="/submit-job-application" element={<CApp />} />
          <Route path="/review-job-postings" element={<RVJobs />} />
          <Route path="/review-job-details" element={<RVJobDetails />} />
          <Route path="/apply/:jobId" element={<ApplyJob />} />
          <Route path="/job-submissions" element={<RVJobSubmissions />} />
          <Route
            path="/submission-details/:applicationId"
            element={<RVStudentSubmission />}
          />
          <Route
            path="/manage-job-applications"
            element={<ManageJobApplications />}
          />
          <Route path="/" element={<Navigate to="/homepage" />} />
          <Route path="/login-mobile" element={<LoginMobile />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
});
