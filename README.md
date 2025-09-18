# Text-to-Video-Generation-Website-with-Veo-3-Integration
# VideoMagic: Text-to-Video AI Generator

A web application that allows users to generate videos from text descriptions using Veo 3 AI models through Google's Flow labs.

## Features

- Generate videos using Veo 3 Fast (4 per week) or Veo 3 Quality (1 per week)
- User authentication system
- Subscription management (₹99 per month or equivalent in local currency)
- Credit-based system (950 credits per subscription)
- Responsive design for all devices

## Project Structure

```
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── auth.js
│   ├── subscription.js
│   ├── videoGeneration.js
│   └── utils.js
├── assets/
│   └── logo.svg
└── README.md
```

## Getting Started

1. Clone this repository
2. Open `index.html` in your browser
3. Sign up for an account
4. Subscribe to access video generation features
5. Start generating videos from text prompts!

## API Integration

This application is designed to integrate with Google's Flow labs API for video generation. In a production environment, you would:

1. Set up server-side authentication with the Flow API
2. Implement secure API key management
3. Handle API responses and errors appropriately

## Subscription Details

- Monthly subscription: ₹99 (or equivalent in local currency)
- Each subscription provides 950 credits
- Veo 3 Fast video: 50 credits each (limit 4 per week)
- Veo 3 Quality video: 200 credits each (limit 1 per week)
