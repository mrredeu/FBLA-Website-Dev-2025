import { useState } from "react";
import Navbar from "./navbar";
import "../assets/css/login-mobile.css";

const LoginMobile = () => {
  const [loginError, setLoginError] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      const response = await fetch("/api/process-login.php", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          localStorage.setItem("username", data.session.username);
          localStorage.setItem("email", data.session.email);
          localStorage.setItem("role", data.session.role);
          window.location.href = "/homepage";
        } else {
          if (data.error === "Account is pending approval.") {
            window.location.href = "/account_status?status=pending";
          } else if (data.error === "Account has been denied.") {
            window.location.href = "/account_status?status=denied";
          } else if (data.error === "User not found.") {
            window.location.href = "/account_status?status=error";
          } else if (data.error === "Invalid password.") {
            setLoginError("Invalid Password");
          } else if (
            data.error === "An error occurred while processing your request."
          ) {
            setLoginError("Login request failed. Please try again.");
          }
        }
      } else {
        setLoginError("Login request failed. Please try again.");
      }
    } catch (error) {
      setLoginError("An error occurred during login. Please try again.");
    }
  };

  return (
    <>
      {/* Render Navbar at top */}
      <Navbar />
      <div className="login-mobile-container">
        <h2 className="login-mobile-title">Beehive Portal Login</h2>
        <form
          id="login-form-mobile"
          className="login-mobile-form"
          onSubmit={handleLogin}
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            required
            className="login-mobile-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            required
            className="login-mobile-input"
          />
          <button type="submit" className="login-mobile-button">
            Login
          </button>
          {loginError && <p className="login-mobile-error">{loginError}</p>}
          <p className="login-mobile-register">
            Don&apos;t have an account?{" "}
            <a href="/register-account">Register here</a>
          </p>
        </form>
      </div>
    </>
  );
};

export default LoginMobile;
