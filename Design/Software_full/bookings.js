// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBUWHm2g9sd9P5ZofIg0zBsN5F0W0I2vM",
  authDomain: "travel-advisor-cac06.firebaseapp.com",
  databaseURL: "https://travel-advisor-cac06-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "travel-advisor-cac06",
  storageBucket: "travel-advisor-cac06.appspot.com",
  messagingSenderId: "307821978887",
  appId: "1:307821978887:web:71ce0fb2e25ed8fb0a51a2"
};


firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Check if user is logged in (replace with actual auth logic)
const userId = localStorage.getItem("userId");
if (!userId) {
    window.location.href = "login.html";
}

// Load destinations into select fields
function populateCitySelects() {
    const departureSelect = document.getElementById("departureCitySelect");
    const destinationSelect = document.getElementById("destinationCitySelect");

    db.ref("/destinations").once("value").then(snapshot => {
        const cities = snapshot.val();
        departureSelect.innerHTML = '<option value="">Select departure</option>';
        destinationSelect.innerHTML = '<option value="">Select destination</option>';

        for (const key in cities) {
            const city = cities[key];
            const option1 = document.createElement("option");
            const option2 = document.createElement("option");
            option1.value = option2.value = city.name;
            option1.textContent = option2.textContent = city.name;
            departureSelect.appendChild(option1.cloneNode(true));
            destinationSelect.appendChild(option2.cloneNode(true));
        }
    });
}

populateCitySelects();

// Handle booking form submission
const confirmBtn = document.getElementById("confirmBookingBtn");
confirmBtn.addEventListener("click", () => {
    const form = document.getElementById("bookingForm");
    const data = new FormData(form);

    const booking = {
        departureCity: data.get("departureCity"),
        destinationCity: data.get("destinationCity"),
        tripType: data.get("tripType"),
        departureDate: data.get("departureDate"),
        returnDate: data.get("tripType") === "roundtrip" ? data.get("returnDate") : null,
        adults: parseInt(data.get("adults")),
        children: parseInt(data.get("children")),
        infants: parseInt(data.get("infants")),
        travelClass: data.get("travelClass"),
        timestamp: Date.now()
    };

    const bookingRef = db.ref(`/bookings/${userId}`).push();
    bookingRef.set(booking).then(() => {
        alert("Booking submitted successfully.");
        // You could redirect to a summary page
    }).catch(error => {
        alert("Error saving booking: " + error.message);
    });
});
