# Auth API — Node.js + TypeScript + MongoDB

A production-ready REST API boilerplate for authentication using Node.js, Express, TypeScript, MongoDB, JWT, and bcrypt.

---

## 📁 Project Structure

```
src/
├── config/
│   ├── app.config.ts        # Centralized env config
│   └── database.config.ts   # MongoDB connection
├── controllers/
│   └── auth.controller.ts   # Business logic
├── middleware/
│   ├── auth.middleware.ts   # JWT guard
│   ├── error.middleware.ts  # Global error handler
│   └── validate.middleware.ts # express-validator runner
├── models/
│   └── user.model.ts        # Mongoose User schema
├── routes/
│   ├── index.ts             # Route aggregator
│   └── auth.routes.ts       # Auth endpoints
├── types/
│   └── index.ts             # All TypeScript types & interfaces
├── utils/
│   ├── AppError.ts          # Custom error class
│   ├── jwt.ts               # JWT sign/verify helpers
│   └── response.ts          # Standardized response helpers
├── validators/
│   └── auth.validator.ts    # express-validator chains
├── app.ts                   # Express app factory
└── server.ts                # Entry point & graceful shutdown
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Run in development
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
npm start
```

---

## 🔑 API Endpoints

Base URL: `http://localhost:5000/api/v1`

### Auth

| Method | Endpoint               | Access    | Description                           |
|--------|------------------------|-----------|---------------------------------------|
| POST   | /auth/signup           | Public    | Register new user                     |
| POST   | /auth/login            | Public    | Login existing user                   |
| POST   | /auth/forgot-password  | Public    | Request password reset email          |
| POST   | /auth/reset-password   | Public    | Reset password with reset token       |
| POST   | /auth/send-otp/email   | Public    | Send OTP to email                     |
| POST   | /auth/verify-otp/email | Public    | Verify email OTP                      |
| GET    | /auth/me               | Protected | Get current user                      |

---

### POST /auth/signup

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password1",
  "confirmPassword": "Password1"
}
```

**Response 201:**
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

---

### POST /auth/forgot-password

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

> In development mode, the response may also include a `resetToken` property for testing.

---

### POST /auth/reset-password

**Request Body:**
```json
{
  "token": "<reset-token>",
  "newPassword": "Password1",
  "confirmNewPassword": "Password1"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

### POST /auth/login

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password1"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Logged in successfully.",
  "data": {
    "user": { ... },
    "accessToken": "eyJ..."
  }
}
```

---

### GET /auth/me

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response 200:**
```json
{
  "success": true,
  "message": "User profile fetched.",
  "data": { ... }
}
```

---

## 🛡️ Password Rules

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

---

## ⚙️ Environment Variables

| Variable              | Description                     | Default       |
|-----------------------|---------------------------------|---------------|
| NODE_ENV              | Environment                     | development   |
| PORT                  | Server port                     | 5000          |
| MONGO_URI             | MongoDB connection string        | —             |
| JWT_SECRET            | JWT signing secret              | —             |
| JWT_EXPIRES_IN        | Token lifetime                  | 7d            |
| JWT_COOKIE_EXPIRES_IN | Cookie lifetime (days)          | 7             |
| ALLOWED_ORIGINS       | Comma-separated CORS origins    | localhost:3000|
