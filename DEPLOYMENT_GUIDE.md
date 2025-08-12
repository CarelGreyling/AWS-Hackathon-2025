# 🚀 Parameter Risk Analysis - Deployment Guide

## Quick Start (Recommended for Demo)

### Prerequisites
- Docker and Docker Compose installed
- Ports 80, 3001, 5432, 6379 available

### One-Command Deployment
```bash
./deploy.sh
```

That's it! The application will be available at **http://localhost**

## Deployment Options

### Option 1: Docker Compose (Recommended)
```bash
# Deploy everything
./deploy.sh

# Check status
./deploy.sh status

# View logs
./deploy.sh logs

# Restart services
./deploy.sh restart

# Stop services
./deploy.sh stop

# Clean up
./deploy.sh cleanup
```

### Option 2: Manual Docker Compose
```bash
# Build and start all services
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 3: Local Development
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev
```

## Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost | Main application interface |
| **Backend API** | http://localhost:3001 | REST API endpoints |
| **Health Check** | http://localhost:3001/health | Service health status |
| **Database** | localhost:5432 | PostgreSQL (postgres/password) |
| **Redis** | localhost:6379 | Cache service |

## Demo Scenarios

### 1. Low Risk Alert
- **Alert Name**: `Logging Service Warning`
- **Expected Result**: LOW risk, ~50 customers affected
- **Services**: logging-service
- **Recommendations**: Safe to proceed

### 2. High Risk Alert  
- **Alert Name**: `Production Database CPU Alert`
- **Expected Result**: HIGH risk, ~1,250 customers affected
- **Services**: payment-processing, user-authentication
- **Recommendations**: Schedule maintenance window

### 3. Critical Risk Alert
- **Alert Name**: `Payment System Critical Alert`
- **Expected Result**: CRITICAL risk, ~5,000 customers affected
- **Services**: payment-processing, billing-service, fraud-detection
- **Recommendations**: DO NOT PROCEED

### 4. Validation Testing
Try these invalid inputs to see validation:
- `Al` (too short)
- `Alert@Name!` (invalid characters)
- `default` (reserved name)
- `system` (reserved name)

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React)       │────│   (Node.js)     │────│   (PostgreSQL)  │
│   Port: 80      │    │   Port: 3001    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   Redis Cache   │
                       │   Port: 6379    │
                       └─────────────────┘
```

## Features Demonstrated

### ✅ **Core Functionality**
- Real-time alert name validation
- Impact analysis with risk calculation
- Customer impact assessment
- Critical services identification
- Contextual recommendations

### ✅ **User Experience**
- Professional Material-UI interface
- Real-time validation feedback
- Loading states and transitions
- Error handling and recovery
- Keyboard navigation support

### ✅ **Technical Features**
- RESTful API with comprehensive validation
- Request caching (5-minute TTL)
- Rate limiting protection
- Audit logging
- Health monitoring

### ✅ **Security & Performance**
- Input sanitization and validation
- Authentication framework (mocked for demo)
- Error handling without information leakage
- Optimized database queries
- Response caching

## Troubleshooting

### Port Conflicts
```bash
# Check what's using a port
lsof -i :80
lsof -i :3001

# Kill process using port
sudo kill -9 $(lsof -t -i:80)
```

### Service Issues
```bash
# Check service health
docker-compose ps

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Restart specific service
docker-compose restart backend
```

### Database Issues
```bash
# Connect to database
docker-compose exec db psql -U postgres -d parameter_risk

# Check tables
\dt

# View sample data
SELECT * FROM alerts;
```

### Reset Everything
```bash
# Complete cleanup and restart
./deploy.sh cleanup
./deploy.sh
```

## Demo Script

### 1. **Introduction** (30 seconds)
"This is a Parameter Risk Analysis application that helps assess the customer impact of configuration changes."

### 2. **Show Interface** (30 seconds)
- Point out clean, professional interface
- Explain the alert name input field
- Show character counter and validation

### 3. **Demonstrate Validation** (1 minute)
- Type "Al" → Show validation error
- Type "Alert@Name!" → Show invalid characters error
- Type "default" → Show reserved name error
- Type "Valid Alert Name" → Show validation passes

### 4. **Low Risk Analysis** (1 minute)
- Enter "Logging Service Warning"
- Click "Analyze Impact"
- Show loading state
- Explain LOW risk result (50 customers, logging-service)

### 5. **High Risk Analysis** (1 minute)
- Enter "Production Database CPU Alert"
- Show HIGH risk result (1,250 customers)
- Expand critical services section
- Show recommendations

### 6. **Critical Risk Analysis** (1 minute)
- Enter "Payment System Critical Alert"
- Show CRITICAL risk result (5,000 customers)
- Highlight "DO NOT PROCEED" recommendation
- Show multiple critical services

### 7. **Technical Highlights** (1 minute)
- Show real-time validation
- Demonstrate keyboard navigation
- Show error handling (network error simulation)
- Mention caching and performance features

## Production Deployment

For production deployment, see:
- `infrastructure/` folder for AWS CDK
- Environment variable configuration
- SSL/TLS setup
- Database migration scripts
- Monitoring and logging setup

## Support

- **Logs**: `docker-compose logs -f`
- **Health Check**: http://localhost:3001/health
- **Database**: Connect via any PostgreSQL client
- **API Testing**: Use Postman or curl with the API endpoints

---

**Total Demo Time**: ~6 minutes
**Setup Time**: ~2 minutes
**Perfect for**: Technical demonstrations, stakeholder reviews, user testing
