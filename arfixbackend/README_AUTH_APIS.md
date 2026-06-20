# Authentication APIs: signup & updateMyProfile

This document describes two authentication-related endpoints implemented in the server:

- `POST /api/v1/auth/signup` — create a new user account and receive an access token.
- `PATCH /api/v1/auth/me` — update the authenticated user's profile.

---

## POST /api/v1/auth/signup

Description: Registers a new user. Required fields: `name`, `email`, `mobile`, `password`.

Request JSON example:

```json
{
  "name": "Alice Example",
  "email": "alice@example.com",
  "mobile": "+911234567890",
  "password": "StrongP@ssw0rd"
}
```

cURL example:

```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Example","email":"alice@example.com","mobile":"+911234567890","password":"StrongP@ssw0rd"}'
```

Successful response (HTTP 201):

```json
{
  "status": "success",
  "message": "Account created successfully.",
  "data": {
    "user": {
      "id": "64f1b2c3d4e5f67890123456",
      "name": "Alice Example",
      "email": "alice@example.com",
      "mobile": "+911234567890",
      "role": "USER",
      "createdAt": "2026-06-03T12:34:56.789Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
}
```

Error cases:
- 409 Conflict if email or mobile already exists.

---

## PATCH /api/v1/auth/me

Description: Updates the authenticated user's profile. Requires authentication via `Authorization: Bearer <token>` header.

Behavior notes:
- If the authenticated user has role `USER` (end user), they can change `name` and optionally `mobile` (ignored if blank).
- For staff/admin roles, `email` can be updated (if not taken) and `mobile` can be set to `null` by sending an empty string for `mobile` key.

Request JSON examples:

Update name and mobile (end-user):

```json
{
  "name": "Alice Updated",
  "mobile": "+919876543210"
}
```

Update name and email (admin/staff):

```json
{
  "name": "Alice Admin",
  "email": "alice.admin@example.com",
  "mobile": ""  
}
```

cURL example (replace <token>):

```bash
curl -X PATCH http://localhost:3000/api/v1/auth/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Alice Updated","mobile":"+919876543210"}'
```

Successful response (HTTP 200):

```json
{
  "status": "success",
  "message": "Profile updated successfully.",
  "data": {
    "id": "64f1b2c3d4e5f67890123456",
    "name": "Alice Updated",
    "email": "alice@example.com",
    "role": "USER",
    "createdAt": "2026-06-03T12:34:56.789Z",
    "coins": 0,
    "mobile": "+919876543210"
  }
}
```

Error cases:
- 401 Unauthorized if token is invalid or user no longer exists.
- 409 Conflict if trying to change email to one that already exists (staff/admin path).

---

File generated to document the two endpoints implemented in `server/src/controllers/auth.controller.ts`.
