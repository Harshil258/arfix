# GET /api/v1/videos

Description:

Returns the list of YouTube videos added by users. Each video entry contains the original URL, extracted YouTube ID, optional metadata (title/description), the user who added it, and timestamps.

Authentication:

- This endpoint requires a valid JWT in the `Authorization` header: `Authorization: Bearer <token>`.

Request:

- Method: `GET`
- URL: `/api/v1/videos`
- Body: none
- Query parameters: none (the current implementation returns all videos sorted by newest first)

cURL example:

```bash
curl -X GET http://localhost:3000/api/v1/videos \
  -H "Authorization: Bearer <token>"
```

Successful response (HTTP 200):

```json
{
  "success": true,
  "message": "Videos fetched successfully.",
  "data": {
    "videos": [
      {
        "id": "64f1b2c3d4e5f67890123456",
        "url": "https://youtu.be/abc123",
        "youtubeId": "abc123",
        "title": null,
        "description": null,
        "addedBy": { "id": "64f0a1b2c3d4e5f678901234", "name": "Alice" },
        "createdAt": "2026-06-03T12:34:56.789Z"
      },
      {
        "id": "64f1b2c3d4e5f67890123457",
        "url": "https://www.youtube.com/watch?v=def456",
        "youtubeId": "def456",
        "title": "How to use ARFIX",
        "description": "Introductory video",
        "addedBy": null,
        "createdAt": "2026-06-02T09:12:00.000Z"
      }
    ]
  }
}
```

Error responses:

- 401 Unauthorized — when token is missing, expired, or invalid.
- 500 Internal Server Error — for unexpected server/database failures.

Notes:

- The server currently extracts the YouTube ID from the provided URL and stores it on create. The `addedBy` field is populated from the authenticated user who created the entry.
- If you want pagination, filtering, or metadata enrichment (title/thumbnail) add query parameters or server-side metadata fetch on `POST /videos`.
