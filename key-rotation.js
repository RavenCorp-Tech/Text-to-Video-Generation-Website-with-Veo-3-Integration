/**
 * API Key Rotation Utility for VeoCreator
 * Implements secure API key rotation strategies
 */

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Configuration
const KEY_ROTATION_INTERVAL = parseInt(process.env.KEY_ROTATION_INTERVAL || '30', 10); // days
const API_KEYS_FILE = path.join(__dirname, 'api-keys.json');
const DEFAULT_ENV_FILE = path.join(__dirname, '.env');
const BACKUP_ENV_FILE = path.join(__dirname, '.env.backup');

// Key types that need rotation
const KEY_TYPES = [
  { 
    name: 'GEMINI_API_KEY', 
    provider: 'Google AI',
    rotationUrl: 'https://ai.google.dev/api/console'
  },
  { 
    name: 'FIREBASE_API_KEY',
    provider: 'Firebase',
    rotationUrl: 'https://console.firebase.google.com/project/_/settings/general'
  },
  { 
    name: 'STRIPE_PUBLIC_KEY',
    provider: 'Stripe',
    rotationUrl: 'https://dashboard.stripe.com/apikeys'
  },
  { 
    name: 'STRIPE_SECRET_KEY',
    provider: 'Stripe',
    rotationUrl: 'https://dashboard.stripe.com/apikeys'
  }
];

/**
 * Check if API keys need rotation
 * @returns {Promise<Array>} Array of keys that need rotation
 */
async function checkKeyRotation() {
  try {
    // Load key history
    let keyHistory = {};
    
    if (fs.existsSync(API_KEYS_FILE)) {
      const fileContent = fs.readFileSync(API_KEYS_FILE, 'utf8');
      keyHistory = JSON.parse(fileContent);
    }
    
    const now = new Date();
    const keysNeedingRotation = [];
    
    // Check each key type
    for (const keyType of KEY_TYPES) {
      const keyHistory = keyHistory[keyType.name] || [];
      const lastRotation = keyHistory.length > 0 
        ? new Date(keyHistory[keyHistory.length - 1].date)
        : new Date(0);
      
      // Calculate days since last rotation
      const daysSinceRotation = Math.floor((now - lastRotation) / (1000 * 60 * 60 * 24));
      
      if (daysSinceRotation >= KEY_ROTATION_INTERVAL) {
        keysNeedingRotation.push({
          ...keyType,
          daysSinceRotation,
          lastRotation: lastRotation.toISOString().split('T')[0]
        });
      }
    }
    
    return keysNeedingRotation;
  } catch (error) {
    console.error('Error checking key rotation:', error);
    return [];
  }
}

/**
 * Record a key rotation in the history
 * @param {string} keyType - The type of key
 * @param {string} newKeyHash - Hash of the new key (not the actual key for security)
 */
async function recordKeyRotation(keyType, newKeyHash) {
  try {
    // Load existing history
    let keyHistory = {};
    
    if (fs.existsSync(API_KEYS_FILE)) {
      const fileContent = fs.readFileSync(API_KEYS_FILE, 'utf8');
      keyHistory = JSON.parse(fileContent);
    }
    
    // Add new rotation record
    if (!keyHistory[keyType]) {
      keyHistory[keyType] = [];
    }
    
    keyHistory[keyType].push({
      date: new Date().toISOString(),
      keyHash: newKeyHash,
    });
    
    // Keep only last 5 rotations
    if (keyHistory[keyType].length > 5) {
      keyHistory[keyType] = keyHistory[keyType].slice(-5);
    }
    
    // Save updated history
    fs.writeFileSync(API_KEYS_FILE, JSON.stringify(keyHistory, null, 2));
    
    return true;
  } catch (error) {
    console.error('Error recording key rotation:', error);
    return false;
  }
}

/**
 * Update .env file with new API key
 * @param {string} keyType - The type of key to update
 * @param {string} newValue - The new key value
 */
async function updateEnvFile(keyType, newValue) {
  try {
    // First create a backup
    if (fs.existsSync(DEFAULT_ENV_FILE)) {
      fs.copyFileSync(DEFAULT_ENV_FILE, BACKUP_ENV_FILE);
    }
    
    // Read current .env file
    let envContent = '';
    if (fs.existsSync(DEFAULT_ENV_FILE)) {
      envContent = fs.readFileSync(DEFAULT_ENV_FILE, 'utf8');
    }
    
    // Replace or add the key
    const regex = new RegExp(`^${keyType}=.*$`, 'm');
    if (regex.test(envContent)) {
      // Replace existing key
      envContent = envContent.replace(regex, `${keyType}=${newValue}`);
    } else {
      // Add new key
      envContent += `\n${keyType}=${newValue}`;
    }
    
    // Write updated content
    fs.writeFileSync(DEFAULT_ENV_FILE, envContent);
    
    // Record the rotation using a hash (not storing actual keys)
    const keyHash = crypto.createHash('sha256').update(newValue).digest('hex');
    await recordKeyRotation(keyType, keyHash);
    
    return true;
  } catch (error) {
    console.error('Error updating .env file:', error);
    
    // Restore from backup if available
    if (fs.existsSync(BACKUP_ENV_FILE)) {
      fs.copyFileSync(BACKUP_ENV_FILE, DEFAULT_ENV_FILE);
    }
    
    return false;
  }
}

/**
 * Generate a rotation report with instructions
 */
async function generateRotationReport() {
  const keysNeedingRotation = await checkKeyRotation();
  
  if (keysNeedingRotation.length === 0) {
    return {
      needsRotation: false,
      message: 'All API keys are up to date.'
    };
  }
  
  let report = '# API Key Rotation Report\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;
  report += `## Keys Requiring Rotation\n\n`;
  
  for (const key of keysNeedingRotation) {
    report += `### ${key.name}\n`;
    report += `- Provider: ${key.provider}\n`;
    report += `- Last rotated: ${key.lastRotation || 'Never'}\n`;
    report += `- Days since rotation: ${key.daysSinceRotation}\n`;
    report += `- Rotation URL: ${key.rotationUrl}\n\n`;
  }
  
  report += '## Rotation Instructions\n\n';
  report += '1. Visit each provider\'s console using the URLs provided above\n';
  report += '2. Generate new API keys\n';
  report += '3. Update the .env file with the new keys\n';
  report += '4. Run the key rotation utility to record the rotation\n';
  report += '5. Restart the application\n\n';
  report += '## Security Reminder\n\n';
  report += 'Remember to invalidate old keys after confirming the new ones work properly.\n';
  
  return {
    needsRotation: true,
    keysToRotate: keysNeedingRotation,
    report
  };
}

// Export the API
module.exports = {
  checkKeyRotation,
  updateEnvFile,
  generateRotationReport
};