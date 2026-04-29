# Ahlussuffa Admission Portal

A student admission management system built for **Ahlussuffa** school. The portal provides a public-facing multi-step application form for students and a secure admin dashboard for staff to review, manage, and print submitted applications.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Forms | React Hook Form + Zod |
| Data Fetching | TanStack Query v5 |
| Routing | React Router v7 |
| UI Primitives | Radix UI, shadcn/ui |
| PDF Export | html2pdf.js |

---

## Project Structure

```
src/
├── assets/           # Images and static assets
├── components/       # Reusable UI components
│   ├── ApplicationPrintDocument.tsx  # A4 print/PDF template
│   ├── ConfirmDialog.tsx
│   ├── DashboardLayout.tsx
│   ├── FormStep.tsx
│   ├── InfoItem.tsx
│   ├── PhotoUploadSection.tsx
│   ├── StudentViewModal.tsx
│   └── ui/           # shadcn/ui base components
├── hooks/
│   ├── useApplications.ts  # TanStack Query hooks for Supabase data
│   └── useFormSteps.ts     # Multi-step form navigation logic
├── lib/              # Utility library (cn, etc.)
├── pages/
│   ├── ApplyPage.tsx             # Landing / application type selection
│   ├── NewAdmissionPage.tsx      # Multi-step form for new students
│   ├── LocalAdmissionPage.tsx    # Multi-step form for local/returning students
│   ├── LocateApplicationPage.tsx # Application lookup by reference
│   ├── AdminPage.tsx             # Password-protected admin dashboard
│   ├── AdminApplicationView.tsx  # Full application detail view (admin)
│   └── NotFound.tsx
├── schemas/          # Zod validation schemas
├── services/
│   └── supabase.js   # All Supabase DB operations
└── utils/            # Formatters, validators, image compression
```

---

## Routes

| Path | Page | Access |
|---|---|---|
| `/` or `/apply` | Application type selection | Public |
| `/apply/new` | New student admission form | Public |
| `/apply/local` | Local/returning student form | Public |
| `/locate` | Locate an existing application | Public |
| `/admin` | Admin dashboard | Password protected |
| `/admin/view/:id` | Full application detail view | Password protected |

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL (e.g. `https://xyz.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public API key |
| `VITE_SUPABASE_TABLE_NAME` | Table name for applications (default: `applications`) |
| `VITE_ADMIN_KEY` | Secret key to access the admin dashboard |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint the codebase
npm run lint
```

The dev server runs on **port 5000** by default.

---

## Key Features

### Public Portal
- **Application type selection** — Students choose between a new admission or a local/returning student application.
- **Multi-step form** — Guided 3-step process: Personal Details → Academic Info → Parent & Guardian Info.
- **Photo upload** — With client-side validation and image compression before submission.
- **Application lookup** — Students can locate a previously submitted application by reference number.
- **Print / PDF export** — After submission, applicants can preview, print, or share their filled application form as an A4 PDF.

### Admin Dashboard
- **Password-protected** — Access controlled via `VITE_ADMIN_KEY`.
- **Application listing** — View all submitted applications from Supabase in a tabular dashboard.
- **Detail view** — Full application details with modal and dedicated view page per applicant.
- **Admin print** — Generate and print the official `ApplicationPrintDocument` for any applicant.
- **Confirm / Delete** — Manage application lifecycle from the dashboard.

### Print & PDF
- `ApplicationPrintDocument` renders a standard A4 page (210mm × 297mm) with navy + gold branding, dotted-line fields, declaration, signature row, and an "For Office Use Only" box.
- Uses fully inline styles for reliable cross-browser print rendering.
- Accepts both `camelCase` (live form data) and `snake_case` (Supabase data) field names.
- `@media print` in `global.css` hides all non-print UI and resets the print area.
- `@page` rule applies 8mm vertical / 10mm horizontal margins.

---

## Deployment

The project is configured for **Vercel** via `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

The SPA rewrite rule ensures React Router handles all client-side navigation correctly on Vercel.

> **Note:** Set all `VITE_*` environment variables in your Vercel project settings before deploying.
