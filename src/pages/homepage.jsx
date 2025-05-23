import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import "../assets/css/homepage.css";
import intern1 from "../assets/images/intern-1.jpg";
import intern2 from "../assets/images/intern-2.png";
import intern3 from "../assets/images/intern-3.jpg";

const HomePage = () => {
  // Slide data: image, title, description, link.
  const slides = [
    {
      img: intern1,
      title: "Beehive Job Portal",
      description:
        "Connecting students to opportunities – Apply for jobs or internships today!",
      link: "/jobs-list",
    },
    {
      img: intern2,
      title: "Explore New Internships",
      description:
        "Gain experience while you learn – Check out the latest openings.",
      link: "/jobs-list",
    },
    {
      img: intern3,
      title: "Build Your Future",
      description:
        "Broaden your horizons, collaborate with experts, and gain real-world experience.",
      link: "/jobs-list",
    },
  ];

  // State: current slide index.
  const [currentIndex, setCurrentIndex] = useState(0);

  // Update slide index with wrap-around logic.
  const showSlide = (index) => {
    setCurrentIndex(() => {
      if (index < 0) return slides.length - 1;
      if (index >= slides.length) return 0;
      return index;
    });
  };

  // Auto-cycle slides every 10 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <>
      {/* Render Navbar */}
      <Navbar />

      {/* Hero Section: slider and overlay */}
      <section className="homepage-slider">
        <div className="homepage-slider-container">
          {/* Slide Items */}
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`homepage-slide ${
                index === currentIndex ? "active" : ""
              }`}
              style={{
                display: index === currentIndex ? "block" : "none",
                transition: "opacity 0.4s ease-in-out",
              }}
            >
              <img src={slide.img} alt={slide.title} />
              <div className="homepage-overlay">
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>
                <a href={slide.link} className="homepage-btn">
                  View Jobs
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="homepage-slider-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`homepage-dot ${
                index === currentIndex ? "active" : ""
              }`}
              onClick={() => showSlide(index)}
            ></span>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer>
        <div className="container">
          <p>&copy; 2024 Beehive Science & Technology Academy</p>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
