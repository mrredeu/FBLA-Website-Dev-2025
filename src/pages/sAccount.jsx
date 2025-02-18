import Navbar from "../components/navbar";
import "../assets/css/saccount.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Account = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [statusType, setStatusType] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");

    if (status === "pending") {
      setStatusType("pending");
    } else if (status === "error") {
      setStatusType("error");
    } else if (status === "denied") {
      setStatusType("denied");
    }
  }, [location.search]);

  return (
    <>
      <Navbar />
      <div className="saccount-container">
        <div className={`saccount-card ${statusType}`}>
          {statusType === "error" ? (
            <>
              <h1 style={{ color: "red" }}>Account Not Found</h1>
              <p>
                We couldn’t find an account with this email. Please double-check
                your email or{" "}
                <a href="/register-account" className="register-button">
                  register for a new account
                </a>
                .
              </p>
            </>
          ) : statusType === "denied" ? (
            <>
              <h1 style={{ color: "red" }}>Account Denied</h1>
              <p>
                Your account application has been denied. If you believe this is
                an error or have any questions, please contact us for
                assistance.
              </p>
            </>
          ) : (
            <>
              <h1>Account Registered</h1>
              <p>
                Your account is currently pending approval. Please wait 2-5
                business days for updates. If you need assistance, please
                contact us.
              </p>
            </>
          )}
          <button onClick={() => navigate("/homepage")}>Go Back to Home</button>
        </div>
      </div>
    </>
  );
};

export default Account;
