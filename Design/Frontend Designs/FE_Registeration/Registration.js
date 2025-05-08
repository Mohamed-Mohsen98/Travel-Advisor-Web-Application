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
        
        if (username.length < 3) {
            errorElement.textContent = 'Invalid username';
            return false;
        }
        
        if (/\s/.test(username)) {
            errorElement.textContent = 'Invalid username';
            return false;
        }
        
        const usernameRegex = /^[a-zA-Z]+$/;
        if (!usernameRegex.test(username)) {
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
        
        if (password.length < 8) {
            errorElement.textContent = 'Invalid password. Your password must be at least 8 characters long and include at least one special character (e.g., ! @ # $ %).';
            return false;
        }
        
        const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
        if (!specialChars.test(password)) {
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
    
    submit() {
        // In a real application, you would send the data to a server here
        console.log('Form submitted successfully!');
        console.log('Username:', this.usernameInput.value.trim());
        console.log('Email:', this.emailInput.value.trim());
        
        // Reset form after submission
        this.form.reset();
        
        // Show success message
        alert('Registration successful! Welcome to Travel Advisor.');
    }
}

// Initialize the form when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new UserRegistrationForm();
});