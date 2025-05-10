// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

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
const storage = getStorage(app);

// Function to fetch country image from Firebase Storage
export async function getCountryImage(countryName) {
    try {
        // Create a reference to the image in Firebase Storage
        // Assuming images are stored in a 'countries' folder with country names as filenames
        const imageRef = ref(storage, `countries/${countryName.toLowerCase()}.jpg`);
        
        // Get the download URL
        const imageUrl = await getDownloadURL(imageRef);
        return imageUrl;
    } catch (error) {
        console.error('Error fetching country image:', error);
        // Return a default image URL or null if the image doesn't exist
        return null;
    }
}

// Function to display country image in an HTML element
export async function displayCountryImage(countryName, imageElement) {
    try {
        const imageUrl = await getCountryImage(countryName);
        if (imageUrl) {
            imageElement.src = imageUrl;
            imageElement.alt = `${countryName} image`;
        } else {
            // Set a default image if the country image is not found
            imageElement.src = '/path/to/default-image.jpg';
            imageElement.alt = 'Default image';
        }
    } catch (error) {
        console.error('Error displaying country image:', error);
    }
}

// Example usage:
// const countryImage = document.getElementById('countryImage');
// displayCountryImage('France', countryImage); 