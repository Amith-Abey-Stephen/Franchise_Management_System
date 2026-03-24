# Franchise Management Web App (Unified)

A single-repo solution combining the **Next.js Frontend** and **Integrated Backend API Routes** for a complete, serverless-ready experience.

## 🛠️ Technology Stack
- **NEXT.JS 16** (App Router)
- **React 19** (RSC Support)
- **Mongoose / MongoDB** (Persistence)
- **Tailwind CSS** (Styling)
- **JWT / Bcryptjs** (Security)

## 📁 Key Directories
- `src/app/api`: All integrated backend endpoints.
- `src/lib/models`: Shared Mongoose models.
- `src/lib/mongodb.ts`: Database connection management.
- `src/lib/auth.ts`: Authentication and JWT utilities.

## 🚀 Environment Variables (`.env.local`)
Create a file at `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=/api
MONGO_URI=mongodb+srv://...
JWT_SECRET=supersecret
JWT_EXPIRES_IN=1d
```

## 📜 Development Scripts
- `npm run dev`: Start the unified dev server.
- `npm run build`: Production bundle including API routes.
- `npm run start`: Production server.
- **`npm run seed`**: Populate database with roles and test organizations.

## 🚀 Hosting
This folder contains the complete, standalone application. It's fully compatible with **Vercel** and other Next.js providers.

---
*Unified and Migrated on March 25, 2026.*
