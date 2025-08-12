// Rate limiting middleware

// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore = new Map();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.resetTime > 0) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

// Rate limiter factory
const createRateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    maxRequests = 100, // 100 requests per window
    keyGenerator = (req) => req.ip || 'anonymous',
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = options;

  return (req, res, next) => {
    const key = keyGenerator(req);
    const now = Date.now();
    
    // Get or create rate limit data for this key
    let rateLimitData = rateLimitStore.get(key);
    
    if (!rateLimitData || now > rateLimitData.resetTime) {
      // Create new window
      rateLimitData = {
        count: 0,
        resetTime: now + windowMs,
        firstRequest: now
      };
      rateLimitStore.set(key, rateLimitData);
    }

    // Check if limit exceeded
    if (rateLimitData.count >= maxRequests) {
      const resetTimeSeconds = Math.ceil((rateLimitData.resetTime - now) / 1000);
      
      res.set({
        'X-RateLimit-Limit': maxRequests,
        'X-RateLimit-Remaining': 0,
        'X-RateLimit-Reset': Math.ceil(rateLimitData.resetTime / 1000),
        'Retry-After': resetTimeSeconds
      });

      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests',
          details: `Rate limit exceeded. Try again in ${resetTimeSeconds} seconds.`
        },
        timestamp: new Date().toISOString()
      });
    }

    // Increment counter
    rateLimitData.count++;

    // Set rate limit headers
    res.set({
      'X-RateLimit-Limit': maxRequests,
      'X-RateLimit-Remaining': Math.max(0, maxRequests - rateLimitData.count),
      'X-RateLimit-Reset': Math.ceil(rateLimitData.resetTime / 1000)
    });

    next();
  };
};

// Pre-configured rate limiters
const apiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes
  keyGenerator: (req) => req.user?.userId || req.ip || 'anonymous'
});

const impactAnalysisRateLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 20, // 20 impact analysis requests per 5 minutes
  keyGenerator: (req) => req.user?.userId || req.ip || 'anonymous'
});

module.exports = {
  createRateLimiter,
  apiRateLimiter,
  impactAnalysisRateLimiter
};
