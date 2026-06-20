# ARFIX Auth API

Base URL: `http://<host>/api/v1/auth`

This document covers the user authentication endpoints for:
- Signup
- Verify signup OTP
- Login
- Forgot password
- Verify forgot-password OTP
- Reset password

All responses use the standard API wrapper:
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

---

## 1. Signup

### Endpoint
`POST /api/v1/auth/signup`

### Purpose
Create a new user account and send an email OTP for verification.

### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "+1234567890",
  "password": "SecurePassword123"
}
```

### Response
```json
{
  "success": true,
  "message": "Account created successfully. Please verify your email using the OTP sent to your inbox.",
  "data": {
    "user": {
      "id": "643f...",
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": "+1234567890",
      "role": "USER",
      "status": "verify",
      "createdAt": "2026-06-07T12:00:00.000Z"
    },
    "emailVerificationExpiresIn": 300,
    "devOtp": "123456"  // only returned in development mode
  }
}
```

---

## 2. Verify signup OTP

### Endpoint
`POST /api/v1/auth/verify-otp/email`

⚠️ Alias: `POST /api/v1/auth/verify-email` also points to the same handler.

### Purpose
Confirm email ownership after signup and activate the account.

### Request Body
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

### Response
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "user": {
      "id": "643f...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "status": "verified",
      "coins": 0,
      "mobile": "+1234567890",
      "createdAt": "2026-06-07T12:00:00.000Z"
    },
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "isNewUser": false
  }
}
```

---

## 3. Login

### Endpoint
`POST /api/v1/auth/login`

### Purpose
Authenticate a verified user and issue an access token.

### Request Body
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

### Response
```json
{
  "success": true,
  "message": "Logged in successfully.",
  "data": {
    "user": {
      "id": "643f...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    },
    "accessToken": "eyJhbGci..."
  }
}
```

---

## 4. Forgot password

### Endpoint
`POST /api/v1/auth/forgot-password`

### Purpose
Request a password reset OTP via email.

### Request Body
```json
{
  "email": "john@example.com"
}
```

### Response
```json
{
  "success": true,
  "message": "Password reset OTP sent to your email.",
  "data": {
    "emailVerificationExpiresIn": 300,
    "devOtp": "123456"  // only returned in development mode
  }
}
```

If the email does not exist, the endpoint still returns a successful message for security.

---

## 5. Verify forgot-password OTP

### Endpoint
`POST /api/v1/auth/verify-otp/email`

⚠️ Alias: `POST /api/v1/auth/verify-email` also works.

### Purpose
Verify the OTP sent for password reset and receive a one-time reset token.

### Request Body
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

### Response
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "user": {
      "id": "643f...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "status": "verified",
      "coins": 0,
      "mobile": "+1234567890",
      "createdAt": "2026-06-07T12:00:00.000Z"
    },
    "resetToken": "a1b2c3d4...",
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "isNewUser": false
  }
}
```

> Use the returned `resetToken` in the next endpoint to actually change the password.

---

## 6. Reset password after verify OTP

### Endpoint
`POST /api/v1/auth/reset-password`

### Purpose
Set a new password using the reset token received after OTP verification.

### Request Body
```json
{
  "token": "a1b2c3d4...",
  "newPassword": "NewSecurePassword123",
  "confirmNewPassword": "NewSecurePassword123"
}
```

### Response
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

## Notes
- `otp` values are 4-8 characters long.
- `resetToken` is a one-time token hashed and stored on the user record.
- `emailVerificationExpiresIn` is in seconds.
- In development mode, `devOtp` is included in the response to simplify testing.
