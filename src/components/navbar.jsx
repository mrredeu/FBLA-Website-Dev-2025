import { useEffect, useState } from "react";
import "../assets/css/navbar.css";
import logo from "../assets/images/beehive-logo.png";

const Navbar = () => {
  const [session, setSession] = useState({
    role: null,
    username: null,
  });
  const [loginBoxVisible, setLoginBoxVisible] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Fetch session data from the server
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/navbar-session.php");
        if (response.ok) {
          const data = await response.json();
          setSession(data);

          // Save session data to local storage if user is logged in
          if (data.username && data.email) {
            localStorage.setItem("username", data.username);
            localStorage.setItem("email", data.email);
            localStorage.setItem("role", data.session.role);
          }
        } else {
          console.error(
            "Failed to fetch session. HTTP status:",
            response.status
          );
        }
      } catch (error) {
        console.error("Failed to fetch session. Error:", error);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 769);
      setHamburgerOpen(false);
      setLoginBoxVisible(false);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Handle login form submission
  const handleLogin = async (event) => {
    event.preventDefault();
    // Save current URL for redirect after login
    localStorage.setItem("redirectAfterLogin", window.location.href);
    const formData = new FormData(event.target);

    try {
      const response = await fetch("/api/process-login.php", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSession(data.session);
          setLoginError(null);
          setLoginBoxVisible(false);

          // Save email and username in local storage
          localStorage.setItem("username", data.session.username);
          localStorage.setItem("email", data.session.email);
          localStorage.setItem("role", data.session.role);

          // Replace default homepage redirection with dynamic redirect
          const redirectUrl =
            localStorage.getItem("redirectAfterLogin") || "/homepage";
          localStorage.removeItem("redirectAfterLogin");
          window.location.href = redirectUrl;
        } else {
          console.log(data.error);
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

  // Handle logout
  const handleLogout = () => {
    fetch("/api/logout.php")
      .then((response) => {
        if (response.ok) {
          // Clear local storage
          localStorage.removeItem("username");
          localStorage.removeItem("email");
          localStorage.removeItem("role");

          setSession({ role: null, username: null });
          window.location.href = "/homepage";
        } else {
          console.error("Failed to log out. HTTP status:", response.status);
        }
      })
      .catch((error) => console.error("Logout failed:", error));
  };

  return (
    <>
      {/* Top Bar */}
      <header>
        <div className="navbar-top-bar">
          <div className="navbar-academy-name">
            BEEHIVE SCIENCE & TECHNOLOGY ACADEMY
          </div>
          <div className="navbar-contact-info">
            <span>
              <i className="fas fa-phone"></i> (801) 576-0070
            </span>
            <div className="navbar-social-links">
              <a href="#">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="navbar-real">
          <div className="navbar-container">
            <div className="navbar-logo">
              <img src={logo} alt="Beehive Logo" />
            </div>
            <ul>
              <li>
                <a href="/homepage">Home</a>
              </li>

              {/* Conditional Links Based on Role */}
              {(!session.role || session.role === "student") && (
                <li>
                  <a href="/jobs-list">Job Postings</a>
                </li>
              )}
              {session.role === "admin" && (
                <>
                  <li>
                    <a href="/manage-accounts">Manage Accounts</a>
                  </li>
                  <li>
                    <a href="/review-job-postings">Review Applications</a>
                  </li>
                </>
              )}
              {session.role === "employer" && (
                <>
                  <li>
                    <a href="/manage-job-applications">Manage Postings</a>
                  </li>
                  <li>
                    <a href="/job-submissions">Review Submissions</a>
                  </li>
                </>
              )}

              {/* User Greeting and Auth Links */}
              {!session.username ? (
                <li>
                  <button
                    className="navbar-login-btn"
                    {...(!isMobile && {
                      onMouseEnter: () => setLoginBoxVisible(true),
                      onMouseLeave: () => setLoginBoxVisible(false),
                    })}
                    onClick={() => {
                      if (isMobile) {
                        localStorage.setItem(
                          "redirectAfterLogin",
                          window.location.href
                        );
                        window.location.href = "/login-mobile";
                      }
                    }}
                  >
                    Login
                  </button>
                </li>
              ) : (
                <>
                  <li>Welcome, {session.username}!</li>
                  <li>
                    <button
                      className="navbar-logout-btn"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
              {/* Hamburger menu button always in nav */}
              {isMobile && (
                <li>
                  <button
                    className="hamburger-btn"
                    onClick={() => setHamburgerOpen(!hamburgerOpen)}
                  >
                    <i
                      className={
                        hamburgerOpen ? "fa-solid fa-x" : "fa-solid fa-bars"
                      }
                    ></i>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </nav>

        {/* Hamburger Menu displayed below the navbar */}
        {hamburgerOpen && (
          <div className="hamburger-menu">
            <ul>
              <li>
                <a href="/homepage" onClick={() => setHamburgerOpen(false)}>
                  Home
                </a>
              </li>
              {(!session.role || session.role === "student") && (
                <li>
                  <a href="/jobs-list" onClick={() => setHamburgerOpen(false)}>
                    Job Postings
                  </a>
                </li>
              )}
              {session.role === "admin" && (
                <>
                  <li>
                    <a
                      href="/manage-accounts"
                      onClick={() => setHamburgerOpen(false)}
                    >
                      Manage Accounts
                    </a>
                  </li>
                  <li>
                    <a
                      href="/review-job-postings"
                      onClick={() => setHamburgerOpen(false)}
                    >
                      Review Job Postings
                    </a>
                  </li>
                </>
              )}
              {session.role === "employer" && (
                <>
                  <li>
                    <a
                      href="/manage-job-applications"
                      onClick={() => setHamburgerOpen(false)}
                    >
                      Manage Postings
                    </a>
                  </li>
                  <li>
                    <a
                      href="/job-submissions"
                      onClick={() => setHamburgerOpen(false)}
                    >
                      Review Submissions
                    </a>
                  </li>
                </>
              )}
              {session.username ? (
                <>
                  <li>
                    <button
                      className="navbar-logout-btn"
                      onClick={() => {
                        handleLogout();
                        setHamburgerOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button
                    className="navbar-login-btn"
                    onClick={() => {
                      setHamburgerOpen(false);
                      window.location.href = isMobile
                        ? "/login-mobile"
                        : "/homepage";
                    }}
                  >
                    Login
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </header>

      {/* Login Box */}
      {loginBoxVisible && (
        <div
          id="login-box"
          className={`navbar-login-box ${loginBoxVisible ? "visible" : ""}`}
          onMouseEnter={() => setLoginBoxVisible(true)}
          onMouseLeave={() => setLoginBoxVisible(false)}
        >
          <div className="navbar-box-content">
            <form
              id="login-form"
              className="navbar-form"
              onSubmit={handleLogin}
            >
              <input
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="email"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                required
              />
              <button type="submit">Login</button>
              {loginError && <p className="navbar-error">{loginError}</p>}
              <p>
                Don&apos;t have an account?{" "}
                <a href="/register-account">Register here</a>
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
