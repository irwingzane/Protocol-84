# Protocol84 – Employee Performance & Resilience Platform (MVP)

This is a hybrid **corporate marketing website + SaaS-style portal** for an employee performance and resilience programme.

The MVP is implemented as a modern, responsive, static web app (no build tools required) that you can open directly in a browser or serve via a simple static server.

## Structure

- **Public marketing site**: `index.html`, `styles.css`, `landing.js`
  - Hero, how it works, programme/features, corporate benefits/ROI, pricing, about, contact/demo.
  - Smooth scrolling CTAs (`Book a demo`, `Contact us`, `See pricing`).
  - Demo form writes submissions into `localStorage` as `demoRequests`.
  - Pricing buttons simulate a **paywall** by storing `companyAccess` in `localStorage` (used by the private app).
- **Private portals (SaaS-style app)**: `app.html`, `app.css`, `app.js`, `storage.js`
  - **Employee login** (company access code + work email).
  - **Employee dashboard**: progress tracking, 12-week journey view, content library tiles, completion badges.
  - **Admin login** (email + company access code).
  - **Admin dashboard**: organisation metrics (average completion, engagement %, indicative burnout delta), employee table, sample JSON report download.
  - Both roles share the same simple `localStorage`-backed storage defined in `storage.js`.

All brand names are placeholders in the copy that you can replace with your final naming (e.g. Protocol84, Zane Irwing).

## Running the project locally

You can either open the HTML files directly or run a simple static server.

### Option 1 – Open files directly

1. Navigate to the `web` folder in your file explorer.
2. Open `index.html` in a modern browser (Chrome, Edge, Firefox).
3. To access the SaaS portal directly, open `app.html`.

> Note: On some browsers, ES module imports from `file://` URLs may be restricted. If `app.html` fails to load `app.js`/`storage.js`, use Option 2 and serve via a local server.

### Option 2 – Simple static server (recommended)

If you have Python installed, you can serve the folder:

```bash
cd path/to/web
python -m http.server 8000
```

Then open:

- Marketing site: `http://localhost:8000/index.html`
- Portal: `http://localhost:8000/app.html`

Any other simple static HTTP server will also work.

## Simulated flows and data

### Company purchase / access

- On the marketing site (`index.html`), pricing cards for **Small** and **Medium** tiers include a **Purchase access** button.
- Clicking this:
  - Stores a JSON object in `localStorage` under the key `companyAccess` (tier + timestamp).
  - Shows a message explaining that this is a simulated checkout.
- On the portal (`app.html`), the header shows an access indicator:
  - **Active** if `companyAccess` exists.
  - **Demo mode** otherwise.

In production you would replace this with a real payment gateway (e.g. Stripe Checkout) and server-side licence handling.

### Employee login & progress

- Employee login form (Employee tab in `app.html`):
  - Accepts any non-empty **company access code** and **work email**.
  - Creates/updates an employee record in `localStorage` (`br_employees`).
- Employee records store:
  - `email`, `name`, `companyCode`
  - `weeksCompleted` (0–12)
  - `lastActivity` (ISO timestamp)

Inside the employee dashboard:

- A **progress bar** and pill show weeks completed and percentage.
- **Mark current week as completed** increments `weeksCompleted` up to 12 and updates `lastActivity`.
- The **12-week journey** grid colours weeks as Completed / Current / Upcoming.
- **Badges** (started, 50%, complete) light up as you progress.
- The **Content library** shows placeholder tiles for workouts, habits, stress management, productivity, nutrition, and resilience modules.

### Admin analytics & reports

- Admin login form (Admin tab in `app.html`):
  - Accepts any non-empty email + company access code.
  - Creates a session with role `admin` (no employee record is stored).
- The **Organisation overview** page shows:
  - Average programme completion (%).
  - Engaged employees (% with `weeksCompleted > 0`).
  - An **illustrative burnout risk delta** derived from completion.
- The **Employees** page shows a table of all locally stored employees with:
  - Name, email, weeks completed, completion %, last activity date.
- The **Reports** page:
  - Generates a JSON report (metrics + employees) and downloads it as `performance-resilience-report.json`.
- A **Simulate additional engagement** button randomly increments some employees’ `weeksCompleted` to demonstrate how metrics update.

All data is **local to the current browser** and resettable by clearing site data or `localStorage`.

## Customising for your brand

- Replace the Protocol84 name or Zane Irwing founder reference in `index.html`, `app.html`, and copy sections if you want to rebrand.
- Update pricing copy in the **Pricing** cards (`index.html`) to your actual tiers and currencies.
- Swap out placeholder content tiles (titles, categories) in `app.js` (`renderEmployeeLibrary`) with your real modules.

## Next steps / future-ready extensions

This MVP is structured so you can:

- Swap the simple `localStorage`-based `storage.js` with real API calls.
- Replace the simulated paywall with a production payment provider.
- Plug in SSO/identity for employees and admins.
- Extend the programme model from 12 generic weeks to fully defined modules and assessments.

