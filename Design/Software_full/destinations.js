// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Your existing Firebase config
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
const db = getDatabase(app);

// Reference to the container in HTML
const galleryGrid = document.getElementById('galleryGrid');

// Fetch destinations from Firebase
function loadDestinations() {
  const destinationsRef = ref(db, 'destinations');

  onValue(destinationsRef, (snapshot) => {
    galleryGrid.innerHTML = ''; // Clear existing content

    const destinations = snapshot.val();

    if (destinations) {
      Object.keys(destinations).forEach((key) => {
        const destination = destinations[key];
        const { name, image } = destination;

        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.innerHTML = `
          <img src="${image}" alt="${name}" title="${name}">
          <div class="gallery-label">${name}</div>
          <a href="bookings.html?destination=${encodeURIComponent(name)}" class="book-btn">Book Now</a>
        `;

        galleryGrid.appendChild(card);
      });
    } else {
      galleryGrid.innerHTML = '<p>No destinations available.</p>';
    }
  }, {
    onlyOnce: false
  });
}

// Run on load
loadDestinations();
