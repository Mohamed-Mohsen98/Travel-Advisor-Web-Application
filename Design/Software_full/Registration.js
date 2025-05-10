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

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

class UserRegistrationForm {
    constructor() {
        this.form = document.getElementById('registrationForm');
        this.usernameInput = document.getElementById('username');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirmPassword');
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        this.usernameInput.addEventListener('input', () => this.validateUsername());
        this.emailInput.addEventListener('input', () => this.validateEmail());
        this.passwordInput.addEventListener('input', () => this.validatePassword());
        this.confirmPasswordInput.addEventListener('input', () => this.confirmPassword());
        
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleSubmit();
        });
    }
    
    validateUsername() {
        const username = this.usernameInput.value.trim();
        const errorElement = document.getElementById('username-error');
        
        if (!username) {
            errorElement.textContent = 'This field is required.';
            return false;
        }
        if (username.length < 3 || /\s/.test(username) || !/^[a-zA-Z]+$/.test(username)) {
            errorElement.textContent = 'Invalid username';
            return false;
        }
        errorElement.textContent = '';
        return true;
    }
    
    validateEmail() {
        const email = this.emailInput.value.trim();
        const errorElement = document.getElementById('email-error');
        
        if (!email) {
            errorElement.textContent = 'This field is required.';
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errorElement.textContent = 'Please enter a valid email address (e.g., example@domain.com).';
            return false;
        }
        errorElement.textContent = '';
        return true;
    }
    
    validatePassword() {
        const password = this.passwordInput.value;
        const errorElement = document.getElementById('password-error');
        
        if (!password) {
            errorElement.textContent = 'This field is required.';
            return false;
        }
        if (password.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errorElement.textContent = 'Invalid password. Your password must be at least 8 characters long and include at least one special character (e.g., ! @ # $ %).';
            return false;
        }
        errorElement.textContent = '';
        return true;
    }
    
    confirmPassword() {
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;
        const errorElement = document.getElementById('confirmPassword-error');
        
        if (!confirmPassword) {
            errorElement.textContent = 'This field is required.';
            return false;
        }
        if (password !== confirmPassword) {
            errorElement.textContent = 'Passwords do not match.';
            return false;
        }
        errorElement.textContent = '';
        return true;
    }
    
    handleSubmit() {
        const isUsernameValid = this.validateUsername();
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        const isConfirmPasswordValid = this.confirmPassword();
        
        if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
            this.submit();
        }
    }
    
    async submit() {
        const username = this.usernameInput.value.trim();
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;

        try {
            // 1. Create authenticated user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            // 2. Store additional user data
            await set(ref(database, 'users/' + userId), {
                username: username,
                email: email,
                role: "User", // default role
                createdAt: new Date().toISOString()
            });

            alert('Registration successful! Welcome to Travel Advisor.');
            this.form.reset();

            // ✅ Redirect to homepage
            window.location.href = "home.html";  // Change path as needed

        } catch (error) {
            console.error('Registration error:', error);

            if (error.code === 'auth/email-already-in-use') {
                document.getElementById('email-error').textContent = 'This email is already registered.';
            } else {
                alert('Registration failed: ' + error.message);
            }
        }
    }
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UserRegistrationForm();
});
