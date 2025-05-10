// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

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
const auth = getAuth(app);
const database = getDatabase(app);

// DOM Elements
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const popup = document.getElementById("loginSuccessPopup");

// Email format regex (standard)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let email = emailInput.value.trim();
  const password = passwordInput.value;

  // Trimmed email update for input field
  emailInput.value = email;

  // Validation checks
  if (!email) {
    alert("Email field is required.");
    return;
  }

  if (email !== emailInput.value) {
    alert("Leading/trailing spaces removed from email.");
    emailInput.value = email; // auto-correct the email field
    return;
  }

  if (!emailRegex.test(email)) {
    alert("Invalid email address.");
    return;
  }

  if (!password) {
    alert("Password field is required.");
    return;
  }

  if (password.length > 60) {
    alert("Password is too long.");
    return;
  }

  try {
    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Get user data from database
    const userSnapshot = await get(ref(database, 'users/' + userId));

    if (userSnapshot.exists()) {
      // Show success popup
      popup.classList.remove("hidden");
      setTimeout(() => {
        popup.classList.add("hidden");
        window.location.href = "home.html"; // redirect
      }, 2000);
    } else {
      alert("User data not found in the database.");
    }

  } catch (error) {
    console.error("Login error:", error);
    switch (error.code) {
      case "auth/user-not-found":
        alert("User not found.");
        break;
      case "auth/wrong-password":
        alert("Incorrect password.");
        break;
      case "auth/too-many-requests":
        alert("Too many failed attempts. Please try again later.");
        break;
      default:
        alert("Login failed: " + error.message);
    }
  }
});
