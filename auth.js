/**
 * Authentication Module for VeoCreator
 * Handles user authentication, registration, and payment validation
 */

// Create auth module namespace
window.authModule = {};

// Import configuration if available
const config = window.VeoConfig || {
    auth: { required: true },
    payment: { required: true }
};

// Firebase Auth state
let firebaseAuth = null;
let currentUser = null;

/**
 * Initialize authentication
 * @param {Object} firebaseConfig - Firebase configuration
 * @returns {Promise<boolean>} Whether initialization was successful
 */
async function initializeAuth(firebaseConfig) {
    try {
        // Check if Firebase is already available
        if (!window.firebase && !window.firebaseui) {
            console.error('Firebase libraries not loaded');
            return false;
        }
        
        // Initialize Firebase if not already initialized
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        
        firebaseAuth = firebase.auth();
        
        // Set up auth state listener
        firebaseAuth.onAuthStateChanged((user) => {
            if (user) {
                currentUser = {
                    id: user.uid,
                    name: user.displayName || 'User',
                    email: user.email,
                    isEmailVerified: user.emailVerified,
                    photoURL: user.photoURL
                };
                
                // Fetch user subscription and payment data
                fetchUserData(user.uid);
            } else {
                currentUser = null;
                // Trigger event for auth state change
                const authEvent = new CustomEvent('authStateChanged', { detail: { user: null } });
                document.dispatchEvent(authEvent);
            }
        });
        
        return true;
    } catch (error) {
        console.error('Error initializing authentication:', error);
        return false;
    }
}

/**
 * Sign in user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User object if successful
 */
async function login(email, password) {
    try {
        if (!firebaseAuth) {
            throw new Error('Authentication not initialized');
        }
        
        const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

/**
 * Register a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User name
 * @returns {Promise<Object>} User object if successful
 */
async function signup(email, password, name) {
    try {
        if (!firebaseAuth) {
            throw new Error('Authentication not initialized');
        }
        
        const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
        
        // Update user profile
        await userCredential.user.updateProfile({
            displayName: name
        });
        
        // Create user record in database
        await createUserRecord(userCredential.user.uid, {
            name,
            email,
            createdAt: new Date().toISOString(),
            isSubscribed: false,
            hasPaymentMethod: false,
            remainingFastVideos: 0,
            remainingQualityVideos: 0,
            credits: 0
        });
        
        return userCredential.user;
    } catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
}

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
async function logout() {
    try {
        if (!firebaseAuth) {
            throw new Error('Authentication not initialized');
        }
        
        await firebaseAuth.signOut();
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}

/**
 * Create user record in database
 * @param {string} userId - User ID
 * @param {Object} userData - User data
 * @returns {Promise<void>}
 */
async function createUserRecord(userId, userData) {
    try {
        if (!firebase.firestore) {
            console.error('Firestore not available');
            return;
        }
        
        const db = firebase.firestore();
        await db.collection('users').doc(userId).set(userData);
    } catch (error) {
        console.error('Error creating user record:', error);
        throw error;
    }
}

/**
 * Fetch user data from database
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User data
 */
async function fetchUserData(userId) {
    try {
        if (!firebase.firestore) {
            console.error('Firestore not available');
            return null;
        }
        
        const db = firebase.firestore();
        const doc = await db.collection('users').doc(userId).get();
        
        if (doc.exists) {
            const userData = doc.data();
            
            // Merge with current user
            currentUser = {
                ...currentUser,
                ...userData,
                id: userId,
                updateUsage: async () => {
                    return updateUserUsage(userId, {
                        remainingFastVideos: currentUser.remainingFastVideos,
                        remainingQualityVideos: currentUser.remainingQualityVideos,
                        credits: currentUser.credits
                    });
                }
            };
            
            // Trigger event for auth state change
            const authEvent = new CustomEvent('authStateChanged', { detail: { user: currentUser } });
            document.dispatchEvent(authEvent);
            
            return userData;
        } else {
            console.warn('User document does not exist');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

/**
 * Update user usage data
 * @param {string} userId - User ID
 * @param {Object} usageData - Usage data to update
 * @returns {Promise<void>}
 */
async function updateUserUsage(userId, usageData) {
    try {
        if (!firebase.firestore) {
            console.error('Firestore not available');
            return;
        }
        
        const db = firebase.firestore();
        await db.collection('users').doc(userId).update(usageData);
    } catch (error) {
        console.error('Error updating user usage:', error);
        throw error;
    }
}

/**
 * Get the current authenticated user
 * @returns {Object|null} Current user or null if not authenticated
 */
function getCurrentUser() {
    return currentUser;
}

/**
 * Check if payment is valid for the user
 * @param {Object} user - User object
 * @returns {boolean} Whether payment is valid
 */
function isPaymentValid(user) {
    if (!config.payment.required) {
        return true;
    }
    
    if (!user) {
        return false;
    }
    
    return user.hasPaymentMethod && user.isSubscribed;
}

// Export the auth module
window.VeoAuth = {
    initializeAuth,
    login,
    signup,
    logout,
    getCurrentUser,
    isPaymentValid
};

// Make functions available for enhanced auth module
window.authModule = {
    loginUser: login,
    registerUser: signup,
    logoutUser: logout,
    getCurrentUser: getCurrentUser,
    isPaymentValid: isPaymentValid,
    initializeAuth: initializeAuth
};

// Backward compatibility with existing code that uses VeoAuth
window.VeoAuth = window.authModule;