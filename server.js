/**
 * Server implementation for VeoCreator
 * This server handles API proxying and template rendering
 * to keep API keys secure on the server side
 */

// Import required modules
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS for all routes

// Content Security Policy middleware
app.use((req, res, next) => {
  // Set CSP header to prevent XSS attacks
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' https://www.gstatic.com https://js.stripe.com 'unsafe-inline'; " +
    "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "media-src 'self' blob:; " +
    "connect-src 'self' https://generativelanguage.googleapis.com https://firebaseauth.googleapis.com https://api.stripe.com; " +
    "frame-src 'self' https://js.stripe.com;"
  );
  
  // Set additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
});

// Serve static files
app.use(express.static('public'));

// Middleware to inject environment variables into templates
app.use((req, res, next) => {
  // Original Express sendFile method
  const originalSendFile = res.sendFile;
  
  // Override sendFile to process templates
  res.sendFile = function(filePath, options, callback) {
    // Only process HTML and JS files
    if (filePath.endsWith('.html') || filePath.endsWith('.js')) {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          return next(err);
        }
        
        // Replace placeholders with actual environment values
        let processedData = data;
        processedData = processedData.replace(/{{FIREBASE_API_KEY}}/g, process.env.FIREBASE_API_KEY);
        processedData = processedData.replace(/{{STRIPE_PUBLIC_KEY}}/g, process.env.STRIPE_PUBLIC_KEY);
        
        // Send processed file
        res.setHeader('Content-Type', filePath.endsWith('.html') ? 'text/html' : 'application/javascript');
        res.send(processedData);
      });
    } else {
      // For other files, use the original method
      originalSendFile.call(this, filePath, options, callback);
    }
  };
  
  next();
});

// Serve index page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    // Get auth token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Check if authentication is required based on env
      if (process.env.AUTH_REQUIRED === 'true') {
        return res.status(401).json({ error: 'Authentication required' });
      } else {
        // If auth not required, continue without auth
        req.user = null;
        return next();
      }
    }
    
    const token = authHeader.split(' ')[1];
    
    // In a real implementation, verify the token with Firebase
    // This is a simplified example
    if (!token) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // For demo, we're simulating successful authentication
    // In production, verify with Firebase Admin SDK
    req.user = { 
      id: 'simulated-user-id',
      isSubscribed: true,
      hasPaymentMethod: true
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Payment validation middleware
const validatePayment = async (req, res, next) => {
  try {
    // Skip validation if payment not required
    if (process.env.PAYMENT_REQUIRED !== 'true') {
      return next();
    }
    
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required for payment validation' });
    }
    
    // Check if user has payment method and subscription
    if (!req.user.isSubscribed || !req.user.hasPaymentMethod) {
      return res.status(403).json({ error: 'Active subscription required' });
    }
    
    next();
  } catch (error) {
    console.error('Payment validation error:', error);
    res.status(403).json({ error: 'Payment validation failed' });
  }
};

// API proxy for Gemini
app.post('/api/generate-video', authenticateUser, validatePayment, async (req, res) => {
  try {
    const { prompt, model } = req.body;
    
    // Get the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }
    
    // Make the request to Gemini API
    const response = await fetch(
      `${process.env.GEMINI_API_URL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ],
          generation_config: {
            temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.7'),
            max_output_tokens: parseInt(process.env.GEMINI_MAX_TOKENS || '8192'),
            output_video: true
          }
        }),
      }
    );
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to generate video' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});