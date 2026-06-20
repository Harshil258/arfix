# ARFIX — Mobile app API reference

This document is for **mobile application developers** integrating with the ARFIX backend. All paths are relative to the API base URL.

## Base URL

| Environment | Example base URL |
|-------------|------------------|
| Local       | `http://localhost:4000/api/v1` |
| Production  | Configure from your deployment (same path prefix: `/api/v1`) |

Replace `BASE` in the examples below, e.g. `BASE=http://localhost:4000/api/v1`.

Static product images are served from the **server origin** (not under `/api/v1`), e.g. `http://localhost:4000` + `image.url` (see [Product list](#2-product-list-home--catalog)).

---

## Conventions

### JSON responses

Successful responses use this shape:

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { }
}
```

`data` may be omitted for some endpoints.

### Errors

Typical error shape:

```json
{
  "success": false,
  "message": "Explanation of what went wrong"
}
```

- **401** — Missing/invalid/expired `Authorization` bearer token, or wrong credentials.
- **403** — Authenticated but not allowed for this action.
- **404** — Resource not found.
- **409** — Conflict (e.g. duplicate email on signup).
- **422** — Validation failed (body/query). Response may include `errors`: `[{ "field": "...", "message": "..." }]`.

### Authentication

After **login** or **signup**, store `accessToken` and send it on every protected request:

```http
Authorization: Bearer <accessToken>
```

---

## 1. Signup (customer accounts)

Creates a **user** (customer) account. Staff and admin accounts are created by administrators in the panel, not via this endpoint.

| Item | Value |
|------|--------|
| **Method / URL** | `POST /auth/signup` |
| **Auth** | None |

### Request body (JSON)

| Field | Type | Required | Rules |
|-------|------|----------|--------|
| `name` | string | Yes | 2–50 characters |
| `email` | string | Yes | Valid email |
| `password` | string | Yes | Min 8 chars, at least one uppercase, one lowercase, one digit |
| `confirmPassword` | string | Yes | Must match `password` |

### cURL

```bash
curl -sS -X POST "$BASE/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Customer",
    "email": "jane@example.com",
    "password": "Str0ngPass",
    "confirmPassword": "Str0ngPass"
  }'
```

### Success `data` (typical)

```json
{
  "user": {
    "id": "...",
    "name": "Jane Customer",
    "email": "jane@example.com",
    "role": "user",
    "createdAt": "..."
  },
  "accessToken": "<JWT>"
```

Use `accessToken` as the bearer token for all following calls.

---

## 2. Login (customer accounts only)

**Only accounts with role `user` may use this endpoint.** Staff and administrators must use the staff sign-in API (`POST /auth/admin/login`), which is intended for the web panel, not the consumer app.

| Item | Value |
|------|--------|
| **Method / URL** | `POST /auth/login` |
| **Auth** | None |

### Request body (JSON)

| Field | Type | Required |
|-------|------|----------|
| `email` | string | Yes |
| `password` | string | Yes |

### cURL

```bash
curl -sS -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "Str0ngPass"
  }'
```

### Success `data` (typical)

```json
{
  "user": {
    "id": "...",
    "name": "Jane Customer",
    "email": "jane@example.com",
    "role": "user"
  },
  "accessToken": "<JWT>"
```

If a staff or admin email is used here, the API responds with **401** and a message directing them to the staff sign-in flow.

---

## 3. Get current user (`getMe`)

Returns the authenticated profile (coins, mobile, etc.).

| Item | Value |
|------|--------|
| **Method / URL** | `GET /auth/me` |
| **Auth** | Bearer token |

### cURL

```bash
curl -sS "$BASE/auth/me" \
  -H "Authorization: Bearer $TOKEN"
```

### Success `data` (typical)

```json
{
  "id": "...",
  "name": "Jane Customer",
  "email": "jane@example.com",
  "role": "user",
  "createdAt": "...",
  "coins": 120,
  "mobile": null
}
```

Use `id` as `userId` when calling [QR / coupon scan](#6-qr-code--coupon-scan).

---

## 4. Update profile (customer: **name only**)

| Item | Value |
|------|--------|
| **Method / URL** | `PATCH /auth/me` |
| **Auth** | Bearer token |

For accounts with role **`user`**, the server **only updates `name`**. Email and mobile in the body are **ignored** for end users (they cannot change email/mobile through this API).

Staff/admin accounts using the same endpoint from other clients may still update email and mobile as implemented for the panel.

### Request body (JSON) — mobile (recommended)

| Field | Type | Required |
|-------|------|----------|
| `name` | string | Yes (2–50 characters) |

Optional fields may be omitted:

```json
{ "name": "Jane Q. Customer" }
```

### cURL

```bash
curl -sS -X PATCH "$BASE/auth/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Q. Customer"}'
```

### Success `data`

Same shape as [Get current user](#3-get-current-user-getme) (updated profile).

---

## 5. Product list (home / catalog)

Public list of active products (pagination, search, rating filters, sort).

| Item | Value |
|------|--------|
| **Method / URL** | `GET /products` |
| **Auth** | None |

### Query parameters (optional)

| Query | Description | Default |
|-------|-------------|---------|
| `page` | Page number (≥ 1) | `1` |
| `limit` | Page size (1–100) | `10` |
| `search` | Text search | — |
| `minRating` | Minimum `averageRating` | — |
| `maxRating` | Maximum `averageRating` | — |
| `sortBy` | `createdAt`, `averageRating`, `totalReviews`, `name` | `createdAt` |
| `order` | `asc` or `desc` | `desc` |

### cURL

```bash
# First page, 20 items, newest first
curl -sS "$BASE/products?page=1&limit=20&sortBy=createdAt&order=desc"

# Search (if text index is configured on the server)
curl -sS "$BASE/products?search=headphones&limit=10"
```

### Success `data` (shape)

```json
{
  "products": [
    {
      "_id": "...",
      "name": "...",
      "description": "...",
      "images": [{ "url": "/uploads/....jpg", "publicId": "..." }],
      "averageRating": 4.5,
      "totalReviews": 12,
      "isActive": true,
      "isDeleted": false,
      "createdBy": { "_id": "...", "name": "...", "email": "..." },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

**Image URLs:** `images[].url` is often a **relative** path (e.g. `/uploads/...`). Build the full URL with your server origin, e.g. `http://localhost:4000` + `url`.

### Single product (optional)

`GET /products/:id` — same product shape as one element in `products` (no `pagination` wrapper in `data`; the product object is returned directly as `data` per server implementation). Public; only active, non-deleted products.

```bash
curl -sS "$BASE/products/<PRODUCT_ID>"
```

---

## 6. QR code / coupon scan

Redeems a coupon: marks it scanned, credits **coins** to the user, and records a transaction. All coupon routes require authentication.

| Item | Value |
|------|--------|
| **Method / URL** | `POST /coupons/scan` |
| **Auth** | Bearer token |

The QR payload from printed coupons should provide at least **coupon MongoDB `id`** and **human-readable `code`**. The app should send the **logged-in user’s id** as `userId` (must match the account that should receive coins — typically the same as `GET /auth/me` → `id`).

### Request body (JSON)

| Field | Type | Required | Description |
|-------|------|----------|----------------|
| `code` | string | Yes | Coupon code (as encoded in QR / printed) |
| `id` | string | Yes | Coupon document MongoDB id (24-char hex) |
| `userId` | string | Yes | Target user id (normally current user) |

### cURL

```bash
curl -sS -X POST "$BASE/coupons/scan" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "ABCD1234",
    "id": "<COUPON_OBJECT_ID>",
    "userId": "<SAME_AS_AUTH_ME_ID>"
  }'
```

### Success `data` (typical)

```json
{
  "coupon": {
    "id": "...",
    "code": "ABCD1234",
    "price": 50,
    "status": "SCANNED",
    "scannedBy": "..."
  },
  "user": {
    "id": "...",
    "name": "Jane Customer",
    "coins": 170
  }
}
```

### Common errors

- Coupon not found / code mismatch → **404**
- Already scanned → **400**
- Inactive coupon → **400**

---

## 7. Submit support message

Creates a support ticket for the **authenticated** user.

| Item | Value |
|------|--------|
| **Method / URL** | `POST /support/messages` |
| **Auth** | Bearer token |

### Request body (JSON)

| Field | Type | Required | Rules |
|-------|------|----------|--------|
| `subject` | string | Yes | Max 200 characters |
| `message` | string | Yes | Max 10000 characters |

### cURL

```bash
curl -sS -X POST "$BASE/support/messages" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Payment issue",
    "message": "I was charged twice for order ..."
  }'
```

### Success `data` (typical)

```json
{
  "message": {
    "id": "...",
    "subject": "Payment issue",
    "message": "Full text...",
    "status": "OPEN",
    "isReadByStaff": false,
    "createdAt": "...",
    "updatedAt": "...",
    "user": { "id": "...", "name": "...", "email": "..." }
  }
}
```

---

## 8. Support list (current user’s tickets)

Lists **only** the signed-in user’s support messages (paginated). This is separate from the staff inbox (`GET /support/messages`), which requires staff/admin roles.

| Item | Value |
|------|--------|
| **Method / URL** | `GET /support/messages/me` |
| **Auth** | Bearer token |

### Query parameters (optional)

| Query | Description | Default |
|-------|-------------|---------|
| `page` | Page (≥ 1) | `1` |
| `limit` | Page size (1–100) | `10` |
| `sortBy` | `createdAt` or `status` | `createdAt` |
| `order` | `asc` or `desc` | `desc` |
| `status` | `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED` | — (no filter) |

### cURL

```bash
curl -sS "$BASE/support/messages/me?page=1&limit=10&sortBy=createdAt&order=desc" \
  -H "Authorization: Bearer $TOKEN"
```

### Success `data` (shape)

```json
{
  "messages": [
    {
      "id": "...",
      "subject": "Payment issue",
      "preview": "First ~160 chars of message...",
      "status": "OPEN",
      "isReadByStaff": false,
      "createdAt": "...",
      "updatedAt": "...",
      "user": { "id": "...", "name": "...", "email": "..." }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "pages": 1
  }
}
```

---

## 9. Support message detail (current user)

Returns **full** message body for one ticket **if it belongs** to the authenticated user.

| Item | Value |
|------|--------|
| **Method / URL** | `GET /support/messages/me/:messageId` |
| **Auth** | Bearer token |

### cURL

```bash
curl -sS "$BASE/support/messages/me/<MESSAGE_ID>" \
  -H "Authorization: Bearer $TOKEN"
```

### Success `data` (typical)

```json
{
  "message": {
    "id": "...",
    "subject": "Payment issue",
    "message": "Full message body...",
    "status": "OPEN",
    "isReadByStaff": false,
    "createdAt": "...",
    "updatedAt": "...",
    "user": { "id": "...", "name": "...", "email": "..." }
  }
}
```

---

## Quick reference

| Action | Method | Path | Auth |
|--------|--------|------|------|
| Signup | POST | `/auth/signup` | No |
| Login (customer) | POST | `/auth/login` | No |
| Current user | GET | `/auth/me` | Yes |
| Update name | PATCH | `/auth/me` | Yes |
| Product list | GET | `/products` | No |
| Product detail | GET | `/products/:id` | No |
| Scan coupon / QR | POST | `/coupons/scan` | Yes |
| New support ticket | POST | `/support/messages` | Yes |
| My support list | GET | `/support/messages/me` | Yes |
| My support detail | GET | `/support/messages/me/:messageId` | Yes |

---

## Change password (optional for mobile)

| Item | Value |
|------|--------|
| **Method / URL** | `PATCH /auth/password` |
| **Auth** | Bearer token |

### Body (JSON)

| Field | Type | Required |
|-------|------|----------|
| `currentPassword` | string | Yes |
| `newPassword` | string | Yes (same complexity rules as signup) |
| `confirmNewPassword` | string | Yes (must match `newPassword`) |

### cURL

```bash
curl -sS -X PATCH "$BASE/auth/password" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "Str0ngPass",
    "newPassword": "N3wStr0ngPass",
    "confirmNewPassword": "N3wStr0ngPass"
  }'
```

---

## Shell helper snippet

```bash
export BASE="http://localhost:4000/api/v1"
export TOKEN="<paste accessToken after login or signup>"

curl -sS "$BASE/auth/me" -H "Authorization: Bearer $TOKEN" | jq .
```

If `jq` is not installed, omit `| jq .`.
