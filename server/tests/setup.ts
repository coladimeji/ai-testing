import { TestEnvironment } from 'jest-environment-node';
import { TextEncoder, TextDecoder } from 'util';

// Set up global test environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Increase timeout for test execution
jest.setTimeout(30000);

// Add custom matchers if needed
expect.extend({
  toBeValidTest(received) {
    const pass = received && 
                typeof received === 'object' && 
                'status' in received;
    return {
      message: () => `expected ${received} to be a valid test result`,
      pass
    };
  },
}); 