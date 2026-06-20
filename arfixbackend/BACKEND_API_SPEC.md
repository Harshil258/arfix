# ARFIX Backend API Specification — For Backend Developer

## Overview
Mobile reward & loyalty app. Users scan QR codes on Arfix products → earn coins → redeem rewards.
Support via email/mobile only (NO chat feature).

**Base URL:** `https://arfix.onrender.com/api/v1`

**Response Format (ALL endpoints):**
```json
{ "success": true, "message": "...", "data": { } }
```
**Error Format:**
```json
{ "success": false, "message": "..." }
```
**Auth:** `Authorization: Bearer <JWT>`

---

## STATUS: ✅ = EXISTS | 🔴 = MISSING (Must Build)

---

## 1. AUTHENTICATION

### 1.1 ✅ Signup — `POST /auth/signup`
**Auth:** None

**Request:**
```json
{ "name": "Rahul Sharma", "email": "rahul@example.com", "password": "Str0ngPass", "confirmPassword": "Str0ngPass" }
```
**Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": { "id": "665a1b2c3d4e5f6789012345", "name": "Rahul Sharma", "email": "rahul@example.com", "role": "user", "coins": 0, "mobile": null, "createdAt": "2026-05-16T10:30:00.000Z" },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 1.2 ✅ Login — `POST /auth/login`
**Auth:** None

**Request:**
```json
{ "email": "rahul@example.com", "password": "Str0ngPass" }
```
**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": "665a1b2c3d4e5f6789012345", "name": "Rahul Sharma", "email": "rahul@example.com", "role": "user", "coins": 250, "mobile": "9876543210", "createdAt": "2026-05-16T10:30:00.000Z" },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 1.3 ✅ Get Profile — `GET /auth/me`
**Auth:** Bearer

**Response (200):**
```json
{
  "success": true,
  "data": { "id": "665a1b2c3d4e5f6789012345", "name": "Rahul Sharma", "email": "rahul@example.com", "role": "user", "coins": 250, "mobile": "9876543210", "createdAt": "2026-05-16T10:30:00.000Z" }
}
```

### 1.4 ✅ Update Profile — `PATCH /auth/me`
**Auth:** Bearer

**Request:**
```json
{ "name": "Rahul K. Sharma" }
```
**Response:** Same as Get Profile with updated fields.

### 1.5 ✅ Change Password — `PATCH /auth/password`
**Auth:** Bearer

**Request:**
```json
{ "currentPassword": "Str0ngPass", "newPassword": "N3wStr0ngPass", "confirmNewPassword": "N3wStr0ngPass" }
```
**Response (200):**
```json
{ "success": true, "message": "Password changed successfully" }
```

### 1.6 🔴 Send OTP — `POST /auth/send-otp`
**Auth:** None | **Priority:** HIGH

**Request:**
```json
{ "mobile": "9876543210", "type": "LOGIN" }
```
`type`: `LOGIN` | `SIGNUP` | `FORGOT_PASSWORD`

**Response (200):**
```json
{ "success": true, "message": "OTP sent successfully", "data": { "otpId": "otp_abc123", "expiresIn": 300 } }
```

### 1.7 🔴 Verify OTP — `POST /auth/verify-otp`
**Auth:** None | **Priority:** HIGH

**Request:**
```json
{ "mobile": "9876543210", "otpId": "otp_abc123", "otp": "123456" }
```
**Response (200):**
```json
{
  "success": true,
  "message": "OTP verified",
  "data": {
    "user": { "id": "665a...", "name": "Rahul Sharma", "email": "rahul@example.com", "role": "user", "coins": 250, "mobile": "9876543210" },
    "accessToken": "eyJ...",
    "isNewUser": false
  }
}
```

### 1.8 🔴 Google Sign-In — `POST /auth/google`
**Auth:** None | **Priority:** MEDIUM

**Request:**
```json
{ "idToken": "<Google ID Token from Firebase Auth>" }
```
**Response:** Same shape as Login response.

### 1.9 🔴 Forgot Password — `POST /auth/forgot-password`
**Auth:** None | **Priority:** HIGH

**Request:**
```json
{ "email": "rahul@example.com" }
```
**Response (200):**
```json
{ "success": true, "message": "Password reset link sent to email" }
```

### 1.10 🔴 Reset Password — `POST /auth/reset-password`
**Auth:** None | **Priority:** HIGH

**Request:**
```json
{ "token": "<reset_token_from_email>", "newPassword": "N3wPass123", "confirmNewPassword": "N3wPass123" }
```
**Response (200):**
```json
{ "success": true, "message": "Password reset successful" }
```

### 1.11 🔴 Delete Account — `DELETE /auth/me`
**Auth:** Bearer | **Priority:** HIGH (required by Play Store/App Store)

**Request:**
```json
{ "password": "Str0ngPass" }
```
**Response (200):**
```json
{ "success": true, "message": "Account deleted successfully" }
```

### 1.12 🔴 Update Mobile — `PATCH /auth/mobile`
**Auth:** Bearer | **Priority:** HIGH

**Request:**
```json
{ "mobile": "9876543210", "otpId": "otp_abc123", "otp": "123456" }
```
**Response:** Same as Get Profile.

### 1.13 🔴 Refresh Token — `POST /auth/refresh`
**Auth:** None | **Priority:** MEDIUM

**Request:**
```json
{ "refreshToken": "eyJ..." }
```
**Response (200):**
```json
{ "success": true, "data": { "accessToken": "eyJ...", "refreshToken": "eyJ..." } }
```

---

## 2. PRODUCTS

### 2.1 ✅ Product List — `GET /products`
**Auth:** None

**Query:** `?page=1&limit=20&search=headphones&sortBy=createdAt&order=desc&minRating=4`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      { "_id": "prod_001", "name": "Arfix Pro Speaker", "description": "Premium wireless speaker...", "images": [{ "url": "/uploads/speaker.jpg", "publicId": "img_001" }], "averageRating": 4.5, "totalReviews": 128, "isActive": true, "createdAt": "2026-04-01T00:00:00Z" }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 45, "pages": 3 }
  }
}
```

### 2.2 ✅ Product Detail — `GET /products/:id`
**Auth:** None — Response: single product object (same shape as list item).

---

## 3. QR CODE / COUPON SCANNING

### 3.1 ✅ Scan Coupon — `POST /coupons/scan`
**Auth:** Bearer

**QR Payload Format (what the QR code contains):**
```json
{ "id": "coupon_mongodb_id", "code": "ABCD1234" }
```

**Request:**
```json
{ "code": "ABCD1234", "id": "665b2c3d4e5f6789012345", "userId": "665a1b2c3d4e5f6789012345" }
```

**Response (200):**
```json
{
  "success": true,
  "message": "Coupon redeemed successfully",
  "data": {
    "coupon": { "id": "665b2c3d...", "code": "ABCD1234", "price": 50, "status": "SCANNED", "scannedBy": "665a1b2c..." },
    "user": { "id": "665a1b2c...", "name": "Rahul Sharma", "coins": 300 }
  }
}
```

**Errors:**
- `400` — Already scanned: `{ "success": false, "message": "This coupon has already been scanned" }`
- `400` — Inactive: `{ "success": false, "message": "This coupon is no longer active" }`
- `404` — Not found: `{ "success": false, "message": "Invalid coupon code" }`

### 3.2 🔴 Scan History — `GET /coupons/history`
**Auth:** Bearer | **Priority:** HIGH

**Query:** `?page=1&limit=20`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "scans": [
      { "id": "scan_001", "couponCode": "ABCD1234", "coinsEarned": 50, "productName": "Arfix Pro Speaker", "productImage": "/uploads/speaker.jpg", "scannedAt": "2026-05-15T14:30:00Z" },
      { "id": "scan_002", "couponCode": "WXYZ5678", "coinsEarned": 100, "productName": "Arfix Earbuds", "productImage": "/uploads/earbuds.jpg", "scannedAt": "2026-05-14T09:15:00Z" }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 12, "pages": 1 },
    "summary": { "totalScans": 12, "totalCoinsEarned": 620 }
  }
}
```

---

## 4. WALLET & TRANSACTIONS

### 4.1 🔴 Wallet Summary — `GET /wallet`
**Auth:** Bearer | **Priority:** HIGH

**Response (200):**
```json
{
  "success": true,
  "data": {
    "balance": 620,
    "totalEarned": 820,
    "totalRedeemed": 200,
    "totalScans": 12,
    "memberSince": "2026-05-01T00:00:00Z"
  }
}
```

### 4.2 🔴 Transaction History — `GET /wallet/transactions`
**Auth:** Bearer | **Priority:** HIGH

**Query:** `?page=1&limit=20&type=EARNED`
`type`: `EARNED` | `REDEEMED` | `BONUS` (optional filter)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      { "id": "txn_001", "type": "EARNED", "coins": 50, "title": "QR Scan — ABCD1234", "description": "Arfix Pro Speaker", "createdAt": "2026-05-15T14:30:00Z" },
      { "id": "txn_002", "type": "REDEEMED", "coins": -200, "title": "Reward Redeemed", "description": "₹100 Cashback", "createdAt": "2026-05-14T10:00:00Z" },

      { "id": "txn_004", "type": "BONUS", "coins": 100, "title": "Welcome Bonus", "description": "First scan bonus", "createdAt": "2026-05-01T12:00:00Z" }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 4, "pages": 1 }
  }
}
```

---

## 5. REWARDS & REDEMPTION

### 5.1 🔴 Rewards Catalog — `GET /rewards`
**Auth:** Bearer | **Priority:** HIGH

**Query:** `?page=1&limit=20&category=CASHBACK`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "rewards": [
      { "id": "rew_001", "title": "₹100 Cashback", "description": "Get ₹100 cashback to your UPI", "coinsRequired": 500, "category": "CASHBACK", "image": "/uploads/cashback100.jpg", "stock": 50, "isActive": true, "expiresAt": "2026-06-30T23:59:59Z" },
      { "id": "rew_002", "title": "₹50 Amazon Voucher", "description": "Amazon gift card worth ₹50", "coinsRequired": 300, "category": "VOUCHER", "image": "/uploads/amazon50.jpg", "stock": 100, "isActive": true, "expiresAt": null },
      { "id": "rew_003", "title": "Free Arfix Cable", "description": "Premium USB-C cable", "coinsRequired": 200, "category": "PRODUCT", "image": "/uploads/cable.jpg", "stock": 25, "isActive": true, "expiresAt": "2026-07-15T23:59:59Z" }
    ],
    "categories": ["CASHBACK", "VOUCHER", "PRODUCT", "DISCOUNT"],
    "pagination": { "page": 1, "limit": 20, "total": 3, "pages": 1 }
  }
}
```

### 5.2 🔴 Redeem Reward — `POST /rewards/:rewardId/redeem`
**Auth:** Bearer | **Priority:** HIGH

**Request:**
```json
{ "upiId": "rahul@upi" }
```
(UPI only for cashback type, otherwise empty body)

**Response (200):**
```json
{
  "success": true,
  "message": "Reward redeemed successfully",
  "data": {
    "redemption": { "id": "red_001", "rewardTitle": "₹100 Cashback", "coinsSpent": 500, "status": "PROCESSING", "estimatedDelivery": "2026-05-18T00:00:00Z", "createdAt": "2026-05-16T10:00:00Z" },
    "newBalance": 120
  }
}
```

**Errors:**
- `400` — `{ "success": false, "message": "Insufficient coins. You need 500 but have 120." }`
- `400` — `{ "success": false, "message": "This reward is out of stock" }`

### 5.3 🔴 My Redemptions — `GET /rewards/redemptions`
**Auth:** Bearer | **Priority:** MEDIUM

**Response (200):**
```json
{
  "success": true,
  "data": {
    "redemptions": [
      { "id": "red_001", "rewardTitle": "₹100 Cashback", "coinsSpent": 500, "status": "COMPLETED", "createdAt": "2026-05-14T10:00:00Z", "completedAt": "2026-05-15T14:00:00Z" }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 1, "pages": 1 }
  }
}
```
`status`: `PROCESSING` | `COMPLETED` | `FAILED` | `CANCELLED`

---

## 7. SUPPORT (Email/Mobile only — NO chat)

### 7.1 ✅ Submit Ticket — `POST /support/messages`
**Auth:** Bearer

**Request:**
```json
{ "subject": "Payment issue", "message": "I was charged twice for order..." }
```
**Response (201):**
```json
{
  "success": true,
  "data": {
    "message": { "id": "msg_001", "subject": "Payment issue", "message": "I was charged twice...", "status": "OPEN", "isReadByStaff": false, "createdAt": "2026-05-16T10:00:00Z", "user": { "id": "665a...", "name": "Rahul Sharma", "email": "rahul@example.com" } }
  }
}
```

### 7.2 ✅ My Tickets — `GET /support/messages/me`
**Auth:** Bearer | **Query:** `?page=1&limit=10&status=OPEN&sortBy=createdAt&order=desc`

### 7.3 ✅ Ticket Detail — `GET /support/messages/me/:messageId`
**Auth:** Bearer

`status`: `OPEN` | `IN_PROGRESS` | `RESOLVED` | `CLOSED`

---

## 8. LEADERBOARD

### 8.1 🔴 Leaderboard — `GET /leaderboard`
**Auth:** Bearer | **Priority:** LOW

**Query:** `?period=WEEKLY` (`WEEKLY` | `MONTHLY` | `ALL_TIME`)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": "WEEKLY",
    "myRank": 12,
    "myCoins": 250,
    "leaders": [
      { "rank": 1, "name": "A***l K.", "coins": 1500, "scans": 30 },
      { "rank": 2, "name": "P***a S.", "coins": 1200, "scans": 24 },
      { "rank": 3, "name": "R***h M.", "coins": 980, "scans": 19 }
    ]
  }
}
```

---

## 9. CAMPAIGNS & BANNERS

### 9.1 🔴 Active Campaigns — `GET /campaigns`
**Auth:** None | **Priority:** MEDIUM

**Response (200):**
```json
{
  "success": true,
  "data": {
    "campaigns": [
      { "id": "camp_001", "title": "Double Coins Weekend", "description": "Earn 2x coins on all scans", "image": "/uploads/double_coins.jpg", "type": "MULTIPLIER", "multiplier": 2, "startsAt": "2026-05-17T00:00:00Z", "endsAt": "2026-05-18T23:59:59Z", "isActive": true }
    ]
  }
}
```

### 9.2 🔴 Home Banners — `GET /banners`
**Auth:** None | **Priority:** MEDIUM

**Response (200):**
```json
{
  "success": true,
  "data": {
    "banners": [
      { "id": "ban_001", "image": "/uploads/banner1.jpg", "title": "Scan & Win iPhone", "actionType": "CAMPAIGN", "actionId": "camp_001", "order": 1 },
      { "id": "ban_002", "image": "/uploads/banner2.jpg", "title": "New Arrivals", "actionType": "SCREEN", "actionId": "PRODUCTS", "order": 2 }
    ]
  }
}
```
`actionType`: `CAMPAIGN` | `PRODUCT` | `REWARD` | `SCREEN` | `URL`

---

## 10. NOTIFICATIONS

### 10.1 🔴 Register FCM Token — `POST /notifications/register`
**Auth:** Bearer | **Priority:** HIGH

**Request:**
```json
{ "fcmToken": "dGhpcyBpcyBhIHRva2Vu...", "platform": "android" }
```
**Response (200):**
```json
{ "success": true, "message": "Token registered" }
```

### 10.2 🔴 Notification History — `GET /notifications`
**Auth:** Bearer | **Priority:** MEDIUM

**Query:** `?page=1&limit=20`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      { "id": "notif_001", "title": "50 Coins Earned!", "body": "You scanned Arfix Pro Speaker", "type": "SCAN", "isRead": false, "createdAt": "2026-05-15T14:30:00Z", "data": { "screen": "SCAN_HISTORY" } }
    ],
    "unreadCount": 3,
    "pagination": { "page": 1, "limit": 20, "total": 8, "pages": 1 }
  }
}
```

### 10.3 🔴 Mark Read — `PATCH /notifications/:id/read`
**Auth:** Bearer | **Priority:** LOW

---

## 11. APP CONFIG

### 11.1 🔴 App Config — `GET /config`
**Auth:** None | **Priority:** HIGH

**Response (200):**
```json
{
  "success": true,
  "data": {
    "minAppVersion": "1.0.0",
    "latestVersion": "1.2.0",
    "forceUpdate": false,
    "maintenanceMode": false,
    "supportEmail": "support@arfix.com",
    "supportPhone": "+91-9876543210",
    "privacyPolicyUrl": "https://arfix.com/privacy",
    "termsUrl": "https://arfix.com/terms",
    "socialLinks": { "instagram": "https://instagram.com/arfix", "youtube": "https://youtube.com/@arfix" }
  }
}
```

---

## DATABASE MODELS (Recommended)

### User
| Field | Type | Notes |
|-------|------|-------|
| _id | ObjectId | Primary key |
| name | String | 2-50 chars |
| email | String | Unique, lowercase |
| password | String | Hashed (bcrypt) |
| mobile | String | Optional, unique |
| role | String | `user` / `staff` / `admin` |
| coins | Number | Default 0 |
| fcmTokens | [String] | Push notification tokens |
| isActive | Boolean | Soft delete |
| createdAt | Date | Auto |

### Coupon
| Field | Type | Notes |
|-------|------|-------|
| _id | ObjectId | Primary key |
| code | String | Unique human-readable |
| price | Number | Coins value |
| status | String | `ACTIVE` / `SCANNED` / `EXPIRED` |
| product | ObjectId | Ref → Product |
| scannedBy | ObjectId | Ref → User |
| scannedAt | Date | When scanned |

### Transaction
| Field | Type | Notes |
|-------|------|-------|
| _id | ObjectId | Primary key |
| user | ObjectId | Ref → User |
| type | String | `EARNED` / `REDEEMED` / `BONUS` |
| coins | Number | Positive=credit, Negative=debit |
| title | String | Display title |
| description | String | Details |
| reference | ObjectId | Ref → Coupon/Reward/etc |
| createdAt | Date | Auto |

### Reward
| Field | Type | Notes |
|-------|------|-------|
| _id | ObjectId | Primary key |
| title | String | Display name |
| description | String | Details |
| coinsRequired | Number | Cost in coins |
| category | String | `CASHBACK` / `VOUCHER` / `PRODUCT` / `DISCOUNT` |
| image | String | URL |
| stock | Number | Available count |
| isActive | Boolean | Admin toggle |
| expiresAt | Date | Optional |

---

## SECURITY REQUIREMENTS

1. **JWT expiry:** Access tokens expire in 7 days, refresh tokens in 30 days
2. **Rate limiting:** Max 5 OTP requests per mobile per hour
3. **QR anti-fraud:** Each coupon scannable only ONCE, log device fingerprint
4. **Password:** Bcrypt hash, min 8 chars with upper+lower+digit
5. **CORS:** Allow only the mobile app origins
6. **Input validation:** Sanitize all inputs, use Joi/Zod
7. **Duplicate scan detection:** Return 400 with clear message

---

## PRIORITY SUMMARY

| Priority | APIs to Build |
|----------|---------------|
| **HIGH** | Send OTP, Verify OTP, Forgot/Reset Password, Delete Account, Update Mobile, Scan History, Wallet Summary, Transaction History, Rewards Catalog, Redeem Reward, FCM Register, App Config |
| **MEDIUM** | Google Sign-In, Refresh Token, My Redemptions, Campaigns, Banners, Notification History |
| **LOW** | Leaderboard, Mark Notification Read |
