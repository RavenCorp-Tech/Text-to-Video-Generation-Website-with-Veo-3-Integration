// Main application script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI components
    initUI();
    
    // Check if user is logged in
    checkAuthStatus();
    
    // Detect user's country and set appropriate currency
    detectCountryAndSetCurrency();
});

function initUI() {
    // Mobile navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }
    
    // Accordion functionality
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const accordionItem = button.parentElement;
            accordionItem.classList.toggle('active');
        });
    });
    
    // Auth modal controls
    document.getElementById('loginBtn').addEventListener('click', showLoginModal);
    document.getElementById('signupBtn').addEventListener('click', showSignupModal);
    document.getElementById('showLoginModal').addEventListener('click', (e) => {
        e.preventDefault();
        hideModal('signupModal');
        showLoginModal();
    });
    document.getElementById('showSignupModal').addEventListener('click', (e) => {
        e.preventDefault();
        hideModal('loginModal');
        showSignupModal();
    });
    
    // Close modal buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            hideModal(modal.id);
        });
    });
    
    // Get Started button
    document.getElementById('getStartedBtn').addEventListener('click', () => {
        const isLoggedIn = checkAuthStatus();
        if (isLoggedIn) {
            scrollToGenerator();
        } else {
            showSignupModal();
        }
    });
    
    // Subscribe button
    document.getElementById('subscribeBtn').addEventListener('click', () => {
        const isLoggedIn = checkAuthStatus();
        if (isLoggedIn) {
            showSubscriptionModal();
        } else {
            showLoginModal();
        }
    });
    
    // Video generation model toggle
    document.getElementById('fastModelBtn').addEventListener('click', () => {
        setActiveModel('fast');
    });
    
    document.getElementById('qualityModelBtn').addEventListener('click', () => {
        setActiveModel('quality');
    });
    
    // Generate video button
    document.getElementById('generateBtn').addEventListener('click', () => {
        const title = document.getElementById('videoTitle').value;
        const prompt = document.getElementById('videoPrompt').value;
        const model = document.querySelector('.model-btn.active').id === 'fastModelBtn' ? 'veo3fast' : 'veo3quality';
        
        if (!title || !prompt) {
            alert('Please provide both a title and description for your video.');
            return;
        }
        
        generateVideo(title, prompt, model);
    });
}

function setActiveModel(model) {
    const fastBtn = document.getElementById('fastModelBtn');
    const qualityBtn = document.getElementById('qualityModelBtn');
    
    if (model === 'fast') {
        fastBtn.classList.add('active');
        qualityBtn.classList.remove('active');
    } else {
        qualityBtn.classList.add('active');
        fastBtn.classList.remove('active');
    }
}

function showLoginModal() {
    showModal('loginModal');
}

function showSignupModal() {
    showModal('signupModal');
}

function showSubscriptionModal() {
    showModal('subscriptionModal');
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

function scrollToGenerator() {
    document.getElementById('generator').scrollIntoView({
        behavior: 'smooth'
    });
}

function updateUIForLoggedInUser(user) {
    const authSection = document.querySelector('.auth-section');
    const userSection = document.querySelector('.user-section');
    const generatorSection = document.getElementById('generator');
    
    authSection.style.display = 'none';
    userSection.style.display = 'flex';
    generatorSection.style.display = 'block';
    
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userCredits').textContent = `${user.credits} credits`;
    
    updateUsageCounts(user.usage);
}

function updateUsageCounts(usage) {
    document.getElementById('fastUsage').textContent = `(${usage.fast}/4 this week)`;
    document.getElementById('qualityUsage').textContent = `(${usage.quality}/1 this week)`;
    
    // Disable buttons if usage limit is reached
    const fastBtn = document.getElementById('fastModelBtn');
    const qualityBtn = document.getElementById('qualityModelBtn');
    
    if (usage.fast >= 4) {
        fastBtn.disabled = true;
        fastBtn.classList.add('disabled');
    } else {
        fastBtn.disabled = false;
        fastBtn.classList.remove('disabled');
    }
    
    if (usage.quality >= 1) {
        qualityBtn.disabled = true;
        qualityBtn.classList.add('disabled');
    } else {
        qualityBtn.disabled = false;
        qualityBtn.classList.remove('disabled');
    }
}

function detectCountryAndSetCurrency() {
    // This would normally use a geolocation API
    // For this example, we'll just simulate it
    
    // Fetch user's country (simulated)
    const userCountry = simulateCountryDetection();
    
    // Set appropriate currency based on country
    const currencyInfo = getCurrencyForCountry(userCountry);
    
    // Update price display
    const price = convertPrice(99, 'INR', currencyInfo.code);
    document.getElementById('displayPrice').innerHTML = `${currencyInfo.symbol}${price} <span>/month</span>`;
    document.getElementById('subscriptionPrice').innerHTML = `${currencyInfo.symbol}${price} <span>/month</span>`;
}

function simulateCountryDetection() {
    // In a real application, you would use a geolocation API
    const countries = ['IN', 'US', 'GB', 'EU', 'JP', 'AU'];
    const randomIndex = Math.floor(Math.random() * countries.length);
    return countries[randomIndex];
}

function getCurrencyForCountry(countryCode) {
    const currencies = {
        'IN': { code: 'INR', symbol: '₹' },
        'US': { code: 'USD', symbol: '$' },
        'GB': { code: 'GBP', symbol: '£' },
        'EU': { code: 'EUR', symbol: '€' },
        'JP': { code: 'JPY', symbol: '¥' },
        'AU': { code: 'AUD', symbol: 'A$' }
    };
    
    return currencies[countryCode] || currencies['IN']; // Default to INR
}

function convertPrice(amount, fromCurrency, toCurrency) {
    // This would normally use a currency conversion API
    // For this example, we'll use hardcoded conversion rates
    const rates = {
        'INR': 1,
        'USD': 0.012,
        'GBP': 0.0095,
        'EUR': 0.011,
        'JPY': 1.8,
        'AUD': 0.018
    };
    
    // Convert from INR to target currency
    const convertedAmount = Math.round(amount * rates[toCurrency]);
    return convertedAmount;
}
