# Vercel Deployment Configuration for Project P_112 Web App

A production-ready deployment configuration to host the **Project P_112: AI-Based Interview Question Generator & Project Hub** on Vercel via GitHub repository integration.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The user confirmed the following choices for Vercel deployment:
> - **Target Application**: The interactive React web app with full project hub (featuring live generation simulation, code viewers, and 1-click ZIP downloads).
> - **Deployment Pathway**: Connecting a GitHub repository to the Vercel dashboard for continuous automated deployments on push.

- **Vercel Routing**: Single Page Application (SPA) rewrite rule in `vercel.json` to prevent 404 errors on browser refresh or deep links.
- **Build Output**: Clean Vite production build targeting the `dist` directory with zero server-side runtime dependencies.

---

## 1. Overview & Core Concept

- **What It Delivers**: Makes the Project P_112 web interface accessible globally on a high-speed, CDN-backed Vercel URL (`https://your-project.vercel.app`).
- **Target Audience**: Anyone visiting your public portfolio, team members accessing the project code and interview generator, and recruiters reviewing Project P_112.
- **Key Value**: One-click global availability, automated CI/CD builds on every Git push, and instant ZIP downloads directly from the hosted edge.

---

## 2. User Experience & Deployment Flow

### Step-by-Step GitHub + Vercel Deployment Flow

```
┌────────────────────────┐      ┌─────────────────────────┐      ┌────────────────────────┐
│  Local / AI Studio     │      │   GitHub Repository     │      │   Vercel Global Edge   │
│  - vercel.json added   ├─────►│   - Push to main branch ├─────►│   - Auto-builds Vite   │
│  - SPA rewrites ready  │      │   - Connect to Vercel   │      │   - Deploys to CDN     │
└────────────────────────┘      └─────────────────────────┘      └────────────────────────┘
```

1. **Local Setup & Git Commit**:
   - Add `vercel.json` with Vite framework presets and client-side route rewrites.
   - Verify `npm run build` compiles `dist/index.html` and bundled assets cleanly.
2. **Push to GitHub**:
   - Push codebase to a GitHub repository (e.g., `github.com/username/p112-interview-generator`).
3. **Import into Vercel Dashboard**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your GitHub repository.
   - Vercel automatically detects the Vite framework, `npm run build`, and `dist` output.
   - Click **Deploy**; your live URL is ready in under 30 seconds.

---

## 3. Key Technical Decisions & Trade-Offs

- **Vite SPA Routing via `vercel.json`**:
  - *Chosen Approach*: Configure `rewrites: [{ "source": "/(.*)", "destination": "/index.html" }]`.
  - *Why*: Without this rewrite rule, reloading any secondary route on static hosting returns a Vercel 404.
- **Client-Side JSZip Bundling**:
  - *Chosen Approach*: Keep the ZIP packaging entirely client-side using `jszip`.
  - *Why*: Eliminates the need for a persistent Node.js or Python backend on Vercel, allowing the site to run on Vercel's zero-cost, ultra-fast static tier with infinite scale.
- **Dedicated `VERCEL_DEPLOYMENT.md` Guide**:
  - *Chosen Approach*: Provide a standalone guide detailing the exact terminal commands and Vercel UI steps for beginners.

---

## 4. Technical Architecture & File Strategy

```
P_112_Repository/
├── vercel.json                 # NEW: Vercel routing, framework, & header rules
├── VERCEL_DEPLOYMENT.md        # NEW: Clear step-by-step GitHub-to-Vercel guide
├── package.json                # Vite build script & dependencies
├── vite.config.ts              # Vite configuration with Tailwind CSS plugin
├── index.html                  # HTML entry point with meta tags & Google fonts
├── src/
│   ├── App.tsx                 # Main web app with Deploy guidance tab
│   ├── data/projectFiles.ts    # Embedded deliverables for 1-click ZIP download
│   └── index.css               # Tailwind CSS styles
├── app.py                      # Python Streamlit application deliverable
├── requirements.txt            # Python requirements deliverable
├── README.md                   # Project documentation deliverable
└── make_zip.py                 # Standalone Python bundler deliverable
```

### Proposed Action Items
1. Create `vercel.json` with proper Vite configuration and SPA routing.
2. Create `VERCEL_DEPLOYMENT.md` with beginner-friendly instructions for linking GitHub to Vercel.
3. Test production build (`npm run build`) to ensure zero bundling errors.
4. Add a "Deploy to Vercel" quick guide in the web app UI for instant reference.
