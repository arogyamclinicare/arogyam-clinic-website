#!/bin/bash

# Production Deployment Script for Arogyam Homeopathic Clinic
# This script automates the production deployment process

set -e  # Exit on any error

echo "🚀 Starting Production Deployment for Arogyam Homeopathic Clinic"
echo "================================================================"

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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed"
        exit 1
    fi
    
    print_success "All dependencies are available"
}

# Run tests
run_tests() {
    print_status "Running test suite..."
    
    if npm test -- --watchAll=false --coverage; then
        print_success "All tests passed"
    else
        print_error "Tests failed. Deployment aborted."
        exit 1
    fi
}

# Build production version
build_production() {
    print_status "Building production version..."
    
    # Clean previous builds
    if [ -d "dist" ]; then
        rm -rf dist
        print_status "Cleaned previous build"
    fi
    
    # Install dependencies
    print_status "Installing dependencies..."
    npm ci --only=production
    
    # Build production
    if npm run build:prod; then
        print_success "Production build completed successfully"
        
        # Show build stats
        echo ""
        print_status "Build Statistics:"
        du -sh dist/
        echo ""
        print_status "Bundle Analysis:"
        ls -la dist/assets/
    else
        print_error "Production build failed"
        exit 1
    fi
}

# Security audit
security_audit() {
    print_status "Running security audit..."
    
    if npm audit --audit-level=moderate; then
        print_success "Security audit passed"
    else
        print_warning "Security vulnerabilities found. Consider fixing them before deployment."
        read -p "Continue with deployment? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Deployment cancelled by user"
            exit 1
        fi
    fi
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if command -v vercel &> /dev/null; then
        if vercel --prod; then
            print_success "Deployment to Vercel completed successfully"
        else
            print_error "Vercel deployment failed"
            exit 1
        fi
    else
        print_warning "Vercel CLI not found. Please deploy manually:"
        echo "1. Run: npm run deploy"
        echo "2. Or visit: https://vercel.com"
    fi
}

# Post-deployment checks
post_deployment_checks() {
    print_status "Running post-deployment checks..."
    
    # Check if dist folder exists and has content
    if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
        print_success "Build artifacts verified"
    else
        print_error "Build artifacts missing or empty"
        exit 1
    fi
    
    # Check bundle sizes
    print_status "Checking bundle sizes..."
    for file in dist/assets/*.js; do
        if [ -f "$file" ]; then
            size=$(du -h "$file" | cut -f1)
            filename=$(basename "$file")
            echo "  $filename: $size"
        fi
    done
    
    print_success "Post-deployment checks completed"
}

# Main deployment flow
main() {
    echo ""
    print_status "Starting deployment process..."
    echo ""
    
    # Check dependencies
    check_dependencies
    
    # Run tests
    run_tests
    
    # Security audit
    security_audit
    
    # Build production
    build_production
    
    # Deploy to Vercel
    deploy_vercel
    
    # Post-deployment checks
    post_deployment_checks
    
    echo ""
    print_success "🎉 Production deployment completed successfully!"
    echo ""
    print_status "Your website is now live at: https://arogyamhomeo.com"
    echo ""
    print_status "Next steps:"
    echo "1. Verify the website is working correctly"
    echo "2. Check performance metrics"
    echo "3. Monitor error logs"
    echo "4. Test all major functionality"
    echo ""
}

# Run main function
main "$@"
