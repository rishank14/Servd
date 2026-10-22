<div align="center">
  <img src="public/orange-logo.png" alt="Servd Logo" width="180" />

  # Servd

  **Good food starts here. An AI-powered culinary companion for smart recipe discovery, dynamic dish crafting, and intelligent pantry management.**
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Better_Auth-F97316?logo=auth0&logoColor=white" alt="Better Auth" />
  <img src="https://img.shields.io/badge/Neon_Postgres-00E599?logo=postgresql&logoColor=white" alt="Neon Postgres" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?logo=drizzle&logoColor=black" alt="Drizzle ORM" />
  <img src="https://img.shields.io/badge/Gemini_AI-4285F4?logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Arcjet-5C54F8?logo=shield&logoColor=white" alt="Arcjet" />
</p>

<p align="center">
  <a href="https://servd-rk.vercel.app">
    <img src="https://img.shields.io/badge/Live_Demo-Visit-d13228?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
</p>

---

## Table of Contents

- [About](#about)
- [Demo](#demo)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [License](#license)
- [Author](#author)

---

## About

**Servd** is a full-stack, AI-powered recipe discovery and smart pantry platform designed to eliminate everyday meal fatigue, prevent food waste, and make gourmet cooking accessible to everyone.

Home cooking often suffers from disconnected workflows: users search generic recipe catalogs without knowing whether they have the required ingredients, let items expire in their fridge, or struggle to adapt dishes to missing pantry staples. Servd unifies these fragmented steps into a cohesive, intelligent culinary workspace:

1. **Intelligent Multimodal Pantry Scanner:** Snap or upload photos of your refrigerator, countertops, or grocery hauls. Multimodal Gemini vision analyzes the image, identifies produce and staples, and assigns confidence ratings for effortless inventory logging.
2. **"What Can I Cook?" Engine:** Uses your active pantry stock to generate recipe recommendations tailored to what you already have on hand, displaying match percentages and clear missing-ingredient lists.
3. **On-Demand AI Recipe Crafting:** Ask for any dish in the world. Servd generates comprehensive recipes complete with prep and cook times, categorized ingredients, step-by-step instructions with chef tips, full nutritional values, and ingredient substitution tables.
4. **Magazine-Quality PDF Export:** Download printable, formatted recipe cards with dynamic page counts, nutrition cards, and Unsplash food photography.
5. **Modern Security & Edge Protection:** Protected by Arcjet bot detection and request shields in Next.js 16 request proxies, backed by Better Auth session verification and Neon Serverless PostgreSQL.

---

## Demo

<p align="center">
  <a href="https://youtu.be/6m3dhIpDx3o">
    <img src="screenshots/LandingPage.png" alt="Servd Demo Video" width="800" />
  </a>
  <br/><em>▶️ Click to watch the full demo on YouTube</em>
</p>

---

## Key Features

### 🔐 Authentication & Session Security
- **Better Auth Integration:** Robust session management utilizing HTTP-only cookies and database-backed sessions.
- **Dual Sign-In Options:** Supports both standard email & password credentials and one-click Google OAuth authentication.
- **Protected Route Guards:** Handled at the edge using Next.js 16 `proxy.ts`, redirecting unauthenticated traffic to `/` while preserving intended destination callback URLs.

### 🍳 Recipe Discovery & Exploration
- **Recipe of the Day:** Fresh, globally curated recipes fetched daily from TheMealDB API with 24-hour cache revalidation.
- **Cuisine & Category Browsing:** Interactive exploration of diverse regional culinary traditions (Italian, Indian, Mexican, Japanese, Thai, etc.) with localized metadata and flag iconography.
- **Dynamic Search & Quick Cook:** Instant search modal allowing users to query any dish and initiate automated AI recipe generation.

### 🤖 Generative AI Recipe Studio
- **Structured Recipe Generation:** Powered by Google Gemini (`gemini-3.5-flash-lite`), producing strict JSON structures containing:
  - Exact prep time, cook time, and serving quantities.
  - Categorized ingredients (Proteins, Vegetables, Spices, Grains, Dairy).
  - Sequenced step-by-step instructions with custom pro tips.
  - Per-serving nutritional values (Calories, Protein, Carbs, Fat).
  - Alternative ingredient substitution guides.
- **Automatic High-Resolution Food Imagery:** Queries the Unsplash API with multi-tier title cleaning and query fallbacks to automatically fetch and attach food photography to every dish.
- **Database Caching & Instant Backfill:** Generated recipes are persisted in Neon PostgreSQL so subsequent visits load instantly without repeated AI token consumption.

### 📸 Multimodal Pantry Vision
- **AI Fridge & Pantry Image Scanning:** Upload photos of your groceries or fridge shelves. Gemini vision identifies items, estimates quantities, and assigns detection confidence scores.
- **Interactive Review & Edit:** Add, edit, or adjust quantities and names before committing items to your personal pantry.
- **Manual Pantry Management:** Full CRUD operations allowing home cooks to add, update, and remove pantry items on demand.
- **"What Can I Cook?" Matcher:** Feeds your active pantry ingredients into Gemini to return tailored recipes ranked by percentage match, highlighting items you already have versus items you need.

### 📄 Magazine-Grade PDF Export
- **Vector PDF Generation:** Built with `@react-pdf/renderer` for client-side compilation without server bottlenecks.
- **Bespoke Editorial Layout:** Includes brand header, recipe imagery, metadata stat bars, two-column ingredient tables, nutritional panels, and dynamic `"Page X of Y"` footers.

### 🛡️ Enterprise-Grade Security with Arcjet
- **Global Shield & Bot Protection:** Configured with `@arcjet/next` to detect and filter malicious bots, scrapers, and automated abuse across public and protected endpoints.
- **Safe Search & Preview Allowlist:** Whitelists verified search engine crawlers and link-preview bots while blocking hostile traffic.

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | `16.3.8` | React framework with App Router, Turbopack, and server/client component boundaries |
| **React** | `19.2.8` | Core UI library for component hierarchy and concurrent rendering |
| **TypeScript** | `^5.0` | Strict static typing for end-to-end data integrity |
| **Tailwind CSS** | `^4.0` | Utility-first CSS framework with modern color palette and responsive tokens |
| **shadcn/ui** | `^4.21` | Accessible, customizable UI component primitives |
| **Lucide React** | `^1.54` | Consistent, clean iconography |
| **Sonner** | `^2.0` | Smooth, customizable toast notifications with built-in deduplication |
| **@react-pdf/renderer** | `^4.9` | Client-side dynamic PDF compilation and export engine |
| **react-dropzone** | `^20.1` | Drag-and-drop file upload handling for pantry camera uploads |

### Backend & Server Infrastructure

| Technology | Version | Purpose |
|---|---|---|
| **Next.js Server Actions** | Built-in | Type-safe RPC server actions for data mutations and AI orchestration |
| **Next.js Proxy (`proxy.ts`)** | `16.3.8` | Next.js 16 edge request proxy for security inspection and auth redirects |
| **TheMealDB API** | REST | External datasource for daily specials and international recipe categories |
| **Unsplash API** | REST | Dynamic photography search engine for recipe hero images |

### Database & ORM

| Technology | Version | Purpose |
|---|---|---|
| **Neon PostgreSQL** | Serverless | Serverless cloud PostgreSQL database with auto-scaling compute |
| **Drizzle ORM** | `^0.45` | Lightweight, type-safe SQL ORM with zero-overhead queries |
| **Drizzle Kit** | `^0.31` | CLI tool for database migrations, pushes, and schema management |

### Authentication & Security

| Technology | Version | Purpose |
|---|---|---|
| **Better Auth** | `^1.7` | Modern TypeScript-first authentication engine with session tables |
| **Google OAuth 2.0** | Provider | Secure social single sign-on integration |
| **Arcjet** | `^1.5` | Application security layer providing bot detection and rate shield protection |

### Artificial Intelligence

| Technology | Model | Purpose |
|---|---|---|
| **Google Generative AI SDK** | `@google/generative-ai` | Official SDK communicating with Google Gemini APIs |
| **Gemini 3.5 Flash Lite** | `gemini-3.5-flash-lite` | Structured recipe generation, substitution reasoning, and multimodal pantry photo recognition |

### Deployment & Hosting

| Platform | Role |
|---|---|
| **Vercel** | CI/CD, production edge proxy, serverless functions, and global static asset hosting |

---

## Getting Started

Follow these steps to set up and run Servd locally on your machine.

### Prerequisites

- **Node.js:** `v20.x` or higher & **npm**
- **Database:** Free [Neon PostgreSQL](https://neon.tech/) database instance
- **API Keys:** [Google Gemini](https://aistudio.google.com/), [Arcjet](https://app.arcjet.com/), [Unsplash](https://unsplash.com/developers), and [Google OAuth](https://console.cloud.google.com/)

### 1. Clone & Install

```bash
git clone https://github.com/rishank14/Servd.git
cd Servd
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
# Database (Neon Serverless PostgreSQL)
DATABASE_URL=postgresql://user:pass@ep-example.neon.tech/neondb?sslmode=require

# Authentication (Better Auth)
BETTER_AUTH_SECRET=your_32_character_random_secret
BETTER_AUTH_URL=http://localhost:3000

# Social Sign-In (Google Cloud Console OAuth 2.0)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AI & APIs
GEMINI_API_KEY=your_gemini_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_access_key

# Security & Bot Shield (Arcjet)
ARCJET_KEY=your_arcjet_key
```

### 3. Database Setup & Migrations

Push the Drizzle schema directly to your Neon PostgreSQL database:

```bash
npm run db:push
```

> **Helpful Commands:**
> - `npm run db:studio` — Open the visual Drizzle database browser.
> - `npm run db:generate` — Generate SQL migration files.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## Project Structure

```
Servd/
├── public/                     # Static assets (brand logos, hero imagery)
│   ├── logo.png                # Brand square icon
│   ├── orange-logo.png         # Primary brand horizontal badge
│   └── pasta-dish.png          # Hero culinary photography
├── src/
│   ├── actions/                # Type-safe Next.js Server Actions
│   │   ├── mealdb.actions.ts   # TheMealDB catalog and daily specials
│   │   ├── pantry.actions.ts   # Pantry CRUD & Gemini vision image scanner
│   │   └── recipe.actions.ts   # Gemini recipe generation, Unsplash lookup, collections
│   ├── app/                    # Next.js 16 App Router pages & endpoints
│   │   ├── (main)/             # Authenticated app shell route group
│   │   │   ├── dashboard/      # Daily inspiration, featured cuisines, categories
│   │   │   ├── pantry/         # Pantry management & "What Can I Cook?"
│   │   │   │   └── recipes/    # AI recipe matches from available pantry stock
│   │   │   ├── recipe/         # Dynamic recipe studio, nutritional cards, PDF export
│   │   │   └── recipes/        # User's saved recipe collection
│   │   ├── api/                # API route handlers
│   │   │   ├── auth/           # Better Auth catch-all endpoint [...all]
│   │   │   └── db-check/       # Database health diagnostic endpoint
│   │   ├── globals.css         # Tailwind CSS v4 design tokens and utilities
│   │   ├── layout.tsx          # Root HTML layout with Navigation Header & Footer
│   │   └── page.tsx            # Landing page with interactive hero & preview cards
│   ├── components/             # Reusable UI component architecture
│   │   ├── ui/                 # shadcn/ui primitives (Button, Dialog, Badge, Card, etc.)
│   │   ├── AddToPantryModal.tsx# AI image scanner & manual ingredient modal
│   │   ├── Header.tsx          # Responsive navigation bar with auth status
│   │   ├── HowToCookModal.tsx  # Quick recipe generator prompt modal
│   │   ├── ImageUploader.tsx   # Drag-and-drop pantry image dropzone
│   │   ├── RecipeCard.tsx      # Multi-variant recipe card (pantry, list, default)
│   │   ├── RecipePDF.tsx       # Printable vector PDF recipe generator
│   │   └── UserDropdown.tsx    # User session menu & logout trigger
│   ├── db/                     # Database configuration and schema definitions
│   │   ├── index.ts            # Neon serverless client & Drizzle instance
│   │   └── schema.ts           # PostgreSQL tables, relations, and enums
│   ├── hooks/                  # Custom React hooks (useFetch, etc.)
│   ├── lib/                    # Shared utilities and configurations
│   │   ├── arcjet.ts           # Centralized Arcjet bot detection & shield client
│   │   ├── auth.ts             # Better Auth server configuration
│   │   ├── auth-client.ts      # Better Auth browser client
│   │   ├── data.ts             # Featured cuisines, categories, and emoji maps
│   │   ├── session.ts          # Server-side user session resolver
│   │   └── utils.ts            # String capitalization and Tailwind clsx helpers
│   └── proxy.ts                # Next.js 16 Edge request proxy & security guard
├── drizzle.config.ts           # Drizzle Kit CLI configuration
├── next.config.ts              # Next.js configuration (remote image hostnames)
├── package.json                # Project dependencies and npm scripts
└── tsconfig.json               # TypeScript compiler options & module paths
```

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for complete details.

---

## Author

Crafted with passion for culinary arts and modern web engineering by **Rishank Kalra**.

---

<p align="center">
  <strong>Servd</strong> — Eat well, cook smarter, and enjoy every bite. 🍽️
</p>
