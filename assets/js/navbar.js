document.addEventListener('DOMContentLoaded', () => {
const loginBtn = document.querySelector('.login-btn');
const loginBox = document.querySelector('.login-box');

if (loginBtn) {
    // Show the login box on hover over the login button
    loginBtn.addEventListener('mouseenter', () => {
        loginBox.style.display = 'block'; // Make the box visible
        setTimeout(() => {
            loginBox.style.opacity = '1';
            loginBox.style.transform = 'translateY(0)';
        }, 0); // Delay to allow transition effect
        loginBtn.classList.add('active'); // Change button color
    });

    // Keep the login box visible when hovered over
    loginBox.addEventListener('mouseenter', () => {
        loginBox.style.display = 'block';
        loginBox.style.opacity = '1';
        loginBox.style.transform = 'translateY(0)';
    });

    // Hide the login box when the mouse leaves the box or button
    loginBox.addEventListener('mouseleave', () => {
            loginBox.style.opacity = '0';
            loginBox.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                loginBox.style.display = 'none'; // Hide completely after transition
                loginBtn.classList.remove('active'); // Reset button color
            }, 400); // Match transition duration
        });
    }
});