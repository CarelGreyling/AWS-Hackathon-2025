// Audit logging middleware

// Mock audit logger - in real implementation, this would write to database
const auditLogger = {
  log: (entry) => {
    console.log('AUDIT LOG:', JSON.stringify(entry, null, 2));
    // In real implementation, this would write to database
    // await db.query('INSERT INTO audit_logs ...', entry);
  }
};

// Audit logging middleware for API requests
const auditRequest = (action, resourceType = 'unknown') => {
  return (req, res, next) => {
    const startTime = Date.now();
    
    // Capture original res.json to log response
    const originalJson = res.json;
    res.json = function(data) {
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Create audit log entry
      const auditEntry = {
        id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        user_id: req.user?.userId || 'anonymous',
        action: action,
        resource_type: resourceType,
        resource_id: req.body?.alertName || req.params?.id || null,
        request_details: {
          method: req.method,
          path: req.path,
          body: req.body,
          query: req.query,
          params: req.params
        },
        response_details: {
          status_code: res.statusCode,
          success: data?.success || false,
          duration_ms: duration
        },
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      };

      // Log the audit entry
      auditLogger.log(auditEntry);

      // Call original json method
      return originalJson.call(this, data);
    };

    next();
  };
};

module.exports = {
  auditRequest,
  auditLogger
};
