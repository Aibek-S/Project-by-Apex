// Test script to demonstrate the API queue functionality
import geminiApiQueue from './src/utils/apiQueue.js';

// Mock API function that simulates different response times
const mockApiCall = (id, delay) => {
  return () => {
    console.log(`Starting request ${id}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Completed request ${id}`);
        resolve(`Response ${id}`);
      }, delay);
    });
  };
};

// Function to add multiple requests to the queue
async function testQueue() {
  console.log('Testing API queue functionality...\n');
  
  // Add multiple requests with different delays
  const promises = [];
  
  promises.push(geminiApiQueue.add(mockApiCall(1, 1000)));
  promises.push(geminiApiQueue.add(mockApiCall(2, 500)));
  promises.push(geminiApiQueue.add(mockApiCall(3, 2000)));
  promises.push(geminiApiQueue.add(mockApiCall(4, 300)));
  promises.push(geminiApiQueue.add(mockApiCall(5, 800)));
  
  console.log(`Added 5 requests to queue. Queue length: ${geminiApiQueue.length}\n`);
  
  // Wait for all requests to complete
  const results = await Promise.all(promises);
  
  console.log('\nAll requests completed:');
  results.forEach((result, index) => {
    console.log(`  Request ${index + 1}: ${result}`);
  });
  
  console.log(`\nFinal queue length: ${geminiApiQueue.length}`);
}

// Run the test
testQueue().catch(console.error);