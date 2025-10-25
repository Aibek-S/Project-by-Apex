# Pseudo-Context Implementation for ChatBot

This document explains the implementation of pseudo-context functionality for the ChatBot component.

## Overview

The pseudo-context feature allows the ChatBot to maintain conversation history and send context to the Gemini API for more coherent conversations. The implementation limits the context to the last 5 messages to balance between contextual relevance and token usage.

## Implementation Details

### 1. Conversation History Management

The ChatBot component now maintains a conversation history using React state:

```javascript
const [conversationHistory, setConversationHistory] = useState([]);
```

Each message in the history contains:
- `id`: Unique identifier for the message
- `text`: The message content
- `sender`: Either 'user' or 'bot'

### 2. Context Limitation

The conversation history is limited to the last 5 messages:

```javascript
// Limit conversation history to last 5 messages
const limitedHistory = updatedHistory.slice(-5);
```

This ensures that:
- Only recent context is sent to the API
- Token usage is controlled
- Performance is maintained

### 3. Context Formatting

The context is formatted as a conversation string before being sent to the API:

```
User: Hello
Assistant: Hi there! How can I help you?
User: What's the weather like?
Assistant:
```

The formatting function adds role prefixes to each message and ends with "Assistant:" to prompt the AI to continue the conversation.

### 4. API Integration

A new function `sendGeminiMessageWithContext` was added to the geminiClient:

```javascript
export async function sendGeminiMessageWithContext(contextMessages) {
  // Formats context and sends to API
}
```

This function:
- Formats the context messages into a single prompt
- Sends the formatted prompt to the API
- Returns the AI response

## Files Modified

1. `src/components/ChatBot.jsx` - Added conversation history management
2. `src/utils/geminiClient.js` - Added context-aware API function
3. `server.js` - No changes needed (already handles message parameter)

## Usage

The implementation is fully automatic:
1. Each user message is added to the conversation history
2. The last 5 messages are sent as context with each API request
3. The AI response is added to the conversation history
4. Old messages are automatically removed when the limit is reached

## Benefits

1. **Contextual Conversations**: The AI can reference previous messages
2. **Controlled Token Usage**: Limited to last 5 messages
3. **Automatic Management**: No manual context management required
4. **Performance**: Efficient state management and API usage
5. **Scalability**: Easy to adjust context window size if needed

## Customization

To adjust the context window size:
1. Change the slice parameter in ChatBot.jsx:
   ```javascript
   const limitedHistory = updatedHistory.slice(-10); // For 10 messages
   ```
2. Update the context message selection:
   ```javascript
   const contextMessages = limitedHistory.slice(-10);
   ```

## Limitations

1. Context is limited to the last 5 messages
2. No persistent storage (context is lost on page refresh)
3. Simple conversation formatting (no advanced prompt engineering)

## Future Improvements

1. Add persistent storage for conversation history
2. Implement more sophisticated context management
3. Add context summarization for longer conversations
4. Allow dynamic context window sizing based on message length