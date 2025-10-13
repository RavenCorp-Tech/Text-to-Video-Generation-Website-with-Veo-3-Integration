# VeoCreator: Text-to-Video AI Generator

A powerful web application that leverages Google's Veo models to transform text prompts into high-quality videos.

## Features

- Text-to-video generation using Veo 3 models
- Two quality options: "Veo 3 fast" and "Veo 3 quality"
- User subscription system with usage limits
- Credit-based system (950 credits per subscription)
- Responsive design for all devices

## Usage Limits

- **Veo 3 fast**: Up to 4 videos per week
- **Veo 3 quality**: 1 video per week

## Pricing Updates

**Veo 3 prices lowered by more than 45%**
- **Veo 3**: Now $0.40/second (was $0.75/second)
- **Veo 3 Fast**: Now $0.15/second (was $0.40/second)
- Plus, enjoy new features like vertical format and 1080p HD output.

## Subscription

- Price: ₹99 (INR) per month (auto-converted to local currency)
- Each subscription includes 950 credits
- Create stunning AI-generated videos with simple text prompts

## Technology Stack

- Frontend: HTML, CSS, JavaScript
- Authentication: Firebase
- Payment Processing: Stripe
- Video Generation: Google Flow API (labs.google/flow)

## Getting Started

1. Clone the repository
2. Set up environment variables in a `.env` file
3. Install dependencies
4. Run the application

## Environment Configuration

Copy the `.env.template` file to create your own `.env` file in the root directory:

```bash
cp .env.template .env
```

Then edit the `.env` file to add your API keys and configuration values.

### Security Best Practices

1. **Never commit your `.env` file to the repository**
2. **Never share API keys in public repositories**
3. **Rotate API keys periodically for security**
4. **Use different API keys for development and production**

The `.gitignore` file is configured to prevent the `.env` file from being committed.

### Required API Keys

1. **Gemini API Key**: Get a Gemini API key from the [Google AI Studio](https://ai.google.dev/)
2. **Firebase**: Set up a Firebase project at [Firebase Console](https://console.firebase.google.com/)
3. **Stripe**: Set up a Stripe account at [Stripe Dashboard](https://dashboard.stripe.com/)

## User Authentication and Payment Flow

1. Users must register and log in before accessing video generation features
2. After logging in, users must subscribe by entering payment details
3. Once subscribed, users receive 950 credits and weekly video generation limits
4. Video generation is only available to authenticated users with active subscriptions

## License

MIT License
