// API service tests - These should FAIL initially (TDD RED phase)

// Import API service - this will fail initially as service doesn't exist yet
let apiService;
try {
  apiService = require('../src/services/apiService');
} catch (error) {
  // Expected to fail in RED phase
  apiService = null;
}

// Mock axios
const mockAxios = {
  post: jest.fn(),
  get: jest.fn(),
  defaults: {
    timeout: 10000
  }
};

jest.mock('axios', () => mockAxios);

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset axios mock
    mockAxios.post.mockReset();
    mockAxios.get.mockReset();
  });

  describe('analyzeImpact', () => {
    const validPayload = {
      alertName: 'Test Alert',
      userId: 'user-123',
      accountId: 'account-456',
      timestamp: '2025-08-12T05:15:00.000Z'
    };

    const mockSuccessResponse = {
      data: {
        success: true,
        data: {
          alertExists: true,
          impactAnalysis: {
            customersAffected: 1250,
            criticalServices: ['payment-processing', 'user-authentication'],
            dependentAlerts: ['downstream-service-alert'],
            estimatedDowntime: '2-5 minutes',
            riskLevel: 'HIGH',
            confidenceScore: 0.85
          },
          recommendations: [
            'Consider maintenance window scheduling',
            'Notify affected customers in advance'
          ]
        },
        timestamp: '2025-08-12T05:15:01.152Z'
      }
    };

    test('should make POST request to correct endpoint', async () => {
      if (!apiService) {
        throw new Error('API service not available - expected in RED phase');
      }

      mockAxios.post.mockResolvedValue(mockSuccessResponse);

      await apiService.analyzeImpact(validPayload);

      expect(mockAxios.post).toHaveBeenCalledWith(
        '/api/v1/alerts/impact-analysis',
        validPayload,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
    });

    test('should include authorization header when token is available', async () => {
      if (!apiService) {
        throw new Error('API service not available - expected in RED phase');
      }

      // Mock localStorage to return a token
      const mockToken = 'mock-jwt-token';
      Storage.prototype.getItem = jest.fn(() => mockToken);

      mockAxios.post.mockResolvedValue(mockSuccessResponse);

      await apiService.analyzeImpact(validPayload);

      expect(mockAxios.post).toHaveBeenCalledWith(
        '/api/v1/alerts/impact-analysis',
        validPayload,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`
          })
        })
      );
    });

    test('should return parsed response data on success', async () => {
      if (!apiService) {
        throw new Error('API service not available - expected in RED phase');
      }

      mockAxios.post.mockResolvedValue(mockSuccessResponse);

      const result = await apiService.analyzeImpact(validPayload);

      expect(result).toEqual(mockSuccessResponse.data);
      expect(result.success).toBe(true);
      expect(result.data.impactAnalysis).toBeDefined();
    });

    test('should handle validation errors properly', async () => {
      if (!apiService) {
        throw new Error('API service not available - expected in RED phase');
      }

      const validationErrorResponse = {
        response: {
          status: 400,
          data: {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid request data',
              details: 'Alert name must be at least 3 characters long'
            }
          }
        }
      };

      mockAxios.post.mockRejectedValue(validationErrorResponse);

      await expect(apiService.analyzeImpact(validPayload)).rejects.toThrow('Invalid request data');
    });

    test('should handle authentication errors', async () => {
      if (!apiService) {
        throw new Error('API service not available - expected in RED phase');
      }

      const authErrorResponse = {
        response: {
          status: 401,
          data: {
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'Access token is required'
            }
          }
        }
      };

      mockAxios.post.mockRejectedValue(authErrorResponse);

      await expect(apiService.analyzeImpact(validPayload)).rejects.toThrow('Access token is required');
    });

    test('should handle rate limiting errors', async () => {
      if (!apiService) {
        throw new Error('API service not available - expected in RED phase');
      }

      const rateLimitResponse = {
        response: {
          status: 429,
          data: {
            success: false,
            error: {
              code: 'RATE_LIMIT_EXCEEDED',
              message: 'Too many requests'
            }
          }
        }
      };

      mockAxios.post.mockRejectedValue(rateLimitResponse);

      await expect(apiService.analyzeImpact(validPayload)).rejects.toThrow('Too many requests');
    });

    test('should handle server errors', async () => {
      if (!apiService) {
        throw new Error('API service not available - expected in RED phase');
      }

      const serverErrorResponse = {
        response: {
          status: 500,
          data: {
            success: false,
            error: {
              code: 'INTERNAL_SERVER_ERROR',
              message: 'An internal server error occurred'
            }
          }
        }
      };

      mockAxios.post.mockRejectedValue(serverErrorResponse);

      await expect(apiService.analyzeImpact(validPayload)).rejects.toThrow('An internal server error occurred');
    });

    test('should handle network errors', async () => {
      if (!apiService) {
        throw new Error('API service not available - expected in RED phase');
      }

      const networkError = new Error('Network Error');
      networkError.code = 'NETWORK_ERROR';

      mockAxios.post.mockRejectedValue(networkError);

      await expect(apiService.analyzeImpact(validPayload)).rejects.toThrow('Network connection failed');
    });

    test('should handle timeout errors', async () => {
      if (!apiService) {
        throw new Error('API service not available - expected in RED phase');
      }

      const timeoutError = new Error('timeout of 10000ms exceeded');
      timeoutError.code = 'ECONNABORTED';

      mockAxios.post.mockRejectedValue(timeoutError);

      await expect(apiService.analyzeImpact(validPayload)).rejects.toThrow('Request timed out');
    });

    test('should validate required fields before making request', async () => {
      if (!apiService) {
        throw new Error('API service not available - expected in RED phase');
      }

      // Test missing alertName
      await expect(apiService.analyzeImpact({
        userId: 'user-123',
        accountId: 'account-456',
        timestamp: '2025-08-12T05:15:00.000Z'
      })).rejects.toThrow('Alert name is required');

      // Test missing userId
      await expect(apiService.analyzeImpact({
        alertName: 'Test Alert',
        accountId: 'account-456',
        timestamp: '2025-08-12T05:15:00.000Z'
      })).rejects.toThrow('User ID is required');

      // Test missing accountId
      await expect(apiService.analyzeImpact({
        alertName: 'Test Alert',
        userId: 'user-123',
        timestamp: '2025-08-12T05:15:00.000Z'
      })).rejects.toThrow('Account ID is required');
    });

    test('should sanitize input data', async () => {
      if (!apiService) {
        throw new Error('API service not available - expected in RED phase');
      }

      mockAxios.post.mockResolvedValue(mockSuccessResponse);

      const payloadWithExtraSpaces = {
        alertName: '  Test Alert  ',
        userId: 'user-123',
        accountId: 'account-456',
        timestamp: '2025-08-12T05:15:00.000Z'
      };

      await apiService.analyzeImpact(payloadWithExtraSpaces);

      expect(mockAxios.post).toHaveBeenCalledWith(
        '/api/v1/alerts/impact-analysis',
        expect.objectContaining({
          alertName: 'Test Alert' // Should be trimmed
        }),
        expect.any(Object)
      );
    });
  });

  describe('Configuration', () => {
    test('should have correct timeout configuration', () => {
      if (!apiService) {
        throw new Error('API service not available - expected in RED phase');
      }

      expect(mockAxios.defaults.timeout).toBe(10000);
    });

    test('should have correct base URL configuration', () => {
      if (!apiService) {
        throw new Error('API service not available - expected in RED phase');
      }

      // This will be tested when we implement the service
      expect(apiService.getBaseURL).toBeDefined();
      expect(typeof apiService.getBaseURL).toBe('function');
    });
  });

  describe('Retry Logic', () => {
    test('should retry failed requests with exponential backoff', async () => {
      if (!apiService) {
        throw new Error('API service not available - expected in RED phase');
      }

      // Mock first two calls to fail, third to succeed
      mockAxios.post
        .mockRejectedValueOnce(new Error('Network Error'))
        .mockRejectedValueOnce(new Error('Network Error'))
        .mockResolvedValueOnce(mockSuccessResponse);

      const result = await apiService.analyzeImpact(validPayload);

      expect(mockAxios.post).toHaveBeenCalledTimes(3);
      expect(result).toEqual(mockSuccessResponse.data);
    });

    test('should not retry on validation errors', async () => {
      if (!apiService) {
        throw new Error('API service not available - expected in RED phase');
      }

      const validationError = {
        response: {
          status: 400,
          data: {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid request data'
            }
          }
        }
      };

      mockAxios.post.mockRejectedValue(validationError);

      await expect(apiService.analyzeImpact(validPayload)).rejects.toThrow();
      expect(mockAxios.post).toHaveBeenCalledTimes(1); // No retries
    });

    test('should not retry on authentication errors', async () => {
      if (!apiService) {
        throw new Error('API service not available - expected in RED phase');
      }

      const authError = {
        response: {
          status: 401,
          data: {
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'Access token is required'
            }
          }
        }
      };

      mockAxios.post.mockRejectedValue(authError);

      await expect(apiService.analyzeImpact(validPayload)).rejects.toThrow();
      expect(mockAxios.post).toHaveBeenCalledTimes(1); // No retries
    });

    test('should limit retry attempts to maximum of 3', async () => {
      if (!apiService) {
        throw new Error('API service not available - expected in RED phase');
      }

      mockAxios.post.mockRejectedValue(new Error('Network Error'));

      await expect(apiService.analyzeImpact(validPayload)).rejects.toThrow();
      expect(mockAxios.post).toHaveBeenCalledTimes(3); // Original + 2 retries
    });
  });

  describe('Caching', () => {
    test('should cache successful responses', async () => {
      if (!apiService) {
        throw new Error('API service not available - expected in RED phase');
      }

      mockAxios.post.mockResolvedValue(mockSuccessResponse);

      // First call
      const result1 = await apiService.analyzeImpact(validPayload);
      
      // Second call with same payload
      const result2 = await apiService.analyzeImpact(validPayload);

      expect(mockAxios.post).toHaveBeenCalledTimes(1); // Should use cache for second call
      expect(result1).toEqual(result2);
    });

    test('should respect cache TTL of 5 minutes', async () => {
      if (!apiService) {
        throw new Error('API service not available - expected in RED phase');
      }

      mockAxios.post.mockResolvedValue(mockSuccessResponse);

      // Mock Date.now to control time
      const originalNow = Date.now;
      let currentTime = 1000000;
      Date.now = jest.fn(() => currentTime);

      // First call
      await apiService.analyzeImpact(validPayload);
      expect(mockAxios.post).toHaveBeenCalledTimes(1);

      // Second call within 5 minutes - should use cache
      currentTime += 4 * 60 * 1000; // 4 minutes later
      await apiService.analyzeImpact(validPayload);
      expect(mockAxios.post).toHaveBeenCalledTimes(1);

      // Third call after 5 minutes - should make new request
      currentTime += 2 * 60 * 1000; // 6 minutes total
      await apiService.analyzeImpact(validPayload);
      expect(mockAxios.post).toHaveBeenCalledTimes(2);

      // Restore Date.now
      Date.now = originalNow;
    });

    test('should not cache error responses', async () => {
      if (!apiService) {
        throw new Error('API service not available - expected in RED phase');
      }

      const errorResponse = {
        response: {
          status: 500,
          data: {
            success: false,
            error: {
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Server error'
            }
          }
        }
      };

      mockAxios.post.mockRejectedValue(errorResponse);

      // First call - should fail
      await expect(apiService.analyzeImpact(validPayload)).rejects.toThrow();
      
      // Second call - should make new request, not use cache
      await expect(apiService.analyzeImpact(validPayload)).rejects.toThrow();
      
      expect(mockAxios.post).toHaveBeenCalledTimes(2);
    });
  });
});

// These tests should ALL FAIL initially since we haven't implemented the API service yet
// This is the expected behavior in the TDD RED phase
