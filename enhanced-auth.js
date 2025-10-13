/**
 * Enhanced Authentication Module for VeoCreator
 * Handles user authentication, registration, and form validation
 */

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Enhanced Auth: Initializing authentication UI');
    setTimeout(initializeAuthUI, 100); // Small delay to ensure DOM is fully loaded
});

/**
 * Initialize the authentication UI components
 */
function initializeAuthUI() {
    // Set up form validation
    setupFormValidation();
    
    // Set up password toggle buttons
    setupPasswordToggles();
    
    // Set up form submission events
    setupFormSubmissions();
    
    // Set up social login buttons
    setupSocialLogins();
    
    // Set up password reset functionality
    setupPasswordReset();
    
    // Set up auth modal event listeners
    setupAuthModalEvents();
}

/**
 * Set up form validation for all auth forms
 */
function setupFormValidation() {
    // Login form validation
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    
    loginEmail?.addEventListener('blur', () => validateEmail(loginEmail, 'loginEmailError'));
    loginPassword?.addEventListener('blur', () => validateRequired(loginPassword, 'loginPasswordError'));
    
    // Signup form validation
    const signupName = document.getElementById('signupName');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const signupConfirmPassword = document.getElementById('signupConfirmPassword');
    
    signupName?.addEventListener('blur', () => validateRequired(signupName, 'signupNameError'));
    signupEmail?.addEventListener('blur', () => validateEmail(signupEmail, 'signupEmailError'));
    signupPassword?.addEventListener('blur', () => validatePassword(signupPassword, 'signupPasswordError'));
    signupConfirmPassword?.addEventListener('blur', () => validatePasswordMatch(signupPassword, signupConfirmPassword, 'signupConfirmPasswordError'));
    
    // Password reset form validation
    const resetEmail = document.getElementById('resetEmail');
    resetEmail?.addEventListener('blur', () => validateEmail(resetEmail, 'resetEmailError'));
}

/**
 * Set up password toggle functionality for password fields
 */
function setupPasswordToggles() {
    const toggleButtons = document.querySelectorAll('.password-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-for');
            const passwordField = document.getElementById(targetId);
            const icon = button.querySelector('i');
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

/**
 * Set up form submission handlers
 */
function setupFormSubmissions() {
    // Login form submission
    const doLoginBtn = document.getElementById('doLoginBtn');
    if (doLoginBtn) {
        // Clone the button to remove all event listeners
        const oldLoginBtn = doLoginBtn;
        const newLoginBtn = oldLoginBtn.cloneNode(true);
        oldLoginBtn.parentNode.replaceChild(newLoginBtn, oldLoginBtn);
        
        // Add our event listener to the new button
        newLoginBtn.addEventListener('click', handleLoginSubmit);
        console.log('Login button event listener set up');
    }
    
    // Signup form submission
    const doSignupBtn = document.getElementById('doSignupBtn');
    if (doSignupBtn) {
        // Clone the button to remove all event listeners
        const oldSignupBtn = doSignupBtn;
        const newSignupBtn = oldSignupBtn.cloneNode(true);
        oldSignupBtn.parentNode.replaceChild(newSignupBtn, oldSignupBtn);
        
        // Add our event listener to the new button
        newSignupBtn.addEventListener('click', handleSignupSubmit);
        console.log('Signup button event listener set up');
    }
    
    // Password reset form submission
    const doResetBtn = document.getElementById('doResetBtn');
    if (doResetBtn) {
        // Clone the button to remove all event listeners
        const oldResetBtn = doResetBtn;
        const newResetBtn = oldResetBtn.cloneNode(true);
        oldResetBtn.parentNode.replaceChild(newResetBtn, oldResetBtn);
        
        // Add our event listener to the new button
        newResetBtn.addEventListener('click', handlePasswordResetSubmit);
        console.log('Password reset button event listener set up');
    }
    
    // Also add enter key support for the forms
    const loginForm = document.getElementById('loginForm');
    loginForm?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleLoginSubmit();
        }
    });
    
    const signupForm = document.getElementById('signupForm');
    signupForm?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSignupSubmit();
        }
    });
    
    const resetForm = document.getElementById('passwordResetForm');
    resetForm?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handlePasswordResetSubmit();
        }
    });
}

/**
 * Set up social login buttons
 */
function setupSocialLogins() {
    // Google login
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    googleLoginBtn?.addEventListener('click', () => handleSocialLogin('google'));
    
    const googleSignupBtn = document.getElementById('googleSignupBtn');
    googleSignupBtn?.addEventListener('click', () => handleSocialLogin('google'));
    
    // GitHub login
    const githubLoginBtn = document.getElementById('githubLoginBtn');
    githubLoginBtn?.addEventListener('click', () => handleSocialLogin('github'));
    
    const githubSignupBtn = document.getElementById('githubSignupBtn');
    githubSignupBtn?.addEventListener('click', () => handleSocialLogin('github'));
}

/**
 * Set up password reset functionality
 */
function setupPasswordReset() {
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const backToLoginLink = document.getElementById('backToLogin');
    
    forgotPasswordLink?.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthForm('passwordResetForm');
    });
    
    backToLoginLink?.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthForm('loginForm');
    });
}

/**
 * Set up auth modal event listeners
 */
function setupAuthModalEvents() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');
    const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
    const signupTab = document.querySelector('.auth-tab[data-tab="signup"]');
    
    // Login and signup buttons in the header
    loginBtn?.addEventListener('click', () => {
        openAuthModal('login');
    });
    
    signupBtn?.addEventListener('click', () => {
        openAuthModal('signup');
    });
    
    // Close button for auth modal
    closeAuthModal?.addEventListener('click', () => {
        const authModal = document.getElementById('authModal');
        authModal.classList.add('hidden');
    });
    
    // Switch between login/signup forms
    switchToSignup?.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthForm('signupForm');
    });
    
    switchToLogin?.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthForm('loginForm');
    });
    
    // Auth tabs
    loginTab?.addEventListener('click', () => {
        switchAuthForm('loginForm');
    });
    
    signupTab?.addEventListener('click', () => {
        switchAuthForm('signupForm');
    });
}

/**
 * Handle login form submission
 */
function handleLoginSubmit() {
    // Show loading state
    showAuthLoading();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Validate form
    const isEmailValid = validateEmail(document.getElementById('loginEmail'), 'loginEmailError');
    const isPasswordValid = validateRequired(document.getElementById('loginPassword'), 'loginPasswordError');
    
    if (!isEmailValid || !isPasswordValid) {
        hideAuthLoading();
        return;
    }
    
    // Check if we should use the auth.js login function
    if (typeof window.authModule !== 'undefined' && typeof window.authModule.loginUser === 'function') {
        window.authModule.loginUser(email, password)
            .then(user => {
                hideAuthLoading();
                closeAuthModal();
                updateUserUI(user);
            })
            .catch(error => {
                hideAuthLoading();
                showError('loginEmailError', error.message || 'Login failed');
            });
    } 
    // Call Firebase login directly if available
    else if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Successful login
                hideAuthLoading();
                closeAuthModal();
                
                // Update UI for logged in user
                updateUserUI(userCredential.user);
            })
            .catch((error) => {
                hideAuthLoading();
                showError('loginEmailError', getAuthErrorMessage(error.code));
            });
    } else {
        // Fallback for development/demo mode using main app's simulation
        setTimeout(() => {
            hideAuthLoading();
            
            if (window.VeoCreator && typeof window.VeoCreator.simulateSuccessfulAuth === 'function') {
                window.VeoCreator.simulateSuccessfulAuth({
                    name: 'Demo User',
                    email: email,
                    isSubscribed: true
                });
            } else {
                // Basic fallback if main app function isn't available
                const user = {
                    displayName: 'Demo User',
                    email: email,
                    uid: 'demo-user-id'
                };
                updateUserUI(user);
            }
            
            closeAuthModal();
        }, 1000);
    }
}

/**
 * Handle signup form submission
 */
function handleSignupSubmit() {
    // Show loading state
    showAuthLoading();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Validate form
    const isNameValid = validateRequired(document.getElementById('signupName'), 'signupNameError');
    const isEmailValid = validateEmail(document.getElementById('signupEmail'), 'signupEmailError');
    const isPasswordValid = validatePassword(document.getElementById('signupPassword'), 'signupPasswordError');
    const doPasswordsMatch = validatePasswordMatch(
        document.getElementById('signupPassword'), 
        document.getElementById('signupConfirmPassword'), 
        'signupConfirmPasswordError'
    );
    
    if (!isNameValid || !isEmailValid || !isPasswordValid || !doPasswordsMatch) {
        hideAuthLoading();
        return;
    }
    
    // Check if we should use the auth.js signup function
    if (typeof window.authModule !== 'undefined' && typeof window.authModule.registerUser === 'function') {
        window.authModule.registerUser(email, password, name)
            .then(user => {
                hideAuthLoading();
                closeAuthModal();
                updateUserUI(user);
                showSubscriptionModal();
            })
            .catch(error => {
                hideAuthLoading();
                showError('signupEmailError', error.message || 'Signup failed');
            });
    }
    // Call Firebase signup directly if available
    else if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Update the user profile with the name
                return userCredential.user.updateProfile({
                    displayName: name
                }).then(() => userCredential);
            })
            .then((userCredential) => {
                hideAuthLoading();
                closeAuthModal();
                
                // Update UI for logged in user
                updateUserUI(userCredential.user);
                
                // Show subscription modal since this is a new user
                showSubscriptionModal();
            })
            .catch((error) => {
                hideAuthLoading();
                showError('signupEmailError', getAuthErrorMessage(error.code));
            });
    } else {
        // Fallback for development/demo mode using main app's simulation
        setTimeout(() => {
            hideAuthLoading();
            
            if (window.VeoCreator && typeof window.VeoCreator.simulateSuccessfulAuth === 'function') {
                window.VeoCreator.simulateSuccessfulAuth({
                    name: name,
                    email: email,
                    isSubscribed: false
                });
            } else {
                // Basic fallback if main app function isn't available
                const user = {
                    displayName: name,
                    email: email,
                    uid: 'demo-user-id'
                };
                updateUserUI(user);
            }
            
            closeAuthModal();
            showSubscriptionModal();
        }, 1000);
    }
}

/**
 * Handle password reset form submission
 */
function handlePasswordResetSubmit() {
    // Show loading state
    showAuthLoading();
    
    const email = document.getElementById('resetEmail').value;
    
    // Validate form
    const isEmailValid = validateEmail(document.getElementById('resetEmail'), 'resetEmailError');
    
    if (!isEmailValid) {
        hideAuthLoading();
        return;
    }
    
    // Call Firebase password reset
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                hideAuthLoading();
                // Show success message
                showSuccessMessage('resetEmail', 'Password reset email sent! Check your inbox.');
                
                // Switch back to login after 3 seconds
                setTimeout(() => {
                    switchAuthForm('loginForm');
                }, 3000);
            })
            .catch((error) => {
                hideAuthLoading();
                showError('resetEmailError', getAuthErrorMessage(error.code));
            });
    } else {
        // Fallback for development/demo mode
        setTimeout(() => {
            hideAuthLoading();
            showSuccessMessage('resetEmail', 'Password reset email sent! Check your inbox.');
            
            // Switch back to login after 3 seconds
            setTimeout(() => {
                switchAuthForm('loginForm');
            }, 3000);
        }, 1000);
    }
}

/**
 * Handle social login (Google, GitHub)
 * @param {string} provider - The provider ('google' or 'github')
 */
function handleSocialLogin(provider) {
    // Show loading state
    showAuthLoading();
    
    let authProvider;
    
    if (typeof firebase !== 'undefined' && firebase.auth) {
        if (provider === 'google') {
            authProvider = new firebase.auth.GoogleAuthProvider();
        } else if (provider === 'github') {
            authProvider = new firebase.auth.GithubAuthProvider();
        }
        
        firebase.auth().signInWithPopup(authProvider)
            .then((result) => {
                hideAuthLoading();
                closeAuthModal();
                
                // Update UI for logged in user
                updateUserUI(result.user);
                
                // If it's a new user, show the subscription modal
                if (result.additionalUserInfo.isNewUser) {
                    showSubscriptionModal();
                }
            })
            .catch((error) => {
                hideAuthLoading();
                alert(getAuthErrorMessage(error.code));
            });
    } else {
        // Fallback for development/demo mode
        setTimeout(() => {
            hideAuthLoading();
            
            // Simulate successful social login
            const providerDisplayName = provider === 'google' ? 'Google User' : 'GitHub User';
            
            const user = {
                displayName: providerDisplayName,
                email: `${provider.toLowerCase()}@example.com`,
                uid: `demo-${provider}-user-id`,
                photoURL: provider === 'google' ? 
                    'https://lh3.googleusercontent.com/a/placeholder-image' : 
                    'https://avatars.githubusercontent.com/u/0'
            };
            
            updateUserUI(user);
            closeAuthModal();
            
            // 50% chance to simulate a new user and show subscription modal
            if (Math.random() > 0.5) {
                showSubscriptionModal();
            }
        }, 1000);
    }
}

/**
 * Validate email field
 * @param {HTMLElement} field - The email input field
 * @param {string} errorId - The ID of the error element
 * @returns {boolean} Whether the field is valid
 */
function validateEmail(field, errorId) {
    if (!field) return false;
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailPattern.test(field.value);
    
    if (!isValid) {
        showError(errorId, 'Please enter a valid email address');
    } else {
        hideError(field, errorId);
    }
    
    return isValid;
}

/**
 * Validate required field
 * @param {HTMLElement} field - The input field
 * @param {string} errorId - The ID of the error element
 * @returns {boolean} Whether the field is valid
 */
function validateRequired(field, errorId) {
    if (!field) return false;
    
    const isValid = field.value.trim() !== '';
    
    if (!isValid) {
        showError(errorId, 'This field is required');
    } else {
        hideError(field, errorId);
    }
    
    return isValid;
}

/**
 * Validate password field
 * @param {HTMLElement} field - The password input field
 * @param {string} errorId - The ID of the error element
 * @returns {boolean} Whether the field is valid
 */
function validatePassword(field, errorId) {
    if (!field) return false;
    
    const password = field.value;
    const isValid = password.length >= 8;
    
    if (!isValid) {
        showError(errorId, 'Password must be at least 8 characters');
    } else {
        hideError(field, errorId);
    }
    
    return isValid;
}

/**
 * Validate password match
 * @param {HTMLElement} passwordField - The password input field
 * @param {HTMLElement} confirmField - The confirm password input field
 * @param {string} errorId - The ID of the error element
 * @returns {boolean} Whether the fields match
 */
function validatePasswordMatch(passwordField, confirmField, errorId) {
    if (!passwordField || !confirmField) return false;
    
    const password = passwordField.value;
    const confirm = confirmField.value;
    const isValid = password === confirm && password !== '';
    
    if (!isValid) {
        showError(errorId, 'Passwords don\'t match');
    } else {
        hideError(confirmField, errorId);
    }
    
    return isValid;
}

/**
 * Show error message for a field
 * @param {string} errorId - The ID of the error element
 * @param {string} message - The error message
 */
function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (!errorElement) return;
    
    errorElement.textContent = message;
    errorElement.parentElement.classList.add('has-error');
}

/**
 * Hide error message for a field
 * @param {HTMLElement} field - The input field
 * @param {string} errorId - The ID of the error element
 */
function hideError(field, errorId) {
    const errorElement = document.getElementById(errorId);
    if (!errorElement) return;
    
    errorElement.textContent = '';
    field.parentElement.classList.remove('has-error');
}

/**
 * Show success message for a field
 * @param {string} fieldId - The ID of the input field
 * @param {string} message - The success message
 */
function showSuccessMessage(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.style.color = 'var(--success-color)';
    successElement.style.fontSize = '14px';
    successElement.style.marginTop = '10px';
    successElement.textContent = message;
    
    // Remove any existing success message
    const existingSuccess = field.parentElement.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    field.parentElement.appendChild(successElement);
}

/**
 * Show auth loading overlay
 */
function showAuthLoading() {
    const loading = document.getElementById('authLoading');
    if (loading) loading.classList.add('active');
}

/**
 * Hide auth loading overlay
 */
function hideAuthLoading() {
    const loading = document.getElementById('authLoading');
    if (loading) loading.classList.remove('active');
}

/**
 * Switch between auth forms
 * @param {string} formId - The ID of the form to switch to
 */
function switchAuthForm(formId) {
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => {
        form.classList.remove('active');
    });
    
    const form = document.getElementById(formId);
    if (form) form.classList.add('active');
    
    // Update tabs if switching between login and signup
    if (formId === 'loginForm' || formId === 'signupForm') {
        const tabs = document.querySelectorAll('.auth-tab');
        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-tab') === formId.replace('Form', '')) {
                tab.classList.add('active');
            }
        });
    }
}

/**
 * Opens the auth modal and switches to the specified tab
 * @param {string} tab - The tab to open ('login' or 'signup')
 */
function openAuthModal(tab) {
    // If we have the main app's openAuthModal function, use it
    if (window.VeoCreator && typeof window.VeoCreator.openAuthModal === 'function') {
        window.VeoCreator.openAuthModal(tab);
    } else {
        // Fallback implementation
        const authModal = document.getElementById('authModal');
        const formId = tab === 'login' ? 'loginForm' : 'signupForm';
        
        // Show the modal
        if (authModal) authModal.classList.remove('hidden');
        
        // Switch to the correct form
        switchAuthForm(formId);
    }
}

/**
 * Close the auth modal
 */
function closeAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) authModal.classList.add('hidden');
}

/**
 * Show the subscription modal
 */
function showSubscriptionModal() {
    const subscriptionModal = document.getElementById('subscriptionModal');
    if (subscriptionModal) subscriptionModal.classList.remove('hidden');
}

/**
 * Update UI for logged in user
 * @param {Object} user - The user object
 */
function updateUserUI(user) {
    if (!user) return;
    
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const userProfile = document.getElementById('userProfile');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    
    if (loginBtn) loginBtn.classList.add('hidden');
    if (signupBtn) signupBtn.classList.add('hidden');
    
    if (userProfile) userProfile.classList.remove('hidden');
    if (userName) userName.textContent = user.displayName || 'User';
    if (userAvatar && user.photoURL) userAvatar.src = user.photoURL;
    
    // Update app state
    if (window.VeoCreator && window.VeoCreator.setUserLoggedIn) {
        window.VeoCreator.setUserLoggedIn(user);
    }
    
    // Show video creation section
    const createVideoSection = document.getElementById('createVideo');
    if (createVideoSection) createVideoSection.classList.remove('hidden');
}

/**
 * Get user-friendly error message for auth errors
 * @param {string} errorCode - Firebase error code
 * @returns {string} User-friendly error message
 */
function getAuthErrorMessage(errorCode) {
    const errorMessages = {
        'auth/user-not-found': 'No account found with this email address.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/email-already-in-use': 'This email is already in use. Try logging in instead.',
        'auth/weak-password': 'Password is too weak. Use at least 8 characters.',
        'auth/invalid-email': 'Invalid email address format.',
        'auth/account-exists-with-different-credential': 'An account already exists with the same email address but different sign-in credentials.',
        'auth/operation-not-allowed': 'This sign-in method is not enabled.',
        'auth/popup-blocked': 'The browser blocked the popup. Please allow popups for this site.',
        'auth/popup-closed-by-user': 'The sign-in popup was closed before completing the sign in.',
        'auth/network-request-failed': 'A network error occurred. Check your connection and try again.'
    };
    
    return errorMessages[errorCode] || 'An error occurred. Please try again.';
}