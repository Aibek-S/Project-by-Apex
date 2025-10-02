import geminiApiQueue from '../apiQueue';

describe('ApiQueue', () => {
  beforeEach(() => {
    // Clear the queue before each test
    geminiApiQueue.clear();
  });

  test('should process requests sequentially', async () => {
    const results = [];
    
    // Create mock request functions with different delays
    const request1 = () => new Promise(resolve => {
      setTimeout(() => {
        results.push('request1');
        resolve('result1');
      }, 100);
    });
    
    const request2 = () => new Promise(resolve => {
      setTimeout(() => {
        results.push('request2');
        resolve('result2');
      }, 50);
    });
    
    const request3 = () => new Promise(resolve => {
      setTimeout(() => {
        results.push('request3');
        resolve('result3');
      }, 75);
    });
    
    // Add requests to queue
    const promise1 = geminiApiQueue.add(request1);
    const promise2 = geminiApiQueue.add(request2);
    const promise3 = geminiApiQueue.add(request3);
    
    // Wait for all requests to complete
    const [result1, result2, result3] = await Promise.all([promise1, promise2, promise3]);
    
    // Verify results
    expect(result1).toBe('result1');
    expect(result2).toBe('result2');
    expect(result3).toBe('result3');
    
    // Verify order of execution
    expect(results).toEqual(['request1', 'request2', 'request3']);
  });

  test('should handle errors without breaking the queue', async () => {
    const results = [];
    
    const successfulRequest = () => new Promise(resolve => {
      setTimeout(() => {
        results.push('success');
        resolve('success_result');
      }, 50);
    });
    
    const failingRequest = () => new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Test error'));
      }, 25);
    });
    
    // Add requests to queue
    const promise1 = geminiApiQueue.add(successfulRequest);
    const promise2 = geminiApiQueue.add(failingRequest);
    const promise3 = geminiApiQueue.add(successfulRequest);
    
    // First request should succeed
    expect(await promise1).toBe('success_result');
    
    // Second request should fail
    await expect(promise2).rejects.toThrow('Test error');
    
    // Third request should succeed
    expect(await promise3).toBe('success_result');
    
    // Verify order of execution
    expect(results).toEqual(['success', 'success']);
  });

  test('should maintain correct queue length', async () => {
    const mockRequest = () => Promise.resolve('result');
    
    // Initially queue should be empty
    expect(geminiApiQueue.length).toBe(0);
    
    // Add requests to queue
    const promise1 = geminiApiQueue.add(mockRequest);
    expect(geminiApiQueue.length).toBe(0); // First request starts processing immediately
    
    const promise2 = geminiApiQueue.add(mockRequest);
    expect(geminiApiQueue.length).toBe(1); // Second request is queued
    
    const promise3 = geminiApiQueue.add(mockRequest);
    expect(geminiApiQueue.length).toBe(2); // Third request is queued
    
    // Wait for all requests to complete
    await Promise.all([promise1, promise2, promise3]);
    
    // Queue should be empty after processing
    expect(geminiApiQueue.length).toBe(0);
  });
});