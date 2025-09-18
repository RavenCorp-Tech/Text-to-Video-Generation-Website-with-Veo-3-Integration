// Authentication related functions
let currentUser = null;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
});

function checkAuthStatus() {
    // Check local storage for user data
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateUIForLoggedInUser(currentUser);
        return true;
    }
    
    return false;
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Please fill in all fields.');
        return;
    }
    
    // Simulate API login (in a real app, this would be a server request)
    simulateLogin(email, password)
        .then(user => {
            currentUser = user;
            localStorage.setItem('user', JSON.stringify(user));
            
            hideModal('loginModal');
            updateUIForLoggedInUser(user);
            
            // Check if user is subscribed
            if (!user.isSubscribed) {
                setTimeout(() => {
                    showSubscriptionModal();
                }, 1000);
            }
        })
        .catch(error => {
            alert(error);
        });
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }
    
    // Simulate API signup (in a real app, this would be a server request)
    simulateSignup(name, email, password)
        .then(user => {
            currentUser = user;
            localStorage.setItem('user', JSON.stringify(user));
            
            hideModal('signupModal');
            updateUIForLoggedInUser(user);
            
            // Show subscription modal for new users
            setTimeout(() => {
                showSubscriptionModal();
            }, 1000);
        })
        .catch(error => {
            alert(error);
        });
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('user');
    
    document.querySelector('.auth-section').style.display = 'flex';
    document.querySelector('.user-section').style.display = 'none';
    document.getElementById('generator').style.display = 'none';
}

// Simulated API functions (replace these with real API calls in production)
function simulateLogin(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate user validation
            if (email === 'demo@example.com' && password === 'password') {
                resolve({
                    id: '123',
                    name: 'Demo User',
                    email: 'demo@example.com',
                    credits: 950,
                    isSubscribed: true,
                    subscriptionEnd: '2025-10-18',
                    usage: {
                        fast: 1,
                        quality: 0
                    }
                });
            } else {
                // For demo purposes, create a user with the entered email
                resolve({
                    id: '456',
                    name: email.split('@')[0],
                    email: email,
                    credits: 0,
                    isSubscribed: false,
                    usage: {
                        fast: 0,
                        quality: 0
                    }
                });
            }
        }, 1000);
    });
}

function simulateSignup(name, email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // In a real app, you would validate and create the user in your backend
            resolve({
                id: '789',
                name: name,
                email: email,
                credits: 0,
                isSubscribed: false,
                usage: {
                    fast: 0,
                    quality: 0
                }
            });
        }, 1000);
    });
}
