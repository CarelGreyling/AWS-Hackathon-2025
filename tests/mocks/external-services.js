// Mock external services for testing

import { jest } from '@jest/globals';

// Mock Redis client
export const mockRedisClient = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  exists: jest.fn(),
  expire: jest.fn(),
  flushall: jest.fn(),
  quit: jest.fn(),
  connect: jest.fn().mockResolvedValue(undefined),
  disconnect: jest.fn().mockResolvedValue(undefined),
  isOpen: true,
  isReady: true
};

// Mock database client
export const mockDbClient = {
  query: jest.fn(),
  connect: jest.fn().mockResolvedValue(undefined),
  end: jest.fn().mockResolvedValue(undefined),
  release: jest.fn()
};

// Mock AWS services
export const mockS3Client = {
  upload: jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
      Location: 'https://test-bucket.s3.amazonaws.com/test-file.xml',
      Key: 'test-file.xml',
      Bucket: 'test-bucket'
    })
  }),
  getObject: jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
      Body: Buffer.from('<?xml version="1.0"?><test>data</test>'),
      ContentType: 'application/xml'
    })
  }),
  deleteObject: jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({})
  })
};

// Mock email service
export const mockEmailService = {
  sendEmail: jest.fn().mockResolvedValue({
    messageId: 'test-message-id',
    status: 'sent'
  }),
  sendBulkEmail: jest.fn().mockResolvedValue({
    messageIds: ['test-message-1', 'test-message-2'],
    status: 'sent'
  })
};

// Mock notification service
export const mockNotificationService = {
  sendWebhook: jest.fn().mockResolvedValue({
    status: 200,
    response: 'OK'
  }),
  sendSlackNotification: jest.fn().mockResolvedValue({
    ok: true,
    channel: 'test-channel'
  })
};

// Mock authentication service
export const mockAuthService = {
  verifyToken: jest.fn().mockResolvedValue({
    userId: 'user-123',
    accountId: 'account-456',
    role: 'admin'
  }),
  generateToken: jest.fn().mockReturnValue('mock-jwt-token'),
  hashPassword: jest.fn().mockResolvedValue('$2b$10$mock.hash'),
  comparePassword: jest.fn().mockResolvedValue(true)
};

// Mock rate limiter
export const mockRateLimiter = {
  checkLimit: jest.fn().mockResolvedValue({
    allowed: true,
    remaining: 99,
    resetTime: Date.now() + 3600000
  }),
  incrementCounter: jest.fn().mockResolvedValue(1)
};

// Helper function to reset all mocks
export const resetAllMocks = () => {
  Object.values(mockRedisClient).forEach(mock => {
    if (typeof mock === 'function' && mock.mockReset) {
      mock.mockReset();
    }
  });
  
  Object.values(mockDbClient).forEach(mock => {
    if (typeof mock === 'function' && mock.mockReset) {
      mock.mockReset();
    }
  });
  
  Object.values(mockS3Client).forEach(mock => {
    if (typeof mock === 'function' && mock.mockReset) {
      mock.mockReset();
    }
  });
  
  Object.values(mockEmailService).forEach(mock => {
    if (typeof mock === 'function' && mock.mockReset) {
      mock.mockReset();
    }
  });
  
  Object.values(mockNotificationService).forEach(mock => {
    if (typeof mock === 'function' && mock.mockReset) {
      mock.mockReset();
    }
  });
  
  Object.values(mockAuthService).forEach(mock => {
    if (typeof mock === 'function' && mock.mockReset) {
      mock.mockReset();
    }
  });
  
  Object.values(mockRateLimiter).forEach(mock => {
    if (typeof mock === 'function' && mock.mockReset) {
      mock.mockReset();
    }
  });
};

// Setup default mock behaviors
export const setupDefaultMocks = () => {
  // Redis defaults
  mockRedisClient.get.mockResolvedValue(null);
  mockRedisClient.set.mockResolvedValue('OK');
  mockRedisClient.del.mockResolvedValue(1);
  mockRedisClient.exists.mockResolvedValue(0);
  mockRedisClient.expire.mockResolvedValue(1);
  
  // Database defaults
  mockDbClient.query.mockResolvedValue({ rows: [], rowCount: 0 });
  
  // Auth defaults
  mockAuthService.verifyToken.mockResolvedValue({
    userId: 'user-123',
    accountId: 'account-456',
    role: 'admin'
  });
  
  // Rate limiter defaults
  mockRateLimiter.checkLimit.mockResolvedValue({
    allowed: true,
    remaining: 99,
    resetTime: Date.now() + 3600000
  });
};
