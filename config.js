/**
 * Configuration Module for VeoCreator
 * Loads environment variables and provides configuration for the application
 */

// Configuration Object
const config = {
    // Gemini API Configuration
    gemini: {
        apiKey: process.env.GEMINI_API_KEY || '',
        apiUrl: process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision',
        videoModel: process.env.GEMINI_VIDEO_MODEL || 'gemini-2.5-pro-vision',
        maxTokens: parseInt(process.env.GEMINI_MAX_TOKENS || '8192'),
        temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.7')
    },
    
    // Authentication Configuration
    auth: {
        required: process.env.AUTH_REQUIRED !== 'false', // Default to true
        firebase: {
            apiKey: process.env.FIREBASE_API_KEY || '',
            authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'veocreator.firebaseapp.com',
            projectId: process.env.FIREBASE_PROJECT_ID || 'veocreator-project',
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'veocreator-project.appspot.com',
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
            appId: process.env.FIREBASE_APP_ID || ''
        }
    },
    
    // Payment Integration
    payment: {
        required: process.env.PAYMENT_REQUIRED !== 'false', // Default to true
        stripe: {
            publicKey: process.env.STRIPE_PUBLIC_KEY || '',
            secretKey: process.env.STRIPE_SECRET_KEY || ''
        },
        subscriptionPriceId: process.env.SUBSCRIPTION_PRICE_ID || '',
        currency: process.env.CURRENCY || 'INR',
        monthlyPrice: parseInt(process.env.MONTHLY_PRICE || '99')
    },
    
    // Video Generation Limits
    limits: {
        maxFastVideosPerWeek: parseInt(process.env.MAX_FAST_VIDEOS_PER_WEEK || '4'),
        maxQualityVideosPerWeek: parseInt(process.env.MAX_QUALITY_VIDEOS_PER_WEEK || '1'),
        creditsPerSubscription: parseInt(process.env.CREDITS_PER_SUBSCRIPTION || '950'),
        fastVideoCost: parseInt(process.env.FAST_VIDEO_COST || '80'),
        qualityVideoCost: parseInt(process.env.QUALITY_VIDEO_COST || '150')
    },
    
    // Video Pricing
    pricing: {
        veo3PricePerSecond: parseFloat(process.env.VEO3_PRICE_PER_SECOND || '0.40'),
        veo3FastPricePerSecond: parseFloat(process.env.VEO3_FAST_PRICE_PER_SECOND || '0.15'),
        veo3OldPricePerSecond: parseFloat(process.env.VEO3_OLD_PRICE_PER_SECOND || '0.75'),
        veo3FastOldPricePerSecond: parseFloat(process.env.VEO3_FAST_OLD_PRICE_PER_SECOND || '0.40')
    },
    
    // Video Features
    features: {
        supportVerticalFormat: process.env.SUPPORT_VERTICAL_FORMAT === 'true',
        support1080pOutput: process.env.SUPPORT_1080P_OUTPUT === 'true'
    },
    
    // Application Settings
    app: {
        nodeEnv: process.env.NODE_ENV || 'development',
        port: parseInt(process.env.PORT || '3000'),
        debug: process.env.DEBUG === 'true'
    }
};

/**
 * Validates that required configuration is present
 * @returns {boolean} Whether the configuration is valid
 */
function validateConfig() {
    // Check for required Gemini API settings
    if (!config.gemini.apiKey) {
        console.error('Missing GEMINI_API_KEY in environment variables');
        return false;
    }
    
    // Check for required Firebase settings if auth is required
    if (config.auth.required) {
        if (!config.auth.firebase.apiKey) {
            console.error('Missing FIREBASE_API_KEY in environment variables');
            return false;
        }
        if (!config.auth.firebase.appId) {
            console.error('Missing FIREBASE_APP_ID in environment variables');
            return false;
        }
    }
    
    // Check for required Stripe settings if payment is required
    if (config.payment.required) {
        if (!config.payment.stripe.publicKey || !config.payment.stripe.secretKey) {
            console.error('Missing Stripe API keys in environment variables');
            return false;
        }
        if (!config.payment.subscriptionPriceId) {
            console.error('Missing SUBSCRIPTION_PRICE_ID in environment variables');
            return false;
        }
    }
    
    return true;
}

// Validate configuration when the module is loaded
const isValid = validateConfig();
if (!isValid && config.app.nodeEnv === 'production') {
    throw new Error('Invalid configuration for production environment');
}

module.exports = {
    config,
    isValid
};