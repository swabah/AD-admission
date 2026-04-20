# Admission – Student Admission Portal

A React + Vite web application for managing student admissions at Ahlussuffa school. Features a multi-step application form for students and an admin dashboard for reviewing applications.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite 8
- **Database:** Supabase (PostgreSQL)
- **State/Forms:** TanStack Query v5, React Hook Form, Zod
- **Routing:** React Router v7
- **Package Manager:** npm

## Project Structure

```
src/
  assets/       # Images and static assets
  components/   # Reusable UI components
  hooks/        # Custom React hooks (useApplications, etc.)
  pages/        # ApplyPage (multi-step form), AdminPage (dashboard)
  schemas/      # Zod validation schemas
  services/     # supabase.js — all DB operations
  utils/        # Formatters, validators, image compression
```

## Environment Variables (Secrets)

| Key | Description |
|-----|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL (e.g. `https://xyz.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public API key |
| `VITE_SUPABASE_TABLE_NAME` | Table name for applications (default: `applications`) |
| `VITE_ADMIN_KEY` | Secret key to access the admin dashboard |

## Development

```bash
npm install
npm run dev       # Start dev server on port 5000
npm run build     # Build for production (output: dist/)
```

## Deployment

Configured as a **static site** deployment:
- Build command: `npm run build`
- Public directory: `dist`

## Workflows

- **Start application** — Runs `npm run dev` on port 5000 (webview)
