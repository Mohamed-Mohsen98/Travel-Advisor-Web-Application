// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBUWHm2g9sd9P5ZofIg0zBsN5F0W0I2vM",
  authDomain: "travel-advisor-cac06.firebaseapp.com",
  databaseURL: "https://travel-advisor-cac06-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "travel-advisor-cac06",
  storageBucket: "travel-advisor-cac06.firebasestorage.app",
  messagingSenderId: "307821978887",
  appId: "1:307821978887:web:71ce0fb2e25ed8fb0a51a2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star');
    const commentBox = document.querySelector('.comment-box');
    const submitBtn = document.querySelector('.submit-btn');
    const selectedRatingInput = document.getElementById('selected-rating');
    const loadingIndicator = document.getElementById('loading-indicator');
    
    let selectedRating = 0;

    // Star rating selection
    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            selectedRatingInput.value = selectedRating;
            
            stars.forEach((s, index) => {
                if (index < selectedRating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
            
            submitBtn.disabled = false;
        });
        
        star.addEventListener('mouseover', function() {
            const hoverRating = parseInt(this.getAttribute('data-rating'));
            
            stars.forEach((s, index) => {
                if (index < hoverRating) {
                    s.style.color = '#ffc107';
                } else {
                    s.style.color = '#ccc';
                }
            });
        });
        
        star.addEventListener('mouseout', function() {
            stars.forEach((s, index) => {
                if (index < selectedRating) {
                    s.style.color = '#ffc107';
                } else {
                    s.style.color = '#ccc';
                }
            });
        });
    });

    // Submit handler with silent redirect
    submitBtn.addEventListener('click', async function() {
        if (selectedRating === 0) {
            alert('Please select a rating before submitting.');
            return;
        }

        const comment = commentBox.value.trim();
        const user = auth.currentUser;

        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.style.display = 'none'; // Hide button during submission
        loadingIndicator.style.display = 'block';

        try {
            // Save rating to Firebase
            const ratingsRef = ref(database, 'ratings');
            const newRatingRef = push(ratingsRef);
            
            await set(newRatingRef, {
                userId: user.uid,
                rating: selectedRating,
                comment: comment || null,
                timestamp: new Date().toISOString()
            });
            
            // Silent redirect to home page
            window.location.href = 'home.html';
        } catch (error) {
            console.error('Error submitting rating:', error);
            
            // Restore UI state
            loadingIndicator.style.display = 'none';
            submitBtn.style.display = 'block';
            submitBtn.disabled = false;
        }
    });

    // Disable submit button initially
    submitBtn.disabled = true;
});