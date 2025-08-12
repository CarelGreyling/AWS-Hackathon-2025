// Test user data fixtures

const testUsers = {
  validUser: {
    id: "user-123",
    email: "test@example.com",
    accountId: "account-456",
    name: "Test User",
    role: "admin"
  },
  
  regularUser: {
    id: "user-789",
    email: "regular@example.com", 
    accountId: "account-456",
    name: "Regular User",
    role: "user"
  },

  anotherAccountUser: {
    id: "user-999",
    email: "other@example.com",
    accountId: "account-999",
    name: "Other Account User",
    role: "admin"
  }
};

const testAlerts = {
  existingAlert: {
    id: "alert-123",
    name: "Production Database CPU Alert",
    userId: "user-123",
    accountId: "account-456",
    createdAt: "2025-08-10T10:00:00.000Z"
  },

  anotherAlert: {
    id: "alert-456", 
    name: "web-server-memory-warning",
    userId: "user-123",
    accountId: "account-456",
    createdAt: "2025-08-11T15:30:00.000Z"
  },

  differentAccountAlert: {
    id: "alert-789",
    name: "API_Response_Time_Monitor", 
    userId: "user-999",
    accountId: "account-999",
    createdAt: "2025-08-12T08:00:00.000Z"
  }
};

const validAlertNames = [
  "Production Database CPU Alert",
  "web-server-memory-warning", 
  "API_Response_Time_Monitor",
  "Critical System Health Check",
  "Load_Balancer_Status",
  "Cache-Performance-Monitor",
  "Network_Latency_Alert",
  "Disk_Space_Warning"
];

const invalidAlertNames = [
  "Al", // too short
  "My Alert!", // invalid character
  "default", // reserved name
  "system", // reserved name
  "admin", // reserved name
  "", // empty
  "a".repeat(256), // too long
  "Alert@Name", // invalid character
  "Alert Name#1" // invalid character
];

const reservedNames = [
  "default",
  "system", 
  "admin",
  "root",
  "null",
  "undefined"
];

module.exports = {
  testUsers,
  testAlerts,
  validAlertNames,
  invalidAlertNames,
  reservedNames
};
