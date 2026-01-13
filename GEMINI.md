# Auto Marketplace QLD - Project Context

## Project Overview
Auto Marketplace QLD is a Next.js web application for buying and selling vehicles in Queensland. It leverages the Next.js App Router, TypeScript, and Firebase for backend services (Authentication, Firestore, Storage).

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (configured via CSS variables in `globals.css`)
- **Backend/DB:** Firebase (Auth, Firestore, Storage)
- **Validation:** Zod
- **Icons:** Lucide React
- **Forms:** React Server Actions

## Folder Structure
- **`app/`**: Application routes and API endpoints (App Router).
- **`_actions/`**: Server Actions for handling form submissions, data mutations, and backend logic.
- **`_components/`**: Reusable UI components, organized by domain (navigation, pages, ui, etc.).
- **`_lib/`**: Utilities, helper functions, authentication logic, and Firebase configuration.
- **`_styles/`**: Global styles, Tailwind configuration (`globals.css`), and shared style constants.
- **`_types/`**: TypeScript interfaces and type definitions.
- **`scripts/`**: Utility scripts for database initialization and maintenance.

## Development Conventions

### Styling & Tailwind CSS
- **Configuration:** Tailwind v4 is used. Configuration is located in `_styles/globals.css` using the `@theme` directive.
- **Custom Colors:** Use project-specific colors defined in variables (e.g., `--color-blue`, `--color-yellow`, `--color-grey`).
- **Typography:** **Do not** use standard Tailwind text sizing classes (like `text-xl`). Use custom semantic classes defined in `globals.css`:
    - `text-heading` / `text-heading-desktop`
    - `text-subheading` / `text-subheading-desktop`
    - `text-paragraph` / `text-paragraph-desktop`
- **Component Styling:**
    - When creating custom components, use the prop **`cssClasses`** instead of `className` to pass additional styles.
    - Use the `classnames` package for conditional class application.
    - Avoid messy template literals.
- **Global Styles:** Check `globals.css` before adding inline styles to avoid duplication (e.g., `h1`, `p`, `button` tags often have default styles applied).

### Components & JSX
- **"use client":** Explicitly mark components as client-side when using hooks (`useState`, `useEffect`, etc.).
- **Next.js Components:**
    - Always use `<Image />` instead of `<img>`.
    - Always use `<Link />` instead of `<a>`.
- **Text Content:** Use HTML entities for quotes: `&quot;` (") and `&apos;` ('). Do not use these in JSON.
- **Structure:** Do not add text colors to parent `<div>` elements; apply them directly to text elements.

### Authentication & Data
- **Firebase:** Used for client-side and server-side authentication.
- **Server Actions:** Primary method for data fetching and mutation. Located in `_actions/`.

## Scripts
- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run start`: Start the production server.
- `npm run lint`: Run ESLint.
- `npm run set-admin-claims`: Custom script to set Firebase admin claims.
- `npm run init-vehicles`: Custom script to initialize vehicle data.
