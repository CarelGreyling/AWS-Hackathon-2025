// Authentication and authorization middleware

// Mock authentication for testing - will be replaced with real JWT validation
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Access token is required',
        details: 'Please provide a valid authorization token'
      },
      timestamp: new Date().toISOString()
    });
  }

  // Mock token validation - in real implementation, this would verify JWT
  if (token === 'invalid-token') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
        details: 'Please provide a valid authorization token'
      },
      timestamp: new Date().toISOString()
    });
  }

  // Mock user data - in real implementation, this would come from JWT payload
  req.user = {
    userId: 'user-123',
    accountId: 'account-456',
    role: 'admin',
    email: 'test@example.com'
  };

  next();
};

// Authorization middleware to check if user can access specific account data
const authorizeAccount = (req, res, next) => {
  const { accountId } = req.body;
  const userAccountId = req.user?.accountId;

  if (!userAccountId) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Access denied',
        details: 'User account information not available'
      },
      timestamp: new Date().toISOString()
    });
  }

  if (accountId !== userAccountId) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Access denied',
        details: 'You do not have permission to access this account data'
      },
      timestamp: new Date().toISOString()
    });
  }

  next();
};

export {
  authenticateToken,
  authorizeAccount
};
