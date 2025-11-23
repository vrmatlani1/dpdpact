# Deploying DPDP Act Website to Hostinger

## Prerequisites
- Hostinger hosting account (VPS, Cloud, or Business plan recommended for Node.js support)
- FTP/SFTP credentials from Hostinger
- Database access (if using Hostinger's database)

## Option 1: Deploy to Hostinger VPS/Cloud (Recommended for Next.js)

### Step 1: Connect to Your Hostinger VPS via SSH
```bash
ssh username@your-server-ip
```

### Step 2: Install Node.js (if not already installed)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 3: Upload Your Project
You can use SFTP, SCP, or Git to upload your files:

**Using SCP:**
```bash
# From your local machine
scp -r /Users/matlani/.gemini/antigravity/scratch/dpdp-act username@your-server-ip:/var/www/dpdpact
```

**Or using SFTP client like FileZilla:**
- Host: your-server-ip
- Username: your SSH username
- Password: your SSH password
- Port: 22
- Upload the entire project folder

### Step 4: Install Dependencies on Server
```bash
cd /var/www/dpdpact
npm install
```

### Step 5: Set Up Environment Variables
```bash
nano .env
```

Add:
```
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="your-gemini-api-key-here"
```

### Step 6: Set Up Database
```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

### Step 7: Build the Application
```bash
npm run build
```

### Step 8: Start the Application with PM2
```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the application
pm2 start npm --name "dpdpact" -- start

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

### Step 9: Configure Nginx (Reverse Proxy)
```bash
sudo nano /etc/nginx/sites-available/dpdpact
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/dpdpact /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Option 2: Deploy to Hostinger Shared Hosting (Static Export)

**Note:** Shared hosting doesn't support Node.js runtime, so we need to export as static HTML.

### Step 1: Modify next.config.ts for Static Export
Add to `next.config.ts`:
```typescript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};
```

### Step 2: Build Static Files
```bash
npm run build
```

This creates an `out` folder with static files.

### Step 3: Upload via FTP
1. Open FileZilla or your preferred FTP client
2. Connect using Hostinger FTP credentials:
   - Host: ftp.your-domain.com
   - Username: your FTP username
   - Password: your FTP password
   - Port: 21
3. Upload all files from the `out` folder to `public_html` directory

**⚠️ Important Limitation:** Static export won't work for this project because:
- We use API routes (`/api/chapters`, `/api/search`)
- We use server-side rendering for database queries
- We need Node.js runtime for Prisma and Gemini AI

---

## Option 3: Deploy to Vercel (Easiest Alternative)

Since your project is a Next.js app with API routes, Vercel is the recommended platform:

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Deploy
```bash
cd /Users/matlani/.gemini/antigravity/scratch/dpdp-act
vercel
```

Follow the prompts:
- Set up and deploy? Yes
- Which scope? Your account
- Link to existing project? No
- Project name? dpdpact
- Directory? ./
- Override settings? No

### Step 3: Add Environment Variables
```bash
vercel env add GEMINI_API_KEY
```

Paste your Gemini API key when prompted.

### Step 4: Deploy to Production
```bash
vercel --prod
```

---

## Recommended Approach

**For Hostinger:**
- If you have VPS/Cloud hosting → Use Option 1
- If you have shared hosting → This project won't work (needs Node.js runtime)

**Alternative (Recommended):**
- Deploy to Vercel (free, optimized for Next.js, easy setup)
- Point your Hostinger domain to Vercel using CNAME records

---

## Database Considerations

### For Production:
Replace SQLite with PostgreSQL or MySQL:

1. **Get database credentials from Hostinger**
2. **Update `prisma/schema.prisma`:**
```prisma
datasource db {
  provider = "postgresql"  // or "mysql"
  url      = env("DATABASE_URL")
}
```

3. **Update `.env`:**
```
DATABASE_URL="postgresql://user:password@host:5432/database"
```

4. **Run migrations:**
```bash
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

---

## Need Help?

Let me know:
1. What type of Hostinger plan do you have? (Shared, VPS, Cloud)
2. Do you want to use Hostinger or would you prefer Vercel?
3. Do you have SSH access to your Hostinger account?
