import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default async function handler(request, response) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = request.body;
    
    if (!message) {
      return response.status(400).json({ error: 'Message is required' });
    }

    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY environment variable is not set');
      return response.status(500).json({ error: 'Server configuration error' });
    }

    // Call Gemini API with gemini-2.5-flash model
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: message
            }]
          }]
        }),
      }
    );

    const data = await geminiResponse.json();
    
    if (!geminiResponse.ok) {
      throw new Error(data.error?.message || 'Failed to get response from Gemini API');
    }

    // Extract the response text
    const reply = data.candidates[0]?.content?.parts[0]?.text || 'No response from Gemini';
    
    // Send response back to client
    response.status(200).json({ reply });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
}