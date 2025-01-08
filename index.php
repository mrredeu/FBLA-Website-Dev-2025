<?php
session_start();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beehive Academy Job Portal</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <?php include 'navbar.php'; ?>

    <!-- Hero Section -->
    <section class="hero-slider">
        <div class="slider">
            <div class="slide active">
                <img src="assets/images/intern-1.jpg" alt="Intern at Work">
                <!--https://www.amazon.jobs/content/en/career-programs/university/internships-for-students-->
                <div class="overlay">
                    <h1>Beehive Academy Job Portal</h1>
                    <p>Connecting students to opportunities – Apply for jobs or internships today!</p>
                    <a href="jobs.php" class="btn">View Jobs</a>
                </div>
            </div>
            <div class="slide">
                <img src="assets/images/intern-2.png" alt="Internship Opportunities">
                <!--https://intermountainhealthcare.org/-/media/images/intermountain-health/student-programs/student-image.ashx?h=4024&iar=0&w=6048&hash=93C09D8D64E2F00E6DA111DC967401A7-->
                <div class="overlay">
                    <h1>Explore New Internships</h1>
                    <p>Gain experience while you learn – Check out the latest openings.</p>
                    <a href="jobs.php" class="btn">View Jobs</a>
                </div>
            </div>
            <div class="slide">
                <img src="assets/images/intern-3.jpg" alt="Student Learning Experience">
                <!--https://www.ziprecruiter.com/career/Electrical-Engineering-Intern/What-Is-How-to-Become-->
                <div class="overlay">
                    <h1>Build Your Future</h1>
                    <p>Apply now for top internships and career paths.</p>
                    <a href="jobs.php" class="btn">View Jobs</a>
                </div>
            </div>
        </div>

        <!-- Navigation Dots -->
        <div class="slider-dots">
            <span class="dot active" onclick="currentSlide(1)"></span>
            <span class="dot" onclick="currentSlide(2)"></span>
            <span class="dot" onclick="currentSlide(3)"></span>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; 2024 Beehive Science & Technology Academy</p>
        </div>
    </footer>

    <script>
        function toggleLoginBox() {
            const loginBox = document.getElementById('login-box');
            loginBox.style.display = (loginBox.style.display === 'block') ? 'none' : 'block';
        }

        let currentIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    function showSlides(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            slide.style.display = 'none';
            dots[i].classList.remove('active');
        });

        slides[index].classList.add('active');
        slides[index].style.display = 'block';
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentIndex++;
        if (currentIndex >= slides.length) currentIndex = 0;
        showSlides(currentIndex);
    }

    function currentSlide(index) {
        currentIndex = index - 1;
        showSlides(currentIndex);
    }

    // Auto-slide every 10 seconds
    setInterval(nextSlide, 10000);
    showSlides(currentIndex);
    </script>
</body>
</html>