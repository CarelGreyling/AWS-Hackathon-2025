// API service for frontend-backend communication - Implementation to make tests pass (TDD GREEN phase)

import axios from 'axios';

// Configure axios defaults
axios.defaults.timeout = 10000;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Base URL configuration
const getBaseURL = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001';
  }
  return ''; // Use relative URLs in production
};

// In-memory cache for API responses
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Cache key generator
const generateCacheKey = (endpoint, payload) => {
  return `${endpoint}:${JSON.stringify(payload)}`;
};

// Check if cache entry is valid
const isCacheValid = (entry) => {
  return entry && (Date.now() - entry.timestamp) < CACHE_TTL;
};

// Get from cache
const getFromCache = (key) => {
  const entry = cache.get(key);
  if (isCacheValid(entry)) {
    return entry.data;
  }
  cache.delete(key);
  return null;
};

// Set cache
const setCache = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Get auth token from localStorage
const getAuthToken = () => {
  try {
    return localStorage.getItem('authToken');
  } catch (error) {
    return null;
  }
};

// Create request headers
const createHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Validate required fields
const validatePayload = (payload) => {
  if (!payload.alertName || typeof payload.alertName !== 'string') {
    throw new Error('Alert name is required');
  }

  if (!payload.userId || typeof payload.userId !== 'string') {
    throw new Error('User ID is required');
  }

  if (!payload.accountId || typeof payload.accountId !== 'string') {
    throw new Error('Account ID is required');
  }

  if (!payload.timestamp) {
    throw new Error('Timestamp is required');
  }
};

// Sanitize input data
const sanitizePayload = (payload) => {
  return {
    ...payload,
    alertName: payload.alertName.trim(),
    userId: payload.userId.trim(),
    accountId: payload.accountId.trim()
  };
};

// Determine if error should be retried
const shouldRetry = (error) => {
  // Don't retry client errors (4xx)
  if (error.response && error.response.status >= 400 && error.response.status < 500) {
    return false;
  }

  // Retry network errors and server errors (5xx)
  return true;
};

// Sleep function for retry delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Exponential backoff retry logic
const retryWithBackoff = async (fn, maxRetries = 3) => {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if it's not a retryable error
      if (!shouldRetry(error)) {
        throw error;
      }

      // Don't sleep on the last attempt
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        await sleep(delay);
      }
    }
  }

  throw lastError;
};

// Handle API errors
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { data } = error.response;
    if (data && data.error && data.error.message) {
      throw new Error(data.error.message);
    }
    throw new Error(`HTTP ${error.response.status}: ${error.response.statusText}`);
  } else if (error.code === 'ECONNABORTED') {
    // Request timeout
    throw new Error('Request timed out');
  } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
    // Network error
    throw new Error('Network connection failed');
  } else {
    // Other errors
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

// Main API function for impact analysis
const analyzeImpact = async (payload) => {
  // Validate payload
  validatePayload(payload);

  // Sanitize payload
  const sanitizedPayload = sanitizePayload(payload);

  // Check cache first
  const endpoint = '/api/v1/alerts/impact-analysis';
  const cacheKey = generateCacheKey(endpoint, sanitizedPayload);
  const cachedResult = getFromCache(cacheKey);
  
  if (cachedResult) {
    return cachedResult;
  }

  // Make API request with retry logic
  const makeRequest = async () => {
    const response = await axios.post(
      `${getBaseURL()}${endpoint}`,
      sanitizedPayload,
      {
        headers: createHeaders()
      }
    );
    return response.data;
  };

  try {
    const result = await retryWithBackoff(makeRequest);
    
    // Cache successful responses only
    if (result.success) {
      setCache(cacheKey, result);
    }
    
    return result;
  } catch (error) {
    handleApiError(error);
  }
};

// Health check function
const healthCheck = async () => {
  try {
    const response = await axios.get(`${getBaseURL()}/health`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Clear cache function (useful for testing)
const clearCache = () => {
  cache.clear();
};

// Get cache stats (useful for debugging)
const getCacheStats = () => {
  const entries = Array.from(cache.entries());
  const validEntries = entries.filter(([key, entry]) => isCacheValid(entry));
  
  return {
    totalEntries: entries.length,
    validEntries: validEntries.length,
    expiredEntries: entries.length - validEntries.length
  };
};

export {
  analyzeImpact,
  healthCheck,
  clearCache,
  getCacheStats,
  getBaseURL
};

export default {
  analyzeImpact,
  healthCheck,
  clearCache,
  getCacheStats,
  getBaseURL
};
