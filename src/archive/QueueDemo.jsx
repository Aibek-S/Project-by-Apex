import React, { useState } from 'react';
import { sendGeminiMessage } from '../utils/geminiClient';

const QueueDemo = () => {
  const [responses, setResponses] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const sendMultipleMessages = async () => {
    setIsSending(true);
    setResponses([]);
    
    try {
      // Send multiple messages in quick succession
      const promises = [
        sendGeminiMessage('Hello, this is message 1!'),
        sendGeminiMessage('Hello, this is message 2!'),
        sendGeminiMessage('Hello, this is message 3!'),
        sendGeminiMessage('Hello, this is message 4!'),
        sendGeminiMessage('Hello, this is message 5!')
      ];

      // Wait for all responses
      const results = await Promise.all(promises);
      
      // Update state with responses
      const newResponses = results.map((response, index) => ({
        id: index + 1,
        message: `Message ${index + 1}`,
        response: response
      }));
      
      setResponses(newResponses);
    } catch (error) {
      console.error('Error sending messages:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>API Queue Demo</h1>
      <p>This demo shows how multiple requests are queued and processed sequentially.</p>
      
      <button 
        onClick={sendMultipleMessages}
        disabled={isSending}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isSending ? 'not-allowed' : 'pointer',
          opacity: isSending ? 0.6 : 1
        }}
      >
        {isSending ? 'Sending Messages...' : 'Send 5 Messages Quickly'}
      </button>
      
      {responses.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2>Responses (Processed Sequentially):</h2>
          {responses.map((item) => (
            <div 
              key={item.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '15px',
                marginBottom: '10px',
                backgroundColor: '#f8f9fa'
              }}
            >
              <strong>{item.message}:</strong>
              <p>{item.response}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QueueDemo;