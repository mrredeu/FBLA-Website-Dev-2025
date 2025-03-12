import Navbar from "../components/navbar";
import "../assets/css/register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  // Use the useNavigate hook to redirect to another page
  const navigate = useNavigate();

  // Initialize state for form fields
  const [formData, setFormData] = useState({
    full_name: localStorage.getItem("full_name") || "",
    email: localStorage.getItem("email") || "",
    password: localStorage.getItem("password") || "",
    role: localStorage.getItem("role") || "student",
  });

  // Update form data and persist to localStorage
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      localStorage.setItem(name, value);
      return updatedData;
    });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const { full_name, email, password, role } = formData;

    // Validate full name format: Two words, each starting with a capital letter and followed by lowercase letters.
    const fullNameRegex = /^[A-Z][a-z]+( [A-Z][a-z]+)$/;
    if (!fullNameRegex.test(full_name)) {
      alert("Please enter a valid full name (e.g., John Doe).");
      return;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("/api/process-register.php", {
        method: "POST",
        body: JSON.stringify({ full_name, email, password, role }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          localStorage.clear();
          navigate("/account_status?status=registered");
        } else {
          alert(data.error || "Registration failed. Please try again.");
        }
      } else {
        alert("Failed to submit registration. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration. Please try again.");
    }
  };

  return (
    <>
      <Navbar />

      {/* Registration Form */}
      <section className="register">
        <div className="register-container">
          <h1>Create an Account</h1>
          <form onSubmit={handleRegister}>
            <label htmlFor="full-name">Full Name</label>
            <input
              type="text"
              id="full-name"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              required
              autoComplete="off"
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              autoComplete="off"
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              autoComplete="off"
            />

            <label htmlFor="role">Register As:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="student">Student</option>
              <option value="employer">Employer</option>
            </select>

            <button type="submit">Register</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Register;
