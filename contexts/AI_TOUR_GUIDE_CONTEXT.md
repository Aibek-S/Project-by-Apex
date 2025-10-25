# AI Tour Guide Context Implementation

This document explains how the AI context was implemented to make the chatbot a tourism guide for the Mangystau region.

## Overview

The AI assistant has been configured with specific context to act as a tour guide for the Mangystau region with the following characteristics:

1. Responds only in Kazakh, Russian, and English
2. Uses only data from the application's database
3. Maintains a youth-friendly, simple communication style
4. Focuses exclusively on tourism topics
5. Clearly states when information is not available

## Implementation Details

### 1. Context Definition

The following context is prepended to all AI requests:

```
Ты — чат-бот-туроводитель для Мангистауской области.
Правила работы:
1. Отвечай только на 3 языках: казахский, русский и английский.
2. Используй только данные из базы данных приложения (не придумывай факты).
3. Стиль речи — молодежный, простой и понятный, без сложных формулировок.
4. Тема всегда ограничена туризмом: достопримечательности, маршруты, культура, сервисы Мангистау.
5. Если информации в базе нет — говори об этом напрямую, не выдумывай.
```

### 2. Context Integration

The context is integrated in the `formatContextForPrompt` function in `geminiClient.js`:

```javascript
function formatContextForPrompt(contextMessages) {
  // If no context, return AI context only
  if (!contextMessages || contextMessages.length === 0) {
    return `${AI_CONTEXT}\n\nПользователь: `;
  }

  // Format the context messages into a conversation format
  const formattedContext = contextMessages.map(msg => {
    const role = msg.sender === 'user' ? 'Пользователь' : 'Туроводитель';
    return `${role}: ${msg.text}`;
  }).join('\n');

  // Add AI context and prompt for continuation
  return `${AI_CONTEXT}\n\n${formattedContext}\nТуроводитель:`;
}
```

### 3. Files Modified

1. `src/utils/geminiClient.js` - Added AI context and updated formatting function
2. `server.js` - No changes needed (handles message parameter correctly)
3. `api/chat.js` - No changes needed (handles message parameter correctly)

## Benefits

1. **Role Definition**: Clearly defines the AI's role as a tour guide
2. **Language Constraints**: Ensures responses are in supported languages
3. **Data Integrity**: Prevents AI from making up facts
4. **User Experience**: Maintains a friendly, accessible communication style
5. **Topic Focus**: Keeps conversations relevant to tourism
6. **Transparency**: Encourages honest responses when information is lacking

## Testing

To test the context implementation:

1. Open the ChatBot
2. Ask a question about Mangystau tourism
3. Verify the response follows the defined rules
4. Ask a question about a non-tourism topic
5. Verify the AI redirects or declines to answer
6. Ask about something not in the database
7. Verify the AI clearly states the information is unavailable

## Customization

To modify the AI context:

1. Update the `AI_CONTEXT` constant in `geminiClient.js`
2. The changes will apply to all new conversations
3. Existing conversations will continue with the previous context until restarted

## Future Improvements

1. Add dynamic context based on user location or preferences
2. Include specific information about attractions from the database
3. Implement context-aware language detection
4. Add personality traits to make the tour guide more engaging