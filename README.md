# AuthApp - Full-Stack Authentication System

A modern, production-ready authentication application built with **SvelteKit 5**, **Tailwind CSS**, **Drizzle ORM**, and **PostgreSQL**. Features a polished blue & orange themed UI with dark mode, role-based access control, and complete user management.

---

## Features

### Authentication
- **Email & Password** sign-up/sign-in with bcrypt hashing (salt 12)
- **OAuth integration** with Google and GitHub via Auth.js
- **Database sessions** with 30-day lifetime and httpOnly cookies
- **Email verification** with 24-hour token expiry and resend capability
- **Password reset** via email with 1-hour secure tokens
- **Password validation** — minimum 8 characters, uppercase, lowercase, and number required

### User Profile
- Editable **first name**, **last name**, **phone number**, **location**, and **bio**
- Profile picture support via OAuth providers (Google/GitHub)
- Change password with current password verification
- OAuth users can set a password to enable dual login
- Account metadata display (User ID, join date, auth method)

### Admin Panel
- Role-based access — only admins can access `/admin`
- **User management** — view all users with search/filter
- **Role toggling** — promote users to admin or demote
- **User deletion** with cascade (sessions removed)
- **Stats dashboard** — total users, active sessions, verified emails, admin count
- Progress bars showing proportional metrics

### UI/UX
- **Blue & orange** color theme with dark mode support
- Cream/warm white light mode, deep dark mode
- Glassmorphism card effects with backdrop blur
- Smooth animations — slide-up, fade-in, scale-in, float, shimmer
- Hover lift effects on stat cards with colored shadows
- Responsive design for mobile, tablet, and desktop
- Toast notifications for sign-in/sign-out/registration events
- Loading spinners on all form submissions

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | SvelteKit 5 (Svelte 5 runes) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 3.4 |
| **Database** | PostgreSQL |
| **ORM** | Drizzle ORM |
| **Auth** | Auth.js (@auth/sveltekit) |
| **Email** | Nodemailer (SMTP / Ethereal for dev) |
| **Bundler** | Vite 5 |

---

## Project Structure

```
src/
├── app.css                          # Global styles, animations, utilities
├── app.html                         # HTML template with dark mode script
├── app.d.ts                         # TypeScript declarations
├── hooks.server.ts                  # Route protection middleware
├── lib/
│   ├── theme.svelte.ts              # Dark mode state (Svelte 5 runes)
│   └── server/
│       ├── auth.ts                  # Auth.js config (providers, callbacks)
│       ├── email.ts                 # Nodemailer email service
│       ├── validation.ts            # Password validation rules
│       └── db/
│           ├── index.ts             # Database connection
│           └── schema.ts            # Drizzle schema (users, sessions, etc.)
└── routes/
    ├── +layout.svelte               # Navbar, toast system, theme toggle
    ├── +layout.server.ts            # Session + role loading
    ├── +page.svelte                 # Home page with role selection
    ├── login/                       # Sign-in (credentials + OAuth)
    ├── register/                    # Sign-up with email verification
    ├── dashboard/                   # User dashboard with stats
    ├── profile/                     # Profile settings (name, phone, bio, etc.)
    ├── admin/                       # Admin panel with user management
    ├── forgot-password/             # Password reset request
    ├── reset-password/              # Password reset form
    ├── verify-email/                # Email verification handler
    └── logout/                      # Session cleanup + redirect
```

---

## Database Schema

### Users Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `name` | text | Full name (computed) |
| `first_name` | text | First name |
| `last_name` | text | Last name |
| `email` | text | Unique, required |
| `email_verified` | timestamp | Verification date |
| `image` | text | OAuth profile picture URL |
| `password` | text | Bcrypt hash (nullable for OAuth) |
| `phone` | text | Phone number |
| `bio` | text | Short bio (max 300 chars) |
| `location` | text | City/country |
| `role` | text | `user` or `admin` (default: `user`) |
| `created_at` | timestamp | Account creation date |

### Other Tables
- **accounts** — OAuth provider links (Google, GitHub)
- **sessions** — Active database sessions with expiry
- **verification_tokens** — Email verification and password reset tokens

---

## Getting Started

### Prerequisites
- **Node.js** 18+
- **PostgreSQL** database
- Google and/or GitHub OAuth credentials (optional)

### 1. Clone and Install

```bash
git clone <repository-url>
cd sveltekit-auth-app
npm install
```

### 2. Environment Variables

Create a `.env` file in the root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/auth_app"

# Auth.js
AUTH_SECRET="your-random-secret-key"

# OAuth Providers (optional)
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="AuthApp <noreply@authapp.com>"
```

### 3. Database Setup

```bash
# Push schema directly to database
npm run db:push

# Or generate and run migrations
npm run db:generate
npm run db:migrate

# (Optional) Open Drizzle Studio GUI
npm run db:studio
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production

```bash
npm run build
npm run preview
```

---

## Route Protection

| Route | Access |
|-------|--------|
| `/` | Public |
| `/login`, `/register` | Public |
| `/forgot-password`, `/reset-password` | Public |
| `/verify-email` | Public |
| `/dashboard` | Authenticated users only |
| `/profile` | Authenticated users only |
| `/admin` | Admin role only |

Route protection is enforced in `src/hooks.server.ts`. Unauthenticated users are redirected to `/login`, and non-admin users are blocked from `/admin`.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run db:generate` | Generate Drizzle migration files |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:push` | Push schema directly to database |
| `npm run db:studio` | Open Drizzle Studio GUI |

---

## Security

- Passwords hashed with **bcrypt** (12 salt rounds)
- Sessions stored in database with **httpOnly** cookies
- CSRF protection via **Auth.js**
- Route-level protection in **server hooks**
- Token-based email verification and password reset
- Input validation on all server actions
