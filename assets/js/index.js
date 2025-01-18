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