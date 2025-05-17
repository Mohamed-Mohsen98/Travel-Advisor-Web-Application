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
  storageBucket: "travel-advisor-cac06.appspot.com",
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
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const firebaseError = document.getElementById("firebaseError");
const loginSuccessPopup = document.getElementById("loginSuccessPopup");

sessionStorage.setItem('isLoggedIn', 'true');

class Login {
  #email;
  #password;

  constructor(email, password) {
    this.#email = email.trim();
    this.#password = password;
  }

  validateMail() {
    return this.#email && this.#email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.#email);
  }

  validatePass() {
    return this.#password && this.#password.length > 0 && this.#password.length <= 60;
  }

  async submit() {
    // Clear previous errors
    emailError.textContent = "";
    passwordError.textContent = "";
    firebaseError.textContent = "";

    let isValid = true;

    if (!this.#email || this.#email.trim() === "") {
      emailError.textContent = "This field is required.";
      isValid = false;
    } else if (!this.validateMail()) {
      emailError.textContent = "Please enter a valid email address.";
      isValid = false;
    }

    if (!this.#password || this.#password.trim() === "") {
      passwordError.textContent = "This field is required.";
      isValid = false;
    } else if (!this.validatePass()) {
      passwordError.textContent = "Please enter a password."; // You might want a more specific message here
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, this.#email, this.#password);
      const userId = userCredential.user.uid;
      const userSnapshot = await get(ref(database, 'users/' + userId));

      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        const userRole = userData.role;

        // Store user ID in session storage
        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('isLoggedIn', 'true');

        loginSuccessPopup.classList.remove("hidden");

        setTimeout(() => {
          loginSuccessPopup.classList.add("hidden");

          // Check if there's a return URL
          const returnUrl = sessionStorage.getItem('returnUrl');
          if (returnUrl) {
            sessionStorage.removeItem('returnUrl'); // Clear the return URL
            window.location.href = returnUrl;
          } else {
            // Default redirect based on role
            if (userRole === "Admin") {
              window.location.href = "admin.html";
            } else {
              window.location.href = "home.html";
            }
          }
        }, 2000);
      } else {
        firebaseError.textContent = "User data not found in the database.";
      }
    } catch (error) {
      console.error("Login error:", error);
      switch (error.code) {
        case "auth/user-not-found":
          firebaseError.textContent = "User not found.";
          break;
        case "auth/wrong-password":
          firebaseError.textContent = "Incorrect password.";
          break;
        case "auth/too-many-requests":
          firebaseError.textContent = "Too many failed attempts. Please try again later.";
          break;
        default:
          firebaseError.textContent = "Login failed ";
      }
    }
  }
}

// Event listener
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;

  const login = new Login(email, password);
  login.submit();
});