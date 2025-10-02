export default function handler(request, response) {
  // Only allow GET requests
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  response.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    platform: 'Vercel Serverless Function'
  });
}