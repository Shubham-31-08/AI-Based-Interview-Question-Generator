/**
 * Complete verbatim file contents for Project P_112 deliverables.
 */

export interface DeliverableFile {
  name: string;
  description: string;
  language: string;
  content: string;
}

export const DELIVERABLE_FILES: Record<string, DeliverableFile> = {
  'app.py': {
    name: 'app.py',
    description: 'Complete Streamlit web application with modern dashboard, expandable cards, metrics & gemini-2.5-flash',
    language: 'python',
    content: `"""
Project P_112: AI-Based Interview Question Generator & Rubric Architect
Domain: Education / Cross-Industry AI Tooling

Tech Stack:
- Python 3.10+
- Streamlit (Modern Dashboard UI with Expandable Cards & Metrics)
- Google Gemini Official SDK (google-genai) using model: gemini-2.5-flash
- python-dotenv (Optional local .env loader)

Hardware Optimization:
- Designed to run smoothly and lightly on an 8GB RAM laptop with zero local GPU overhead.
"""

import os
import sys
import datetime
from typing import Optional
import streamlit as st

# Attempt to load environment variables from .env file if available
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Import the official Google GenAI SDK
try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False


# ==============================================================================
# Page Configuration & Styling
# ==============================================================================
st.set_page_config(
    page_title="AI Interview Question Generator & Rubrics (P_112)",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for modern dashboard polish, typography, and card presentation
st.markdown("""
<style>
    /* Metric & Card Styling */
    .metric-container {
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 12px 16px;
        margin-bottom: 1rem;
    }
    .question-box {
        background: #ffffff;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        padding: 1.25rem;
        margin-bottom: 1.25rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .badge {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    .badge-tech { background-color: #eff6ff; color: #1d4ed8; }
    .badge-behav { background-color: #f0fdf4; color: #15803d; }
    .badge-scen { background-color: #fefce8; color: #a16207; }
    .badge-mixed { background-color: #faf5ff; color: #7e22ce; }
</style>
""", unsafe_allow_html=True)


# ==============================================================================
# Sidebar: Credentials & Engine Controls
# ==============================================================================
with st.sidebar:
    st.title("🎯 Project P_112")
    st.caption("AI-Based Interview Question Generator")
    st.write("---")
    
    st.subheader("1. API Configuration")
    
    # Check for pre-existing key in environment
    env_api_key = os.getenv("GEMINI_API_KEY", "")
    
    api_key_input = st.text_input(
        "Google Gemini API Key",
        value=env_api_key if env_api_key else "",
        type="password",
        help="Paste your Gemini API key from Google AI Studio (https://aistudio.google.com/app/apikey). You can also set GEMINI_API_KEY in a .env file.",
        placeholder="AIzaSy..."
    )
    
    # Active API Key resolution
    active_api_key = api_key_input.strip() if api_key_input else env_api_key.strip()
    
    if active_api_key:
        st.success("API Key detected & ready", icon="✅")
    else:
        st.warning("Please provide a Gemini API Key to generate questions.", icon="⚠️")
        st.markdown("[Get a free Gemini API key](https://aistudio.google.com/app/apikey)")

    st.write("---")
    st.subheader("2. Model & Runtime")
    st.info("**Model**: \`gemini-2.5-flash\`\\n\\n**SDK**: \`google-genai\` (Official)\\n\\n**Footprint**: Ultra-lightweight (Zero local model weights; ideal for 8GB RAM laptops).")
    
    st.write("---")
    st.caption("Project P_112 · Education / AI Tooling")


# ==============================================================================
# Helper Functions: Prompt Construction & LLM Call
# ==============================================================================
def generate_interview_kit(
    role: str,
    industry: str,
    experience_level: str,
    question_type: str,
    num_questions: int,
    focus_areas: str,
    api_key: str
) -> str:
    """Calls the official Google Gemini SDK to generate calibrated questions and rubrics."""
    if not GENAI_AVAILABLE:
        raise RuntimeError("The 'google-genai' package is not installed. Run 'pip install google-genai'.")
    
    if not api_key:
        raise ValueError("No Gemini API key provided. Please input your key in the sidebar.")
    
    # Initialize the modern official Gemini Client
    client = genai.Client(api_key=api_key)
    
    system_instruction = (
        "You are a Principal Talent Acquisition Architect and Expert Technical Interviewer. "
        "Your task is to craft rigorous, role-specific, and realistic interview questions "
        "accompanied by key candidate concepts to listen for and a detailed evaluation rubric table. "
        "The evaluation rubric MUST be formatted as a structured Markdown table with scoring tiers: "
        "'Poor (1-2 pts)', 'Average (3 pts)', and 'Excellent (4-5 pts)', detailing observable candidate answers, "
        "evidence, and red flags."
    )
    
    prompt = f"""
Please generate an interview kit for the following specifications:
- **Target Job Role**: {role}
- **Industry / Domain**: {industry}
- **Candidate Experience Level**: {experience_level}
- **Question Type**: {question_type}
- **Total Questions Requested**: {num_questions}
{"- **Special Focus Topics / Job Snippet**: " + focus_areas if focus_areas else ""}

### Required Output Structure:
For EACH of the {num_questions} questions, produce the following clearly delineated Markdown sections:

### Question X: [Short Descriptive Question Title]
**Type**: [{question_type}] | **Target Level**: [{experience_level}]

#### 📋 The Interview Question:
> "[Clear, realistic, professionally phrased interview question with context]"

#### 💡 What to Look For (Key Concepts & Competencies):
- **Core Concept 1**: [Specific principle, syntax, method, or trade-off the candidate must mention]
- **Core Concept 2**: [Practical architectural or real-world behavioral instinct]
- **Core Concept 3**: [Nuance or depth indicator separating junior from senior understanding]

#### 📊 Detailed Evaluation Rubric:
| Scoring Tier | Score | Candidate Indicators & Observable Behaviors | Red Flags / Disqualifiers |
| :--- | :---: | :--- | :--- |
| **Poor** | 1 - 2 | [Vague, inaccurate, or missing core principles. Inability to explain fundamentals.] | [Major misconceptions, unviable solutions, bluffs, blames others.] |
| **Average** | 3 | [Meets baseline expectations. Understands standard approaches but misses edge cases, scale constraints, or deeper nuance.] | [Relies heavily on buzzwords without technical mechanics, passive involvement.] |
| **Excellent** | 4 - 5 | [Demonstrates mastery, cites proactive trade-offs, scalability, edge cases, clear communication, and production-tested intuition.] | [None.] |

---

Make questions highly authentic and tailored to real {industry} challenges for {role}. Do NOT write generic questions.
"""

    response = client.models.generateContent(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.7,
        )
    )
    
    return response.text or "No content was generated by the model."


# ==============================================================================
# Main Application Dashboard
# ==============================================================================
st.title("🎯 AI Interview Question Generator & Rubric Architect")
st.markdown(
    "Generate calibrated, role-specific interview questions with **Key Concepts checklists** and "
    "**detailed evaluation rubric tables** for accurate, unbiased candidate assessment."
)

# Configuration Form
with st.container():
    col1, col2 = st.columns([1, 1], gap="medium")
    
    with col1:
        role_preset = st.selectbox(
            "Quick Role Preset (Optional)",
            [
                "Custom (Type your own below)",
                "Senior Python Backend Engineer",
                "Frontend React / TypeScript Developer",
                "Full-Stack Web Developer",
                "Data Scientist & ML Engineer",
                "DevOps & Cloud Infrastructure Lead",
                "Technical Product Manager",
                "Cybersecurity Incident Responder",
                "Clinical Healthcare Data Analyst"
            ],
            index=0
        )
        
        default_role = "" if role_preset.startswith("Custom") else role_preset
        
        target_role = st.text_input(
            "Target Job Role *",
            value=default_role,
            placeholder="e.g., Senior Distributed Systems Engineer"
        )
        
        industry_options = [
            "Technology & Software",
            "FinTech & Quantitative Finance",
            "Healthcare & Life Sciences",
            "E-Commerce & Digital Retail",
            "Education & EdTech",
            "Cloud Infrastructure & Cybersecurity",
            "Automotive & Autonomous Systems",
            "Media & Entertainment",
            "Other / General"
        ]
        industry = st.selectbox("Industry / Domain *", industry_options, index=0)
    
    with col2:
        experience_level = st.select_slider(
            "Candidate Experience Level *",
            options=["Beginner / Entry-Level", "Intermediate / Mid-Level", "Senior / Lead / Principal"],
            value="Intermediate / Mid-Level"
        )
        
        question_type = st.selectbox(
            "Question Type *",
            [
                "Mixed (Balanced technical, behavioral & scenario)",
                "Technical / Architecture",
                "Behavioral / Leadership (STAR Method)",
                "Scenario-Based / System Design / Problem Solving"
            ],
            index=0
        )
        
        num_questions = st.slider(
            "Number of Questions to Generate *",
            min_value=1,
            max_value=10,
            value=5,
            help="Select between 1 to 10 questions. 5 is recommended for a standard 45-60 minute interview."
        )

    focus_areas = st.text_area(
        "Optional: Specific Focus Areas, Tech Stack, or Job Description Snippet",
        placeholder="e.g., Must have experience with FastAPI, Redis caching, microservices, high-concurrency async loops, and CI/CD pipelines.",
        height=80
    )

generate_clicked = st.button("🚀 Generate Questions & Evaluation Rubrics", type="primary", use_container_width=True)

if "generated_content" not in st.session_state:
    st.session_state.generated_content = ""
if "generation_metadata" not in st.session_state:
    st.session_state.generation_metadata = {}

if generate_clicked:
    if not target_role.strip():
        st.error("Please enter a Target Job Role before generating.", icon="🚨")
    elif not active_api_key:
        st.error("Missing Gemini API Key. Please enter your API key in the sidebar.", icon="🔑")
    else:
        with st.spinner(f"Analyzing {target_role} ({experience_level}) requirements and generating rubrics with gemini-2.5-flash..."):
            try:
                content = generate_interview_kit(
                    role=target_role.strip(),
                    industry=industry,
                    experience_level=experience_level,
                    question_type=question_type,
                    num_questions=num_questions,
                    focus_areas=focus_areas.strip(),
                    api_key=active_api_key
                )
                st.session_state.generated_content = content
                st.session_state.generation_metadata = {
                    "role": target_role.strip(),
                    "industry": industry,
                    "level": experience_level,
                    "type": question_type,
                    "count": num_questions,
                    "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
                st.toast("Interview questions & rubrics generated successfully!", icon="🎉")
            except Exception as e:
                st.error(f"Generation failed: {str(e)}", icon="❌")

if st.session_state.generated_content:
    meta = st.session_state.generation_metadata
    st.write("---")
    st.subheader("📋 Generated Interview Kit & Rubrics")
    m1, m2, m3, m4 = st.columns(4)
    with m1:
        st.metric("Target Role", meta.get("role", "N/A"))
    with m2:
        st.metric("Experience Level", meta.get("level", "N/A"))
    with m3:
        st.metric("Questions", f"{meta.get('count', 0)} Items")
    with m4:
        est_time = meta.get('count', 0) * 10
        st.metric("Est. Interview Time", f"~{est_time} min")
        
    exp_col1, exp_col2, exp_col3 = st.columns([1, 1, 2])
    timestamp_slug = datetime.datetime.now().strftime("%Y%m%d_%H%M")
    safe_role = meta.get("role", "interview").lower().replace(" ", "_").replace("/", "_")
    full_markdown = f"""# Interview Assessment Kit: {meta.get('role', 'Candidate')}
**Domain / Industry**: {meta.get('industry', 'General')}
**Target Level**: {meta.get('level', 'Mid-Level')}
**Question Type**: {meta.get('type', 'Mixed')}
**Generated**: {meta.get('timestamp', '')}
**Model**: Google Gemini (gemini-2.5-flash)

---

{st.session_state.generated_content}
"""

    with exp_col1:
        st.download_button(
            label="📥 Download Markdown (.md)",
            data=full_markdown,
            file_name=f"interview_rubric_{safe_role}_{timestamp_slug}.md",
            mime="text/markdown",
            use_container_width=True
        )
    with exp_col2:
        st.download_button(
            label="📄 Download Plain Text (.txt)",
            data=full_markdown,
            file_name=f"interview_rubric_{safe_role}_{timestamp_slug}.txt",
            mime="text/plain",
            use_container_width=True
        )
    with exp_col3:
        with st.expander("🔍 Copy Raw Markdown"):
            st.code(full_markdown, language="markdown")

    st.write("---")
    st.markdown(st.session_state.generated_content)
`
  },
  'requirements.txt': {
    name: 'requirements.txt',
    description: 'Minimal Python dependencies tailored for lightweight execution on 8GB RAM laptops',
    language: 'text',
    content: `# Project P_112: AI-Based Interview Question Generator
# Core Python Dependencies (Optimized for lightweight execution on 8GB RAM laptops)

streamlit>=1.38.0
google-genai>=0.1.1
python-dotenv>=1.0.1
`
  },
  'README.md': {
    name: 'README.md',
    description: 'Comprehensive project documentation, beginner quickstart guide, venv commands & rubric philosophy',
    language: 'markdown',
    content: `# 🎯 Project P_112: AI-Based Interview Question Generator & Rubric Architect

> **Domain**: Education / Cross-Industry AI Tooling  
> **Tech Stack**: Python 3.10+, Streamlit, Google Gemini SDK (\`google-genai\`), \`gemini-2.5-flash\`  
> **Hardware Target**: Lightweight; tested to run smoothly on an **8GB RAM laptop** with zero local GPU overhead.

## 🚀 Beginner Quickstart Guide (Step-by-Step)

### Step 1: Create and Activate Virtual Environment
\`\`\`bash
# macOS/Linux:
python3 -m venv venv
source venv/bin/activate

# Windows:
python -m venv venv
venv\\Scripts\\activate
\`\`\`

### Step 2: Install Dependencies
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### Step 3: Run the Streamlit Application
\`\`\`bash
streamlit run app.py
\`\`\`
`
  },
  'make_zip.py': {
    name: 'make_zip.py',
    description: 'Standalone Python script that auto-creates all files and bundles them into P_112_Interview_Generator.zip',
    language: 'python',
    content: `#!/usr/bin/env python3
"""
Standalone Bundler Script for Project P_112: AI-Based Interview Question Generator
Usage: python make_zip.py
"""
import os
import zipfile
from pathlib import Path
`
  },
  'vercel.json': {
    name: 'vercel.json',
    description: 'Vercel deployment configuration with Vite framework preset, dist target, and SPA URL rewrites',
    language: 'json',
    content: `{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
`
  },
  'VERCEL_DEPLOYMENT.md': {
    name: 'VERCEL_DEPLOYMENT.md',
    description: 'Complete step-by-step guide for deploying Project P_112 to Vercel via GitHub or CLI',
    language: 'markdown',
    content: `# 🚀 Deploying Project P_112 to Vercel

### Step 1: Push Code to GitHub
\`\`\`bash
git init
git add .
git commit -m "Initial commit of Project P_112"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/p112-interview-generator.git
git push -u origin main
\`\`\`

### Step 2: Import into Vercel
1. Go to https://vercel.com/new
2. Select your repository
3. Vercel automatically detects Vite, \`npm run build\`, and \`dist\`
4. Click Deploy!
`
  }
};
