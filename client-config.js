/**
 * Client-side Configuration Module for VeoCreator
 * Loads environment variables into the browser
 * 
 * SECURITY NOTE: This file does NOT contain actual API keys.
 * The placeholder values are replaced by the server during rendering.
 * Never store sensitive keys directly in client-side JavaScript.
 */

// Configuration Object for client-side access
const clientConfig = {
    // Gemini API Configuration (public parts only)
    gemini: {
        videoModel: 'gemini-2.5-pro-vision',
        maxTokens: 8192,
        temperature: 0.7
        // apiKey is NOT included in client-side config for security
    },
    
    // Authentication Configuration
    auth: {
        required: true,
        firebase: {
            // These values are replaced by the server during rendering
            apiKey: '{{FIREBASE_API_KEY}}', // Placeholder - replaced server-side
            authDomain: 'veocreator.firebaseapp.com',
            projectId: 'veocreator-project',
            storageBucket: 'veocreator-project.appspot.com',
            messagingSenderId: '123456789012',
            appId: '1:123456789012:web:abcdef1234567890'
        }
    },
    
    // Payment Integration (public parts only)
    payment: {
        required: true,
        stripe: {
            publicKey: '{{STRIPE_PUBLIC_KEY}}' // Placeholder - replaced server-side
        },
        currency: 'INR',
        monthlyPrice: 99
    },
    
    // Video Generation Limits
    limits: {
        maxFastVideosPerWeek: 4,
        maxQualityVideosPerWeek: 1,
        creditsPerSubscription: 950,
        fastVideoCost: 80,
        qualityVideoCost: 150
    },
    
    // Video Pricing
    pricing: {
        veo3PricePerSecond: 0.40,
        veo3FastPricePerSecond: 0.15,
        veo3OldPricePerSecond: 0.75,
        veo3FastOldPricePerSecond: 0.40,
        discountPercentage: 45
    },
    
    // New Features
    features: {
        verticalFormat: true,  // Enable vertical video format (9:16 aspect ratio)
        hdOutput: true,        // Enable 1080p HD output
        priceReduction: true,  // Enable price reduction messaging
        animatedUI: true       // Enable enhanced UI animations
    },
    
    // Video Features
    features: {
        supportVerticalFormat: true,
        support1080pOutput: true
    }
};

// Initialize the configuration
function initializeClientConfig() {
    // This would normally be replaced by server-side rendering
    // or an API call to get the configuration securely
    
    // In a real production environment, the server would inject
    // the actual values here from environment variables
}

// Make the configuration available globally
window.VeoConfig = clientConfig;

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeClientConfig);