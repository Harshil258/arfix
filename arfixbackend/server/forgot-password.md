# Forgot Password API

This file documents the key authentication endpoints for signing up, requesting a password reset, and resetting the password.

## Base URL

`http://localhost:5000/api/v1`

---

## POST /auth/signup

Registers a new user and returns an access token.

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password1",
  "confirmPassword": "Password1"
}
```

### Response (201)

```json
{
  "success": true,
  "message": "Account created successfully.",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "..."
    },
    "accessToken": "eyJ..."
  }
}
```

### Validation

- `name` is required, 2-50 characters.
- `email` is required and must be valid.
- `password` is required, at least 8 characters, with uppercase, lowercase, and number.
- `confirmPassword` must match `password`.

---

## POST /auth/forgot-password

Requests a password reset link for the user.

### Request Body

```json
{
  "email": "john@example.com"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

> In development mode, the API may also return a `resetToken` in the response for easier testing.

---

## POST /auth/reset-password

Resets the user password using the reset token.

### Request Body

```json
{
  "token": "<reset-token>",
  "newPassword": "Password1",
  "confirmNewPassword": "Password1"
}
```

### Response (200)

```json
{
  "success": true,
  "message": "Password reset successful"
}
```

### Validation

- `token` is required.
- `newPassword` is required and must follow the password policy.
- `confirmNewPassword` must match `newPassword`.

---

## Notes

- The password reset flow sends a reset token to the provided email.
- The token is stored hashed in the database and expires after 1 hour.
- Use the same email account that exists in the application when requesting the password reset.
