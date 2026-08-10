# Deploy to Vercel — Step by Step

This project is an **Express 5 + Prisma 7 (PostgreSQL)** backend. Vercel runs Node apps as
**serverless functions**, not as a long-running server, so we expose the Express app through an
`api/` handler instead of calling `app.listen()`.

Stack summary:

- Express 5 (ESM, `"type": "module"`)
- Prisma 7 with the `prisma-client` generator + `@prisma/adapter-pg` driver adapter
- PostgreSQL database

---

## Prerequisites

1. Your project pushed to a GitHub repository.
2. A **hosted PostgreSQL** database (Neon, Supabase, Vercel Postgres, or Prisma Postgres).
3. A Vercel account (vercel.com).

---

## Step 1 — Prepare the project for Vercel

### 1.1 Add `build` / `start` scripts to `package.json`

Add these scripts (keep the existing `dev` script):

```json
"scripts": {
  "dev": "tsx watch src/server.ts",
  "build": "prisma generate && tsc",
  "start": "node dist/server.js"
}
```

- `build` regenerates the Prisma client (it is gitignored, so it must be created at build time)
  and compiles TypeScript to `dist/`.
- `start` runs the compiled server locally / on a Node host.

### 1.2 Create the serverless entry point

Create `api/index.ts` at the project root:

```ts
import { createServer } from 'node:http';
import app from '../src/app.js';

export default createServer(app);
```

Vercel detects the `api/` directory automatically and treats it as a serverless function, routing
every request to your Express app.

### 1.3 (Optional) `vercel.json`

If you use the **legacy build system** you may need this file. With the current Vercel build system
you can skip it:

```json
{
  "version": 2,
  "builds": [{ "src": "api/index.ts", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "api/index.ts" }]
}
```

> **Note:** `PORT` from `.env` is ignored on Vercel — the serverless function handles requests
> directly. Also make sure `.env` stays in `.gitignore`; real values go in the Vercel dashboard.

---

## Step 2 — Set up the database

1. Create a PostgreSQL database on your provider of choice (e.g. Neon / Supabase).
2. Copy the connection string. It looks like:
   ```
   postgresql://USER:PASSWORD@HOST:5432/dbname?schema=public
   ```

---

## Step 3 — Create the database schema (migrations / push)

This project has no `prisma/migrations` folder yet, so push the schema directly to the production DB:

```bash
# make sure your production DATABASE_URL is set in the shell first
export DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/dbname?schema=public"

npx prisma db push
```

If you later adopt migrations, run `npx prisma migrate dev` locally to create them and
`npx prisma migrate deploy` against the production database instead.

---

## Step 4 — Environment variables

Add these to the **Vercel dashboard** (Project → Settings → Environment Variables):

| Name            | Example value                        |
| --------------- | ------------------------------------ |
| `DATABASE_URL`  | `postgresql://USER:PASSWORD@HOST:5432/dbname?schema=public` |
| `JWT_SECRET`    | `a-long-random-secret`               |
| `JWT_EXPIRES_IN`| `7d`                                 |

> ⚠️ Use the **production** `DATABASE_URL` (your hosted DB), **not** the local
> `localhost:5432` one in `.env`.

---

## Step 5 — Push to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

---

## Step 6 — Deploy on Vercel

1. Go to **vercel.com → Add New → Project**.
2. Import your GitHub repo.
3. Vercel auto-detects a Node.js project. Set:
   - **Build Command:** `npm run build`
   - **Output/Directory:** leave empty (default)
4. Click **Environment Variables** and paste the values from Step 4.
5. Click **Deploy**.

After the build finishes, you'll get a URL like `https://your-app.vercel.app`.

---

## Step 7 — Verify

- Visit `https://your-app.vercel.app/` → should return:
  > Server is running successfully and Prisma is connected! 🚀
- Hit an endpoint, e.g. `GET /api/products` or register via `POST /api/auth/register`.

---

## Troubleshooting

- **`PrismaClientUnknownRequestError` / connection refused**
  Check that `DATABASE_URL` is set for the correct environment (Production) and points at the hosted DB.

- **`generated/prisma/client.js` not found / "Cannot find module"**
  Make sure the build command is `npm run build` (which runs `prisma generate` first).

- **Database tables missing**
  Run `npx prisma db push` (or `migrate deploy`) against the production `DATABASE_URL` (Step 3).

- **CORS issues**
  The app uses `cors()` with no restrictions. Tighten it if needed in `src/app.ts`.

- **Local `.env` overrides production**
  Vercel env vars take precedence; never commit `.env` to git.
