# API Queue Demo Instructions

This document explains how to test the API queue functionality in your application.

## Overview

The API queue ensures that requests to the Gemini API are processed sequentially, preventing concurrent requests which could overwhelm the API or cause rate limiting issues.

## Demo Components

1. `src/components/QueueDemo.jsx` - A React component that demonstrates sending multiple requests quickly
2. `src/utils/apiQueue.js` - The queue implementation
3. `src/utils/geminiClient.js` - Updated to use the queue
4. `test-api-queue.js` - A Node.js script to test the queue logic

## Testing the Queue

### 1. Test Script

Run the test script to see the queue in action:

```bash
node test-api-queue.js
```

This will show how requests are processed sequentially even when added simultaneously.

### 2. React Component Demo

To test the queue with actual API calls:

1. Start your Gemini API proxy server:
   ```bash
   npm run start:server
   ```

2. Start your React development server:
   ```bash
   npm run dev
   ```

3. Create a route to the QueueDemo component in your App.jsx:
   ```jsx
   import QueueDemo from './components/QueueDemo';
   
   // Add this route to your Routes:
   <Route path="/queue-demo" element={
     <AnimatedPage>
       <QueueDemo />
     </AnimatedPage>
   } />
   ```

4. Navigate to `http://localhost:5173/queue-demo`

5. Click the "Send 5 Messages Quickly" button

6. Observe how the requests are processed one at a time, even though they were sent simultaneously

### 3. ChatBot Integration

The ChatBot component now shows queue status in the header when there are pending requests.

To test:

1. Open the chat modal or navigate to `/chat`
2. Send multiple messages quickly by clicking "Send" multiple times
3. Observe the queue status indicator in the chat header
4. Notice how messages are processed one at a time

## How It Works

### Sequential Processing

The queue ensures that only one request is processed at a time:

1. When a request is added to the queue, it's placed in an array
2. If no request is currently processing, the first request starts immediately
3. Subsequent requests wait for the previous request to complete
4. After each request completes, the next request in the queue is processed
5. The queue automatically clears after all requests are processed

### Benefits

1. **Rate Limiting Prevention**: Prevents hitting API rate limits
2. **Resource Management**: Efficiently manages API resources
3. **User Experience**: Provides visual feedback on queue status
4. **Error Resilience**: Maintains stability even if individual requests fail

### Implementation Details

The queue is implemented using:

1. **Promise Chain**: Each request is wrapped in a Promise
2. **Async Processing**: Requests are processed asynchronously
3. **State Management**: Queue length is tracked and exposed
4. **Automatic Cleanup**: Queue clears after processing

## Customization

You can customize the queue behavior by modifying the `ApiQueue` class in `src/utils/apiQueue.js`:

1. **Queue Priority**: Implement priority-based queueing
2. **Batch Processing**: Process requests in batches
3. **Timeout Handling**: Add timeout mechanisms
4. **Retry Logic**: Implement automatic retry for failed requests

## Integration

The queue is integrated into the existing `sendGeminiMessage` function, so all existing code continues to work without changes. The queue management is completely transparent to the calling code.