import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  databaseURL: "https://travel-advisor-cac06-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const stars = document.querySelectorAll('.star');
    const commentBox = document.querySelector('.comment-box');
    const submitBtn = document.querySelector('.submit-btn');
    const loadingIndicator = document.getElementById('loading-indicator');
    
    let selectedRating = 0;

    // Star rating interaction
    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            stars.forEach((s, index) => {
                s.classList.toggle('active', index < selectedRating);
            });
            submitBtn.disabled = false;
        });
        
        star.addEventListener('mouseover', function() {
            const hoverRating = parseInt(this.getAttribute('data-rating'));
            stars.forEach((s, index) => {
                s.style.color = index < hoverRating ? '#ffc107' : '#ccc';
            });
        });
        
        star.addEventListener('mouseout', function() {
            stars.forEach((s, index) => {
                s.style.color = index < selectedRating ? '#ffc107' : '#ccc';
            });
        });
    });

    // Submit handler
    submitBtn.addEventListener('click', async function() {
        // 1. Check login status
        if (!sessionStorage.getItem('isLoggedIn')) {
            window.location.href = 'login.html';
            return;
        }

        // 2. Validate rating selection
        if (selectedRating === 0) {
            alert('Please select a rating');
            return;
        }

        // 3. Show loading state
        submitBtn.disabled = true;
        submitBtn.style.display = 'none';
        loadingIndicator.style.display = 'block';

        try {
            // 4. Save to Firebase
            const ratingsRef = ref(database, 'ratings');
            await set(push(ratingsRef), {
                userId: sessionStorage.getItem('userId'),
                rating: selectedRating,
                comment: commentBox.value.trim() || null,
                timestamp: new Date().toISOString()
            });

            // 5. REDIRECT TO HOME PAGE AFTER SUCCESS
            window.location.href = 'home.html';
            
        } catch (error) {
            console.error("Submission failed:", error);
            loadingIndicator.style.display = 'none';
            submitBtn.style.display = 'block';
            submitBtn.disabled = false;
        }
    });

    // Initial state
    submitBtn.disabled = true;
});