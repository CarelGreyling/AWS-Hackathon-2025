#!/bin/bash

# Local Development Setup Script
# For quick demo without Docker

set -e

echo "🚀 Parameter Risk Analysis - Local Development Setup"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_warning "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_warning "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "Node.js and npm are available"
}

# Install dependencies
install_dependencies() {
    print_status "Installing root dependencies..."
    npm install
    
    print_status "Installing backend dependencies..."
    cd backend && npm install && cd ..
    
    print_status "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
    
    print_success "All dependencies installed"
}

# Start backend in background
start_backend() {
    print_status "Starting backend server..."
    cd backend
    NODE_ENV=development npm start &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    sleep 3
    
    if kill -0 $BACKEND_PID 2>/dev/null; then
        print_success "Backend started on http://localhost:3001"
        echo $BACKEND_PID > .backend.pid
    else
        print_warning "Backend failed to start"
        exit 1
    fi
}

# Start frontend
start_frontend() {
    print_status "Starting frontend development server..."
    cd frontend
    npm run dev
}

# Cleanup function
cleanup() {
    print_status "Stopping services..."
    
    if [ -f .backend.pid ]; then
        BACKEND_PID=$(cat .backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            kill $BACKEND_PID
            print_success "Backend stopped"
        fi
        rm -f .backend.pid
    fi
    
    # Kill any remaining node processes for this project
    pkill -f "node.*server.js" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    
    print_success "Cleanup completed"
}

# Handle Ctrl+C
trap cleanup EXIT INT TERM

# Main function
main() {
    check_node
    install_dependencies
    start_backend
    
    print_success "🎉 Backend is running!"
    print_status "Backend API: http://localhost:3001"
    print_status "Health Check: http://localhost:3001/health"
    echo ""
    print_status "Starting frontend... (this will open in your browser)"
    echo ""
    
    start_frontend
}

# Handle script arguments
case "${1:-}" in
    "stop")
        cleanup
        ;;
    "backend-only")
        check_node
        cd backend && npm install && npm start
        ;;
    "frontend-only")
        check_node
        cd frontend && npm install && npm run dev
        ;;
    *)
        main
        ;;
esac
