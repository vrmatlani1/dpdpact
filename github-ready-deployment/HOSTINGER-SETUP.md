# Hostinger Server Deployment Guide

## Quick Setup for Hostinger VPS/Cloud

### Step 1: Upload Files

1. **Connect via FTP/SFTP**:
   - Host: Your Hostinger server IP or domain
   - Username: Your SSH/FTP username
   - Password: Your SSH/FTP password
   - Port: 22 (SFTP) or 21 (FTP)

2. **Upload the extracted files** to your server directory (e.g., `/home/username/dpdpact` or `/var/www/dpdpact`)

### Step 2: SSH into Your Server

```bash
ssh username@your-server-ip
```

### Step 3: Navigate to Project Directory

```bash
cd /path/to/dpdpact
```

### Step 4: Install Node.js (if not installed)

```bash
# Check if Node.js is installed
node --version

# If not installed, install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 5: Install Dependencies

```bash
npm install
```

### Step 6: Set Up Environment Variables

```bash
nano .env
```

Add these lines:
```env
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="your-gemini-api-key-here"
```

Save and exit (Ctrl+X, then Y, then Enter)

### Step 7: Set Up Database

```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

### Step 8: Build the Application

```bash
npm run build
```

### Step 9: Start the Application

#### Option A: Using PM2 (Recommended for Production)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the application
pm2 start npm --name "dpdpact" -- start

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
# Follow the command it gives you
```

#### Option B: Using npm (Simple)

```bash
npm start
```

The app will run on port 3000 by default.

### Step 10: Configure Nginx (Reverse Proxy)

```bash
sudo nano /etc/nginx/sites-available/dpdpact
```

Add this configuration:
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/dpdpact /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 11: Set Up SSL (Optional but Recommended)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Quick Commands Reference

### Start Application
```bash
pm2 start dpdpact
# or
npm start
```

### Stop Application
```bash
pm2 stop dpdpact
```

### Restart Application
```bash
pm2 restart dpdpact
```

### View Logs
```bash
pm2 logs dpdpact
```

### Update Application
```bash
# Stop the app
pm2 stop dpdpact

# Pull new changes or upload new files
# Then:
npm install
npm run build

# Restart
pm2 restart dpdpact
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>
```

### Permission Issues
```bash
# Give proper permissions
sudo chown -R $USER:$USER /path/to/dpdpact
```

### Database Issues
```bash
# Reset database
rm dev.db
npx prisma db push
npx tsx prisma/seed.ts
```

## Production Database (Recommended)

For production, use MySQL or PostgreSQL instead of SQLite:

### Using MySQL (Available on Hostinger)

1. Create MySQL database in Hostinger control panel
2. Update `.env`:
```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
```

3. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

4. Run migrations:
```bash
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

## Accessing Your App

- **Local**: http://localhost:3000
- **Domain**: http://your-domain.com (after Nginx setup)
- **HTTPS**: https://your-domain.com (after SSL setup)

## Important Files

- `.env` - Environment variables (create this manually)
- `package.json` - Dependencies
- `prisma/schema.prisma` - Database schema
- `prisma/seed.ts` - Database seeding script

## Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs dpdpact`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Check application is running: `pm2 status`

---

**Your deployment package is ready!**
Extract `hostinger-deployment.zip` and follow the steps above.
