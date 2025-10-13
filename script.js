// VeoCreator Application
const VeoCreator = (function() {
    // Private variables and functions
    let appState = {
        isLoggedIn: false,
        currentUser: null,
        isSubscribed: false,
        hasPaymentMethod: false,
        remainingFastVideos: 4,
        remainingQualityVideos: 1,
        credits: 950,
        isGenerating: false
    };
    
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', initializeApp);
    
    function initializeApp() {
    // DOM Elements
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const authModal = document.getElementById('authModal');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');
    const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
    const signupTab = document.querySelector('.auth-tab[data-tab="signup"]');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const doLoginBtn = document.getElementById('doLoginBtn');
    const doSignupBtn = document.getElementById('doSignupBtn');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const subscribeBtn = document.getElementById('subscribeBtn');
    const subscriptionModal = document.getElementById('subscriptionModal');
    const closeSubModal = document.getElementById('closeSubModal');
    const completePaymentBtn = document.getElementById('completePaymentBtn');
    const promptText = document.getElementById('promptText');
    const charCount = document.getElementById('charCount');
    const generateBtn = document.getElementById('generateBtn');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const galleryGrid = document.getElementById('galleryGrid');
    
    // App State
    const appState = {
        isLoggedIn: false,
        currentUser: null,
        isSubscribed: false,
        hasPaymentMethod: false,
        remainingFastVideos: 4,
        remainingQualityVideos: 1,
        credits: 950,
        isGenerating: false
    };
    
    // Initialize API and Authentication
    initializeServices();
    
    // Initialize the gallery with sample videos
    initializeGallery();
    
    // Initialize API and Authentication with configuration
    function initializeServices() {
        // Get the configuration
        const config = window.VeoConfig;
        
        if (!config) {
            console.error('Configuration not loaded');
            return;
        }
        
        // Initialize Authentication
        if (window.authModule) {
            window.authModule.initializeAuth(config.auth.firebase)
                .then((success) => {
                    if (success) {
                        console.log('Authentication initialized successfully');
                        
                        // Listen for auth state changes
                        document.addEventListener('authStateChanged', (event) => {
                            const user = event.detail.user;
                            if (user) {
                                // Update app state with user data
                                appState.isLoggedIn = true;
                                appState.currentUser = user;
                                appState.isSubscribed = user.isSubscribed || false;
                                appState.hasPaymentMethod = user.hasPaymentMethod || false;
                                appState.remainingFastVideos = user.remainingFastVideos || 0;
                                appState.remainingQualityVideos = user.remainingQualityVideos || 0;
                                appState.credits = user.credits || 0;
                                
                                // Update the UI
                                updateUserInterface();
                            } else {
                                appState.isLoggedIn = false;
                                appState.currentUser = null;
                                appState.isSubscribed = false;
                                appState.hasPaymentMethod = false;
                                
                                // Update the UI
                                updateUserInterface();
                            }
                        });
                    }
                });
        }
        
        // Initialize API
        if (window.VeoAPI && window.VeoAPI.initializeAPI) {
            window.VeoAPI.initializeAPI({
                apiKey: config.gemini ? config.gemini.apiKey : null
            });
        }
    }
    
    // Auth event handlers are now managed by enhanced-auth.js
    // We'll just make sure our authModal, switchAuthTab and openAuthModal functions 
    // are available globally for enhanced-auth.js to use
    
    // Expose necessary functions to window
    window.VeoCreator = window.VeoCreator || {};
    window.VeoCreator.openAuthModal = openAuthModal;
    window.VeoCreator.switchAuthTab = switchAuthTab;
    window.VeoCreator.simulateSuccessfulAuth = simulateSuccessfulAuth;
    
    // Event Listeners for Subscription Modal
    subscribeBtn.addEventListener('click', () => {
        if (!appState.isLoggedIn) {
            openAuthModal('signup');
            return;
        }
        subscriptionModal.classList.remove('hidden');
    });
    
    closeSubModal.addEventListener('click', () => {
        subscriptionModal.classList.add('hidden');
    });
    
    completePaymentBtn.addEventListener('click', handleSubscription);
    
    // Event Listeners for Video Creation
    promptText.addEventListener('input', () => {
        charCount.textContent = promptText.value.length;
    });
    
    generateBtn.addEventListener('click', handleVideoGeneration);
    getStartedBtn.addEventListener('click', handleGetStarted);
    
    // Mobile Navigation
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
    
    // Functions
    function openAuthModal(tab) {
        switchAuthTab(tab);
        authModal.classList.remove('hidden');
    }
    
    function switchAuthTab(tab) {
        if (tab === 'login') {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        } else {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }
    
    function handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }
        
        // In a real app, this would call your auth.js login function
        // Here we'll simulate a successful login
        simulateSuccessfulAuth({
            name: 'Demo User',
            email: email,
            isSubscribed: true
        });
    }
    
    function handleSignup() {
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
        
        // In a real app, this would call your auth.js signup function
        // Here we'll simulate a successful signup but not subscribed
        simulateSuccessfulAuth({
            name: name,
            email: email,
            isSubscribed: false
        });
        
        // Show subscription modal after signup
        subscriptionModal.classList.remove('hidden');
    }
    
    function handleSubscription() {
        const cardName = document.getElementById('cardName').value;
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        
        if (!cardName || !cardNumber || !expiryDate || !cvv) {
            alert('Please fill in all payment details.');
            return;
        }
        
        // Simulate successful subscription
        appState.isSubscribed = true;
        updateUserInterface();
        
        // Close the modal
        subscriptionModal.classList.add('hidden');
        
        // Show success message
        alert('Subscription successful! You now have 950 credits to create videos.');
    }
    
    function simulateSuccessfulAuth(user) {
        appState.isLoggedIn = true;
        appState.currentUser = user;
        appState.isSubscribed = user.isSubscribed;
        
        // Update UI based on logged in state
        updateUserInterface();
        
        // Close the auth modal
        authModal.classList.add('hidden');
    }
    
    function updateUserInterface() {
        // Update navigation
        loginBtn.classList.toggle('hidden', appState.isLoggedIn);
        signupBtn.classList.toggle('hidden', appState.isLoggedIn);
        document.getElementById('userProfile').classList.toggle('hidden', !appState.isLoggedIn);
        
        if (appState.isLoggedIn) {
            document.getElementById('userName').textContent = appState.currentUser.name;
            
            // Show creator section and dashboard if subscribed
            document.getElementById('createVideo').classList.toggle('hidden', !appState.isSubscribed);
            document.getElementById('dashboard').classList.toggle('hidden', !appState.isSubscribed);
            
            // Update dashboard stats
            document.getElementById('dashFastUsed').textContent = 4 - appState.remainingFastVideos;
            document.getElementById('dashQualityUsed').textContent = 1 - appState.remainingQualityVideos;
            document.getElementById('dashCredits').textContent = appState.credits;
            
            // Update progress bars
            document.getElementById('fastProgress').style.width = `${((4 - appState.remainingFastVideos) / 4) * 100}%`;
            document.getElementById('qualityProgress').style.width = `${(1 - appState.remainingQualityVideos) * 100}%`;
            
            // Update creation section counters
            document.getElementById('fastRemaining').textContent = appState.remainingFastVideos;
            document.getElementById('qualityRemaining').textContent = appState.remainingQualityVideos;
            document.getElementById('userCredits').textContent = appState.credits;
        }
    }
    
    function handleGetStarted() {
        if (!appState.isLoggedIn) {
            openAuthModal('signup');
        } else if (!appState.isSubscribed) {
            subscriptionModal.classList.remove('hidden');
        } else {
            // Scroll to create video section
            document.getElementById('createVideo').scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
    
    function handleVideoGeneration() {
        // Import API and validation utilities
        const api = window.VeoAPI || {};
        
        // Check if user is logged in
        if (!appState.isLoggedIn) {
            alert('Please log in to generate videos.');
            openAuthModal('login');
            return;
        }
        
        // Validate prompt
        const prompt = promptText.value.trim();
        if (!prompt) {
            alert('Please enter a text prompt for your video.');
            return;
        }
        
        if (prompt.length > 500) {
            alert('Prompt exceeds maximum length of 500 characters.');
            return;
        }
        
        const selectedModel = document.querySelector('input[name="model"]:checked').value;
        
        // Use API to validate user can generate video
        const userForValidation = {
            id: appState.currentUser ? appState.currentUser.id : null,
            isSubscribed: appState.isSubscribed,
            hasPaymentMethod: appState.hasPaymentMethod,
            remainingFastVideos: appState.remainingFastVideos,
            remainingQualityVideos: appState.remainingQualityVideos,
            credits: appState.credits
        };
        
        // If we have access to our API validation utility
        if (api.validateUserForVideoGeneration) {
            const validationResult = api.validateUserForVideoGeneration(userForValidation, selectedModel);
            
            if (!validationResult.isValid) {
                alert(validationResult.error);
                
                // If the issue is payment or subscription related, open subscription modal
                if (validationResult.error.includes('Payment') || validationResult.error.includes('subscription')) {
                    subscriptionModal.classList.remove('hidden');
                }
                return;
            }
        } else {
            // Fallback validation if API isn't available
            // Check if user has remaining videos for the selected model
            if (selectedModel === 'veo3-fast' && appState.remainingFastVideos <= 0) {
                alert('You have reached your weekly limit for Veo 3 Fast videos.');
                return;
            }
            
            if (selectedModel === 'veo3-quality' && appState.remainingQualityVideos <= 0) {
                alert('You have reached your weekly limit for Veo 3 Quality videos.');
                return;
            }
            
            // Check if user has enough credits
            const creditCost = selectedModel === 'veo3-fast' ? 
                clientConfig.limits.fastVideoCost : clientConfig.limits.qualityVideoCost;
                
            document.getElementById('genCost').textContent = creditCost;
            
            if (appState.credits < creditCost) {
                alert(`You don't have enough credits to generate this video. Required: ${creditCost}, Available: ${appState.credits}`);
                return;
            }
        }
            alert('You don\'t have enough credits to generate this video.');
            return;
        }
        
        // Show loading indicator
        startVideoGeneration(selectedModel, prompt);
    },
    
    startVideoGeneration: function(model, prompt) {
        appState.isGenerating = true;
        
        // Update UI to show generating state
        document.getElementById('generateBtn').disabled = true;
        document.getElementById('previewPlaceholder').classList.add('hidden');
        document.getElementById('loadingIndicator').classList.remove('hidden');
        document.getElementById('videoActions').classList.add('hidden');
        document.getElementById('videoPreview').classList.add('hidden');
        
        // Simulate API call to Flow
        const processingTime = model === 'veo3-fast' ? 3000 : 6000; // 3 or 6 seconds for demo
        document.getElementById('estimatedTime').textContent = model === 'veo3-fast' ? '30-60' : '60-120';
        
        // Use the API.js module to handle the actual request
        setTimeout(() => {
            // This would be replaced by the actual API response
            const videoUrl = getSampleVideoUrl();
            
            // Update user's limits and credits
            if (model === 'veo3-fast') {
                appState.remainingFastVideos--;
                appState.credits -= 100;
            } else {
                appState.remainingQualityVideos--;
                appState.credits -= 200;
            }
            
            // Update UI
            finishVideoGeneration(videoUrl, prompt);
            updateUserInterface();
            
            // In a real app, save the video to user's history
            addToRecentVideos(videoUrl, prompt, model);
        }, processingTime);
    }
    
    function finishVideoGeneration(videoUrl, prompt) {
        appState.isGenerating = false;
        
        // Update UI to show completed state
        document.getElementById('generateBtn').disabled = false;
        document.getElementById('loadingIndicator').classList.add('hidden');
        document.getElementById('videoActions').classList.remove('hidden');
        
        // Set the video source and display it
        const videoEl = document.getElementById('videoPreview');
        videoEl.src = videoUrl;
        videoEl.classList.remove('hidden');
        videoEl.play();
    }
    
    function addToRecentVideos(videoUrl, prompt, model) {
        const recentVideosEl = document.getElementById('recentVideos');
        const noVideosEl = recentVideosEl.querySelector('.no-videos');
        
        if (noVideosEl) {
            noVideosEl.remove();
        }
        
        // Create video element
        const videoItem = document.createElement('div');
        videoItem.classList.add('gallery-item');
        videoItem.innerHTML = `
            <video src="${videoUrl}" preload="metadata"></video>
            <div class="gallery-item-overlay">
                <h4>${truncate(prompt, 40)}</h4>
                <p>${model === 'veo3-fast' ? 'Veo 3 Fast' : 'Veo 3 Quality'} • ${formatDate(new Date())}</p>
            </div>
        `;
        
        // Add to recent videos
        recentVideosEl.prepend(videoItem);
        
        // Add click event to play/pause
        const videoEl = videoItem.querySelector('video');
        videoItem.addEventListener('click', () => {
            if (videoEl.paused) {
                videoEl.play();
            } else {
                videoEl.pause();
            }
        });
    }
    
    function initializeGallery() {
        // Sample videos for gallery
        const samplePrompts = [
            "A serene lake surrounded by mountains at sunset",
            "Urban cityscape with flying cars in a futuristic setting",
            "Cherry blossoms falling in a Japanese garden",
            "Ocean waves crashing against a rocky shore",
            "Northern lights dancing across the night sky",
            "A space station orbiting Earth with the sun rising in the background"
        ];
        
        // Clear existing gallery
        galleryGrid.innerHTML = '';
        
        // Create sample gallery items
        for (let i = 0; i < 6; i++) {
            const videoUrl = getSampleVideoUrl();
            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');
            
            galleryItem.innerHTML = `
                <video src="${videoUrl}" preload="metadata" loop muted></video>
                <div class="gallery-item-overlay">
                    <h4>${samplePrompts[i]}</h4>
                    <p>${i % 2 === 0 ? 'Veo 3 Fast' : 'Veo 3 Quality'} • Community Creation</p>
                </div>
            `;
            
            galleryGrid.appendChild(galleryItem);
            
            // Add hover effect to play video
            const video = galleryItem.querySelector('video');
            galleryItem.addEventListener('mouseenter', () => {
                video.play();
            });
            
            galleryItem.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
            
            // Add click event to play/pause
            galleryItem.addEventListener('click', () => {
                if (video.paused) {
                    video.muted = false;
                    video.play();
                } else {
                    video.pause();
                    video.muted = true;
                }
            });
        }
    }
    
    // Helper functions
    function getSampleVideoUrl() {
        // For demo purposes, return a sample video URL
        // In a real app, this would come from the API response
        const sampleVideos = [
            'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
            'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
            'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4',
            'https://assets.mixkit.co/videos/preview/mixkit-countryside-meadow-4075-large.mp4',
            'https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4',
            'https://assets.mixkit.co/videos/preview/mixkit-white-sand-beach-and-palm-trees-1169-large.mp4'
        ];
        return sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
    }
    
    function truncate(str, length) {
        if (str.length <= length) return str;
        return str.substring(0, length) + '...';
    }
    
    function formatDate(date) {
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
});
