# ⚖️ HeLaw - Backend API

Backend API service for **HeLaw (Helper Law)**, an AI-powered legal assistant platform for MSMEs in Indonesia.

## 🚀 Tech Stack
- **Runtime**: Node.js & TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **AI**: Google Gemini 2.5 Flash (`@google/genai`)
- **Storage**: Cloudinary
- **Authentication**: JWT stored in HTTP-Only Cookies

## 📦 Setup & Installation

1. Copy `.env.example` to `.env` and fill in the required variables:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   npm start
   ```
