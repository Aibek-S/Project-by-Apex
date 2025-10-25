# API Queue Implementation

This document explains the API queue implementation for sequential processing of requests to the Gemini API.

## Overview

The API queue ensures that requests to the Gemini API are processed sequentially, preventing concurrent requests which could overwhelm the API or cause rate limiting issues.

## Implementation Details

### Files

- `src/utils/apiQueue.js` - Queue manager implementation
- `src/utils/geminiClient.js` - Updated to use the queue
- `src/components/ChatBot.jsx` - Updated to show queue status
- `test-api-queue.js` - Test script for the queue

### How It Works

1. **Queue Manager**: The `ApiQueue` class manages a queue of requests using an array.
2. **Sequential Processing**: Requests are processed one at a time in the order they were added.
3. **Promise Chain**: Each request is wrapped in a Promise to maintain async/await compatibility.
4. **Automatic Cleanup**: The queue automatically clears after processing all requests.

### Key Features

1. **Sequential Processing**: Only one request is processed at a time
2. **Automatic Queue Management**: Requests are automatically added to the queue
3. **Promise-Based**: Maintains Promise-based API for compatibility
4. **Queue Status**: Shows the number of pending requests
5. **Error Handling**: Properly handles errors without breaking the queue

## Usage

### In geminiClient.js

```javascript
import geminiApiQueue from './apiQueue';

export async function sendGeminiMessage(message) {
  const requestFn = () => {
    // API call implementation
  };
  
  return geminiApiQueue.add(requestFn);
}
```

### In Components

```javascript
import { sendGeminiMessage } from '../utils/geminiClient';

// This will automatically be queued
const response = await sendGeminiMessage("Hello Gemini!");
```

## Testing

Run the test script to see the queue in action:

```bash
node test-api-queue.js
```

This will simulate multiple API requests with different response times to demonstrate sequential processing.

## Benefits

1. **Rate Limiting Prevention**: Prevents hitting API rate limits
2. **Resource Management**: Efficiently manages API resources
3. **User Experience**: Provides visual feedback on queue status
4. **Error Resilience**: Maintains stability even if individual requests fail
5. **Performance**: Reduces concurrent request overhead

## Customization

You can customize the queue behavior by modifying the `ApiQueue` class:

1. **Queue Priority**: Implement priority-based queueing
2. **Batch Processing**: Process requests in batches
3. **Timeout Handling**: Add timeout mechanisms
4. **Retry Logic**: Implement automatic retry for failed requests

## Integration with Existing Code

The queue implementation is designed to be non-breaking:

1. **Backward Compatibility**: Existing code using `sendGeminiMessage` continues to work
2. **No API Changes**: The function signature remains the same
3. **Transparent Operation**: Queue management is handled internally
4. **Performance Monitoring**: Queue status is visible to users