# Quick Setup Guide for GitHub Upload

## Step 1: Upload to GitHub

### Option A: Via GitHub Web Interface (Easiest)

1. Go to https://github.com/vrmatlani1/dpdpact
2. Click on "Add file" → "Upload files"
3. Extract the `dpdp-act-deployment.zip` file on your computer
4. Drag and drop all the extracted files into the upload area
5. Add commit message: "Initial commit: DPDP Act website"
6. Click "Commit changes"

### Option B: Via GitHub Desktop

1. Download and install GitHub Desktop: https://desktop.github.com
2. Sign in with your GitHub account
3. Click "Add" → "Add Existing Repository"
4. Select the folder: `/Users/matlani/.gemini/antigravity/scratch/dpdp-act`
5. Click "Publish repository"
6. Choose "vrmatlani1/dpdpact" as the repository name
7. Click "Publish Repository"

## Step 2: Deploy to Vercel

Once your code is on GitHub:

1. Go to https://vercel.com
2. Sign up/Login (use your GitHub account for easy integration)
3. Click "Add New Project"
4. Click "Import Git Repository"
5. Select your repository: `vrmatlani1/dpdpact`
6. Click "Import"
7. Configure project:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: ./
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
8. Add Environment Variables:
   - Click "Environment Variables"
   - Add: `GEMINI_API_KEY` = `your-gemini-api-key`
   - Add: `DATABASE_URL` = `file:./dev.db`
9. Click "Deploy"

Vercel will:
- Install dependencies
- Run database migrations
- Build your app
- Deploy it to a URL like: `https://dpdpact.vercel.app`

## Step 3: Set Up Database on Vercel

After first deployment:

1. Go to your Vercel project dashboard
2. Click on "Settings" → "Environment Variables"
3. Verify `GEMINI_API_KEY` is set
4. Go to "Deployments" tab
5. Click on the latest deployment
6. Click "..." → "Redeploy"
7. Check "Use existing Build Cache" 
8. Click "Redeploy"

## Step 4: Run Database Seed (One-time)

You'll need to seed the database with DPDP Act content:

### Option A: Via Vercel CLI (if you have access)
```bash
vercel env pull
npx prisma generate
npx tsx prisma/seed.ts
```

### Option B: Via Vercel Dashboard
1. Go to your project on Vercel
2. Click "Settings" → "Functions"
3. You may need to create a one-time API route to trigger seeding
4. Or, use Vercel's Postgres/MySQL instead of SQLite for production

## Important Notes

⚠️ **SQLite Limitation on Vercel**: 
- SQLite files are ephemeral on Vercel (they reset on each deployment)
- For production, consider using:
  - **Vercel Postgres** (recommended)
  - **PlanetScale** (MySQL)
  - **Supabase** (PostgreSQL)

### To Switch to Vercel Postgres:

1. In Vercel dashboard, go to "Storage" → "Create Database"
2. Choose "Postgres"
3. Copy the connection string
4. Update environment variable `DATABASE_URL` with the new connection string
5. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
6. Redeploy

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

### Database Issues
- For production, use Vercel Postgres instead of SQLite
- Run migrations: `npx prisma migrate deploy`
- Seed data: `npx tsx prisma/seed.ts`

### API Routes Not Working
- Ensure `GEMINI_API_KEY` is set in environment variables
- Check function logs in Vercel dashboard

## Your Deployment Package

The ZIP file `dpdp-act-deployment.zip` contains:
- ✅ All source code
- ✅ Configuration files
- ✅ Database schema and seed script
- ✅ README and documentation
- ❌ node_modules (will be installed during build)
- ❌ .env file (create new one with your keys)
- ❌ Database file (will be created during build)

## Next Steps After Deployment

1. **Custom Domain**: Add your Hostinger domain to Vercel
   - Vercel Dashboard → Settings → Domains
   - Add your domain
   - Update DNS records in Hostinger to point to Vercel

2. **Environment Variables**: Keep your API keys secure
   - Never commit `.env` to GitHub
   - Always use Vercel's environment variable settings

3. **Monitor**: Check Vercel analytics and logs
   - View deployment logs
   - Monitor function execution
   - Track performance

## Support

If you encounter any issues:
1. Check Vercel deployment logs
2. Review the error messages
3. Consult Vercel documentation: https://vercel.com/docs

---

**Location of deployment package:**
`/Users/matlani/.gemini/antigravity/scratch/dpdp-act/dpdp-act-deployment.zip`

Extract this ZIP file and upload to GitHub!
