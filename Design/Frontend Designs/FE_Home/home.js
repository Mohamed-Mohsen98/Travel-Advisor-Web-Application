document.addEventListener('DOMContentLoaded', function () {
    const ctaBtn = document.getElementById('startJourneyBtn');
    ctaBtn.addEventListener('click', function () {
        const gallery = document.getElementById('gallery');
        if (gallery) {
            gallery.scrollIntoView({ behavior: 'smooth' });
        }
    });
}); 