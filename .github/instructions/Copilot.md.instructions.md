---
description: description: Global workspace instructions for the BetterTaytay
applyTo: '*'
---

<!-- Tip: Use /create-instructions in chat to generate content with agent assistance -->

BetterTaytay AI Developer Instructions

You are acting as an AI coding assistant for BetterTaytay, an open-source, community-led municipal government portal for Taytay, Rizal, Philippines (forked from BetterLB.org).

When generating code, answering questions, or reviewing changes, you must strictly adhere to the following project context, architectural constraints, and coding guidelines.

1. Project Identity & Tech Stack
Frontend: React 19, Vite, TypeScript (Strict Mode).

Styling: Tailwind CSS v4 using CSS variables and the Kapwa Design System.

Backend: Cloudflare Pages Functions (Serverless).

Database: Cloudflare D1 (SQLite) for dynamic data, KV for caching.

Search: Meilisearch (via Fuse.js for fallback/local).

Data Pipeline: Python (processes legislative PDFs into JSON/D1).

Localization: i18next (English & Filipino).

2. Frontend Coding Guidelines
Design System & Styling (CRITICAL)
NEVER use raw Tailwind colors (e.g., bg-blue-500, text-red-600).

ALWAYS use Kapwa Design Tokens (e.g., bg-kapwa-surface, text-kapwa-text-strong, bg-kapwa-bg-brand-bold).

Ensure high contrast and accessibility standards are met for all UI components.

Components & Imports
Import base components from the Kapwa library when available: import { Button } from '@bettergov/kapwa/button';

Import local reusable UI components from src/components/ui/ or features from src/components/.

Favor functional components, hooks, and nuqs for URL-based state management.


Data Handling
Static Data: Found in src/data/. Modifying public services requires rebuilding (python scripts/merge_services.py or npm run merge:data).

Dynamic Data: Fetched via /api/* endpoints.

3. Backend & API Coding Guidelines
Cloudflare Pages Functions
All backend code resides in functions/api/.

Functions receive Cloudflare's Request and Env (bindings for KV, D1, etc.).


API Security & Admin Endpoints
Authentication: Admin endpoints must be protected using the withAuth() wrapper (GitHub OAuth session-based).

CSRF Protection: ALL state-changing requests (POST, PUT, PATCH, DELETE) to admin endpoints MUST check for and validate X-CSRF-Token headers.

Audit Logging: Every state-changing operation must call logAudit(env, { action, performedBy, targetType, targetId, details }) to record the action in the admin_audit_log D1 table.


Response Standardization
Success: return new Response(JSON.stringify({ success: true, data: { ... } }), ...)

Error: return new Response(JSON.stringify({ error: "Error message" }), { status: 400 })

CORS: Include appropriate CORS headers for public APIs. Admin APIs must restrict to same-origin.

Database (D1) & Caching (KV)
Use prepared statements for D1 to prevent SQL injection.

Use env.KV_NAMESPACE for caching (e.g., WEATHER_KV). Ensure TTLS are respected (e.g., 30-60 mins for external APIs like Weather/Forex).


4. Directory Structure Navigation
When looking for specific logic, refer to this map:

config/lgu.config.json -> Global configurations (LGU name, region, coordinates).

src/data/ -> Source of truth for Departments, Barangays, Services (JSON).

src/pages/ -> Route-level views.

src/i18n/ -> Translation dictionaries (common.json).

functions/api/ -> Backend endpoints.

pipeline/ -> Python scripts for PDF scraping, parsing, and D1 database seeding.


5. General Development Rules
TypeScript Strictness: Do not use any. Always define explicit interfaces/types in src/types/. Avoid non-null assertions (!) unless absolutely certain.

Error Handling: Wrap async operations in try/catch. Present user-friendly errors on the frontend; log detailed errors on the backend.

Commit Convention: Use Conventional Commits (feat:, fix:, docs:, refactor:).

Testing: Ensure new features are testable via Playwright (E2E) in the e2e/ directory.

Before writing or modifying code, ensure you understand whether you are touching the static frontend data layer, the Cloudflare backend functions, or the Python data processing pipeline, as each has strict boundaries.