# DPDP Act Website - GitHub Ready

Complete Next.js application for the Digital Personal Data Protection Act, 2023.

## 🚀 Quick Start

### 1. Clone or Download

```bash
git clone https://github.com/vrmatlani1/dpdpact.git
cd dpdpact
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

The `.env.example` already contains the Gemini API key. Just copy it!

### 4. Set Up Database

```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 What's Included

- ✅ **Full DPDP Act Content** - All 9 chapters, 44 sections
- ✅ **AI-Powered Search** - Gemini AI integration (API key included)
- ✅ **Mobile Responsive** - Swipe gestures for navigation
- ✅ **Material Design 3** - Clean, modern UI
- ✅ **Database Seeding** - Automatic data population
- ✅ **API Routes** - RESTful endpoints for all data

## 🌐 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vrmatlani1/dpdpact)

1. Click the button above or go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Environment variables are already in `.env.example`
4. Click "Deploy"
5. After deployment, visit `https://your-app.vercel.app/api/seed` to populate the database

## 📁 Project Structure

```
dpdpact/
├── app/
│   ├── api/              # API routes
│   │   ├── chapters/     # Get all chapters
│   │   ├── sections/     # Get all sections
│   │   ├── search/       # AI-powered search
│   │   └── seed/         # Database seeding endpoint
│   ├── chapter/          # Chapter and section pages
│   ├── components/       # React components
│   └── page.tsx          # Home page
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Full DPDP Act data
├── .env.example          # Environment variables template
└── package.json          # Dependencies
```

## 🔑 Environment Variables

The `.env.example` file includes:

```env
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="AIzaSyDKN93_KH3E9Kyd4YZQR-Ae8vLdN_hKK70"
```

Just copy it to `.env` and you're ready to go!

## 🎯 Features

### AI-Powered Search
- Natural language queries
- Contextual answers from Gemini AI
- Relevant section suggestions

### Mobile Gestures
- Swipe left/right to navigate sections
- Touch-optimized interface

### Clean UI
- Material Design 3 principles
- Dark mode ready
- Responsive layout

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Prisma + SQLite (easily switchable to PostgreSQL/MySQL)
- **Styling**: Tailwind CSS 4
- **AI**: Google Gemini API
- **Language**: TypeScript

## 📖 API Endpoints

- `GET /api/chapters` - Get all chapters with sections
- `POST /api/chapters` - Create a new chapter
- `POST /api/sections` - Create a new section
- `POST /api/search` - AI-powered search
- `GET /api/seed` - Seed database with DPDP Act content

## 🚢 Deployment Options

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Deploy
4. Visit `/api/seed` to populate database

### Hostinger VPS
See `HOSTINGER-SETUP.md` for detailed instructions.

### Other Platforms
Works on any Node.js hosting platform (Railway, Render, DigitalOcean, etc.)

## 🔧 Production Database

For production, switch from SQLite to PostgreSQL:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update `DATABASE_URL` in `.env` with your PostgreSQL connection string

3. Run migrations:
```bash
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

## 📝 License

MIT License - Feel free to use for any purpose

## 🤝 Contributing

Contributions welcome! Feel free to submit issues and pull requests.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Ready to deploy!** Just upload to GitHub and deploy to Vercel. Everything is included! 🎉
