# API Key Security Documentation

## Overview

This document outlines the security approach for handling API keys in the VeoCreator application.

## Security Measures

1. **Environment Variables**: All API keys are stored in environment variables using a `.env` file
2. **Git Exclusion**: The `.gitignore` file prevents the `.env` file from being committed to the repository
3. **Server-side Handling**: API keys are only used in server-side code, never exposed directly to the client
4. **Template Placeholders**: Client-side code contains only placeholders that are replaced during server rendering

## Handling API Keys

### Server-side (.env file)
```
# Actual API keys in the .env file (NEVER commit this)
GEMINI_API_KEY=actual_api_key_value
FIREBASE_API_KEY=actual_firebase_key
```

### Client-side (placeholders)
```javascript
// Placeholders in client-side JavaScript
const config = {
  apiKey: '{{GEMINI_API_KEY}}',
  firebase: {
    apiKey: '{{FIREBASE_API_KEY}}'
  }
}
```

### Server-side Rendering
When the application is served, a server-side process should replace the placeholders with actual values:

```javascript
function renderTemplate(template) {
  return template
    .replace('{{GEMINI_API_KEY}}', process.env.GEMINI_API_KEY)
    .replace('{{FIREBASE_API_KEY}}', process.env.FIREBASE_API_KEY);
}
```

## API Key Rotation

It's recommended to rotate API keys periodically:

1. Generate new keys in the respective service dashboards
2. Update the `.env` file with the new keys
3. Verify functionality in a test environment
4. Deploy the updated environment to production

## Authentication Flow

1. API requests requiring authentication should be proxied through the server
2. The server adds the API keys to the requests
3. Client-side code never directly accesses sensitive API keys

This approach ensures API keys are not exposed in browser developer tools, network requests, or client-side code.