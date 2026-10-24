# Build Phases

The app is built in five phases. Complete one phase at a time. Do not start the next until the owner replies **"proceed"**.

**Rules for every phase**
- Start by listing what will be built.
- Do everything possible without the owner (code, files, running, testing).
- If something can only be done manually (creating the Firebase project, copying keys, auth settings, deploying), stop and give exact steps. Wait for confirmation.
- End with: what was built, how to test it, and remaining manual steps. Then stop.
- No features outside this document without asking first.

---

## Phase 1: Foundation and Database

**Goal:** A working skeleton connected to Firebase.

**Build**
- Project structure: `index.html`, `/css`, `/js`, `config.js`
- Design system in CSS variables: colors, type scale, spacing, buttons, inputs, cards
- Firebase client setup (Auth + Firestore with offline persistence)
- Firestore security rules

**Manual steps (owner)**
- Create the Firebase project
- Enable Email/Password in Authentication
- Paste Firebase credentials into `config.js`
- Publish Firestore rules

**Done when**
- The page loads with the design system applied
- The connection check succeeds
- Firestore rules protect user data

---

## Phase 2: Authentication and Core Task CRUD

**Goal:** Users can sign in and manage their own tasks.

**Build**
- Sign up, log in, log out, session persistence, username onboarding
- Create, view, edit, delete tasks (form and list view)
- 10-second undo countdown for delete
- Validation and inline error messages

**Manual steps (owner)**
- None

**Done when**
- Two test users each see only their own tasks
- All CRUD actions persist after reload

---

## Phase 3: Organization and Prioritization

**Goal:** Users can find and focus on the right tasks.

**Build**
- Priority levels (low, medium, high), distinguished by label and icon, not color alone
- Filters: status, priority, and quick chips (All, Due Soon in 2 days, Urgent High)
- Search by task title
- Sorting: Newest first, Oldest first, Due Date earliest, Priority (High to Low), Title (A-Z)

**Done when**
- Filters, search, and sort combine correctly
- Priority is clear in grayscale

---

## Phase 4: Status and Deadline Tracking

**Goal:** Users can see progress and what is urgent.

**Build**
- Status workflow: To do, In progress, Done, with quick action buttons from the list (Start, Done, Undo)
- Due dates with timezone-safe indicators: Overdue (with days count), Due Today, Due Tomorrow, and normal dates
- Progress overview card: Real-time completed, in progress, pending, and overdue counts, along with completion rate % and a plain CSS animated progress bar
- Filter support for "In Progress" and quick chip for "Overdue"

**Done when**
- Counts match the actual data after every change
- Overdue logic is correct around midnight and across time zones

---

## Phase 5: Polish, Testing, and Handoff

**Goal:** Production-ready and documented.

**Build (Completed)**
- [x] Empty, loading, and error states (friendly messages, "No tasks created yet", fallback timeouts)
- [x] Keyboard accessibility, focus styles, contrast checks (visible focus-visible rings, modal Escape key & backdrop dismiss)
- [x] Responsive review at phone, tablet, and desktop widths (adaptive layouts, flex wrapping)
- [x] End-to-end testing of all flows and bug fixes (CRUD, 10s undo, password-verified logout)
- [x] Security review against `security.md` (XSS escaping, Firestore rules)
- [x] README with setup and deployment steps (Netlify, Vercel, or GitHub Pages)

**Manual steps (owner)**
- Deploy the site (Netlify, Vercel, or GitHub Pages)
- Add the deployed domain to Firebase Authentication authorized domains if needed

**Done when**
- Every item in the PRD success criteria passes
- The security checklist is fully ticked
