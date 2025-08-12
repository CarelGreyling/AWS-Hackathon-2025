// Database service for alert operations

// Mock database - in production this would be PostgreSQL/DynamoDB
const mockDatabase = {
  alerts: [
    {
      id: 'alert-123',
      name: 'Production Database CPU Alert',
      user_id: 'user-123',
      account_id: 'account-456',
      status: 'active',
      created_at: new Date('2025-08-10T10:00:00Z'),
      updated_at: new Date('2025-08-10T10:00:00Z')
    },
    {
      id: 'alert-456',
      name: 'web-server-memory-warning',
      user_id: 'user-123',
      account_id: 'account-456',
      status: 'active',
      created_at: new Date('2025-08-11T15:30:00Z'),
      updated_at: new Date('2025-08-11T15:30:00Z')
    }
  ],
  impactAnalyses: [],
  auditLogs: []
};

/**
 * Check if alert name exists for a specific user/account
 */
async function checkAlertNameExists(alertName, userId, accountId) {
  // Simulate database query delay
  await new Promise(resolve => setTimeout(resolve, 10));
  
  const normalizedName = alertName.toLowerCase().trim();
  
  const existingAlert = mockDatabase.alerts.find(alert => 
    alert.name.toLowerCase() === normalizedName &&
    alert.account_id === accountId &&
    alert.status === 'active'
  );
  
  return !!existingAlert;
}

/**
 * Get alert by name for a specific user/account
 */
async function getAlertByName(alertName, userId, accountId) {
  await new Promise(resolve => setTimeout(resolve, 10));
  
  const normalizedName = alertName.toLowerCase().trim();
  
  return mockDatabase.alerts.find(alert => 
    alert.name.toLowerCase() === normalizedName &&
    alert.account_id === accountId &&
    alert.status === 'active'
  );
}

/**
 * Create a new alert
 */
async function createAlert(alertData) {
  await new Promise(resolve => setTimeout(resolve, 20));
  
  const newAlert = {
    id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: alertData.name,
    user_id: alertData.userId,
    account_id: alertData.accountId,
    status: 'active',
    alert_type: alertData.alertType || 'unknown',
    affected_services: alertData.affectedServices || [],
    created_at: new Date(),
    updated_at: new Date()
  };
  
  mockDatabase.alerts.push(newAlert);
  return newAlert;
}

/**
 * Store impact analysis result
 */
async function storeImpactAnalysis(analysisData) {
  await new Promise(resolve => setTimeout(resolve, 15));
  
  const analysis = {
    id: `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    alert_name: analysisData.alertName,
    user_id: analysisData.userId,
    account_id: analysisData.accountId,
    customers_affected: analysisData.customersAffected,
    risk_level: analysisData.riskLevel,
    confidence_score: analysisData.confidenceScore,
    critical_services: analysisData.criticalServices,
    dependent_alerts: analysisData.dependentAlerts,
    estimated_downtime: analysisData.estimatedDowntime,
    recommendations: analysisData.recommendations,
    created_at: new Date()
  };
  
  mockDatabase.impactAnalyses.push(analysis);
  return analysis;
}

/**
 * Get historical data for an alert type/service combination
 */
async function getHistoricalData(alertType, affectedServices = []) {
  await new Promise(resolve => setTimeout(resolve, 25));
  
  // Mock historical data based on alert type and services
  const baseData = {
    avgCustomersAffected: 100,
    avgDowntime: 60,
    successfulDeployments: 10,
    failedDeployments: 2
  };
  
  // Adjust based on alert type
  switch (alertType) {
    case 'database':
      baseData.avgCustomersAffected = 1200;
      baseData.avgDowntime = 180;
      baseData.successfulDeployments = 15;
      baseData.failedDeployments = 3;
      break;
    case 'payment':
      baseData.avgCustomersAffected = 5000;
      baseData.avgDowntime = 900;
      baseData.successfulDeployments = 5;
      baseData.failedDeployments = 8;
      break;
    case 'logging':
      baseData.avgCustomersAffected = 50;
      baseData.avgDowntime = 30;
      baseData.successfulDeployments = 25;
      baseData.failedDeployments = 1;
      break;
  }
  
  // Adjust based on critical services
  const criticalServices = ['payment-processing', 'user-authentication', 'order-management'];
  const hasCriticalServices = affectedServices.some(service => criticalServices.includes(service));
  
  if (hasCriticalServices) {
    baseData.avgCustomersAffected *= 1.5;
    baseData.avgDowntime *= 1.3;
    baseData.failedDeployments += 2;
  }
  
  return baseData;
}

/**
 * Store audit log entry
 */
async function storeAuditLog(logEntry) {
  await new Promise(resolve => setTimeout(resolve, 5));
  
  const auditLog = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...logEntry,
    created_at: new Date()
  };
  
  mockDatabase.auditLogs.push(auditLog);
  return auditLog;
}

/**
 * Get recent impact analyses for trend analysis
 */
async function getRecentAnalyses(userId, accountId, limit = 10) {
  await new Promise(resolve => setTimeout(resolve, 20));
  
  return mockDatabase.impactAnalyses
    .filter(analysis => analysis.account_id === accountId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);
}

/**
 * Health check for database connection
 */
async function healthCheck() {
  await new Promise(resolve => setTimeout(resolve, 5));
  
  return {
    status: 'healthy',
    alerts_count: mockDatabase.alerts.length,
    analyses_count: mockDatabase.impactAnalyses.length,
    audit_logs_count: mockDatabase.auditLogs.length,
    timestamp: new Date().toISOString()
  };
}

/**
 * Clear test data (for testing purposes)
 */
async function clearTestData() {
  if (process.env.NODE_ENV === 'test') {
    mockDatabase.alerts = mockDatabase.alerts.filter(alert => 
      !alert.user_id.startsWith('user-')
    );
    mockDatabase.impactAnalyses = mockDatabase.impactAnalyses.filter(analysis => 
      !analysis.user_id.startsWith('user-')
    );
    mockDatabase.auditLogs = mockDatabase.auditLogs.filter(log => 
      !log.user_id.startsWith('user-')
    );
  }
}

module.exports = {
  checkAlertNameExists,
  getAlertByName,
  createAlert,
  storeImpactAnalysis,
  getHistoricalData,
  storeAuditLog,
  getRecentAnalyses,
  healthCheck,
  clearTestData,
  // Export mock database for testing
  _mockDatabase: mockDatabase
};
