# Security: Task Management App

Because the app has no custom backend, the browser talks straight to Firebase. **Security lives in Firestore Security Rules and in careful handling of user input in the browser.**

## 1. Threat Summary
| Threat | Mitigation |
|--------|------------|
| A user reads or edits another user's tasks | Firestore Security Rules enforce `request.auth.uid == user_id` |
| Stolen or leaked keys | Client keys are public identifiers; security is enforced by rules & Auth |
| Cross-site scripting (XSS) via task text | Render user text using `escapeHTML` and text node manipulation |
| Unauthorized access | Firebase Email/Password authentication & JWT tokens |
| Data in transit intercepted | HTTPS only |

## 2. Firestore Security Rules
- Rules are enforced on the `/tasks/{taskId}` collection:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow create: if request.auth != null && request.auth.uid == request.resource.data.user_id;
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.user_id;
    }
  }
}
```

## 3. Input Handling and XSS
- Task titles are escaped with `escapeHTML` before rendering.
- Plain-language error messages are surfaced to users without exposing raw system stack traces.
