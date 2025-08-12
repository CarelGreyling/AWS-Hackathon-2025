// Mock API responses for testing

const mockImpactAnalysisResponse = {
  success: true,
  data: {
    alertExists: true,
    impactAnalysis: {
      customersAffected: 1250,
      criticalServices: [
        "payment-processing",
        "user-authentication",
        "order-management"
      ],
      dependentAlerts: [
        "downstream-service-alert",
        "cascade-failure-alert",
        "database-connection-alert"
      ],
      estimatedDowntime: "2-5 minutes",
      riskLevel: "HIGH",
      confidenceScore: 0.85
    },
    recommendations: [
      "Consider maintenance window scheduling",
      "Notify affected customers in advance",
      "Prepare rollback plan",
      "Monitor critical services during deployment"
    ]
  },
  timestamp: "2025-08-12T04:15:01.152Z"
};

const mockImpactAnalysisLowRisk = {
  success: true,
  data: {
    alertExists: true,
    impactAnalysis: {
      customersAffected: 50,
      criticalServices: [
        "logging-service"
      ],
      dependentAlerts: [],
      estimatedDowntime: "< 1 minute",
      riskLevel: "LOW",
      confidenceScore: 0.92
    },
    recommendations: [
      "Safe to proceed with deployment",
      "Monitor logs for any anomalies"
    ]
  },
  timestamp: "2025-08-12T04:15:01.152Z"
};

const mockImpactAnalysisCritical = {
  success: true,
  data: {
    alertExists: true,
    impactAnalysis: {
      customersAffected: 5000,
      criticalServices: [
        "payment-processing",
        "user-authentication",
        "order-management",
        "inventory-system",
        "notification-service"
      ],
      dependentAlerts: [
        "payment-failure-alert",
        "auth-service-down",
        "database-critical-alert",
        "cache-failure-alert"
      ],
      estimatedDowntime: "10-30 minutes",
      riskLevel: "CRITICAL",
      confidenceScore: 0.95
    },
    recommendations: [
      "DO NOT PROCEED - Schedule maintenance window",
      "Coordinate with all stakeholders",
      "Prepare comprehensive rollback plan",
      "Consider phased deployment approach",
      "Ensure 24/7 support coverage"
    ]
  },
  timestamp: "2025-08-12T04:15:01.152Z"
};

const mockErrorResponse = {
  success: false,
  error: {
    code: "IMPACT_ANALYSIS_FAILED",
    message: "Unable to analyze customer impact at this time",
    details: "Service temporarily unavailable"
  },
  timestamp: "2025-08-12T04:15:01.152Z"
};

const mockTimeoutError = {
  success: false,
  error: {
    code: "REQUEST_TIMEOUT",
    message: "Impact analysis request timed out",
    details: "Analysis took longer than 10 seconds"
  },
  timestamp: "2025-08-12T04:15:01.152Z"
};

const mockValidationError = {
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Invalid alert name provided",
    details: "Alert name must be between 3-255 characters and contain only alphanumeric characters, hyphens, and underscores"
  },
  timestamp: "2025-08-12T04:15:01.152Z"
};

module.exports = {
  mockImpactAnalysisResponse,
  mockImpactAnalysisLowRisk,
  mockImpactAnalysisCritical,
  mockErrorResponse,
  mockTimeoutError,
  mockValidationError
};
