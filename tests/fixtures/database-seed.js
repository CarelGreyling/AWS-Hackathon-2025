// Database seed data for testing

export const seedUsers = [
  {
    id: 'user-123',
    email: 'test@example.com',
    password_hash: '$2b$10$example.hash.for.testing',
    account_id: 'account-456',
    name: 'Test User',
    role: 'admin',
    created_at: new Date('2025-08-01T00:00:00Z'),
    updated_at: new Date('2025-08-01T00:00:00Z')
  },
  {
    id: 'user-789',
    email: 'regular@example.com',
    password_hash: '$2b$10$example.hash.for.testing',
    account_id: 'account-456', 
    name: 'Regular User',
    role: 'user',
    created_at: new Date('2025-08-02T00:00:00Z'),
    updated_at: new Date('2025-08-02T00:00:00Z')
  }
];

export const seedAlerts = [
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
];

export const seedImpactAnalyses = [
  {
    id: 'analysis-123',
    alert_id: 'alert-123',
    user_id: 'user-123',
    customers_affected: 1250,
    risk_level: 'HIGH',
    confidence_score: 0.85,
    critical_services: ['payment-processing', 'user-authentication'],
    dependent_alerts: ['downstream-service-alert', 'cascade-failure-alert'],
    estimated_downtime: '2-5 minutes',
    recommendations: [
      'Consider maintenance window scheduling',
      'Notify affected customers in advance',
      'Prepare rollback plan'
    ],
    created_at: new Date('2025-08-12T04:15:00Z')
  }
];

export const seedAuditLogs = [
  {
    id: 'audit-123',
    user_id: 'user-123',
    action: 'IMPACT_ANALYSIS_REQUEST',
    resource_type: 'alert',
    resource_id: 'alert-123',
    details: {
      alert_name: 'Production Database CPU Alert',
      risk_level: 'HIGH',
      customers_affected: 1250
    },
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Test Browser)',
    created_at: new Date('2025-08-12T04:15:00Z')
  }
];

// Helper function to clear all test data
export const clearTestData = async (db) => {
  await db.query('DELETE FROM audit_logs WHERE user_id LIKE \'user-%\'');
  await db.query('DELETE FROM impact_analyses WHERE user_id LIKE \'user-%\'');
  await db.query('DELETE FROM alerts WHERE user_id LIKE \'user-%\'');
  await db.query('DELETE FROM users WHERE id LIKE \'user-%\'');
};

// Helper function to seed test data
export const seedTestData = async (db) => {
  // Insert users
  for (const user of seedUsers) {
    await db.query(`
      INSERT INTO users (id, email, password_hash, account_id, name, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO NOTHING
    `, [user.id, user.email, user.password_hash, user.account_id, user.name, user.role, user.created_at, user.updated_at]);
  }

  // Insert alerts
  for (const alert of seedAlerts) {
    await db.query(`
      INSERT INTO alerts (id, name, user_id, account_id, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO NOTHING
    `, [alert.id, alert.name, alert.user_id, alert.account_id, alert.status, alert.created_at, alert.updated_at]);
  }

  // Insert impact analyses
  for (const analysis of seedImpactAnalyses) {
    await db.query(`
      INSERT INTO impact_analyses (id, alert_id, user_id, customers_affected, risk_level, confidence_score, critical_services, dependent_alerts, estimated_downtime, recommendations, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO NOTHING
    `, [
      analysis.id, analysis.alert_id, analysis.user_id, analysis.customers_affected,
      analysis.risk_level, analysis.confidence_score, JSON.stringify(analysis.critical_services),
      JSON.stringify(analysis.dependent_alerts), analysis.estimated_downtime,
      JSON.stringify(analysis.recommendations), analysis.created_at
    ]);
  }

  // Insert audit logs
  for (const log of seedAuditLogs) {
    await db.query(`
      INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, details, ip_address, user_agent, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO NOTHING
    `, [
      log.id, log.user_id, log.action, log.resource_type, log.resource_id,
      JSON.stringify(log.details), log.ip_address, log.user_agent, log.created_at
    ]);
  }
};
