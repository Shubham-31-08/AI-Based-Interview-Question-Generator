# 🚀 Deploying Project P_112 to Vercel

This guide walks you through deploying the **Project P_112: AI-Based Interview Question Generator & Project Hub** to Vercel using your GitHub repository.

---

## ⚡ Quick Summary

- **Framework**: Vite + React + Tailwind CSS
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Configuration File**: `vercel.json` (Pre-configured with Single Page Application rewrites)
- **Deployment Cost**: 100% Free on Vercel Hobby Tier

---

## 📋 Prerequisites

1. A free [GitHub Account](https://github.com/).
2. A free [Vercel Account](https://vercel.com/signup) (sign in with your GitHub account for 1-click integration).
3. [Git](https://git-scm.com/) installed on your computer.

---

## 🛠️ Step-by-Step Deployment (GitHub + Vercel Dashboard)

### Step 1: Initialize Git in Your Project Directory
Open your terminal inside the project directory:

```bash
# Initialize git repository (if not already initialized)
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit of Project P_112 Interview Generator"
```

### Step 2: Push Your Code to GitHub

1. Go to [github.com/new](https://github.com/new) and create a new repository (e.g. `p112-interview-generator`).
2. Do **not** initialize it with a README, .gitignore, or license (they are already included in this project).
3. Copy the repository URL and run the following in your terminal:

```bash
# Set default branch to main
git branch -M main

# Link your local repository to your GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/p112-interview-generator.git

# Push code to GitHub
git push -u origin main
```

---

### Step 3: Import into Vercel

1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click the **Add New...** button in the top right corner and choose **Project**.
3. Under **Import Git Repository**, find your `p112-interview-generator` repository and click **Import**.
4. Vercel will automatically detect the project settings from `vercel.json`:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.

---

### Step 4: Your App is Live! 🎉

Within ~20–30 seconds, Vercel will build and publish your project globally. You will receive a live production URL:
```
https://p112-interview-generator.vercel.app
```

Every time you `git push` to your `main` branch, Vercel will automatically rebuild and deploy your updates with zero downtime!

---

## 🔧 Alternative Method: Fast Deploy via Vercel CLI

If you prefer to deploy directly from your terminal without opening the browser:

```bash
# 1. Install Vercel CLI globally
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to production
vercel --prod
```

---

*Project P_112 · Education / Cross-Industry AI Tooling*
