# Gemini API Proxy Server

This is a simple Express server that acts as a proxy for the Gemini API, keeping your API key secure on the server side.

## Setup

1. Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/)
2. Add your API key to `.env.server`:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

## Running the Server Locally

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

3. The server will start on port 3001 (or the PORT specified in .env.server)

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

## Using from Frontend

In your React frontend, you can now call the proxy server instead of the Gemini API directly:

```javascript
const response = await fetch('http://localhost:3001/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ message: 'Hello Gemini!' }),
});

const data = await response.json();
console.log(data.reply);
```

## Deployment

### Vercel Deployment

1. Create a new Vercel project
2. Add `GEMINI_API_KEY` as an environment variable in your Vercel project settings
3. Set the build command to `npm run build`
4. Set the output directory to `dist`

### VPS Deployment

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

## Security Notes

1. Never commit your `.env.server` file to version control
2. The server implements CORS to allow frontend requests
3. API key is stored only as an environment variable
4. For production, consider adding rate limiting and additional security measures