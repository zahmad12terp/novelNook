document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPass').value;

        console.log('Login Data:', { email, password }); // Log the form data

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userEmail: email, userPass: password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to log in:', errorData);
                throw new Error(errorData.error || 'Failed to log in');
            }

            const data = await response.json();
            alert(data.message);

            // Store the token in local storage or a cookie
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            // Redirect to the home page
            window.location.href = '/home.html';
            
        } catch (error) {
            console.error('Error logging in:', error.message);
            alert('An error occurred while logging in');
        }
    });
});
