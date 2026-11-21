# ⚖️ HeLaw Backend - AI-Powered Legal & Regulatory Guide for MSMEs

[![Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-blue?logo=google-gemini&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Express](https://img.shields.io/badge/Backend-Express%20%2B%20TypeScript-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Frontend Repo](https://img.shields.io/badge/Frontend%20Repo-Helaw--frontend-646CFF?logo=github&logoColor=white)](https://github.com/madpy-og/Helaw-frontend)
[![Swagger](https://img.shields.io/badge/Docs-Swagger%20OpenAPI-85EA2D?logo=swagger&logoColor=black)](https://swagger.io/)
[![Docker](https://img.shields.io/badge/Deployment-Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)

🚀 **Live Demo:** [helaw.vercel.app](https://helaw.vercel.app/)  
🔗 **Frontend SPA Repository:** [github.com/madpy-og/Helaw-frontend](https://github.com/madpy-og/Helaw-frontend)

**HeLaw Backend** (Helper Law) is the core RESTful API service powering **HeLaw**, an AI-powered legal assistant platform designed specifically to guide Micro, Small, and Medium Enterprises (MSMEs) in Indonesia.

The service provides secure authentication, conversation session management, multimodal document ingestion (PDFs and images via Cloudinary), and deep legal reasoning powered by **Google Gemini 2.5 Flash** (`@google/genai`), delivering structured **Actionable Insights** (To-Do, Prohibitions, and Sanctions) for Indonesian business compliance.

> [!NOTE]
> This repository contains the **Backend API** service. The user-facing client application is maintained in [**madpy-og/Helaw-frontend**](https://github.com/madpy-og/Helaw-frontend).

---

## ✨ Key Features

- **💬 Multi-Turn Legal Consultation**
  Maintains conversation context by automatically injecting recent chat history into Gemini 2.5 Flash for natural, context-aware legal advice.
- **📄 Multimodal Document & Image Analysis**
  Supports uploads of up to 5 document attachments per message (PDF, JPG, PNG) stored on Cloudinary and analyzed directly by Gemini's multimodal capabilities.
- **🎯 Structured Actionable Insights (JSON Format)**
  Enforces structured JSON outputs from the LLM containing:
  - **To Do**: Concrete actionable steps for MSME compliance.
  - **Prohibitions**: Crucial practices to avoid according to Indonesian regulations.
  - **Sanctions**: Legal penalties and administrative consequences for non-compliance.
- **🔐 Secure JWT Cookie Authentication**
  Session authentication using JSON Web Tokens (JWT) stored in *HTTP-Only & SameSite Cookies* with password hashing via `bcryptjs`.
- **📚 Interactive API Documentation (Swagger OpenAPI 3.0)**
  Built-in Swagger UI accessible at `/api-docs` generated from JSDoc specifications for seamless endpoint inspection and testing.
- **🚀 Rate Limiting & Security Guardrails**
  Granular protection using `express-rate-limit` against brute-force attacks on auth routes and spamming on AI generation endpoints.

---

## 🛠️ Tech Stack & Dependencies

| Technology | Purpose |
| :--- | :--- |
| **Node.js & Express.js** | Fast, minimal web application framework and RESTful API runtime. |
| **TypeScript & ts-node-dev** | Type-safe backend development with instant hot-reloading. |
| **PostgreSQL & PG Pool** | Relational database client with connection pooling for high concurrency. |
| **Google Gen AI SDK (`@google/genai`)** | Official Google Gen AI SDK integrating **Gemini 2.5 Flash**. |
| **Cloudinary SDK** | Cloud media storage for uploaded documents and images. |
| **Multer & Streamifier** | Multipart form-data handling with direct memory streaming to Cloudinary. |
| **JSONWebToken & Cookie-Parser** | Secure session management via HTTP-Only cookies. |
| **Bcrypt.js** | Strong one-way password hashing for user credentials. |
| **Express Rate Limit** | Rate limiting middleware to prevent abuse on sensitive endpoints. |
| **Swagger UI Express & swagger-jsdoc** | OpenAPI 3.0 documentation served dynamically at `/api-docs`. |

---

## 🗄️ Database Schema

HeLaw uses a PostgreSQL relational database (compatible with **Supabase** or standalone PostgreSQL instances):

```mermaid
erDiagram
    users ||--o{ conversations : "owns"
    conversations ||--o{ messages : "contains"
    messages ||--o{ documents : "attaches"

    users {
        uuid id PK
        string name
        string email UK
        string password_hash
        timestamp created_at
    }

    conversations {
        uuid id PK
        uuid user_id FK
        string title
        timestamp created_at
        timestamp updated_at
    }

    messages {
        uuid id PK
        uuid conversation_id FK
        string role "user / ai"
        text content
        jsonb actionable_insights
        timestamp created_at
    }

    documents {
        uuid id PK
        uuid message_id FK
        string file_url
        string file_type "pdf / image"
        string file_name
        timestamp created_at
    }
```

---

## 📁 Project Structure

```text
Helaw-backend/
├── src/
│   ├── config/             # DB connection (pg Pool), Cloudinary, and Swagger configs
│   │   ├── cloudinary.ts   # Cloudinary client initialization
│   │   ├── db.ts           # PostgreSQL connection pool
│   │   └── swagger.ts      # OpenAPI/Swagger JSDoc definition
│   ├── controllers/        # Request handlers & business logic
│   │   ├── authController.ts
│   │   ├── conversationController.ts
│   │   └── messageController.ts
│   ├── middlewares/        # Custom Express middlewares
│   │   ├── authMiddleware.ts # JWT verification from HTTP-only cookie
│   │   └── rateLimiter.ts    # Rate limiters for auth & message endpoints
│   ├── models/             # Database access layers & table schemas
│   │   ├── userModel.ts
│   │   ├── conversationModel.ts
│   │   ├── messageModel.ts
│   │   ├── documentModel.ts
│   │   └── index.ts
│   ├── routes/             # API route declarations
│   │   ├── authRoutes.ts
│   │   ├── conversationRoutes.ts
│   │   └── messageRoutes.ts
│   ├── services/           # External service integrations
│   │   └── geminiService.ts# Gemini 2.5 Flash prompt orchestration & insights parser
│   ├── server.ts           # Express application initialization & middleware setup
│   └── setup.ts            # Database table creation script
├── .env.example            # Environment variables template
├── package.json            # Node.js dependencies & scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Backend documentation
```

---

## 🚀 Installation & Setup Guide

### Prerequisites

Ensure you have the following installed and set up:
- [Node.js](https://nodejs.org/) (v18+ LTS recommended)
- [PostgreSQL](https://www.postgresql.org/) (or a free [Supabase](https://supabase.com/) project)
- [Cloudinary Account](https://cloudinary.com/) (Cloud Name, API Key, API Secret)
- [Google Gemini API Key](https://aistudio.google.com/) from Google AI Studio

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/madpy-og/Helaw-backend.git
cd Helaw-backend
```

---

### Step 2: Install Dependencies

```bash
npm install
```

---

### Step 3: Configure Environment Variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Open `.env` and configure the following variables:

```env
# POSTGRESQL CONNECTION STRING
DATABASE_URL="postgresql://postgres.your-supabase-db-id:your-password@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# CLOUDINARY CREDENTIALS
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

# GOOGLE GEMINI AI KEY
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere..."

# AUTH CONFIGURATION
JWT_SECRET="generate_a_very_long_secure_secret_string_here"

# CLIENT URL CONFIGURATION (FOR CORS & COOKIES)
CLIENT_URL="http://localhost:5173"
PORT=3000
```

---

### Step 4: Initialize Database Tables

Run the automated table setup script to create the `users`, `conversations`, `messages`, and `documents` tables:

```bash
npx ts-node src/setup.ts
```

---

### Step 5: Run the Server

**Development Mode (Hot Reload):**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
npm start
```

*The server will be available at: `http://localhost:3000`*  
*Interactive Swagger documentation: `http://localhost:3000/api-docs`*

---

## 🐳 Docker Deployment Guide (VPS)

Deploying HeLaw Backend on a VPS using Docker & Docker Compose:

### 1. Clone & Environment Configuration on VPS

```bash
git clone https://github.com/madpy-og/Helaw-backend.git
cd Helaw-backend

# Create and populate production .env
cp .env.example .env
nano .env
```

Make sure `CLIENT_URL` is set to your production frontend domain (e.g. `https://helaw.vercel.app` or custom domain) and `DATABASE_URL` is configured.

### 2. Build and Start Container

Using **Docker Compose** (Recommended):
```bash
# Build image and run in detached mode
docker compose up -d --build
```

Or using **Standalone Docker**:
```bash
# Build Docker image
docker build -t helaw-backend .

# Run container with environment file
docker run -d \
  --name helaw-backend \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  helaw-backend
```

### 3. Initialize Database Tables inside Container

If you haven't initialized your PostgreSQL tables yet, run the database setup script directly inside the running container:

```bash
# Using Docker Compose:
docker compose exec backend node dist/setup.js

# Or using Docker CLI:
docker exec -it helaw-backend node dist/setup.js
```

### 4. Useful Docker Management Commands

```bash
# View real-time logs
docker compose logs -f

# Check container status
docker compose ps

# Restart the application
docker compose restart

# Stop the container
docker compose down

# Rebuild after updating code (git pull)
git pull origin main
docker compose up -d --build
```

---

## 🔌 API Endpoints Structure (Swagger OpenAPI)

Access `/api-docs` when running the server for interactive documentation and request testing:

### 🔑 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new MSME user account *(Rate Limited)* | No |
| `POST` | `/api/auth/login` | Authenticate and set JWT in HTTP-Only cookie *(Rate Limited)* | No |
| `POST` | `/api/auth/logout` | Clear the JWT session cookie | Yes |
| `GET` | `/api/auth/me` | Get profile details of the authenticated user | Yes |
| `PUT` | `/api/auth/me` | Update user name and email | Yes |

### 💬 Chat Sessions (`/api/conversations`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/conversations` | Get paginated chat history for the user | Yes |
| `POST` | `/api/conversations` | Create a new session (auto-titles from prompt) | Yes |
| `GET` | `/api/conversations/:id` | Get conversation details with paginated messages | Yes |
| `PUT` | `/api/conversations/:id` | Rename a conversation title | Yes |
| `DELETE` | `/api/conversations/:id` | Delete a conversation and all attached messages | Yes |

### ✉️ Messaging & AI Integration (`/api/conversations/:id/messages`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/conversations/:id/messages` | Send message with up to 5 file attachments (multipart/form-data, max 10MB). Returns contextual AI advice and structured Actionable Insights *(Rate Limited)* | Yes |

---

## 🔗 Related Repositories

| Repository | Description |
| :--- | :--- |
| [**Helaw-frontend**](https://github.com/madpy-og/Helaw-frontend) | React 19, Vite, and Tailwind CSS Single Page Application (SPA). |

---

## 🔒 AI Safety & Guardrails (System Instructions)

The Gemini 2.5 Flash instance is configured with system prompt guardrails:
1. **Domain Boundary**: Strictly restricted to Indonesian legal regulations, business licensing (NIB, OSS), taxation (PPh, PPN), Halal certification, intellectual property, and MSME operations.
2. **Out of Scope Handling**: Politely declines queries unrelated to Indonesian business law (e.g., coding, general math, entertainment).
3. **Structured Response Output**: Forces an appended JSON schema containing `to_do`, `prohibitions`, and `sanctions` alongside the natural language explanation.

---

## 📄 License

This project is licensed under the **ISC License**. Feel free to use, modify, and distribute this codebase for educational or commercial purposes, provided credit is given to the original authors.

---
*Developed with love to empower Indonesian MSMEs through accessible legal and regulatory knowledge.*
