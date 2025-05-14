import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, set, push, get } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCBUWHm2g9sd9P5ZofIg0zBsN5F0W0I2vM",
  authDomain: "travel-advisor-cac06.firebaseapp.com",
  databaseURL: "https://travel-advisor-cac06-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "travel-advisor-cac06",
  storageBucket: "travel-advisor-cac06.appspot.com",
  messagingSenderId: "307821978887",
  appId: "1:307821978887:web:71ce0fb2e25ed8fb0a51a2"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

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
        // 1. Check login status and userId
        const currentUser = auth.currentUser;
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        const userId = sessionStorage.getItem('userId');

        console.log('Auth status:', { currentUser, isLoggedIn, userId }); // Debug log

        if (!currentUser || !isLoggedIn || !userId) {
            console.log('User not properly authenticated');
            sessionStorage.setItem('returnUrl', window.location.href);
            window.location.href = 'login.html';
            return;
        }

        // Verify the session userId matches the authenticated user
        if (currentUser.uid !== userId) {
            console.error('Session user ID does not match authenticated user');
            alert('Authentication mismatch. Please login again.');
            window.location.href = 'login.html';
            return;
        }

        // 2. Validate rating selection
        if (selectedRating === 0) {
            alert('Please select a rating');
            return;
        }

        // 1. Check if user has at least one booking
        try {
            const bookingsRef = ref(database, `users/${currentUser.uid}/bookings`);
            const bookingsSnapshot = await get(bookingsRef);

            if (!bookingsSnapshot.exists() || Object.keys(bookingsSnapshot.val()).length === 0) {
                alert('You must book at least one trip before you can submit a rating.');
                loadingIndicator.style.display = 'none';
                submitBtn.style.display = 'block';
                submitBtn.disabled = false;
                return;
            }
        } catch (error) {
            alert('Error checking bookings: ' + error.message);
            loadingIndicator.style.display = 'none';
            submitBtn.style.display = 'block';
            submitBtn.disabled = false;
            return;
        }

        // 3. Show loading state
        submitBtn.disabled = true;
        submitBtn.style.display = 'none';
        loadingIndicator.style.display = 'block';

        try {
            console.log('Attempting to save rating...'); // Debug log
            
            // Create a reference to the specific user's ratings
            const userRatingsRef = ref(database, `users/${currentUser.uid}/ratings`);
            
            const ratingData = {
                rating: selectedRating,
                comment: commentBox.value.trim() || null,
                timestamp: new Date().toISOString()
            };
            
            console.log('Rating data:', ratingData); // Debug log
            
            // Save the rating under the user's ID
            const newRatingRef = push(userRatingsRef);
            await set(newRatingRef, ratingData);

            console.log('Rating saved successfully!'); // Debug log
            alert('Rating submitted successfully!');
            
            // Redirect to home page
            window.location.href = 'home.html';
        } catch (error) {
            console.error('Error saving rating:', error);
            alert('Failed to submit rating: ' + error.message);
            
            // Reset UI state
            loadingIndicator.style.display = 'none';
            submitBtn.style.display = 'block';
            submitBtn.disabled = false;
        }
    });

    // Initial state
    submitBtn.disabled = true;
});