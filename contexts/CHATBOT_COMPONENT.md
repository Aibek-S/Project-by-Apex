# ChatBot Component

A React chat component that integrates with the Gemini API proxy server.

## Features

- Message history with user/bot differentiation
- Real-time typing indicators
- Auto-scrolling to latest messages
- Error handling with user-friendly messages
- Keyboard shortcut (Ctrl+Enter) for sending
- Accessibility features (aria labels, focus management)
- Responsive design
- Lazy loading support

## Files

- `src/components/ChatBot.jsx` - Main chat component
- `src/components/ChatBotExample.jsx` - Example usage
- `src/components/LazyChatBot.jsx` - Lazy-loaded version
- `src/components/ChatBotLoading.jsx` - Loading component for lazy loading
- `src/components/__tests__/ChatBot.test.jsx` - Unit tests
- `src/utils/geminiClient.js` - API client functions

## Installation

Make sure you have the required dependencies installed:

```bash
npm install
```

## Environment Variables

Make sure your `.env` file includes the server URL:

```env
VITE_GEMINI_SERVER_URL=http://localhost:3001
```

## Usage

### Basic Usage

```jsx
import ChatBot from './components/ChatBot';

function App() {
  return (
    <div className="App">
      <ChatBot />
    </div>
  );
}
```

### Example Usage

```jsx
import ChatBotExample from './components/ChatBotExample';

function App() {
  return (
    <div className="App">
      <ChatBotExample />
    </div>
  );
}
```

### Lazy Loading

```jsx
import LazyChatBot from './components/LazyChatBot';

function App() {
  return (
    <div className="App">
      <LazyChatBot />
    </div>
  );
}
```

### With Suspense (if not using LazyChatBot)

```jsx
import React, { lazy, Suspense } from 'react';
import ChatBotLoading from './components/ChatBotLoading';

const ChatBot = lazy(() => import('./components/ChatBot'));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<ChatBotLoading />}>
        <ChatBot />
      </Suspense>
    </div>
  );
}
```

## Styling

The component uses Tailwind CSS classes for styling. Make sure you have Tailwind configured in your project.

If you're not using Tailwind, you can either:
1. Install Tailwind CSS: https://tailwindcss.com/docs/guides/vite
2. Replace the Tailwind classes with your own CSS classes

## API Integration

The component integrates with `src/utils/geminiClient.js` which provides:

- `sendGeminiMessage(message)` - Sends a message to the Gemini API
- `checkServerHealth()` - Checks if the server is healthy

## Testing

Run the unit tests with:

```bash
npm test
```

Or for a specific test:

```bash
npm test ChatBot.test.jsx
```

## Customization

### Styling

You can customize the appearance by modifying the Tailwind classes in the component:

- Message bubbles: Modify the classes in the message rendering section
- Input area: Modify the classes in the input form section
- Colors: Change the color classes (bg-blue-500, bg-gray-100, etc.)

### Functionality

You can customize the behavior by modifying:

- Keyboard shortcuts: Modify the `handleKeyDown` function
- Message display: Modify the message rendering logic
- Error handling: Modify the error display logic

## Accessibility

The component includes several accessibility features:

- Proper aria labels for input and button
- Focus management (input is focused on mount)
- Semantic HTML structure
- Color contrast compliant with WCAG standards
- Keyboard navigation support

## Error Handling

The component handles several types of errors:

- Network errors
- API errors
- Server errors

All errors are displayed to the user in a friendly manner.

## Performance

- Messages are only re-rendered when necessary
- Efficient auto-scrolling implementation
- Lazy loading support
- Minimal DOM updates