#!/bin/bash

# Parameter Risk Analysis - Deployment Script
# This script sets up and deploys the complete application

set -e

echo "🚀 Parameter Risk Analysis - Deployment Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if ports are available
check_ports() {
    local ports=(80 3001 5432 6379)
    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            print_warning "Port $port is already in use. Please stop the service using this port."
            print_status "You can find what's using the port with: lsof -i :$port"
        fi
    done
}

# Create necessary directories
setup_directories() {
    print_status "Setting up directories..."
    mkdir -p logs
    mkdir -p data/postgres
    mkdir -p data/redis
    print_success "Directories created"
}

# Build and start services
deploy_application() {
    print_status "Building and starting application services..."
    
    # Stop any existing containers
    docker-compose down --remove-orphans 2>/dev/null || true
    
    # Build and start services
    docker-compose up --build -d
    
    print_success "Application services started"
}

# Wait for services to be healthy
wait_for_services() {
    print_status "Waiting for services to be healthy..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose ps | grep -q "healthy"; then
            print_success "Services are healthy"
            return 0
        fi
        
        print_status "Attempt $attempt/$max_attempts - Waiting for services..."
        sleep 10
        ((attempt++))
    done
    
    print_error "Services did not become healthy within expected time"
    print_status "Checking service logs..."
    docker-compose logs --tail=50
    return 1
}

# Display service status
show_status() {
    print_status "Service Status:"
    echo ""
    docker-compose ps
    echo ""
    
    print_status "Application URLs:"
    echo "🌐 Frontend: http://localhost"
    echo "🔧 Backend API: http://localhost:3001"
    echo "📊 Health Check: http://localhost:3001/health"
    echo "🐘 Database: localhost:5432 (postgres/password)"
    echo "🔴 Redis: localhost:6379"
    echo ""
}

# Show logs
show_logs() {
    print_status "Recent logs:"
    docker-compose logs --tail=20
}

# Cleanup function
cleanup() {
    print_status "Cleaning up..."
    docker-compose down --remove-orphans
    docker system prune -f
    print_success "Cleanup completed"
}

# Main deployment function
main() {
    echo ""
    print_status "Starting deployment process..."
    echo ""
    
    # Pre-deployment checks
    check_docker
    check_ports
    setup_directories
    
    # Deploy application
    deploy_application
    
    # Wait for services
    if wait_for_services; then
        show_status
        
        print_success "🎉 Deployment completed successfully!"
        echo ""
        print_status "You can now access the application at: http://localhost"
        print_status "API documentation: http://localhost:3001/health"
        echo ""
        print_status "To view logs: docker-compose logs -f"
        print_status "To stop: docker-compose down"
        print_status "To restart: docker-compose restart"
        echo ""
        
        # Optional: Open browser
        if command -v xdg-open &> /dev/null; then
            print_status "Opening application in browser..."
            xdg-open http://localhost
        elif command -v open &> /dev/null; then
            print_status "Opening application in browser..."
            open http://localhost
        fi
        
    else
        print_error "Deployment failed. Check the logs above."
        show_logs
        exit 1
    fi
}

# Handle script arguments
case "${1:-}" in
    "cleanup")
        cleanup
        ;;
    "logs")
        show_logs
        ;;
    "status")
        show_status
        ;;
    "restart")
        print_status "Restarting services..."
        docker-compose restart
        show_status
        ;;
    "stop")
        print_status "Stopping services..."
        docker-compose down
        print_success "Services stopped"
        ;;
    *)
        main
        ;;
esac
