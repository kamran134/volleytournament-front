# Backend API Specification for Volleyball Tournament Authentication

## Overview
This document outlines the expected backend API endpoints for the authentication system. The frontend has been updated to use refresh token authentication with the following endpoints.

## Authentication Endpoints

### 1. Login
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "userPassword123"
}
```

**Success Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900,
  "user": {
    "id": "user_id_here",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

**Error Responses:**
- 401: Invalid credentials
- 429: Too many login attempts
- 400: Validation errors

### 2. Register
**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "new_user_id",
    "email": "newuser@example.com",
    "role": "user"
  }
}
```

### 3. Refresh Token
**Endpoint:** `POST /auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

**Error Responses:**
- 401: Invalid or expired refresh token
- 403: Refresh token revoked

### 4. Logout
**Endpoint:** `POST /auth/logout`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

## JWT Token Structure

### Access Token Payload
```json
{
  "userId": "user_id_here",
  "email": "user@example.com", 
  "role": "admin",
  "iat": 1640995200,
  "exp": 1640996100,
  "sub": "user_id_here"
}
```

### Refresh Token Payload
```json
{
  "userId": "user_id_here",
  "type": "refresh",
  "iat": 1640995200,
  "exp": 1641600000
}
```

## Token Configuration
- **Access Token TTL:** 15 minutes (900 seconds)
- **Refresh Token TTL:** 7 days (604800 seconds)
- **JWT Algorithm:** HS256
- **JWT Secret:** Should be stored in environment variables

## Cookie Configuration
When `withCredentials: true` is used, you can optionally set refresh tokens as httpOnly cookies:

```javascript
// Set httpOnly cookie for refresh token (optional, more secure)
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});
```

## CORS Configuration
Since frontend uses `withCredentials: true`, backend must configure CORS properly:

```javascript
// Express CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true,
  optionsSuccessStatus: 200
}));
```

## Environment Variables
```env
JWT_SECRET=your_super_secret_key_here
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=7d
FRONTEND_URL=http://localhost:4200
DB_CONNECTION_STRING=your_database_connection_string
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('superadmin', 'admin', 'moderator', 'coach', 'captain', 'user') DEFAULT 'user',
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Refresh Tokens Table
```sql
CREATE TABLE refresh_tokens (
  id VARCHAR(36) PRIMARY KEY,
  token VARCHAR(500) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  is_revoked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Security Features

### 1. Token Rotation
- Issue new refresh token on each access token refresh
- Invalidate old refresh token
- Detect token reuse attacks

### 2. Rate Limiting
```javascript
// Example with express-rate-limit
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/auth/login', loginLimiter, loginController);
```

### 3. Token Blacklisting
- Maintain blacklist of revoked tokens
- Check blacklist on each request
- Clean up expired tokens periodically

## Frontend Integration

### 1. Token Storage
The frontend stores tokens in localStorage:
- `accessToken`: Short-lived access token
- `refreshToken`: Long-lived refresh token
- `userId`: User ID from token payload
- `role`: User role from token payload

### 2. Automatic Token Refresh
- Frontend automatically refreshes tokens 5 minutes before expiry
- HTTP interceptor handles 401 errors by refreshing tokens
- Failed refresh attempts result in automatic logout

### 3. Request Headers
All authenticated requests include:
```
Authorization: Bearer <accessToken>
```

## Error Handling

### Common Error Responses
```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "statusCode": 401
}
```

### Error Types
- `INVALID_CREDENTIALS`: Wrong email/password
- `TOKEN_EXPIRED`: Access token expired
- `REFRESH_TOKEN_INVALID`: Refresh token invalid/expired
- `USER_NOT_FOUND`: User doesn't exist
- `USER_NOT_APPROVED`: User exists but not approved
- `VALIDATION_ERROR`: Request validation failed

## Implementation Notes

### 1. Password Security
- Use bcrypt for password hashing
- Minimum password length: 6 characters
- Consider password complexity requirements

### 2. Email Validation
- Validate email format
- Consider email verification for new registrations
- Check for duplicate emails

### 3. Role-Based Access Control
- Implement role hierarchy: superadmin > admin > moderator > coach > captain > user
- Protect endpoints based on user roles
- Frontend already implements role-based UI controls

### 4. Database Considerations
- Index frequently queried columns (email, user_id)
- Clean up expired refresh tokens periodically
- Consider soft deletes for user accounts

## Testing Endpoints

You can test the authentication flow using curl:

```bash
# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  -c cookies.txt

# Use the returned tokens for authenticated requests
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer <accessToken>" \
  -b cookies.txt

# Refresh token
curl -X POST http://localhost:5000/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}' \
  -b cookies.txt

# Logout
curl -X POST http://localhost:5000/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}' \
  -b cookies.txt
```

This specification provides a complete guide for implementing the backend authentication system that matches the updated frontend implementation.
