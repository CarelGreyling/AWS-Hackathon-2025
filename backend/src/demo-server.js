// Simplified Express server for demo - bypasses complex middleware

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Basic middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Simple impact analysis algorithm
const analyzeImpact = (alertName) => {
  const lowerName = alertName.toLowerCase();
  
  // Determine impact based on alert name
  if (lowerName.includes('payment') || lowerName.includes('billing') || lowerName.includes('critical')) {
    return {
      customersAffected: 5000,
      criticalServices: ['payment-processing', 'billing-service', 'fraud-detection'],
      dependentAlerts: ['payment-failure-alert', 'auth-service-down', 'database-critical-alert'],
      estimatedDowntime: '10-30 minutes',
      riskLevel: 'CRITICAL',
      confidenceScore: 0.95,
      recommendations: [
        'DO NOT PROCEED - Schedule maintenance window',
        'Coordinate with all stakeholders',
        'Prepare comprehensive rollback plan',
        'Consider phased deployment approach',
        'Ensure 24/7 support coverage'
      ]
    };
  } else if (lowerName.includes('database') || lowerName.includes('production') || lowerName.includes('cpu')) {
    return {
      customersAffected: 1250,
      criticalServices: ['payment-processing', 'user-authentication'],
      dependentAlerts: ['downstream-service-alert', 'cascade-failure-alert'],
      estimatedDowntime: '2-5 minutes',
      riskLevel: 'HIGH',
      confidenceScore: 0.85,
      recommendations: [
        'Consider maintenance window scheduling',
        'Notify affected customers in advance',
        'Prepare rollback plan',
        'Monitor critical services during deployment'
      ]
    };
  } else if (lowerName.includes('memory') || lowerName.includes('server')) {
    return {
      customersAffected: 500,
      criticalServices: ['user-authentication'],
      dependentAlerts: ['auth-service-alert'],
      estimatedDowntime: '1-3 minutes',
      riskLevel: 'MEDIUM',
      confidenceScore: 0.78,
      recommendations: [
        'Proceed with caution',
        'Monitor system resources',
        'Have rollback plan ready'
      ]
    };
  } else {
    // Default for logging, monitoring, etc.
    return {
      customersAffected: 50,
      criticalServices: ['logging-service'],
      dependentAlerts: [],
      estimatedDowntime: '< 1 minute',
      riskLevel: 'LOW',
      confidenceScore: 0.92,
      recommendations: [
        'Safe to proceed with deployment',
        'Monitor logs for any anomalies'
      ]
    };
  }
};

// Impact analysis endpoint (simplified for demo)
app.post('/api/v1/alerts/impact-analysis', (req, res) => {
  try {
    const { alertName } = req.body;

    // Basic validation
    if (!alertName || typeof alertName !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Alert name is required',
          details: 'Please provide a valid alert name'
        },
        timestamp: new Date().toISOString()
      });
    }

    if (alertName.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Alert name must be at least 3 characters long',
          details: 'Please provide a longer alert name'
        },
        timestamp: new Date().toISOString()
      });
    }

    if (alertName.length > 255) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Alert name cannot exceed 255 characters',
          details: 'Please provide a shorter alert name'
        },
        timestamp: new Date().toISOString()
      });
    }

    // Check for invalid characters
    if (!/^[a-zA-Z0-9][a-zA-Z0-9\-_\s]*$/.test(alertName)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Alert name contains invalid characters',
          details: 'Use only letters, numbers, hyphens, underscores, and spaces'
        },
        timestamp: new Date().toISOString()
      });
    }

    // Check for reserved names
    const reservedNames = ['default', 'system', 'admin', 'root'];
    if (reservedNames.includes(alertName.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'This name is reserved',
          details: 'Please choose a different name'
        },
        timestamp: new Date().toISOString()
      });
    }

    // Perform impact analysis
    const impactAnalysis = analyzeImpact(alertName);

    // Return response
    res.json({
      success: true,
      data: {
        alertExists: true,
        impactAnalysis,
        recommendations: impactAnalysis.recommendations
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Impact analysis error:', error);
    
    res.status(500).json({
      success: false,
      error: {
        code: 'IMPACT_ANALYSIS_FAILED',
        message: 'Unable to analyze customer impact at this time',
        details: 'Service temporarily unavailable'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Handle 404 for other routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
      details: `${req.method} ${req.originalUrl} is not a valid endpoint`
    },
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Parameter Risk Analysis Demo Server`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoint: http://localhost:${PORT}/api/v1/alerts/impact-analysis`);
  console.log(`Ready for demo! 🎯`);
});

export default app;
