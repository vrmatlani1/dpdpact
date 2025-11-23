# DPDP Act Website

A modern web application for browsing the Digital Personal Data Protection Act, 2023 with AI-powered search functionality.

## Features

- 📖 **Complete DPDP Act Content**: Full text of all chapters and sections
- 🔍 **AI-Powered Search**: Gemini AI integration for intelligent search and answers
- 📱 **Mobile Responsive**: Optimized for all devices with swipe gestures
- 🎨 **Material Design 3**: Clean, modern UI following Google's design principles
- ⚡ **Fast Navigation**: Dedicated pages for each section with prev/next navigation
- 🌙 **Dark Mode Ready**: Built with theme support

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Prisma with SQLite (easily switchable to PostgreSQL/MySQL)
- **Styling**: Tailwind CSS 4
- **AI**: Google Gemini API
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone this repository or download the ZIP file
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="your-gemini-api-key-here"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Deploy to Vercel (Recommended)

1. Push this code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variable: `GEMINI_API_KEY`
5. Deploy!

### Deploy to Other Platforms

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to:
- Vercel
- Hostinger VPS
- Other Node.js hosting platforms

## Project Structure

```
dpdp-act/
├── app/
│   ├── api/              # API routes
│   │   ├── chapters/     # Chapter CRUD endpoints
│   │   ├── search/       # AI search endpoint
│   │   └── sections/     # Section CRUD endpoints
│   ├── chapter/          # Chapter and section pages
│   ├── components/       # React components
│   │   ├── GestureWrapper.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SearchDialog.tsx
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   ├── globals.css       # Global styles with MD3 tokens
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding script
├── lib/
│   └── prisma.ts         # Prisma client singleton
└── public/               # Static assets
```

## Key Features Explained

### AI-Powered Search
The search functionality uses Google's Gemini AI to provide contextual answers based on the DPDP Act content. When you search, it:
1. Finds relevant sections using keyword matching
2. Sends the context to Gemini AI
3. Returns an AI-generated summary along with relevant sections

### Mobile Gestures
On mobile devices, you can swipe left/right to navigate between sections, providing a native app-like experience.

### Typography & Readability
- 1.5 line spacing for better readability
- Justified text alignment
- Proper paragraph spacing
- Material Design 3 typography scale

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Database connection string | Yes |
| `GEMINI_API_KEY` | Google Gemini API key for AI search | Yes |

## Database

The project uses Prisma ORM with SQLite by default. For production, consider switching to PostgreSQL or MySQL:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update your `DATABASE_URL` in `.env`
3. Run migrations: `npx prisma migrate deploy`

## Contributing

This is a demonstration project for the DPDP Act. Feel free to fork and customize for your needs.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- DPDP Act content from official government sources
- Built with Next.js and Vercel
- AI powered by Google Gemini
- UI inspired by Material Design 3

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for better access to legal information
