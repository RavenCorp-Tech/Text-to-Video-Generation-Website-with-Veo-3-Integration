/**
 * API Key Rotation Script
 * 
 * This script helps automate the API key rotation process
 * Run with: npm run rotate-keys
 */

const readline = require('readline');
const keyRotation = require('../key-rotation');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function rotateKeys() {
  try {
    // Generate rotation report
    const report = await keyRotation.generateRotationReport();
    
    if (!report.needsRotation) {
      console.log('✅ All API keys are up to date.');
      process.exit(0);
    }
    
    console.log('\n==== API KEY ROTATION REQUIRED ====\n');
    console.log('The following keys need rotation:');
    
    // Display keys needing rotation
    report.keysToRotate.forEach((key, index) => {
      console.log(`\n[${index + 1}] ${key.name}`);
      console.log(`    Provider: ${key.provider}`);
      console.log(`    Last rotated: ${key.lastRotation || 'Never'}`);
      console.log(`    Days since rotation: ${key.daysSinceRotation}`);
      console.log(`    Rotation URL: ${key.rotationUrl}`);
    });
    
    console.log('\nFollow these steps for each key:');
    console.log('1. Visit the provider console');
    console.log('2. Generate a new API key');
    console.log('3. Enter the new key when prompted');
    console.log('4. The .env file will be updated automatically');
    
    // Process each key
    for (const key of report.keysToRotate) {
      await processKeyRotation(key);
    }
    
    console.log('\n✅ Key rotation complete! Please restart the application.');
    process.exit(0);
    
  } catch (error) {
    console.error('Error during key rotation:', error);
    process.exit(1);
  }
}

async function processKeyRotation(key) {
  return new Promise((resolve) => {
    console.log(`\n==== Rotating ${key.name} ====`);
    console.log(`Visit: ${key.rotationUrl}`);
    
    rl.question(`Enter the new value for ${key.name} (or type 'skip' to skip): `, async (answer) => {
      if (answer.toLowerCase() === 'skip') {
        console.log(`Skipped rotation for ${key.name}`);
        resolve();
        return;
      }
      
      try {
        const success = await keyRotation.updateEnvFile(key.name, answer);
        
        if (success) {
          console.log(`✅ Successfully rotated ${key.name}`);
        } else {
          console.log(`❌ Failed to rotate ${key.name}`);
        }
        
        resolve();
      } catch (error) {
        console.error(`Error updating ${key.name}:`, error);
        resolve();
      }
    });
  });
}

// Start the rotation process
rotateKeys().catch(console.error).finally(() => rl.close());