# Chat Integration Test Instructions

Follow these steps to test the ChatBot integration in your React application:

## Prerequisites

1. Make sure your Gemini API proxy server is running:
   ```bash
   npm run start:server
   ```

2. Make sure your React development server is running:
   ```bash
   npm run dev
   ```

## Test Steps

### 1. Test Modal Chat Toggle

1. Open your browser and navigate to `http://localhost:5173` (or your Vite dev server URL)
2. Look for the "💬 Chat" button in the header navigation
3. Click the chat button
4. Verify that:
   - A modal window opens with the ChatBot component
   - The chat loads without errors
   - You can type a message and send it using the Send button or Ctrl+Enter
   - The bot responds with a message from Gemini
   - You can close the modal by clicking the "×" button or clicking outside the modal

### 2. Test Chat Route

1. Navigate to `http://localhost:5173/chat`
2. Verify that:
   - The ChatBot component loads directly in the main content area
   - The chat functions the same as in the modal
   - Navigation to other pages works correctly

### 3. Test Mobile Responsiveness

1. Open browser developer tools and switch to mobile view
2. Refresh the page
3. Click the hamburger menu button
4. Verify that:
   - The "💬 Chat" button appears in the mobile menu
   - Clicking it opens the chat modal
   - The chat functions correctly on mobile

### 4. Test Lazy Loading

1. Open browser developer tools and go to the Network tab
2. Navigate to `http://localhost:5173/chat` or open the chat modal
3. Verify that:
   - The ChatBot component is loaded only when needed
   - You see the "Loading chat..." fallback while the component loads

## Troubleshooting

### If the chat doesn't load:

1. Check that the server is running on port 3001:
   ```bash
   npm run start:server
   ```

2. Check that the server URL is correctly configured in your `.env` file:
   ```env
   VITE_GEMINI_SERVER_URL=http://localhost:3001
   ```

3. Check the browser console for any errors

### If you get API errors:

1. Verify your Gemini API key is correctly set in `.env.server`:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

2. Test the server directly:
   ```bash
   node test-server.js
   ```

## Expected Behavior

- Chat should load quickly with lazy loading
- Messages should display clearly with user/bot differentiation
- Typing indicator should appear while waiting for responses
- Errors should be handled gracefully
- Chat should be accessible via both modal and direct route
- Chat should work on both desktop and mobile views