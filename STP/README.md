# Task Management App (STP)

A modern, fast, and accessible personal task management web application built with vanilla HTML5, CSS3 (Glassmorphism design system), and JavaScript (ES Modules). Powered by **Firebase Auth** and **Cloud Firestore** with persistent offline caching via browser IndexedDB.

---

## ✨ Features

- **Authentication & Security**:
  - Secure Email/Password authentication with persistent sessions.
  - Interactive password visibility toggle (eye button).
  - First-time user onboarding with personalized greeting (*"Hello, [Name]!"*).
  - **Password-Protected Logout**: Secure reauthentication modal required to log out.
  - Custom friendly error handling for login attempts.

- **Task Management (CRUD)**:
  - Add tasks with titles, priorities (High, Medium, Low), and due dates.
  - Edit existing tasks in place with smooth scrolling.
  - Delete tasks with an animated **10-Second Undo Countdown Toast** before permanent removal.
  - Three-tier status workflow: **To Do** → **In Progress** → **Done**.
  - Calm, celebratory checkmark animation upon completing tasks.

- **Organization & Deadlines**:
  - **Progress Overview**: Live visual tracking of completion rate (%), completed, in-progress, to-do, and overdue task counts with a plain CSS gradient progress bar.
  - **Timezone-Safe Deadline Tracking**: Badges for `⚠ Overdue (Xd)`, `⏳ Due Today`, and `Due Tomorrow`.
  - **Real-Time Filtering**: Filter by Status (*All, To Do, In Progress, Done*), Priority (*All, High, Medium, Low*), or Quick Chips (*All Tasks, Due Soon (2 days), Overdue, Urgent High*).
  - **Multi-Field Sorting**: Sort by Newest First, Oldest First, Due Date (Earliest), Priority (High to Low), or Title (A-Z).
  - **Instant Title Search**: Debounce-free real-time title search.

- **Offline-First & Never Expires**:
  - Powered by Firebase Modular SDK with multi-tab `IndexedDB` local persistence. Tasks load and save with 0ms latency even without internet connectivity.
  - Free Firebase Spark plan has **no inactivity pause rules** (never pauses or shuts down like free Postgres tiers).

---

## 📁 Project Structure

```text
STP/
├── frontend/                     # Client-side presentation layer
│   ├── index.html                # App shell, semantics, forms, and modals
│   ├── css/
│   │   └── style.css             # Glassmorphism design tokens, responsive styles, animations
│   └── js/
│       └── app.js                # Main DOM controller, filters, undo queue, UI events
│
├── backend/                      # Client-side services & API configuration
│   ├── config.js                 # Firebase project credentials
│   ├── firebase.js               # Firebase App, Auth & Firestore initialization with offline cache
│   └── auth.js                   # Authentication logic, password verification, session callbacks
│
├── database/                     # Security rules and data models
│   ├── firestore.rules           # Security rules for per-user task isolation
│   └── tasks.js                  # Firestore CRUD operations and client-side sorting
│
├── index.html                    # Root launcher (auto-redirects to frontend/index.html)
├── architecture.md               # Technical architecture document
├── phases.md                     # Build phases and milestone tracking
├── PRD.md                        # Product requirements document
├── security.md                   # Threat analysis and security mitigations
└── README.md                     # Deployment and developer guide
```

---

## 🚀 Running Locally

Because the application uses native browser ES Modules (`import`/`export`), it must be served over a local HTTP server:

### Option 1: Python (Built-in)
Run the following in the project directory:
```bash
python -m http.server 8088
```
Then visit **[http://localhost:8088](http://localhost:8088)** in your browser.

### Option 2: VS Code Live Server
1. Install the **Live Server** extension in Visual Studio Code.
2. Right-click `index.html` or `frontend/index.html` and select **"Open with Live Server"**.

---

## 🔒 Firebase Security Rules

Before production use, ensure your Firestore rules enforce that users can only read and write their own tasks. In the [Firebase Console](https://console.firebase.google.com/):
1. Navigate to **Build > Firestore Database > Rules**.
2. Paste the rules from `database/firestore.rules`:

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
3. Click **Publish**.

---

## 🌐 Deployment Guide

### 1. Vercel
1. Install the Vercel CLI (`npm i -g vercel`) or push the code to a GitHub repository.
2. Import the project in [vercel.com](https://vercel.com).
3. Set the root directory to `./` (the root `index.html` will automatically route users to `frontend/index.html`).
4. Click **Deploy**.

### 2. Netlify
1. Log into [netlify.com](https://www.netlify.com).
2. Drag and drop the `STP` folder onto the Netlify dashboard, or connect your GitHub repository.
3. Click **Deploy Site**.

### 3. GitHub Pages
1. Push your repository to GitHub.
2. Go to **Settings > Pages**.
3. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
4. Your site will be live at `https://<username>.github.io/<repo-name>/`.

> **Post-Deployment Step**: In your [Firebase Console](https://console.firebase.google.com/) under **Authentication > Settings > Authorized domains**, add your live domain (e.g., `your-app.vercel.app` or `<username>.github.io`) to allow logins from your production URL.
