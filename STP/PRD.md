# Product Requirements Document: Task Management App

## 1. Overview
A task management app that helps users create, organize, prioritize, and track daily tasks efficiently. It offers a simple interface for managing tasks and monitoring completion status.

## 2. Objectives
1. Create and manage tasks easily.
2. Track task status and deadlines.
3. Improve productivity and organization.

## 3. Expected Outcome
A user-friendly task management system that helps users stay organized, track progress, and complete tasks efficiently.

## 4. Target Users
Individuals who want a plain, fast way to manage a personal daily task list: students, freelancers, and working professionals. No teams or sharing in v1.

## 5. Tech Constraints
- HTML, CSS, and vanilla JavaScript only
- Firebase (Auth & Firestore) loaded from a CDN with offline caching
- No frameworks, no build tools, no CSS libraries

## 6. User Stories
| ID | As a user, I want to... | So that... |
|----|-------------------------|------------|
| U1 | sign up, log in, and log out | my tasks are private and saved |
| U2 | add a task with title, description, priority, and due date | I capture what needs doing |
| U3 | edit or delete a task | I can keep my list accurate |
| U4 | set priority (low, medium, high) | I focus on what matters |
| U5 | change a task's status (To do, In progress, Done) | I track progress |
| U6 | see which tasks are overdue or due today | I don't miss deadlines |
| U7 | filter, search, and sort tasks | I find things quickly |
| U8 | see a progress overview | I understand how I'm doing |

## 7. Functional Requirements

### 7.1 Authentication
- Email and password sign up, log in, log out
- Session persists across page reloads
- Inline error messages for invalid input or failed auth

### 7.2 Task CRUD
- Fields: title (required, max 120 chars), description (optional, max 1000 chars), priority, status, due date (optional)
- Defaults: priority = medium, status = To do
- Delete asks for confirmation

### 7.3 Organization
- Priority is shown by label and icon, not color alone
- Filters: status, priority, due date (overdue, today, this week, none)
- Search by title and description
- Sort by due date, priority, created date

### 7.4 Status and Deadlines
- Quick status change directly from the list
- Overdue and due-today indicators
- Progress overview: completed vs pending, overdue count, completion rate (plain CSS bars)

### 7.5 States and Polish
- Empty, loading, and error states on every view
- Keyboard accessible with visible focus styles
- Responsive on phone, tablet, desktop

## 8. Non-Functional Requirements
- **Performance:** first load under 2 seconds on a normal connection; no blocking scripts
- **Accessibility:** WCAG AA contrast, semantic HTML, full keyboard operation
- **Security:** see security.md
- **Browser support:** latest two versions of Chrome, Firefox, Safari, Edge
- **Privacy:** each user can only access their own data

## 9. Design Requirements
- Clean, calm, human-made look; must not look AI-generated
- No gradients anywhere; no purple, blue, or indigo gradients; no glassmorphism, glow, or neon
- Fonts: Public Sans (UI) and IBM Plex Mono (dates, counts). No Inter, Poppins, Space Grotesk, or Roboto
- Palette: warm off-white background, near-black text, one muted accent (deep green, terracotta, or ochre), flat colors only
- 4-6px corner radius, 1px borders, generous spacing, restrained shadows
- No emoji; simple inline SVG icons or text labels
- Short, plain copy

## 10. Out of Scope (v1)
Teams and sharing, comments, file attachments, push notifications, recurring tasks, native mobile apps, third-party integrations.

## 11. Success Criteria
- A new user can sign up and add their first task in under a minute
- All flows work end to end with no console errors
- RLS verified: one user cannot read or change another's tasks
- Passes keyboard-only and contrast checks
- Deployed and reachable at a public URL

## 12. Delivery
Built in five phases (see phases.md). Each phase ends with a summary, test steps, and any manual steps, then waits for approval.
