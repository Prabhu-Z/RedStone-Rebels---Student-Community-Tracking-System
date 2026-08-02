# 🌐 Free Cloud Deployment Guide for SCTS

> **Complete Step-by-Step Guide to Deploying SCTS (Spring Boot Backend + React Frontend) to Free Cloud Services (Vercel, Render, Railway, Docker).**

---

## 📑 Deployment Architecture

- **Frontend Hosting (Free & Instant)**: Vercel or Netlify (Deploys the static React `frontend/dist` bundle).
- **Backend Hosting (Free)**: Render or Railway (Deploys `Dockerfile` or Spring Boot `scts-backend-1.0.0.jar`).
- **Database**: Embedded H2 database (`jdbc:h2:mem:sctsdb`) runs automatically inside the backend.

---

## ⚡ Option 1: 1-Click Free Cloud Deployment (Recommended)

### 1️⃣ Deploy Frontend to Vercel (Free 1-Click)
1. Go to [Vercel.com](https://vercel.com) and sign in with your GitHub account.
2. Click **New Project** and import your GitHub repository:
   `RedStone-Rebels---Student-Community-Tracking-System`
3. Configure the deployment settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. Vercel will give you a live production URL (e.g. `https://scts-frontend.vercel.app`)!

---

### 2️⃣ Deploy Backend to Render (Free 1-Click)
1. Go to [Render.com](https://render.com) and sign in with GitHub.
2. Click **New +** ➔ Select **Web Service**.
3. Connect your GitHub repository.
4. Select **Docker** environment (or set build command: `cd backend && ./mvnw clean package -DskipTests` and start command `java -jar backend/target/scts-backend-1.0.0.jar`).
5. Set Instance Type to **Free**.
6. Click **Create Web Service**. Render will deploy your Spring Boot backend to a live URL (e.g. `https://scts-backend.onrender.com`)!

---

## 📦 Option 2: Docker Container Deployment

If you want to run SCTS inside Docker anywhere (Local, AWS EC2, DigitalOcean, Azure):

1. Build the production Docker image:
   ```bash
   docker build -t scts-platform .
   ```
2. Run the Docker container:
   ```bash
   docker run -d -p 8080:8080 --name scts-app scts-platform
   ```
3. Open `http://localhost:8080` in your browser.

---

## 📁 Pre-Built Production Bundles Generated

Both backend and frontend production builds have been compiled and verified:

| Layer | Production Output Artifact | Location |
| :--- | :--- | :--- |
| **Spring Boot Backend** | `scts-backend-1.0.0.jar` (Standalone Runnable Archive) | [backend/target/scts-backend-1.0.0.jar](file:///C:/Users/prabh/.gemini/antigravity/scratch/scts/backend/target/scts-backend-1.0.0.jar) |
| **React Vite Frontend** | Static Asset Bundle (`dist/index.html`, `assets/`) | [frontend/dist/](file:///C:/Users/prabh/.gemini/antigravity/scratch/scts/frontend/dist) |
