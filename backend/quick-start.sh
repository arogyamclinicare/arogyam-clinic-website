#!/bin/bash

echo "🚀 Arogyam Clinic Backend - Quick Start Script"
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL client not found. Please ensure PostgreSQL is installed and running."
    echo "   You can still continue with the setup, but database operations will fail."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p logs

# Copy environment file
if [ ! -f .env ]; then
    echo "⚙️  Setting up environment configuration..."
    cp env.example .env
    echo "✅ Environment file created. Please edit .env with your database and JWT configuration."
else
    echo "✅ Environment file already exists"
fi

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npm run db:generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

echo "✅ Prisma client generated"

# Check if .env has been configured
if grep -q "your-super-secret-jwt-key-here" .env; then
    echo ""
    echo "⚠️  IMPORTANT: Please configure your .env file before starting the server:"
    echo "   1. Set DATABASE_URL to your PostgreSQL connection string"
    echo "   2. Generate strong JWT_SECRET and JWT_REFRESH_SECRET"
    echo "   3. Configure other environment variables as needed"
    echo ""
    echo "   Example JWT secrets (generate your own):"
    echo "   JWT_SECRET=$(openssl rand -base64 64)"
    echo "   JWT_REFRESH_SECRET=$(openssl rand -base64 64)"
    echo ""
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Configure your .env file with database and JWT settings"
echo "2. Set up your PostgreSQL database"
echo "3. Run: npm run db:push (to create database tables)"
echo "4. Start the server: npm run dev"
echo ""
echo "📚 For detailed instructions, see README.md"
echo "🔗 Health check will be available at: http://localhost:5000/health"
echo ""
