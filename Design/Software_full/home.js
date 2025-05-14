console.log("home.js loaded!");

// Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

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

// Fetch and display top 3 rated countries
const galleryGrid = document.getElementById("topDestinations");

function displayTopCountries() {
    const countriesRef = ref(database, "destinations");

    onValue(countriesRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        // Convert to array with ID
        const countryArray = Object.values(data);

        // Sort by rate descending
        countryArray.sort((a, b) => (b.rate || 0) - (a.rate || 0));

        // Get top 3
        const topThree = countryArray.slice(0, 3);

        // Render cards
        galleryGrid.innerHTML = topThree.map(country => `
            <div class="gallery-card">
                <img src="${country.image}" alt="${country.name}" title="${country.name}">
                <div class="gallery-label">${country.name}</div>
                <a href="bookings.html?destination=${encodeURIComponent(country.name)}" class="book-btn">Book Now</a>
            </div>
        `).join("");
    });
}

function displayReviews() {
    console.log("displayReviews called!");
    const reviewsBlock = document.querySelector('.reviews-block');
    const usersRef = ref(database, "users");

    onValue(usersRef, (snapshot) => {
        const usersData = snapshot.val();
        console.log("Fetched usersData:", usersData); // Log the raw data fetched from Firebase

        if (!usersData) {
            reviewsBlock.innerHTML = ""; // Show the :empty::before message
            return;
        }

        // Collect all ratings from all users
        let allRatings = [];
        Object.entries(usersData).forEach(([userId, user]) => {
            if (user.ratings) {
                Object.values(user.ratings).forEach(rating => {
                    allRatings.push({
                        username: user.username || "Anonymous",
                        comment: rating.comment || "",
                        rating: rating.rating || 0,
                        timestamp: rating.timestamp || ""
                    });
                });
            }
        });

        console.log("All ratings:", allRatings); // Log the processed ratings array

        // Sort by timestamp descending (latest first)
        allRatings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Render reviews
        if (allRatings.length === 0) {
            reviewsBlock.innerHTML = ""; // Show the :empty::before message
        } else {
            reviewsBlock.innerHTML = allRatings.map(r =>
                `<div class="review-card">
                    <div class="review-header">
                        <span class="review-username">${r.username}</span>
                        <span class="review-rating">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span>
                    </div>
                    <div class="review-comment">${r.comment}</div>
                    <div class="review-date">${new Date(r.timestamp).toLocaleString()}</div>
                </div>`
            ).join("");
        }
    }, (error) => {
        console.error("Firebase onValue error:", error);
    });
}
// Initialize
document.addEventListener("DOMContentLoaded", () => {
    displayTopCountries();
    displayReviews();
});
