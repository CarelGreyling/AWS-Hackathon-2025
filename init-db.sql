-- Database initialization script for Parameter Risk Analysis

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS parameter_risk;

-- Connect to the database
\c parameter_risk;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    account_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    account_id UUID NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    alert_type VARCHAR(100),
    affected_services JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, account_id)
);

-- Create impact_analyses table
CREATE TABLE IF NOT EXISTS impact_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_name VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    account_id UUID NOT NULL,
    customers_affected INTEGER NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    confidence_score DECIMAL(5,2) NOT NULL,
    critical_services JSONB,
    dependent_alerts JSONB,
    estimated_downtime VARCHAR(100),
    recommendations JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(255),
    request_details JSONB,
    response_details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_alerts_account_id ON alerts(account_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_name ON alerts(name);
CREATE INDEX IF NOT EXISTS idx_impact_analyses_account_id ON impact_analyses(account_id);
CREATE INDEX IF NOT EXISTS idx_impact_analyses_user_id ON impact_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_impact_analyses_created_at ON impact_analyses(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Insert sample data for demo
INSERT INTO users (id, email, password_hash, account_id, name, role) VALUES
('user-123', 'demo@example.com', '$2b$10$example.hash.for.demo', 'account-456', 'Demo User', 'admin'),
('user-789', 'test@example.com', '$2b$10$example.hash.for.test', 'account-456', 'Test User', 'user')
ON CONFLICT (email) DO NOTHING;

INSERT INTO alerts (id, name, user_id, account_id, status, alert_type, affected_services) VALUES
('alert-123', 'Production Database CPU Alert', 'user-123', 'account-456', 'active', 'database', '["payment-processing", "user-authentication"]'),
('alert-456', 'web-server-memory-warning', 'user-123', 'account-456', 'active', 'server', '["logging-service"]'),
('alert-789', 'Payment System Critical Alert', 'user-123', 'account-456', 'active', 'payment', '["payment-processing", "billing-service", "fraud-detection"]')
ON CONFLICT (name, account_id) DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
