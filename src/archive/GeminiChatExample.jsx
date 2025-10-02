import React, { useState } from 'react';
import { sendGeminiMessage, checkServerHealth } from '../utils/geminiClient';

const GeminiChatExample = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('unknown');

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setResponse('');
    
    try {
      const reply = await sendGeminiMessage(input);
      setResponse(reply);
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckHealth = async () => {
    const isHealthy = await checkServerHealth();
    setServerStatus(isHealthy ? 'healthy' : 'unhealthy');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Gemini API Chat Example</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleCheckHealth}>
          Check Server Health
        </button>
        <span style={{ marginLeft: '10px' }}>
          Server Status: <strong>{serverStatus}</strong>
        </span>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your message here..."
          rows={4}
          style={{ width: '100%', padding: '10px' }}
        />
      </div>
      
      <button 
        onClick={handleSendMessage} 
        disabled={loading || !input.trim()}
        style={{ padding: '10px 20px', marginRight: '10px' }}
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
      
      {response && (
        <div style={{ marginTop: '20px' }}>
          <h3>Response:</h3>
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '5px',
            whiteSpace: 'pre-wrap'
          }}>
            {response}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiChatExample;