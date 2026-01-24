# Phase 1: Creators_Lab Repository Analysis

**Repository Path:** `/Users/ashleytan/Creators_Lab`  
**Branch:** `merge-lms`  
**GitHub URL:** https://github.com/atan2016/Creators_Lab

## Repository Structure

### Static HTML Pages (9 files)
1. `index.html` - Main homepage
2. `login.html` - Member login page (⚠️ CONFLICT with LMS `/login` route)
3. `about.html` - About page
4. `resources.html` - Resources page
5. `events.html` - Events page
6. `careers.html` - Careers page
7. `showcase.html` - Student showcase
8. `what-we-teach.html` - What we teach page
9. `creators_lab_single_preview.html` - Preview page (may be temporary)

### API Routes (2 serverless functions)
Located in `/api/` folder (Vercel serverless functions):

1. **`api/create-checkout-session.js`**
   - Purpose: Stripe payment processing for donations
   - Method: POST
   - Dependencies: `stripe` package
   - Environment Variables: `STRIPE_SECRET_KEY`, `VERCEL_URL` or `NEXT_PUBLIC_SITE_URL`
   - Returns: Stripe checkout session ID and URL
   - Redirects: Success/cancel URLs point to `/index.html?donation=success`

2. **`api/move-past-events.js`**
   - Purpose: Monthly cron job to log past events (monitoring only)
   - Method: GET (called by Vercel cron)
   - Schedule: Runs monthly (1st of each month at midnight)
   - Reads: `announcements.json` from the deployed site
   - Note: Events are filtered client-side, this is for logging only

### Configuration Files

1. **`package.json`**
   - Dependencies: `@vercel/speed-insights`, `stripe`
   - No build scripts (static site)
   - No dev dependencies

2. **`vercel.json`**
   - Contains cron job configuration for `move-past-events`
   - No routing configuration (uses default static file serving)

### Data Files (JSON)

1. `announcements.json` - Event announcements data
2. `news-feed.json` - News feed data
3. `search-index.json` - Search index data

### Assets

- `/assets/` - Contains logos, images, and SVG files
- `/student-showcase/src/assets/` - Student project showcase images

### Other Files

- `search.css` and `search.js` - Search functionality
- Various archive/backup files (`.zip`, `.jsx`, `.xcf`)

## Conflict Analysis

### 🔴 HIGH PRIORITY CONFLICTS

1. **Login Route Conflict**
   - **Creators_Lab:** `login.html` (static HTML page)
   - **LMS:** `/login` (Next.js route with NextAuth)
   - **Resolution:** Convert `login.html` to redirect to LMS `/login` OR integrate LMS login into the existing page design

2. **API Route Structure**
   - **Creators_Lab:** `/api/` folder with serverless functions (Vercel format)
   - **LMS:** `/src/app/api/` folder with Next.js API routes
   - **Resolution:** Move Creators_Lab API functions to `/src/app/api/` and convert to Next.js route handlers

### 🟡 MEDIUM PRIORITY CONFLICTS

3. **Package Dependencies**
   - **Creators_Lab:** Minimal dependencies (`stripe`, `@vercel/speed-insights`)
   - **LMS:** Full Next.js stack (Next.js, React, Prisma, NextAuth, Tailwind, etc.)
   - **Resolution:** Merge both dependency lists - no version conflicts expected

4. **Build Process**
   - **Creators_Lab:** No build process (static files)
   - **LMS:** Next.js build process required
   - **Resolution:** Replace static serving with Next.js build

5. **Vercel Configuration**
   - **Creators_Lab:** `vercel.json` with cron jobs
   - **LMS:** May need Next.js-specific Vercel config
   - **Resolution:** Update `vercel.json` to support Next.js while preserving cron jobs

### 🟢 LOW PRIORITY (No Conflicts)

6. **Styling**
   - **Creators_Lab:** Inline CSS in HTML files
   - **LMS:** Tailwind CSS
   - **Resolution:** Both can coexist; convert or import as needed

7. **Static Assets**
   - **Creators_Lab:** `/assets/` folder
   - **LMS:** `/public/` folder (Next.js convention)
   - **Resolution:** Move assets to `/public/assets/`

## Migration Strategy

### API Routes Migration

**Current:** `/api/create-checkout-session.js` (Vercel serverless function)  
**Target:** `/src/app/api/create-checkout-session/route.ts` (Next.js API route)

**Changes needed:**
- Convert from `export default async function handler(req, res)` to Next.js route handler format
- Update response format (Next.js uses `NextResponse`)
- Update CORS headers (Next.js middleware or route-level)
- Preserve Stripe integration logic

**Current:** `/api/move-past-events.js` (Vercel cron job)  
**Target:** `/src/app/api/move-past-events/route.ts` (Next.js API route)

**Changes needed:**
- Convert to Next.js route handler
- Update `vercel.json` cron configuration to point to new route
- Preserve cron schedule and logic

### Static Pages Migration

All HTML pages need conversion to Next.js pages:
- `index.html` → `src/app/page.tsx`
- `about.html` → `src/app/about/page.tsx`
- `resources.html` → `src/app/resources/page.tsx`
- `events.html` → `src/app/events/page.tsx`
- `careers.html` → `src/app/careers/page.tsx`
- `showcase.html` → `src/app/showcase/page.tsx`
- `what-we-teach.html` → `src/app/what-we-teach/page.tsx`
- `login.html` → Handle specially (see conflict #1)

### Environment Variables Needed

From Creators_Lab:
- `STRIPE_SECRET_KEY` (for donation payments)
- `VERCEL_URL` or `NEXT_PUBLIC_SITE_URL` (for redirects)

From LMS:
- `DATABASE_URL` (PostgreSQL)
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`

## Next Steps (Phase 2)

1. Initialize Next.js structure
2. Merge package.json dependencies
3. Copy LMS source code
4. Begin static page conversions
5. Migrate API routes
