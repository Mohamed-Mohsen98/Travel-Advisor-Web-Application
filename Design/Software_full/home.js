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

// Initialize
document.addEventListener("DOMContentLoaded", displayTopCountries);
