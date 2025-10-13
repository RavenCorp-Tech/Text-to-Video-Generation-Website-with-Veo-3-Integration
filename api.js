/**
 * API Integration with Gemini 2.5 for Video Generation
 * This module handles all interactions with the Gemini API
 */

// Import configuration module
const { config, isValid } = require('./config');

// API Configuration
const API_CONFIG = {
    baseUrl: config.gemini.apiUrl,
    apiKey: config.gemini.apiKey,
    videoModel: config.gemini.videoModel,
    maxTokens: config.gemini.maxTokens,
    temperature: config.gemini.temperature
};

// API Endpoints
const ENDPOINTS = {
    generateVideo: '/generateContent',
    getStatus: '/status',
    getUser: '/user'
};

// Server API Endpoints (for server proxy)
const SERVER_ENDPOINTS = {
    generateVideo: '/api/generate-video',
    getStatus: '/api/status',
    getUser: '/api/user'
};

/**
 * Initialize the API with configuration
 * @param {Object} customConfig - Optional custom configuration to override defaults
 * @param {string} customConfig.apiKey - API key for authentication
 * @returns {boolean} Whether initialization was successful
 */
function initializeAPI(customConfig = {}) {
    if (customConfig.apiKey) {
        API_CONFIG.apiKey = customConfig.apiKey;
    }
    
    if (!API_CONFIG.apiKey) {
        console.error('API key is required for Gemini API');
        return false;
    }
    
    // Check if config is valid
    if (!isValid) {
        console.error('Invalid configuration. Check your environment variables.');
        return false;
    }
    
    return true;
}

/**
 * Generate a video from text prompt
 * @param {Object} params - Video generation parameters
 * @param {string} params.prompt - Text prompt for video generation
 * @param {string} params.model - Model to use for generation (fast or quality)
 * @param {Object} params.user - User object with authentication and payment info
 * @param {Function} callback - Callback function to handle response
 * @returns {Promise} Promise that resolves to video generation response
 */
async function generateVideo(params) {
    // Check if API is initialized
    if (!API_CONFIG.apiKey) {
        // Try to use server proxy if direct API access isn't available
        try {
            return await generateVideoViaServer(params);
        } catch (serverError) {
            console.error('Failed to generate video via server:', serverError);
            throw new Error('API not initialized and server proxy failed. Check your API configuration.');
        }
    }
    
    // Check for required parameters
    if (!params.prompt) {
        throw new Error('Prompt is required for video generation.');
    }
    
    // Verify user is authenticated if auth is required
    if (config.auth.required && (!params.user || !params.user.id)) {
        throw new Error('Authentication is required for video generation.');
    }
    
    // Verify user has payment info if payment is required
    if (config.payment.required && (!params.user || !params.user.hasPaymentMethod)) {
        throw new Error('Payment method is required for video generation.');
    }
    
    // Verify user has subscription if needed
    if (config.payment.required && (!params.user || !params.user.isSubscribed)) {
        throw new Error('Active subscription is required for video generation.');
    }
    
    // Check video generation limits based on model
    const isQualityModel = params.model === 'veo3-quality' || params.model === 'quality';
    
    if (isQualityModel && params.user.remainingQualityVideos <= 0) {
        throw new Error('You have reached your weekly limit for quality videos.');
    } else if (!isQualityModel && params.user.remainingFastVideos <= 0) {
        throw new Error('You have reached your weekly limit for fast videos.');
    }
    
    // Check if user has enough credits
    const requiredCredits = isQualityModel ? 
                            config.limits.qualityVideoCost : 
                            config.limits.fastVideoCost;
    
    if (params.user.credits < requiredCredits) {
        throw new Error(`Insufficient credits. Required: ${requiredCredits}, Available: ${params.user.credits}`);
    }
    
    // Create request body for Gemini API
    const requestBody = {
        contents: [
            {
                role: "user",
                parts: [
                    { text: params.prompt }
                ]
            }
        ],
        generation_config: {
            temperature: API_CONFIG.temperature,
            max_output_tokens: API_CONFIG.maxTokens,
            output_video: true
        }
    };
    
    try {
        // Construct the URL with API key
        const url = `${API_CONFIG.baseUrl}:${ENDPOINTS.generateVideo}?key=${API_CONFIG.apiKey}`;
        
        // Make the API request
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
        }
        
        const data = await response.json();
        
        // Update user's remaining videos and credits
        if (isQualityModel) {
            params.user.remainingQualityVideos--;
        } else {
            params.user.remainingFastVideos--;
        }
        
        params.user.credits -= requiredCredits;
        
        // Save the updated user data
        if (params.user.updateUsage) {
            await params.user.updateUsage();
        }
        
        return data;
        
    } catch (error) {
        console.error('Error generating video:', error);
        throw error;
    }
}

/**
 * Check if the user can generate a video with the given model
 * @param {Object} user - The user object
 * @param {string} model - The model to use (fast or quality)
 * @returns {Object} Object containing validation result and error message if any
 */
function validateUserForVideoGeneration(user, model) {
    if (!user) {
        return { 
            isValid: false, 
            error: 'User is not authenticated' 
        };
    }
    
    if (config.auth.required && !user.id) {
        return { 
            isValid: false, 
            error: 'Authentication is required for video generation' 
        };
    }
    
    if (config.payment.required) {
        if (!user.hasPaymentMethod) {
            return { 
                isValid: false, 
                error: 'Payment method is required for video generation' 
            };
        }
        
        if (!user.isSubscribed) {
            return { 
                isValid: false, 
                error: 'Active subscription is required for video generation' 
            };
        }
    }
    
    // Check limits based on model
    const isQualityModel = model === 'veo3-quality' || model === 'quality';
    
    if (isQualityModel && user.remainingQualityVideos <= 0) {
        return { 
            isValid: false, 
            error: 'You have reached your weekly limit for quality videos'
        };
    } else if (!isQualityModel && user.remainingFastVideos <= 0) {
        return { 
            isValid: false, 
            error: 'You have reached your weekly limit for fast videos'
        };
    }
    
    // Check credits
    const requiredCredits = isQualityModel ? 
                        config.limits.qualityVideoCost : 
                        config.limits.fastVideoCost;
    
    if (user.credits < requiredCredits) {
        return { 
            isValid: false, 
            error: `Insufficient credits. Required: ${requiredCredits}, Available: ${user.credits}`
        };
    }
    
    return { isValid: true };
}

/**
 * Get the configuration for the API
 * @returns {Object} The current API configuration
 */
function getApiConfig() {
    return { ...API_CONFIG };
}

/**
 * Get the limits for video generation
 * @returns {Object} The current limits configuration
 */
function getLimits() {
    return { ...config.limits };
}

/**
 * Generate a video via server proxy (when direct API access isn't available)
 * @param {Object} params - The same parameters as generateVideo
 * @returns {Promise} Promise that resolves to video generation response
 */
async function generateVideoViaServer(params) {
    try {
        // Use the server proxy endpoint
        const response = await fetch(SERVER_ENDPOINTS.generateVideo, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': params.user && params.user.token ? `Bearer ${params.user.token}` : ''
            },
            body: JSON.stringify({
                prompt: params.prompt,
                model: params.model
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate video via server');
        }
        
        const data = await response.json();
        
        // Update user's remaining videos and credits if successful
        if (params.user) {
            const isQualityModel = params.model === 'veo3-quality' || params.model === 'quality';
            
            if (isQualityModel) {
                params.user.remainingQualityVideos--;
            } else {
                params.user.remainingFastVideos--;
            }
            
            const requiredCredits = isQualityModel ? 
                                (config.limits ? config.limits.qualityVideoCost : 200) : 
                                (config.limits ? config.limits.fastVideoCost : 100);
            
            params.user.credits -= requiredCredits;
            
            // Save the updated user data
            if (params.user.updateUsage) {
                await params.user.updateUsage();
            }
        }
        
        return data;
    } catch (error) {
        console.error('Error generating video via server:', error);
        throw error;
    }
}

// Export the API methods
module.exports = {
    initializeAPI,
    generateVideo,
    validateUserForVideoGeneration,
    getApiConfig,
    getLimits,
    generateVideoViaServer
};
