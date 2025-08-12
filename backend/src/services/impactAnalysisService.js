// Impact Analysis Service - Core business logic implementation

// Critical services that have high customer impact
const CRITICAL_SERVICES = [
  'payment-processing',
  'user-authentication',
  'order-management',
  'billing-service',
  'fraud-detection',
  'inventory-system',
  'checkout-service',
  'account-service'
];

// Service impact multipliers for customer calculation
const SERVICE_IMPACT_MULTIPLIERS = {
  'payment-processing': 5.0,
  'user-authentication': 4.0,
  'order-management': 3.5,
  'billing-service': 3.0,
  'fraud-detection': 2.5,
  'inventory-system': 2.0,
  'checkout-service': 4.5,
  'account-service': 3.5,
  'logging-service': 0.1,
  'monitoring-service': 0.2,
  'analytics-service': 0.3
};

// Mock dependency mapping for finding related alerts
const SERVICE_DEPENDENCIES = {
  'payment-processing': ['billing-service', 'fraud-detection', 'order-management'],
  'user-authentication': ['account-service', 'order-management', 'checkout-service'],
  'order-management': ['inventory-system', 'payment-processing', 'checkout-service'],
  'billing-service': ['payment-processing', 'account-service'],
  'fraud-detection': ['payment-processing', 'order-management'],
  'inventory-system': ['order-management', 'checkout-service'],
  'checkout-service': ['payment-processing', 'inventory-system', 'user-authentication'],
  'account-service': ['user-authentication', 'billing-service']
};

/**
 * Calculate customer impact based on affected services
 */
function calculateCustomerImpact(alertData) {
  if (!alertData || !alertData.affectedServices || alertData.affectedServices.length === 0) {
    return 0;
  }

  const { affectedServices, historicalData = {} } = alertData;
  const baseCustomers = historicalData.avgCustomersAffected || 100;
  
  // Calculate impact multiplier based on affected services
  let impactMultiplier = 0;
  for (const service of affectedServices) {
    const multiplier = SERVICE_IMPACT_MULTIPLIERS[service] || 1.0;
    impactMultiplier += multiplier;
  }
  
  // Apply service count factor (more services = higher impact)
  const serviceCountFactor = Math.min(affectedServices.length * 0.2 + 0.8, 2.0);
  
  const totalImpact = Math.round(baseCustomers * impactMultiplier * serviceCountFactor);
  
  return Math.max(0, totalImpact);
}

/**
 * Determine risk level based on impact factors
 */
function determineRiskLevel({ customersAffected, criticalServicesCount, historicalFailureRate }) {
  // Calculate risk score based on multiple factors
  let riskScore = 0;
  
  // Customer impact factor (0-40 points)
  if (customersAffected >= 5000) riskScore += 40;
  else if (customersAffected >= 2000) riskScore += 30;
  else if (customersAffected >= 1000) riskScore += 20;
  else if (customersAffected >= 500) riskScore += 15;
  else if (customersAffected >= 100) riskScore += 10;
  else riskScore += 5;
  
  // Critical services factor (0-35 points)
  riskScore += Math.min(criticalServicesCount * 12, 35);
  
  // Historical failure rate factor (0-25 points)
  const failureRate = historicalFailureRate || 0;
  if (failureRate >= 0.5) riskScore += 25;
  else if (failureRate >= 0.3) riskScore += 20;
  else if (failureRate >= 0.2) riskScore += 15;
  else if (failureRate >= 0.1) riskScore += 10;
  else riskScore += 5;
  
  // Determine risk level based on total score
  if (riskScore >= 80) return 'CRITICAL';
  if (riskScore >= 60) return 'HIGH';
  if (riskScore >= 35) return 'MEDIUM';
  return 'LOW';
}

/**
 * Identify critical services from the affected services list
 */
function identifyCriticalServices(affectedServices) {
  if (!Array.isArray(affectedServices)) {
    return [];
  }
  
  return affectedServices.filter(service => CRITICAL_SERVICES.includes(service));
}

/**
 * Find alerts that depend on the same services
 */
function findDependentAlerts(alertName, affectedServices) {
  if (!Array.isArray(affectedServices)) {
    return [];
  }
  
  const dependentAlerts = new Set();
  
  // Find services that depend on the affected services
  for (const service of affectedServices) {
    const dependencies = SERVICE_DEPENDENCIES[service] || [];
    
    // Generate mock alert names based on dependencies
    for (const dependency of dependencies) {
      if (CRITICAL_SERVICES.includes(dependency)) {
        const alertSuffix = dependency.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        dependentAlerts.add(`${alertSuffix} Alert`);
        dependentAlerts.add(`${alertSuffix} Failure Alert`);
      }
    }
  }
  
  // Add some common dependent alerts for critical services
  const criticalServices = identifyCriticalServices(affectedServices);
  if (criticalServices.length > 0) {
    dependentAlerts.add('Downstream Service Alert');
    dependentAlerts.add('Cascade Failure Alert');
    
    if (criticalServices.includes('payment-processing')) {
      dependentAlerts.add('Payment Failure Alert');
      dependentAlerts.add('Transaction Processing Alert');
    }
    
    if (criticalServices.includes('user-authentication')) {
      dependentAlerts.add('Auth Service Down Alert');
      dependentAlerts.add('Login Failure Alert');
    }
  }
  
  // Convert to array and filter out the original alert
  return Array.from(dependentAlerts).filter(alert => 
    alert.toLowerCase() !== alertName.toLowerCase()
  );
}

/**
 * Calculate confidence score based on data quality and historical accuracy
 */
function calculateConfidenceScore({ 
  historicalDataPoints = 0, 
  successfulDeployments = 0, 
  failedDeployments = 0, 
  dataQuality = 'medium' 
}) {
  let confidence = 0.5; // Base confidence
  
  // Data quantity factor (0-0.3)
  const totalDeployments = successfulDeployments + failedDeployments;
  if (totalDeployments >= 50) confidence += 0.3;
  else if (totalDeployments >= 20) confidence += 0.2;
  else if (totalDeployments >= 10) confidence += 0.15;
  else if (totalDeployments >= 5) confidence += 0.1;
  else confidence += 0.05;
  
  // Success rate factor (0-0.2)
  if (totalDeployments > 0) {
    const successRate = successfulDeployments / totalDeployments;
    if (successRate >= 0.9) confidence += 0.2;
    else if (successRate >= 0.8) confidence += 0.15;
    else if (successRate >= 0.7) confidence += 0.1;
    else if (successRate >= 0.6) confidence += 0.05;
    // No bonus for success rates below 60%
  }
  
  // Data quality factor (-0.1 to +0.2)
  switch (dataQuality.toLowerCase()) {
    case 'high':
      confidence += 0.2;
      break;
    case 'medium':
      confidence += 0.1;
      break;
    case 'low':
      confidence -= 0.1;
      break;
  }
  
  // Ensure confidence is between 0 and 1
  return Math.max(0, Math.min(1, confidence));
}

/**
 * Generate recommendations based on risk analysis
 */
function generateRecommendations({ riskLevel, customersAffected, criticalServices, estimatedDowntime }) {
  const recommendations = [];
  
  switch (riskLevel) {
    case 'LOW':
      recommendations.push('Safe to proceed with deployment');
      recommendations.push('Monitor logs for any anomalies');
      if (estimatedDowntime > 60) {
        recommendations.push('Consider deploying during low-traffic hours');
      }
      break;
      
    case 'MEDIUM':
      recommendations.push('Proceed with caution');
      recommendations.push('Monitor critical metrics during deployment');
      recommendations.push('Have rollback plan ready');
      if (customersAffected > 200) {
        recommendations.push('Consider notifying customer support team');
      }
      break;
      
    case 'HIGH':
      recommendations.push('Consider maintenance window scheduling');
      recommendations.push('Notify affected customers in advance');
      recommendations.push('Prepare rollback plan');
      recommendations.push('Monitor critical services during deployment');
      if (criticalServices.includes('payment-processing')) {
        recommendations.push('Coordinate with payment operations team');
      }
      break;
      
    case 'CRITICAL':
      recommendations.push('DO NOT PROCEED - Schedule maintenance window');
      recommendations.push('Coordinate with all stakeholders');
      recommendations.push('Prepare comprehensive rollback plan');
      recommendations.push('Consider phased deployment approach');
      recommendations.push('Ensure 24/7 support coverage');
      if (criticalServices.includes('payment-processing')) {
        recommendations.push('Alert payment operations and fraud teams');
      }
      if (criticalServices.includes('user-authentication')) {
        recommendations.push('Prepare for potential login issues');
      }
      break;
  }
  
  // Add service-specific recommendations
  if (criticalServices.length > 0) {
    recommendations.push(`Critical services affected: ${criticalServices.join(', ')}`);
  }
  
  if (estimatedDowntime > 300) {
    recommendations.push('Extended downtime expected - communicate with stakeholders');
  }
  
  return recommendations;
}

/**
 * Estimate downtime based on alert type and historical data
 */
function estimateDowntime(alertData) {
  const { alertType, historicalData = {}, affectedServices = [] } = alertData;
  const avgDowntime = historicalData.avgDowntime || 60; // Default 1 minute
  
  // Apply multipliers based on alert type and services
  let multiplier = 1.0;
  
  if (alertType === 'database') multiplier = 2.0;
  else if (alertType === 'network') multiplier = 1.5;
  else if (alertType === 'payment') multiplier = 3.0;
  
  // Additional time for critical services
  const criticalCount = identifyCriticalServices(affectedServices).length;
  multiplier += criticalCount * 0.5;
  
  const estimatedSeconds = Math.round(avgDowntime * multiplier);
  
  // Format as human-readable string
  if (estimatedSeconds < 60) return '< 1 minute';
  if (estimatedSeconds < 300) return `${Math.round(estimatedSeconds / 60)} minutes`;
  if (estimatedSeconds < 1800) return `${Math.round(estimatedSeconds / 60)}-${Math.round(estimatedSeconds / 60) + 2} minutes`;
  return `${Math.round(estimatedSeconds / 60)}-${Math.round(estimatedSeconds / 60) + 10} minutes`;
}

/**
 * Main impact analysis function - integrates all components
 */
function analyzeImpact(alertData) {
  const { historicalData = {} } = alertData;
  
  // Calculate customer impact
  const customersAffected = calculateCustomerImpact(alertData);
  
  // Identify critical services
  const criticalServices = identifyCriticalServices(alertData.affectedServices || []);
  
  // Calculate historical failure rate
  const totalDeployments = (historicalData.successfulDeployments || 0) + (historicalData.failedDeployments || 0);
  const historicalFailureRate = totalDeployments > 0 ? 
    (historicalData.failedDeployments || 0) / totalDeployments : 0.1;
  
  // Determine risk level
  const riskLevel = determineRiskLevel({
    customersAffected,
    criticalServicesCount: criticalServices.length,
    historicalFailureRate
  });
  
  // Find dependent alerts
  const dependentAlerts = findDependentAlerts(alertData.alertName, alertData.affectedServices || []);
  
  // Estimate downtime
  const estimatedDowntime = estimateDowntime(alertData);
  
  // Calculate confidence score
  const confidenceScore = calculateConfidenceScore({
    historicalDataPoints: totalDeployments,
    successfulDeployments: historicalData.successfulDeployments || 0,
    failedDeployments: historicalData.failedDeployments || 0,
    dataQuality: totalDeployments > 20 ? 'high' : totalDeployments > 5 ? 'medium' : 'low'
  });
  
  // Generate recommendations
  const recommendations = generateRecommendations({
    riskLevel,
    customersAffected,
    criticalServices,
    estimatedDowntime: parseInt(estimatedDowntime) || 60
  });
  
  return {
    customersAffected,
    riskLevel,
    criticalServices,
    dependentAlerts,
    estimatedDowntime,
    confidenceScore,
    recommendations
  };
}

module.exports = {
  calculateCustomerImpact,
  determineRiskLevel,
  identifyCriticalServices,
  findDependentAlerts,
  calculateConfidenceScore,
  generateRecommendations,
  estimateDowntime,
  analyzeImpact,
  CRITICAL_SERVICES,
  SERVICE_IMPACT_MULTIPLIERS
};
