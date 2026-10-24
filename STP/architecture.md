# Architecture: Task Management App

## 1. Overview
A static, client-side web app. The browser talks directly to Firebase (Firestore + Auth) via Firebase Modular SDK with multi-tab offline persistence. There is no custom backend server. Security is enforced with Firestore Security Rules.

```
Browser (HTML / CSS / vanilla JS)
        |
        |  Firebase JS SDK (CDN, HTTPS + IndexedDB Persistence)
        v
Firebase
  - Auth (email + password, persistent sessions)
  - Firestore (tasks collection + security rules)
```

Hosting: any static host (Netlify, Vercel, or GitHub Pages).

## 2. Tech Stack
| Layer | Choice |
|-------|--------|
| Markup | HTML5, semantic elements |
| Styling | Plain CSS with custom properties & glassmorphism |
| Logic | Vanilla JavaScript, ES modules |
| Database and Auth | Firebase (Auth & Firestore) |
| Client library | Firebase modular v10 from official CDN |
| Offline Cache | IndexedDB persistent local cache via Firestore |
| Fonts | Public Sans, IBM Plex Mono (Google Fonts) |

## 3. Folder Structure
```
/
├── index.html          App shell and views
├── firestore.rules     Security rules for task isolation
├── css/
│   └── style.css       Glassmorphism design, tokens, animations, responsive layout
├── js/
│   ├── config.js       Firebase project configuration
│   ├── firebase.js     Firebase App, Auth, and Firestore initialization
│   ├── auth.js         Sign up, log in, log out, username onboarding
│   ├── tasks.js        Firestore CRUD operations
│   └── app.js          Main app logic, DOM events, filters, undo queue
└── README.md
```

## 4. Firestore Security Rules

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

## 5. Data Flow
1. On load, `auth.js` listens to auth state changes via Firebase Auth.
2. No user logged in: show the sign up / log in card.
3. User logged in: `tasks.js` fetches the user's tasks (`user_id == uid`).
4. Tasks are rendered to the DOM with instant client-side filtering (priority, status, due soon, search).
5. Any create, edit, or status change executes against Firestore with automatic IndexedDB offline sync.
6. Delete actions trigger a 10-second undo countdown before committing deletion to Firestore.

## 6. Key Decisions
- **No backend server:** Firestore rules provide user data isolation at zero operational cost.
- **Persistent local cache:** Offline support using browser IndexedDB cache.
- **Never pauses:** Unlike free PostgreSQL instances, Firebase Firestore never auto-pauses after 7 days of inactivity.
