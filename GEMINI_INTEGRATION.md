# Gemini API Integration Guide

This guide explains how to securely integrate the Gemini API into your application using a proxy server.

## Architecture

```
[Frontend] → [Proxy Server] → [Gemini API]
                ↑
            (API Key stored securely here)
```

## Setup

1. Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/)
2. Add your API key to `.env.server`:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

## Running the Proxy Server

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm run start:server
   ```

   Or for development with auto-restart:
   ```bash
   npm run dev:server
   ```

## Using the Gemini Client

In your React components, you can use the utility functions:

```javascript
import { sendGeminiMessage } from '../utils/geminiClient';

// Send a message and get a response
const response = await sendGeminiMessage('Hello Gemini!');
console.log(response);
```

## API Endpoints

### POST /api/chat

Send a message to the Gemini API:

```json
{
  "message": "Your message here"
}
```

Response:
```json
{
  "reply": "Gemini's response"
}
```

### GET /api/health

Health check endpoint:
```json
{
  "status": "OK",
  "timestamp": "2023-04-01T12:00:00.000Z"
}
```

## Deployment Options

### Vercel Serverless Functions

The `api/` directory contains Vercel serverless functions that can be deployed directly to Vercel:

1. Add `GEMINI_API_KEY` as an environment variable in your Vercel project settings
2. Deploy your project to Vercel

### Traditional VPS Deployment

1. Upload your code to the VPS
2. Install Node.js and npm
3. Run `npm install` to install dependencies
4. Set the `GEMINI_API_KEY` environment variable
5. Start the server with `npm run start:server`

For production use with a process manager:
```bash
npm install -g pm2
pm2 start server.js
```

## Security Best Practices

1. Never commit your `.env.server` file to version control
2. API key is stored only as an environment variable
3. The server implements CORS to allow frontend requests
4. For production, consider adding rate limiting and additional security measures
5. Use different API keys for development and production
6. Regularly rotate your API keys

## Testing

Run the test script to verify everything works:
```bash
node test-server.js
```