import dotenv from 'dotenv';
dotenv.config();
const API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error('❌ VITE_GEMINI_API_KEY environment variable is not set');
  process.exit(1);
}

async function listModels() {
  console.log('Fetching available models...');
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Successfully fetched models:');
      data.models.forEach(model => {
        console.log(`  - ${model.name}: ${model.description}`);
      });
    } else {
      console.error('❌ Failed to fetch models:', data.error?.message || 'Unknown error');
    }
  } catch (error) {
    console.error('❌ Error fetching models:', error.message);
  }
}

async function testGeminiKey() {
  console.log('Testing Gemini API key with gemini-2.5-flash-lite model...');
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Write a short greeting message.'
            }]
          }]
        }),
      }
    );

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ API Key is valid!');
      console.log('Response:', data.candidates[0].content.parts[0].text);
    } else {
      console.error('❌ API Key test failed:', data.error?.message || 'Unknown error');
      // Let's also try to list models to see what's available
      await listModels();
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error during API test:', error.message);
    process.exit(1);
  }
}

// Run both tests
testGeminiKey();