import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import "../assets/css/homepage.css";
import intern1 from "../assets/images/intern-1.jpg";
import intern2 from "../assets/images/intern-2.png";
import intern3 from "../assets/images/intern-3.jpg";

const HomePage = () => {
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
        "Broaden your horizons, collaborate with leading experts, and gain the real-world experience.",
      link: "/jobs-list",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to move to a specific slide
  const showSlide = (index) => {
    setCurrentIndex(() => {
      if (index < 0) return slides.length - 1;
      if (index >= slides.length) return 0;
      return index;
    });
  };

  // Auto-slide every 10 seconds
  useEffect(() => {
    const interval = setInterval(function () {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="homepage-slider">
        <div className="homepage-slider-container">
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

      {/* Footer */}
      <footer>
        <div className="container">
          <p>&copy; 2024 Beehive Science & Technology Academy</p>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
