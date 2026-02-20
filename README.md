# 1Fi Full Stack Developer Assignment

A premium dynamic product page with real-time EMI calculations and variant switching.

## 🚀 Tech Stack
- **Frontend:** Next.js 15 (App Router), Tailwind CSS, Framer Motion (Animations)
- **Backend:** Next.js API Routes, Mongoose (MongoDB Atlas)
- **Validation:** React use() hook for Async Params (Next.js 15)

## 🛠️ Setup Instructions
1. Clone the repo: `git clone <your-repo-link>`
2. Install dependencies: `npm install`
3. Set `.env.local`: Add `MONGODB_URI`
4. Run: `npm run dev`
5. Seed Database: Visit `http://localhost:3000/api/seed`

## 📊 Database Schema
The product schema includes:
- **Variants:** Nested array for storage, color, and price logic.
- **EMI Plans:** Dynamic logic to calculate monthly payments based on interest rates.