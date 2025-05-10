document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('bookingForm');
    const summaryDetails = document.getElementById('summaryDetails');
    const totalPrice = document.getElementById('totalPrice');
    const confirmBtn = document.getElementById('confirmBookingBtn');
    const tripTypeRadios = form.elements['tripType'];
    const returnDateLabel = form.querySelector('.return-date-label');
    const bookingMain = document.getElementById('bookingMain');
    const stepBookingInfo = document.getElementById('step-booking-info');
    const bookingSummarySection = document.getElementById('bookingSummarySection');
    const progressSteps = document.querySelectorAll('.progress-indicator .step');

    let bookingData = {};
    let currentStep = 1;

    // Show/hide return date based on trip type
    function updateReturnDateVisibility() {
        const tripType = form.elements['tripType'].value;
        if (tripType === 'roundtrip') {
            returnDateLabel.style.display = 'flex';
        } else {
            returnDateLabel.style.display = 'none';
            form.elements['returnDate'].value = '';
        }
    }
    form.tripType.forEach(radio => {
        radio.addEventListener('change', updateReturnDateVisibility);
    });
    updateReturnDateVisibility();

    // Update summary
    function updateSummary() {
        const dep = form.departureCity.value || '-';
        const dest = form.destinationCity.value || '-';
        const depDate = form.departureDate.value || '-';
        const retDate = form.returnDate.value || '-';
        const tripType = form.tripType.value;
        const adults = form.adults.value;
        const children = form.children.value;
        const infants = form.infants.value;
        const travelClass = form.travelClass.options[form.travelClass.selectedIndex].text;
        let summary = `<div><b>From:</b> ${dep} <i class='fa-solid fa-arrow-right'></i> <b>To:</b> ${dest}</div>`;
        summary += `<div><b>Departure:</b> ${depDate}`;
        if (tripType === 'roundtrip') summary += ` <b>Return:</b> ${retDate}`;
        summary += `</div>`;
        summary += `<div><b>Passengers:</b> ${adults} Adult(s), ${children} Child(ren), ${infants} Infant(s)</div>`;
        summary += `<div><b>Class:</b> ${travelClass}</div>`;
        summaryDetails.innerHTML = summary;
        // Simple price estimate
        let price = 200 * adults + 120 * children + 50 * infants;
        if (travelClass === 'Business') price *= 1.7;
        if (travelClass === 'First') price *= 2.5;
        if (tripType === 'roundtrip') price *= 1.8;
        if (tripType === 'multicity') price *= 2.2;
        totalPrice.textContent = `$${price.toFixed(2)}`;
    }
    form.addEventListener('input', updateSummary);
    updateSummary();

    // Progress indicator update
    function setStep(step) {
        progressSteps.forEach((el, idx) => {
            if (idx === step - 1) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    }

    // Step 1: Booking Info (default)
    function showStep1() {
        stepBookingInfo.style.display = '';
        bookingSummarySection.style.display = '';
        // Show only the Continue button
        confirmBtn.style.display = '';
        setStep(1);
        currentStep = 1;
    }

    // Step 2: Review
    function showStep2() {
        // Gather data
        bookingData = {
            departureCity: form.departureCity.value,
            destinationCity: form.destinationCity.value,
            departureDate: form.departureDate.value,
            returnDate: form.returnDate.value,
            tripType: form.tripType.value,
            adults: form.adults.value,
            children: form.children.value,
            infants: form.infants.value,
            travelClass: form.travelClass.options[form.travelClass.selectedIndex].text,
            totalPrice: totalPrice.textContent
        };
        // Hide form, show review
        stepBookingInfo.style.display = 'none';
        // Replace summary section with review
        bookingSummarySection.innerHTML = `
            <div class="card summary-card">
                <h2><i class="fa-solid fa-eye"></i> Review Your Booking</h2>
                <div class="summary-details">
                    <div><b>From:</b> ${bookingData.departureCity || '-'} <i class='fa-solid fa-arrow-right'></i> <b>To:</b> ${bookingData.destinationCity || '-'}</div>
                    <div><b>Departure:</b> ${bookingData.departureDate || '-'}${bookingData.tripType === 'roundtrip' ? ` <b>Return:</b> ${bookingData.returnDate || '-'}` : ''}</div>
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
        // Add event listener for OK
        document.getElementById('okReviewBtn').onclick = showStep3;
    }

    // Step 3: Done
    function showStep3() {
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
    }

    // Continue button handler
    confirmBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showStep2();
    });

    // (Optional) Autocomplete for cities (stub)
    // You can integrate a real API or a list for production
    // For now, just a placeholder for UI

    // Set destination from query string if present
    const urlParams = new URLSearchParams(window.location.search);
    const dest = urlParams.get('destination');
    if (dest && form.destinationCity) {
        form.destinationCity.value = dest;
        form.dispatchEvent(new Event('input'));
    }
}); 