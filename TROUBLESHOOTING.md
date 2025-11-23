# Troubleshooting Vercel 404 Error

## Quick Diagnosis

If you're seeing a 404 error on Vercel, here's what to check:

### 1. Check Deployment Logs

1. Go to your Vercel project dashboard
2. Click on "Deployments"
3. Click on the latest deployment
4. Check the "Build Logs" tab

**Look for:**
- ✅ "Build Completed" - Good!
- ❌ Any errors during build
- ⚠️ Warnings about missing dependencies

### 2. Check Function Logs

1. In your deployment, click "Functions" tab
2. Look for any errors when accessing the homepage

**Common issues:**
- Database connection errors
- Missing environment variables
- Prisma client not generated

### 3. Most Likely Issue: Empty Database

The 404 is probably because:
- The database exists but has NO data
- The home page tries to fetch chapters
- No chapters = empty page = 404

## Solutions

### Solution 1: Check if Database is Empty (Quick Test)

Visit this URL in your browser:
```
https://your-app.vercel.app/api/chapters
```

**If you see:**
- `[]` (empty array) → Database is empty, needs seeding
- `[{...}]` (with data) → Database has data, different issue
- Error message → Check the error

### Solution 2: Seed the Database

#### Option A: Use Vercel Postgres (Recommended for Production)

1. Go to Vercel Dashboard → Your Project
2. Click "Storage" tab
3. Click "Create Database" → Choose "Postgres"
4. Copy the connection string
5. Go to "Settings" → "Environment Variables"
6. Update `DATABASE_URL` with the Postgres connection string
7. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
8. Redeploy

#### Option B: Keep SQLite but Seed on Every Deploy

Add this to `package.json`:
```json
{
  "scripts": {
    "build": "prisma generate && prisma db push && tsx prisma/seed.ts && next build"
  }
}
```

Then redeploy on Vercel.

**⚠️ Warning:** SQLite data is lost on each deployment on Vercel!

### Solution 3: Manual Seed via API Route

I've created `/api/seed` route for you.

After deployment, visit:
```
https://your-app.vercel.app/api/seed
```

This will seed the database with all DPDP Act content.

## Step-by-Step Fix

### If Database is Empty:

1. **Quick Fix** (Temporary):
   - Visit: `https://your-app.vercel.app/api/seed`
   - Wait for "Database seeded successfully"
   - Refresh your homepage

2. **Permanent Fix** (Recommended):
   - Switch to Vercel Postgres (see Option A above)
   - Or modify build script (see Option B above)

### If You See Other Errors:

1. **"GEMINI_API_KEY not found"**:
   - Go to Vercel → Settings → Environment Variables
   - Add `GEMINI_API_KEY` with your API key
   - Redeploy

2. **"Prisma Client not generated"**:
   - Check build logs
   - Ensure `prisma generate` runs during build
   - Add to `package.json` build script if missing

3. **"Cannot find module"**:
   - Check that all imports are correct
   - Verify file paths are correct (case-sensitive!)

## Vercel-Specific Issues

### SQLite Limitations on Vercel

- ❌ SQLite files are **ephemeral** (reset on each deploy)
- ❌ Not suitable for production
- ✅ Use Vercel Postgres, PlanetScale, or Supabase instead

### How to Switch to Vercel Postgres

1. Create Postgres database in Vercel
2. Get connection string
3. Update `DATABASE_URL` environment variable
4. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
5. Redeploy
6. Visit `/api/seed` to populate data

## Quick Checklist

- [ ] Deployment succeeded (green checkmark)
- [ ] Build logs show no errors
- [ ] Environment variable `GEMINI_API_KEY` is set
- [ ] `/api/chapters` returns data (not empty array)
- [ ] Database is seeded with DPDP Act content

## Still Having Issues?

### Check These URLs:

1. Homepage: `https://your-app.vercel.app/`
2. API test: `https://your-app.vercel.app/api/chapters`
3. Seed route: `https://your-app.vercel.app/api/seed`

### Share These Details:

- What URL shows 404?
- What does `/api/chapters` return?
- Any errors in Vercel function logs?
- Screenshot of deployment logs

---

**Most Common Fix:**
Visit `https://your-app.vercel.app/api/seed` to populate the database!
