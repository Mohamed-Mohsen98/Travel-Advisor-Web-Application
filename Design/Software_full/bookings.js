// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getDatabase,
  ref as dbRef,
  get,
  push,
  set
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase config
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
const db = getDatabase(app);
const auth = getAuth(app);
const destinationsRef = dbRef(db, 'destinations');

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bookingForm');
  const summaryDetails = document.getElementById('summaryDetails');
  const totalPrice = document.getElementById('totalPrice');
  const confirmBtn = document.getElementById('confirmBookingBtn');
  const returnDateLabel = form.querySelector('.return-date-label');
  const stepBookingInfo = document.getElementById('step-booking-info');
  const bookingSummarySection = document.getElementById('bookingSummarySection');
  const progressSteps = document.querySelectorAll('.progress-indicator .step');
  const departureSelect = form.departureCity;
  const destinationSelect = form.destinationCity;

  let bookingData = {};
  let currentStep = 1;

  // 🔁 Show/hide return date field
  function updateReturnDateVisibility() {
    const tripType = form.tripType.value;
    returnDateLabel.style.display = tripType === 'roundtrip' ? 'flex' : 'none';
    if (tripType !== 'roundtrip') form.returnDate.value = '';
  }

  form.tripType.forEach(r => r.addEventListener('change', updateReturnDateVisibility));
  updateReturnDateVisibility();

  // 📝 Update Summary
  function updateSummary() {
    const depDate = new Date(form.departureDate.value);
    const retDate = new Date(form.returnDate.value);
    const tripType = form.tripType.value;

    if (tripType === 'roundtrip' && (!retDate || retDate <= depDate)) {
      alert("Return date must be after departure date.");
      form.returnDate.value = '';
      return;
    }

    if (form.departureCity.value === form.destinationCity.value && form.departureCity.value !== '') {
      alert("Departure City and Destination City cannot be the same.");
      form.destinationCity.value = '';
      form.destinationCity.focus();
      return;
    }

    const dep = form.departureCity.value || '-';
    const dest = form.destinationCity.value || '-';
    const adults = form.adults.value;
    const children = form.children.value;
    const infants = form.infants.value;
    const travelClass = form.travelClass.options[form.travelClass.selectedIndex].text;

    let summary = `<div><b>From:</b> ${dep} <i class='fa-solid fa-arrow-right'></i> <b>To:</b> ${dest}</div>`;
    summary += `<div><b>Departure:</b> ${form.departureDate.value || '-'}`;
    if (tripType === 'roundtrip') summary += ` <b>Return:</b> ${form.returnDate.value || '-'}`;
    summary += `</div>`;
    summary += `<div><b>Passengers:</b> ${adults} Adult(s), ${children} Child(ren), ${infants} Infant(s)</div>`;
    summary += `<div><b>Class:</b> ${travelClass}</div>`;
    summaryDetails.innerHTML = summary;

    let price = 200 * adults + 120 * children + 50 * infants;
    if (travelClass === 'Business') price *= 1.7;
    if (travelClass === 'First') price *= 2.5;
    if (tripType === 'roundtrip') price *= 1.8;
    totalPrice.textContent = `$${price.toFixed(2)}`;
  }

  form.addEventListener('input', updateSummary);

  // Progress Step
  function setStep(step) {
    progressSteps.forEach((el, idx) => {
      el.classList.toggle('active', idx === step - 1);
    });
  }

  function showStep1() {
    stepBookingInfo.style.display = '';
    bookingSummarySection.style.display = '';
    confirmBtn.style.display = '';
    setStep(1);
    currentStep = 1;
  }

  function showStep2() {
    const tripType = form.tripType.value;

    if (!form.departureCity.value) {
      alert("Please select a departure city before proceeding.");
      form.departureCity.focus();
      return;
    }

    if (!form.destinationCity.value) {
      alert("Please select a destination city.");
      form.destinationCity.focus();
      return;
    }

    if (form.departureCity.value === form.destinationCity.value) {
      alert("Departure and Destination City cannot be the same.");
      form.destinationCity.value = '';
      form.destinationCity.focus();
      return;
    }

    if (!form.departureDate.value) {
      alert("Please select a departure date.");
      form.departureDate.focus();
      return;
    }

    if (tripType === 'roundtrip' && !form.returnDate.value) {
      alert("Please select a return date before procedding.");
      form.returnDate.focus();
      return;
    }

    bookingData = {
      departureCity: form.departureCity.value,
      destinationCity: form.destinationCity.value,
      departureDate: form.departureDate.value,
      returnDate: form.returnDate.value || '',
      tripType: form.tripType.value,
      adults: form.adults.value,
      children: form.children.value,
      infants: form.infants.value,
      travelClass: form.travelClass.options[form.travelClass.selectedIndex].text,
      totalPrice: totalPrice.textContent
    };

    stepBookingInfo.style.display = 'none';
    bookingSummarySection.innerHTML = `
      <div class="card summary-card">
        <h2><i class="fa-solid fa-eye"></i> Review Your Booking</h2>
        <div class="summary-details">
          <div><b>From:</b> ${bookingData.departureCity} <i class='fa-solid fa-arrow-right'></i> <b>To:</b> ${bookingData.destinationCity}</div>
          <div><b>Departure:</b> ${bookingData.departureDate}${bookingData.tripType === 'roundtrip' ? ` <b>Return:</b> ${bookingData.returnDate}` : ''}</div>
          <div><b>Passengers:</b> ${bookingData.adults} Adult(s), ${bookingData.children} Child(ren), ${bookingData.infants} Infant(s)</div>
          <div><b>Class:</b> ${bookingData.travelClass}</div>
        </div>
        <div class="summary-total">
          <span>Total Estimate:</span>
          <span>${bookingData.totalPrice}</span>
        </div>
        <button class="confirm-btn" id="okReviewBtn">OK</button>
      </div>
    `;
    setStep(2);
    currentStep = 2;
    document.getElementById('okReviewBtn').onclick = showStep3;
  }

  function showStep3() {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        alert("You must be logged in to submit a booking.");
        showStep1();
        return;
      }

      const userId = user.uid;
      const userBookingsRef = dbRef(db, `users/${userId}/bookings`);
      const newBookingRef = push(userBookingsRef);

      set(newBookingRef, bookingData)
        .then(() => {
          bookingSummarySection.innerHTML = `
            <div class="card summary-card">
              <h2><i class="fa-solid fa-check-circle" style="color:#21795b"></i> Thank You!</h2>
              <div class="summary-details" style="text-align:center; font-size:1.1rem;">
                Your booking has been received.<br>We wish you a pleasant journey!
              </div>
            </div>
          `;
          setStep(3);
          currentStep = 3;
        })
        .catch((error) => {
          console.error("Error saving booking:", error);
          alert("Failed to save booking. Try again.");
        });
    });
  }

  confirmBtn.addEventListener('click', function (e) {
    e.preventDefault();
    showStep2();
  });

  // Load destinations
  get(destinationsRef)
    .then(snapshot => {
      const list = snapshot.val();
      if (list && Array.isArray(list)) {
        list.forEach(item => {
          if (item && item.name) {
            const option1 = new Option(item.name, item.name);
            const option2 = new Option(item.name, item.name);
            departureSelect.appendChild(option1);
            destinationSelect.appendChild(option2.cloneNode(true));
          }
        });
      }
    })
    .catch(err => console.error("Error loading destinations:", err));
});
