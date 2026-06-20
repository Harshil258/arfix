# API CURL Commands

## Base URL
```
http://localhost:5000/api/v1
```

---

## 1. Signup - POST /auth/signup

Create a new user account with name, email, password, and optional mobile number.

### Basic (without mobile number):
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  }'
```

### With mobile number:
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123",
    "mobileNumber": "+923001234567"
  }'
```

### Expected Response (201 Created):
```json
{
  "success": true,
  "message": "Account created successfully.",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "mobileNumber": "+923001234567",
      "role": "user",
      "createdAt": "2026-05-03T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 2. Login - POST /auth/login

Authenticate user with email and password.

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Expected Response (200 OK):
```json
{
  "success": true,
  "message": "Logged in successfully.",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "mobileNumber": "+923001234567",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 3. Get Current User - GET /auth/me

Fetch the authenticated user's profile (requires Bearer token).

```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Or using the token from login/signup response:
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Expected Response (200 OK):
```json
{
  "success": true,
  "message": "User profile fetched.",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "mobileNumber": "+923001234567",
    "role": "user",
    "createdAt": "2026-05-03T10:30:00.000Z"
  }
}
```

---

## Password Requirements
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)

## Mobile Number Format (Optional)
- Valid formats: 1234567890, +11234567890, +923001234567
- Must be 9-15 digits with optional + prefix

## Notes
- Replace `http://localhost:5000` with your actual server URL
- Replace `YOUR_ACCESS_TOKEN_HERE` with the token received from signup/login
- Passwords must not be stored or transmitted insecurely
- Mobile number is optional for signup

---

## 4. Create Coupons - POST /coupons/create

Create multiple coupons with specified quantity and price (requires Bearer token).

```bash
curl -X POST http://localhost:5000/api/v1/coupons/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "quantity": 10,
    "price": 50.00
  }'
```

### Expected Response (201 Created):
```json
{
  "success": true,
  "message": "Coupons created successfully.",
  "data": {
    "session": {
      "id": "507f1f77bcf86cd799439011",
      "quantity": 10,
      "price": 50.00,
      "createdBy": "507f1f77bcf86cd799439012"
    },
    "coupons": [
      {
        "id": "507f1f77bcf86cd799439013",
        "code": "ABC123XYZ",
        "status": "ACTIVE",
        "price": 50.00
      }
    ]
  }
}
```

---

## 5. Scan Coupon - POST /coupons/scan

Scan and redeem a coupon (requires Bearer token).

```bash
curl -X POST http://localhost:5000/api/v1/coupons/scan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "code": "ABC123XYZ",
    "id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439012"
  }'
```

### Expected Response (200 OK):
```json
{
  "success": true,
  "message": "Coupon scanned successfully.",
  "data": {
    "coupon": {
      "id": "507f1f77bcf86cd799439013",
      "code": "ABC123XYZ",
      "status": "SCANNED",
      "price": 50.00,
      "scannedBy": "507f1f77bcf86cd799439012"
    }
  }
}
```

---

## 6. Inactivate Coupons - PATCH /coupons/inactivate

Inactivate one or multiple coupons (requires Bearer token).

### Inactivate single coupon:
```bash
curl -X PATCH http://localhost:5000/api/v1/coupons/inactivate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "ids": ["507f1f77bcf86cd799439013"],
    "isMultiple": false
  }'
```

### Inactivate multiple coupons:
```bash
curl -X PATCH http://localhost:5000/api/v1/coupons/inactivate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "ids": ["507f1f77bcf86cd799439013", "507f1f77bcf86cd799439014"],
    "isMultiple": true
  }'
```

### Expected Response (200 OK):
```json
{
  "success": true,
  "message": "Coupons inactivated successfully.",
  "data": {
    "modifiedCount": 2
  }
}
```

---

## 7. Update Coupon - PATCH /coupons/:id

Update a single coupon's details (requires Bearer token).

```bash
curl -X PATCH http://localhost:5000/api/v1/coupons/507f1f77bcf86cd799439013 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "code": "NEWCODE123",
    "price": 75.00,
    "status": "ACTIVE"
  }'
```

### Expected Response (200 OK):
```json
{
  "success": true,
  "message": "Coupon updated successfully.",
  "data": {
    "coupon": {
      "id": "507f1f77bcf86cd799439013",
      "code": "NEWCODE123",
      "status": "ACTIVE",
      "price": 75.00
    }
  }
}
```

---

## 8. Health Check - GET /health

Check if the server is running (no authentication required).

```bash
curl -X GET http://localhost:5000/health
```

### Expected Response (200 OK):
```json
{
  "success": true,
  "message": "Server is running",
  "environment": "development",
  "timestamp": "2026-05-03T10:30:00.000Z"
}
```

---

## Coupon Status Values
- `ACTIVE`: Coupon is available for scanning
- `INACTIVE`: Coupon has been deactivated
- `SCANNED`: Coupon has been redeemed

## Additional Notes
- All coupon endpoints require authentication (Bearer token)
- Coupon IDs must be valid MongoDB ObjectIds (24-character hexadecimal strings)
- Quantity for creating coupons: 1-500
- Price must be a non-negative number
- Use the access token from login/signup for authenticated requests
