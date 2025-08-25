# Arogyam Clinic Backend API

A robust, secure, and scalable backend API for the Arogyam Homeopathy Clinic application. Built with Node.js, Express, TypeScript, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Complete user registration, login, and profile management
- **Consultation System**: Book, manage, and track medical consultations
- **Admin Panel**: Comprehensive admin dashboard with user and consultation management
- **Security**: Rate limiting, input validation, CORS protection, and security headers
- **Logging**: Structured logging with Winston for monitoring and debugging
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **Validation**: Input validation using express-validator and Zod schemas

## 🏗️ Architecture

```
backend/
├── src/
│   ├── controllers/     # Business logic handlers
│   ├── routes/         # API route definitions
│   ├── middleware/     # Custom middleware (auth, validation, etc.)
│   ├── services/       # Business logic services
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions (logging, etc.)
│   └── index.ts        # Main server entry point
├── prisma/             # Database schema and migrations
├── logs/               # Application logs
└── dist/               # Compiled JavaScript output
```

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

## 🛠️ Installation

### 1. Clone and Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp env.example .env

# Edit .env file with your configuration
nano .env
```

**Required Environment Variables:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/arogyam_clinic"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-make-it-long-and-random

# Security Configuration
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push database schema (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate

# Open Prisma Studio (optional)
npm run db:studio
```

### 4. Start Development Server

```bash
# Start in development mode with hot reload
npm run dev

# Or build and start production
npm run build
npm start
```

## 🗄️ Database Schema

### Core Models

- **User**: Patient accounts with authentication and profile information
- **PatientProfile**: Extended medical information for patients
- **Consultation**: Medical consultation records with scheduling and status
- **RefreshToken**: JWT refresh token management
- **AdminUser**: Administrative user accounts

### Key Relationships

- Users can have multiple consultations
- Users have one patient profile (optional)
- Consultations belong to users
- Refresh tokens are linked to users

## 🔐 Authentication

### JWT Token System

- **Access Token**: Short-lived (15 minutes) for API requests
- **Refresh Token**: Long-lived (7 days) for token renewal
- **Secure Storage**: Tokens stored in httpOnly cookies

### Role-Based Access Control

- **PATIENT**: Can manage own profile and consultations
- **DOCTOR**: Can view and update consultations
- **STAFF**: Can manage users and consultations
- **ADMIN**: Full system access
- **SUPER_ADMIN**: System administration

## 📡 API Endpoints

### Authentication Routes

```
POST /api/auth/register     - User registration
POST /api/auth/login        - User login
POST /api/auth/refresh      - Token refresh
POST /api/auth/logout       - User logout
GET  /api/auth/me          - Get current user
```

### User Management

```
GET    /api/users/profile       - Get user profile
PUT    /api/users/profile       - Update user profile
PUT    /api/users/profile/medical - Update medical profile
GET    /api/users/consultations - Get user consultations
DELETE /api/users/account      - Deactivate account
```

### Consultation Management

```
POST   /api/consultations      - Book consultation
GET    /api/consultations      - List consultations (doctors)
GET    /api/consultations/:id  - Get consultation details
PUT    /api/consultations/:id  - Update consultation
PATCH  /api/consultations/:id/cancel - Cancel consultation
GET    /api/consultations/stats/overview - Consultation statistics
```

### Admin Routes

```
GET    /api/admin/users         - List all users
GET    /api/admin/users/:id     - Get specific user
PUT    /api/admin/users/:id     - Update user
PATCH  /api/admin/users/:id/toggle-status - Toggle user status
GET    /api/admin/consultations - List all consultations
PATCH  /api/admin/consultations/:id/status - Update consultation status
GET    /api/admin/stats         - System statistics
```

## 🔒 Security Features

### Input Validation
- Request body validation using express-validator
- SQL injection prevention with Prisma ORM
- XSS protection with content security policy

### Rate Limiting
- Authentication endpoints: 5 requests per 15 minutes
- General API: 100 requests per 15 minutes
- Configurable limits per environment

### Authentication Security
- Password hashing with bcrypt (12 salt rounds)
- JWT secret rotation capability
- Account lockout after failed attempts
- Secure token storage

## 📊 Logging & Monitoring

### Log Levels
- **ERROR**: Application errors and exceptions
- **WARN**: Warning conditions
- **INFO**: General information
- **HTTP**: HTTP request logging
- **DEBUG**: Detailed debugging information

### Log Outputs
- Console output (development)
- File output (production)
- Structured JSON format
- Request/response correlation

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testNamePattern="auth"
```

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables

Ensure all production environment variables are set:
- Strong JWT secrets
- Production database URL
- Proper CORS origins
- Log level configuration

### Database Migration

```bash
# Run migrations in production
npm run db:migrate

# Verify database connection
npm run db:generate
```

## 📈 Performance Optimization

### Database
- Connection pooling
- Query optimization
- Proper indexing
- Pagination for large datasets

### API
- Response compression
- Caching strategies
- Rate limiting
- Request validation

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify DATABASE_URL in .env
   - Check PostgreSQL service status
   - Ensure database exists

2. **JWT Token Issues**
   - Verify JWT_SECRET and JWT_REFRESH_SECRET
   - Check token expiration settings
   - Verify token format in requests

3. **CORS Errors**
   - Check FRONTEND_URL in .env
   - Verify CORS configuration
   - Check browser console for details

### Debug Mode

```bash
# Enable debug logging
LOG_LEVEL=debug npm run dev

# Check application logs
tail -f logs/app.log
```

## 🤝 Contributing

1. Follow TypeScript strict mode
2. Use async/await with proper error handling
3. Add comprehensive input validation
4. Include proper logging for all operations
5. Write tests for new features
6. Follow the established code structure

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For technical support or questions:
- Check the logs for error details
- Review API documentation
- Check environment configuration
- Verify database connectivity

---

**Built with ❤️ for Arogyam Homeopathy Clinic**
