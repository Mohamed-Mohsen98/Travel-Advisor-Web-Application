document.addEventListener('DOMContentLoaded', function () {
    const addUserBtn = document.getElementById('addUserBtn');
    const modalContainer = document.getElementById('modalContainer');

    addUserBtn.addEventListener('click', showAddUserModal);

    function showAddUserModal() {
        modalContainer.innerHTML = `
            <div class="modal-overlay">
                <div class="modal">
                    <h2>Add User</h2>
                    <form id="addUserForm">
                        <div class="field-error" id="error-username"></div>
                        <label>Username:<input type="text" name="username" required placeholder="Enter your username"></label><br>
                        <div class="field-error" id="error-email"></div>
                        <label>Email:<input type="email" name="email" required placeholder="Enter your email"></label><br>
                        <div class="field-error" id="error-password"></div>
                        <label>Password:<input type="password" name="password" required placeholder="Choose a password"></label><br>
                        <div class="field-error" id="error-confirmPassword"></div>
                        <label>Confirm Password:<input type="password" name="confirmPassword" required placeholder="Confirm your password"></label><br>
                        <div class="modal-actions">
                            <button type="submit">Add</button>
                            <button type="button" id="cancelBtn">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.getElementById('cancelBtn').onclick = closeModal;
        document.getElementById('addUserForm').onsubmit = handleAddUserSubmit;
    }

    function closeModal() {
        modalContainer.innerHTML = '';
    }

    function handleAddUserSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const username = form.username.value.trim();
        const email = form.email.value.trim();
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        // Clear all field errors
        ["username", "email", "password", "confirmPassword"].forEach(field => {
            document.getElementById(`error-${field}`).textContent = '';
        });
        let hasError = false;
        // 1. All fields required
        if (!username) {
            document.getElementById('error-username').textContent = 'This field is required.';
            hasError = true;
        }
        if (!email) {
            document.getElementById('error-email').textContent = 'This field is required.';
            hasError = true;
        }
        if (!password) {
            document.getElementById('error-password').textContent = 'This field is required.';
            hasError = true;
        }
        if (!confirmPassword) {
            document.getElementById('error-confirmPassword').textContent = 'This field is required.';
            hasError = true;
        }
        // 2. Username validation (only a-z, A-Z)
        if (username && !/^[a-zA-Z]+$/.test(username)) {
            document.getElementById('error-username').textContent = 'Invalid username.';
            hasError = true;
        }
        // 3. Email validation (simple pattern)
        if (email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            document.getElementById('error-email').textContent = 'Please enter a valid email address (e.g., example@domain.com).';
            hasError = true;
        }
        // 4. Password validation
        if (password && (password.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(password))) {
            document.getElementById('error-password').textContent = 'Your password must be at least 8 characters long and include at least one special character (e.g., ! @ # $ %).';
            hasError = true;
        }
        // 5. Confirm password
        if (password && confirmPassword && password !== confirmPassword) {
            document.getElementById('error-confirmPassword').textContent = 'Passwords do not match.';
            hasError = true;
        }
        if (hasError) return;
        // If all validations pass
        addUser({ username, email, password });
        closeModal();
    }

    // Stub function for adding user
    function addUser(data) {
        console.log('Add User:', data);
        // Example fetch call:
        // fetch('/api/users', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // })
        // .then(res => res.json())
        // .then(result => console.log(result));
    }
}); 