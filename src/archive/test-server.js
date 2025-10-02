// Simple test script to verify the Gemini API proxy server
async function testServer() {
  try {
    console.log('Testing Gemini API proxy server...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:3001/api/health');
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);
    
    // Test chat endpoint
    console.log('Testing chat endpoint...');
    const chatResponse = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Write a short greeting message.'
      }),
    });
    
    const chatData = await chatResponse.json();
    
    if (chatResponse.ok) {
      console.log('✅ Server test successful!');
      console.log('Response:', chatData.reply);
    } else {
      console.error('❌ Server test failed:', chatData.error);
    }
  } catch (error) {
    console.error('❌ Error testing server:', error.message);
  }
}

testServer();