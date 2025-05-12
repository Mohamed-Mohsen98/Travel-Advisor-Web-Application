// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
  const addUserBtn = document.getElementById('addUserBtn');
  const userModal = document.getElementById('userModal');
  const cancelBtn = document.getElementById('cancelBtn');
  const form = document.getElementById('registrationForm');

  // Show modal
  addUserBtn.addEventListener('click', () => {
    userModal.style.display = 'block';
  });

  // Hide modal
  cancelBtn.addEventListener('click', () => {
    userModal.style.display = 'none';
    form.reset();
    clearErrors();
  });

  // Clear error messages
  function clearErrors() {
    ["username", "email", "password", "confirmPassword"].forEach(id => {
      document.getElementById(`${id}-error`).textContent = '';
    });
  }

  // Form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    clearErrors();

    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    let hasError = false;

    // Validation
    if (!username) {
      document.getElementById('username-error').textContent = 'This field is required.';
      hasError = true;
    } else if (!/^[a-zA-Z]+$/.test(username)) {
      document.getElementById('username-error').textContent = 'Invalid username.';
      hasError = true;
    }

    if (!email) {
      document.getElementById('email-error').textContent = 'This field is required.';
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('email-error').textContent = 'Please enter a valid email address.';
      hasError = true;
    }

    if (!password) {
      document.getElementById('password-error').textContent = 'This field is required.';
      hasError = true;
    } else if (password.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      document.getElementById('password-error').textContent = 'Password must be at least 8 characters and include a special character.';
      hasError = true;
    }

    if (!confirmPassword) {
      document.getElementById('confirmPassword-error').textContent = 'This field is required.';
      hasError = true;
    } else if (password !== confirmPassword) {
      document.getElementById('confirmPassword-error').textContent = 'Passwords do not match.';
      hasError = true;
    }

    if (hasError) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      await set(ref(database, 'users/' + userId), {
        username: username,
        email: email,
        role: "User",
        createdAt: new Date().toISOString()
      });

      alert("User registered successfully!");
      form.reset();
      userModal.style.display = 'none';
    } catch (error) {
      console.error('Firebase error:', error);
      if (error.code === 'auth/email-already-in-use') {
        document.getElementById('email-error').textContent = 'This email is already registered.';
      } else {
        alert('Registration failed: ' + error.message);
      }
    }
  });
});
