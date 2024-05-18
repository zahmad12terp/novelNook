document.addEventListener('DOMContentLoaded', function() {
    const loginLink = document.getElementById('login-link');
    const signupLink = document.getElementById('signup-link');
    const logoutLink = document.getElementById('logout-link');
    const accountLink = document.getElementById('account-link');
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
      // accountDropdown.style.display = 'none';
      logoutLink.style.display = 'block';
  
      // Handle logout
      logoutLink.addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.removeItem('token');
        window.location.href = 'login.html';
      });
    } else {
      // User is not logged in, show login and signup links
      loginLink.style.display = 'block';
      signupLink.style.display = 'block';
      logoutLink.style.display = 'none';
    }
  });
  