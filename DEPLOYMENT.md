# Deployment Guide

This guide deploys the Sales Dashboard for **free** using:

| Layer | Service | Notes |
|-------|---------|-------|
| Database | **MongoDB Atlas** (M0 free) | 512 MB shared cluster |
| Backend API | **Render** (free web service) | Node/Express; spins down after ~15 min idle |
| Frontend | **Vercel** (Hobby free) | Static React build; no spin-down |
| Keep-alive | **UptimeRobot** (free) | Pings `/health` so the backend stays awake and the live seeder keeps running |

The frontend and backend live on **different domains**, so the app is configured for cross-site cookies (`SameSite=None; Secure`). This is already handled in code — you just need to set the env vars below correctly.

---

## Prerequisites

- A GitHub account with this repo pushed to it.
- The MongoDB Atlas cluster you already created, plus its connection string.
- Accounts on [Render](https://render.com), [Vercel](https://vercel.com), and [UptimeRobot](https://uptimerobot.com) (all free, GitHub sign-in works).

---

## Step 1 — MongoDB Atlas

You already have a cluster. Two settings to confirm so Render can connect:

1. **Database user** — Atlas > Database Access. Confirm you have a user with a password (the one in your `MONGO_URI`).
2. **Network access** — Atlas > Network Access > Add IP Address > **Allow access from anywhere (`0.0.0.0/0`)**. Render's free tier doesn't give a static outbound IP, so you can't allowlist a single address. (For a personal/demo project this is fine; the database is still protected by the user/password.)

Keep your connection string handy — it looks like:

```
mongodb+srv://<user>:<password>@<cluster>.mongodb.net/sales-dashboard?retryWrites=true&w=majority
```

---

## Step 2 — Push to GitHub

Make sure `server/.env` is **not** committed (it's gitignored). Then:

```bash
git add .
git commit -m "Phase 3: deployment config + live seeder"
git push origin main
```

---

## Step 3 — Deploy the backend to Render

The repo includes a `render.yaml` blueprint, so this is mostly automatic.

1. Render dashboard > **New > Blueprint** > connect your GitHub repo.
2. Render reads `render.yaml` and proposes a web service named `sales-dashboard-api`. Approve it.
3. When prompted, fill in the **secret** env vars (these are `sync:false` in the blueprint, so Render asks for them):

   | Key | Value |
   |-----|-------|
   | `MONGO_URI` | your Atlas connection string |
   | `JWT_SECRET` | a long random string (generate below) |
   | `CORS_ORIGIN` | leave blank for now — you'll set it after Step 4 |
   | `SEED_DEMO_PASSWORD` | any password for the demo login (e.g. `DemoPass123!`) |

   Generate a strong `JWT_SECRET` locally:

   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

4. Deploy. The first build takes a few minutes. When it's live you'll get a URL like:

   ```
   https://sales-dashboard-api.onrender.com
   ```

5. Verify it's up:

   ```
   https://sales-dashboard-api.onrender.com/health
   ```

   should return `{"status":"ok","uptime":...}`.

> Don't deploy via blueprint? Create a **Web Service** manually instead: Build `npm install`, Start `node server/index.js`, Health check path `/health`, and add every env var from `server/.env.example` (set `NODE_ENV=production`, `ENABLE_LIVE_SEED=true`).

---

## Step 4 — Deploy the frontend to Vercel

1. Vercel dashboard > **Add New > Project** > import your GitHub repo.
2. Vercel auto-detects Create React App (the repo also includes `vercel.json`). Keep the defaults (build `npm run build`, output `build`).
3. Add one **Environment Variable**:

   | Key | Value |
   |-----|-------|
   | `REACT_APP_API_URL` | `https://sales-dashboard-api.onrender.com/api` |

   (Use your actual Render URL, and keep the `/api` suffix.)

4. Deploy. You'll get a URL like:

   ```
   https://sales-dashboard.vercel.app
   ```

---

## Step 5 — Connect the two (CORS)

Now tell the backend to trust the frontend's origin.

1. Render > your service > **Environment** > set:

   ```
   CORS_ORIGIN=https://sales-dashboard.vercel.app
   ```

   (No trailing slash. To also allow Vercel preview deploys, use a comma-separated list, e.g. `https://sales-dashboard.vercel.app,https://sales-dashboard-git-main-you.vercel.app`.)

2. Save — Render redeploys automatically.

3. Open your Vercel URL and register/log in. Auth should work end to end. (If it doesn't, see Troubleshooting — it's almost always `CORS_ORIGIN` or cookies.)

---

## Step 6 — Keep the backend awake (so the live seeder runs)

Render's free web service sleeps after ~15 min idle, which pauses the node-cron seeder. A free uptime monitor keeps it warm:

1. [UptimeRobot](https://uptimerobot.com) > **Add New Monitor**.
2. Type: **HTTP(s)**. URL: `https://sales-dashboard-api.onrender.com/health`. Interval: **5 minutes**.
3. Save.

This keeps the service alive within Render's 750 free instance-hours/month (enough for one always-on service), so the seeder keeps generating fresh sales every 2 minutes. (Prefer not to keep it awake 24/7? Skip this step — the seeder will simply run only while someone is using the app, after a ~30–50s cold start.)

> Alternative: [cron-job.org](https://cron-job.org) works the same way if you prefer it over UptimeRobot.

---

## Step 7 — Verify the live demo

- Visit your Vercel URL, log in with the demo account: email `demo@sales-dashboard.local`, password = the `SEED_DEMO_PASSWORD` you set (or check Render logs for the auto-generated one).
- Watch the dashboard: a few new sales appear every 2 minutes, so totals and charts drift over time.
- The demo dataset self-trims at `SEED_MAX_SALES` (default 500) so it never outgrows the free Atlas tier.

---

## Troubleshooting

**Login works locally but not in production.**
Almost always cookies or CORS. Check, in the browser devtools Network tab, that the login response sets a `token` cookie with `SameSite=None; Secure`. That requires HTTPS on both ends (Render + Vercel both serve HTTPS) and `NODE_ENV=production` on Render. Confirm `CORS_ORIGIN` exactly matches your Vercel origin (scheme, host, no trailing slash).

**`Origin ... not allowed by CORS`.**
`CORS_ORIGIN` on Render doesn't match the site making the request. Add the exact origin (and any preview origins) as a comma-separated list.

**First request is very slow (~30–50s).**
That's Render's free-tier cold start after the service slept. Step 6 (keep-alive) prevents it.

**Render can't connect to Atlas (`MongooNetworkError` / timeout).**
Atlas Network Access must include `0.0.0.0/0` (Step 1), and the user/password in `MONGO_URI` must be correct and URL-encoded if it contains special characters.

**Demo data isn't changing.**
Confirm `ENABLE_LIVE_SEED=true` on Render and that the keep-alive monitor is hitting `/health`. Check Render logs for `[liveSeeder] Started.` and per-tick `Inserted N sale(s)` lines.
