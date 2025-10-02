# Gemini Model Update

This document explains the update from gemini-2.5-flash-lite to gemini-2.5-flash model.

## Overview

The AI model has been updated from gemini-2.5-flash-lite to gemini-2.5-flash to provide better performance and capabilities for the tourism guide chatbot.

## Changes Made

### 1. Server-side Changes

Updated `server.js` to use gemini-2.5-flash model:
```javascript
// Before
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`

// After
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`
```

### 2. Vercel Function Changes

Updated `api/chat.js` to use gemini-2.5-flash model:
```javascript
// Before
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`

// After
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`
```

### 3. Test Script Update

Updated `test-gemini-key.js` to test with gemini-2.5-flash model:
```javascript
// Before
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`

// After
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`
```

## Files Modified

1. `server.js` - Updated model in Gemini API endpoint
2. `api/chat.js` - Updated model in Vercel function
3. `test-gemini-key.js` - Updated model in test script

## Benefits of gemini-2.5-flash

1. **Better Performance**: Improved response quality and speed
2. **Enhanced Capabilities**: More advanced reasoning and understanding
3. **Latest Features**: Access to the newest Gemini features
4. **Balanced Approach**: Maintains efficiency while providing better results than the lite version

## Testing

To verify the model update:

1. Restart the server:
   ```bash
   npm run start:server
   ```

2. Test the API key:
   ```bash
   node test-gemini-key.js
   ```

3. Open the ChatBot and verify responses are working correctly

## Rollback Plan

If issues arise with the gemini-2.5-flash model, you can revert to gemini-2.5-flash-lite by:

1. Changing the model name back in `server.js`
2. Changing the model name back in `api/chat.js`
3. Changing the model name back in `test-gemini-key.js`
4. Restarting the server

## Model Comparison

| Feature | gemini-2.5-flash-lite | gemini-2.5-flash |
|---------|----------------------|------------------|
| Performance | Good | Better |
| Response Quality | Adequate | Enhanced |
| Speed | Fast | Fast |
| Capabilities | Limited | Full |
| Use Case | Simple tasks | Complex tasks |

The gemini-2.5-flash model provides a better balance of performance and capabilities for the tourism guide chatbot.