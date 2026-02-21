Sales Dashboard

Full-stack Sales Dashboard (React frontend + Express/Mongo backend).

This repository contains a simple sales dashboard backend and frontend used for tracking sales, users, and basic analytics.

---

## Quick Start

- Install dependencies:

```bash
npm install
```

- Run the backend server:

```bash
# Starts the Node server on port 5001
npm run server
```

- Run the frontend (in another terminal):

```bash
# Starts CRA dev server on port 3000
npm start
```

## Environment Variables

Create a `.env` file in the `server/` folder (or set system env vars) with at least:

```
PORT=5001
MONGO_URI=mongodb://localhost:27017/sales-dashboard
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
CORS_ORIGIN=http://localhost:3000
```

Note: Do NOT commit production credentials. The repository no longer contains any production DB credentials.

## Project Structure

- `server/` — Express API, Mongoose models, controllers, middleware
- `src/` — React frontend (components, redux, utils)
- `public/` — static assets for frontend

## Important Notes & Changes

I reviewed and fixed several issues before this commit:

- Fixed `User` pre-save hook to correctly return early and handle errors so passwords are hashed reliably.
- Updated `updateUser` to load the document and call `save()` (ensures pre-save hooks run when updating password).
- Hardened `protect` auth middleware to ensure the user still exists after token verification.
- `sendTokenResponse` now sets a cookie (`token`) in addition to returning token in JSON; cookie expiry parsing is safer.
- Tightened CORS defaults and removed hardcoded DB credentials from the config.
- Replaced `.remove()` usages with `findByIdAndDelete` to avoid runtime errors.
- Simplified frontend 401 handling to rely on status codes.


## Running integration checks

I ran basic integration checks locally (register, login, create/update/delete sale) which succeeded.

## Screenshots

Placeholders are included in `docs/screenshots/`. Replace them with real screenshots (same filenames) if desired.

- Login / Signup: ![Login](/docs/screenshots/login.png)
- Dashboard (overview): ![Dashboard](/docs/screenshots/dashboard.png)
- Dashboard (overview): ![Dashboard](/docs/screenshots/Dashboard-1.png)
- Dashboard (overview): ![Dashboard](/docs/screenshots/Dashboard-2.png)
- Charts / Table: ![Charts](/docs/screenshots/charts.png)

## How to add real screenshots

1. Create a `docs/screenshots/` directory at the repo root.
2. Save screenshots as `login.svg`, `dashboard.svg`, `charts.svg` (or use PNG/JPEG but update README links).
3. Commit the images alongside the README.

## Security & Deployment Recommendations

- Use environment variables for all secrets, and store them securely (Vault, cloud secrets manager, or CI secret store).
- Serve the frontend from a trusted domain and set `CORS_ORIGIN` to that domain in production.
- Store auth tokens in secure, httpOnly cookies (already set by server) and avoid localStorage for sensitive tokens.
- Rotate `JWT_SECRET` if it was exposed and enforce strong secret values.

---

If you want, I can commit these changes and open a PR. I can also replace the SVG placeholders with real PNG screenshots if you provide them or allow me to capture them locally.
