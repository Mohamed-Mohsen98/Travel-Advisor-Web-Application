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
const popup = document.getElementById("loginSuccessPopup");

class Login {
  #email;
  #password;

  constructor(email, password) {
    this.#email = email.trim();
    this.#password = password;
  }

  validateMail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return this.#email && emailRegex.test(this.#email);
  }

  validatePass() {
    return this.#password && this.#password.length <= 60;
  }

  async submit() {
    if (!this.validateMail()) {
      alert("Invalid or missing email.");
      return;
    }

    if (!this.validatePass()) {
      alert("Invalid or missing password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, this.#email, this.#password);
      const userId = userCredential.user.uid;
      const userSnapshot = await get(ref(database, 'users/' + userId));

      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        const userRole = userData.role;

        popup.classList.remove("hidden");

        setTimeout(() => {
          popup.classList.add("hidden");

          // Redirect based on role
          if (userRole === "Admin") {
            window.location.href = "admin.html";
          } else {
            window.location.href = "home.html";
          }
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
