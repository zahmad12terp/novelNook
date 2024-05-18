document.addEventListener('DOMContentLoaded', function() {
    // See masked Password Input
    const eyeIcon = document.getElementById('eyeIcon');
    if (eyeIcon) {
        eyeIcon.addEventListener('click', function() {
            const passwordInput = document.getElementById('userPass');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
        });
    }

    // Password Validation code
    const passwordInput = document.getElementById('userPass');
    const lengthRequirement = document.getElementById('lengthRequirement');
    const uppercaseRequirement = document.getElementById('uppercaseRequirement');
    const lowercaseRequirement = document.getElementById('lowercaseRequirement');
    const numberRequirement = document.getElementById('numberRequirement');

    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = passwordInput.value;

            // Check length requirement
            lengthRequirement.style.color = password.length >= 6 ? 'green' : 'red';

            // Check uppercase requirement
            uppercaseRequirement.style.color = /[A-Z]/.test(password) ? 'green' : 'red';

            // Check lowercase requirement
            lowercaseRequirement.style.color = /[a-z]/.test(password) ? 'green' : 'red';

            // Check number requirement
            numberRequirement.style.color = /\d/.test(password) ? 'green' : 'red';
        });
    }

    // Form submission event listener
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent default form submission

            const email = document.getElementById('userEmail').value; // Get email value
            const password = document.getElementById('userPass').value; // Get password value
            const userName = document.getElementById('userName').value; // Get username value
            const fullName = document.getElementById('fullName').value; // Get full name value

            try {
                // Send signup request to backend
                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userEmail: email, userPass: password, userName: userName, fullName: fullName })
                });

                if (!response.ok) {
                    throw new Error('Failed to sign up user');
                }

                const data = await response.json();
                alert(data.message); // Display success message

                // Store the JWT token in local storage or cookies
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }

                // Redirect to the login page
                window.location.href = 'login.html';

            } catch (error) {
                console.error('Error signing up user:', error.message);
                alert('An error occurred while signing up user');
            }
        });
    }

    // User Authentication and Navigation Logic
    const loginLink = document.getElementById('login-link');
    const signupLink = document.getElementById('signup-link');
    const logoutLink = document.getElementById('logout-link');
    const accountLink = document.getElementById('account-link');
    const myBooksLink = document.getElementById('mybooks-link');
    const accountDropdown = document.getElementById('account-dropdown');

    // Check if the user is logged in
    const token = localStorage.getItem('token');

    if (token) {
        // Decode the token to get user information (assuming the token payload contains username)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const username = payload.userName;

        // Update the UI to reflect the logged-in state
        accountLink.textContent = username;
        loginLink.style.display = 'none';
        signupLink.style.display = 'none';
        myBooksLink.style.display = 'block';
        logoutLink.style.display = 'block';

        // Handle logout
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault();
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });

        // Ensure My Books page is accessible only to logged-in users
        if (window.location.pathname === '/mybooks.html' && !token) {
            window.location.href = 'login.html';
        }
    } else {
        // User is not logged in, show login and signup links
        loginLink.style.display = 'block';
        signupLink.style.display = 'block';
        logoutLink.style.display = 'none';

        // Redirect to login page if trying to access My Books page
        if (window.location.pathname === '/mybooks.html') {
            window.location.href = 'login.html';
        }
    }
});
