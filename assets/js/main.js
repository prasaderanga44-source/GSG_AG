document.addEventListener('DOMContentLoaded', () => {
    // Current route to highlight nav links correctly
    const currentLocation = location.href;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Add smooth scrolling for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const element = document.querySelector(targetId);
            if(element){
                element.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
