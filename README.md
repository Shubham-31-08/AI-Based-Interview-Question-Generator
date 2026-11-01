# 🎯 Project P_112: AI-Based Interview Question Generator & Rubric Architect

> **Domain**: Education / Cross-Industry AI Tooling  
> **Tech Stack**: Python 3.10+, Streamlit, Google Gemini SDK (`google-genai`), `gemini-2.5-flash`  
> **Hardware Target**: Lightweight; tested to run smoothly on an **8GB RAM laptop** with zero local GPU overhead.  
> **Vercel Ready**: Pre-configured with `vercel.json` for global web deployment.

---

## 📌 Project Overview

**Project P_112** empowers hiring managers, technical interviewers, educators, and recruiters to rapidly construct calibrated, role-specific interview kits. In seconds, it generates:

1. **Role-Calibrated Interview Questions**: Realistic scenarios spanning Technical, Behavioral (STAR methodology), System Design, and Cross-Functional challenges.
2. **Key Concepts & Competency Checklists**: Concrete principles, keywords, and architectural nuances to listen for in candidate responses.
3. **Structured Evaluation Rubric Tables**: Clear scoring tiers (**Poor [1-2 pts]**, **Average [3 pts]**, and **Excellent [4-5 pts]**) with observable indicators and red flags to eliminate interviewer bias.
4. **Instant Export**: Export complete assessment guides as formatted **Markdown (`.md`)** or **Plain Text (`.txt`)** files.

---

## 🚀 Deploy on Vercel

The interactive React web app can be deployed to Vercel in 1 click! See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for full instructions:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/p112-interview-generator.git
git push -u origin main
```
Then import the repository at [vercel.com/new](https://vercel.com/new).

---

## 💻 Running the Streamlit App Locally (8GB RAM Friendly)

```bash
# 1. Create and activate venv
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Launch Streamlit
streamlit run app.py
```
App opens at `http://localhost:8501`.

---

## 🛠️ Standalone Bundler (`make_zip.py`)

Run `python make_zip.py` to bundle all files into `P_112_Interview_Generator.zip`.
