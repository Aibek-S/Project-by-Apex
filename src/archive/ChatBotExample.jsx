import React from 'react';
import ChatBot from './ChatBot';

const ChatBotExample = () => {
  return (
    <div className="chat-example-container">
      <h1 className="chat-example-title">ChatBot Demo</h1>
      <div className="chat-example-content">
        <ChatBot />
      </div>
      <div className="chat-example-info">
        <h2>How to use:</h2>
        <ul className="chat-example-list">
          <li>Type your message in the input field at the bottom</li>
          <li>Press "Send" or Ctrl+Enter to submit your message</li>
          <li>The chat will display your messages on the right and bot responses on the left</li>
          <li>While waiting for a response, you'll see a typing indicator</li>
        </ul>
      </div>
    </div>
  );
};

export default ChatBotExample;