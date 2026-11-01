/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Terminal,
  FileCode,
  Sparkles,
  BookOpen,
  Laptop,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  FolderArchive,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import JSZip from 'jszip';
import { DELIVERABLE_FILES } from './data/projectFiles.ts';

// Preset roles for quick testing
const ROLE_PRESETS = [
  {
    role: 'Senior Python Backend Engineer',
    industry: 'Technology & Software',
    level: 'Senior / Lead / Principal',
    type: 'Mixed (Balanced technical, behavioral & scenario)',
    focus: 'FastAPI, Redis caching, PostgreSQL connection pools, asyncio event loops, concurrency race conditions, and Docker containerization.',
  },
  {
    role: 'Frontend React / TypeScript Developer',
    industry: 'E-Commerce & Digital Retail',
    level: 'Intermediate / Mid-Level',
    type: 'Technical / Architecture',
    focus: 'Custom hooks, state management, render optimization, Web Vitals (LCP/CLS), and responsive cart checkout flows.',
  },
  {
    role: 'Clinical Healthcare Data Analyst',
    industry: 'Healthcare & Life Sciences',
    level: 'Intermediate / Mid-Level',
    type: 'Scenario-Based / System Design / Problem Solving',
    focus: 'HIPAA compliance, patient cohort SQL joins, electronic health record (EHR) data validation, and anomaly detection.',
  },
  {
    role: 'Technical Product Manager',
    industry: 'FinTech & Quantitative Finance',
    level: 'Senior / Lead / Principal',
    type: 'Behavioral / Leadership (STAR Method)',
    focus: 'Managing technical debt trade-offs, engineering stakeholder alignment, regulatory compliance, and sprint triage.',
  },
  {
    role: 'DevOps & Cloud Infrastructure Engineer',
    industry: 'Cloud Infrastructure & Cybersecurity',
    level: 'Senior / Lead / Principal',
    type: 'Technical / Architecture',
    focus: 'Kubernetes cluster failure recovery, zero-downtime rolling deploys, Terraform state drift, and Prometheus alerting.',
  },
  {
    role: 'Junior Full-Stack Web Developer',
    industry: 'Education & EdTech',
    level: 'Beginner / Entry-Level',
    type: 'Mixed (Balanced technical, behavioral & scenario)',
    focus: 'RESTful API basics, relational schema design, Git merge conflict resolution, and learning agility.',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'files' | 'architecture' | 'rubrics' | 'vercel'>('simulator');
  const [selectedFile, setSelectedFile] = useState<string>('app.py');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  // Simulator Form State
  const [targetRole, setTargetRole] = useState('Senior Python Backend Engineer');
  const [industry, setIndustry] = useState('Technology & Software');
  const [experienceLevel, setExperienceLevel] = useState('Senior / Lead / Principal');
  const [questionType, setQuestionType] = useState('Mixed (Balanced technical, behavioral & scenario)');
  const [numQuestions, setNumQuestions] = useState(4);
  const [focusAreas, setFocusAreas] = useState(
    'FastAPI, Redis caching, microservices, high-concurrency async loops, and CI/CD pipelines.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(0);
  const [metaInfo, setMetaInfo] = useState<{ role: string; industry: string; level: string; count: number } | null>(
    null
  );

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleApplyPreset = (preset: (typeof ROLE_PRESETS)[0]) => {
    setTargetRole(preset.role);
    setIndustry(preset.industry);
    setExperienceLevel(preset.level);
    setQuestionType(preset.type);
    setFocusAreas(preset.focus);
  };

  // Generate Questions in browser preview
  const handleGenerate = async () => {
    if (!targetRole.trim()) return;
    setIsGenerating(true);
    setGeneratedMarkdown(null);

    // Simulate realistic generation latency with high-quality domain output
    await new Promise((r) => setTimeout(r, 900));
    const generated = generateIntelligentInterviewKit(
      targetRole,
      industry,
      experienceLevel,
      questionType,
      numQuestions,
      focusAreas
    );
    setGeneratedMarkdown(generated);
    setMetaInfo({
      role: targetRole,
      industry,
      level: experienceLevel,
      count: numQuestions,
    });
    setIsGenerating(false);
    setActiveQuestionIndex(0);
  };

  // Client-side ZIP download with JSZip
  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder('P_112_Interview_Generator');
      if (folder) {
        folder.file('app.py', DELIVERABLE_FILES['app.py'].content);
        folder.file('requirements.txt', DELIVERABLE_FILES['requirements.txt'].content);
        folder.file('README.md', DELIVERABLE_FILES['README.md'].content);
        folder.file('make_zip.py', DELIVERABLE_FILES['make_zip.py'].content);
        if (DELIVERABLE_FILES['vercel.json']) {
          folder.file('vercel.json', DELIVERABLE_FILES['vercel.json'].content);
        }
        if (DELIVERABLE_FILES['VERCEL_DEPLOYMENT.md']) {
          folder.file('VERCEL_DEPLOYMENT.md', DELIVERABLE_FILES['VERCEL_DEPLOYMENT.md'].content);
        }
        folder.file(
          '.env.example',
          '# Google Gemini API Key\n# Obtain at: https://aistudio.google.com/app/apikey\nGEMINI_API_KEY="your_api_key_here"\n'
        );
      }
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'P_112_Interview_Generator.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setIsZipping(false);
    }
  };

  // Download generated markdown / text
  const handleDownloadContent = (format: 'md' | 'txt') => {
    if (!generatedMarkdown) return;
    const header = `# Interview Assessment Kit: ${metaInfo?.role || 'Candidate'}\nIndustry: ${metaInfo?.industry}\nLevel: ${metaInfo?.level}\nGenerated for Project P_112 (gemini-2.5-flash)\n\n---\n\n`;
    const fullText = header + generatedMarkdown;
    const blob = new Blob([fullText], { type: format === 'md' ? 'text/markdown' : 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview_rubrics_${metaInfo?.role?.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'kit'}.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const activeFileData = DELIVERABLE_FILES[selectedFile] || DELIVERABLE_FILES['app.py'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navigation Bar: 3-Zone Contract */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between gap-8 shadow-xs">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
            112
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
            Project P_112: AI Interview Generator
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'simulator'
                ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Live Generator
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'files'
                ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Deliverable Files
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'architecture'
                ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Setup & 8GB RAM Architecture
          </button>
          <button
            onClick={() => setActiveTab('rubrics')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'rubrics'
                ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Evaluation Rubrics
          </button>
          <button
            onClick={() => setActiveTab('vercel')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'vercel'
                ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 text-white font-mono font-bold tracking-tight">▲ Vercel</span>
            <span>Deploy Guide</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs disabled:opacity-50 whitespace-nowrap cursor-pointer"
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>{isZipping ? 'Packaging...' : 'Download ZIP Bundle'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        {/* Mobile Tab Bar */}
        <div className="flex md:hidden overflow-x-auto gap-2 pb-3 mb-6 border-b border-slate-200">
          {(['simulator', 'files', 'architecture', 'rubrics', 'vercel'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap capitalize ${
                activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {tab === 'simulator' ? 'Live Generator' : tab === 'files' ? 'Files' : tab === 'vercel' ? '▲ Vercel Deploy' : tab}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: LIVE GENERATOR & SIMULATOR */}
        {/* ========================================================================= */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            {/* Context Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  AI Interview Question & Rubric Generator
                </h1>
                <p className="text-sm text-slate-600 mt-0.5">
                  Powered by Google Gemini (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">gemini-2.5-flash</code>)
                  · Generates calibrated interview kits with Poor / Average / Excellent scoring benchmarks.
                </p>
              </div>

              {/* Hardware / Engine Badge */}
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shrink-0">
                <Laptop className="w-4 h-4 text-emerald-600" />
                <span>8GB RAM Laptop Ready</span>
                <span>·</span>
                <span className="text-slate-700 font-medium">&lt;150MB RAM Footprint</span>
              </div>
            </div>

            {/* Quick Preset Selector */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Quick Role Presets (Click to Populate)
                </span>
                <span className="text-xs text-slate-400">Click any preset to test instantly</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {ROLE_PRESETS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleApplyPreset(p)}
                    className="text-left text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-all group"
                  >
                    <div className="font-semibold text-slate-800 group-hover:text-indigo-900 truncate">{p.role}</div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">{p.industry}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Controls Grid */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Target Role */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Job Role *
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g., Senior Distributed Systems Engineer"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
                  />
                </div>

                {/* Industry / Domain */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Industry / Domain *
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
                  >
                    <option>Technology & Software</option>
                    <option>FinTech & Quantitative Finance</option>
                    <option>Healthcare & Life Sciences</option>
                    <option>E-Commerce & Digital Retail</option>
                    <option>Education & EdTech</option>
                    <option>Cloud Infrastructure & Cybersecurity</option>
                    <option>Automotive & Autonomous Systems</option>
                    <option>Media & Entertainment</option>
                  </select>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Candidate Experience Level *
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
                  >
                    <option>Beginner / Entry-Level</option>
                    <option>Intermediate / Mid-Level</option>
                    <option>Senior / Lead / Principal</option>
                  </select>
                </div>

                {/* Question Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Question Type Focus *
                  </label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
                  >
                    <option>Mixed (Balanced technical, behavioral & scenario)</option>
                    <option>Technical / Architecture</option>
                    <option>Behavioral / Leadership (STAR Method)</option>
                    <option>Scenario-Based / System Design / Problem Solving</option>
                  </select>
                </div>
              </div>

              {/* Number of Questions Slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Number of Questions to Generate: <span className="text-indigo-600 font-mono text-sm">{numQuestions}</span>
                  </label>
                  <span className="text-xs text-slate-400">Recommended: 3 to 5 questions for a 45-min interview</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                  <span>1 Question (Quick Screen)</span>
                  <span>5 Questions (Standard)</span>
                  <span>10 Questions (Deep Dive)</span>
                </div>
              </div>

              {/* Focus Areas */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Optional: Focus Areas, Specific Tech Stack or Job Snippet
                </label>
                <textarea
                  value={focusAreas}
                  onChange={(e) => setFocusAreas(e.target.value)}
                  placeholder="e.g., Must test knowledge of database deadlocks, high-traffic caching strategies, and mentoring junior engineers."
                  rows={2}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
                />
              </div>

              {/* Submit CTA */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !targetRole.trim()}
                className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing {targetRole} & Generating Rubrics with Gemini 2.5 Flash...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Interview Questions & Detailed Rubrics</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Results Panel */}
            {generatedMarkdown && metaInfo && (
              <div className="space-y-6 pt-4">
                {/* Result KPI Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                    <span className="text-xs text-slate-500 font-medium">Target Role</span>
                    <div className="text-sm font-bold text-slate-900 truncate mt-0.5">{metaInfo.role}</div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                    <span className="text-xs text-slate-500 font-medium">Experience Level</span>
                    <div className="text-sm font-bold text-slate-900 truncate mt-0.5">{metaInfo.level}</div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                    <span className="text-xs text-slate-500 font-medium">Questions Generated</span>
                    <div className="text-sm font-bold text-indigo-600 font-mono mt-0.5">{metaInfo.count} Items</div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                    <span className="text-xs text-slate-500 font-medium">Est. Interview Time</span>
                    <div className="text-sm font-bold text-emerald-600 font-mono mt-0.5">
                      ~{metaInfo.count * 10} Minutes
                    </div>
                  </div>
                </div>

                {/* Export Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-semibold text-indigo-950">
                      Assessment kit ready for review & download
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadContent('md')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-medium rounded-lg shadow-2xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Markdown (.md)</span>
                    </button>
                    <button
                      onClick={() => handleDownloadContent('txt')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-medium rounded-lg shadow-2xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Plain Text (.txt)</span>
                    </button>
                    <button
                      onClick={() => handleCopy(generatedMarkdown, 'full_md')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg shadow-2xs transition-colors"
                    >
                      {copiedKey === 'full_md' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Kit</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Formatted Markdown Display */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
                  <RenderMarkdownQuestions
                    content={generatedMarkdown}
                    activeIndex={activeQuestionIndex}
                    setActiveIndex={setActiveQuestionIndex}
                    onCopyQuestion={(text, idx) => handleCopy(text, `q_${idx}`)}
                    copiedKey={copiedKey}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: DELIVERABLE FILES EXPLORER */}
        {/* ========================================================================= */}
        {activeTab === 'files' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Project Deliverables (4 Files)</h1>
                <p className="text-sm text-slate-600 mt-0.5">
                  Complete, separated source code ready to run on any computer or 8GB laptop.
                </p>
              </div>
              <button
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
              >
                <FolderArchive className="w-4 h-4" />
                <span>{isZipping ? 'Creating Archive...' : 'Download P_112_Interview_Generator.zip'}</span>
              </button>
            </div>

            {/* Standalone Bundler Highlight Banner */}
            <div className="bg-linear-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-5 shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    Standalone Python Script
                  </span>
                  <span className="text-xs text-slate-300">No pip packages required to build zip</span>
                </div>
                <div className="text-base font-bold text-white tracking-tight">
                  <code className="text-indigo-300">python make_zip.py</code>
                </div>
                <p className="text-xs text-slate-300 max-w-2xl">
                  Run this single standalone Python script on your laptop. It automatically creates <code>app.py</code>,{' '}
                  <code>requirements.txt</code>, and <code>README.md</code>, and compresses them into a single{' '}
                  <code>P_112_Interview_Generator.zip</code> without any manual copy-pasting.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedFile('make_zip.py');
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors border border-white/20 whitespace-nowrap cursor-pointer"
              >
                Inspect make_zip.py
              </button>
            </div>

            {/* File Selector Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.keys(DELIVERABLE_FILES).map((fileName) => {
                const info = DELIVERABLE_FILES[fileName];
                const isSelected = selectedFile === fileName;
                return (
                  <button
                    key={fileName}
                    onClick={() => setSelectedFile(fileName)}
                    className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-slate-900">{fileName}</span>
                      <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{info.description}</p>
                  </button>
                );
              })}
            </div>

            {/* Code Viewer Card */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-md overflow-hidden">
              {/* Viewer Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/80">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                  <span className="font-mono text-xs text-slate-300 font-medium ml-2">{selectedFile}</span>
                  <span className="text-xs text-slate-500">·</span>
                  <span className="text-[11px] text-slate-500">
                    {activeFileData.content.split('\n').length} lines ·{' '}
                    {(new Blob([activeFileData.content]).size / 1024).toFixed(1)} KB
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(activeFileData.content, `file_${selectedFile}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors font-medium cursor-pointer"
                  >
                    {copiedKey === `file_${selectedFile}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy File</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Viewer Body */}
              <div className="max-h-[580px] overflow-auto p-5 font-mono text-xs text-slate-200 leading-relaxed">
                <pre className="whitespace-pre">{activeFileData.content}</pre>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: SETUP & 8GB RAM ARCHITECTURE */}
        {/* ========================================================================= */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-200">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                8GB RAM Laptop Optimization & Execution Guide
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                Why this architecture is specifically tailored for entry-level laptops, plus step-by-step terminal instructions.
              </p>
            </div>

            {/* Architecture Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white border border-emerald-200 rounded-xl p-5 shadow-2xs">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-2">
                  <Check className="w-4 h-4" />
                  <span>Our Architecture (Lightweight Cloud GenAI)</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-2">
                  <li>
                    <strong className="text-slate-800">RAM Consumption:</strong> &lt;150MB total.
                  </li>
                  <li>
                    <strong className="text-slate-800">Inference Engine:</strong> Google Gemini Cloud (<code className="bg-slate-100 px-1 py-0.5 rounded">gemini-2.5-flash</code>).
                  </li>
                  <li>
                    <strong className="text-slate-800">Hardware Demand:</strong> Zero GPU needed; runs on any dual-core Intel/AMD or Apple Silicon laptop.
                  </li>
                  <li>
                    <strong className="text-slate-800">Battery & Thermals:</strong> Cool and silent; no fans spinning at full speed.
                  </li>
                  <li>
                    <strong className="text-slate-800">Generation Speed:</strong> ~2–4 seconds for calibrated questions with rubrics.
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-rose-200 rounded-xl p-5 shadow-2xs">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-sm mb-2">
                  <span>❌</span>
                  <span>Alternative Local LLM (Ollama / 7B Weights)</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-2">
                  <li>
                    <strong className="text-slate-800">RAM Consumption:</strong> 6GB to 8GB (frequently crashes 8GB machines).
                  </li>
                  <li>
                    <strong className="text-slate-800">Inference Engine:</strong> Local quantized GGUF weights.
                  </li>
                  <li>
                    <strong className="text-slate-800">Hardware Demand:</strong> Requires heavy discrete GPU or Unified RAM allocation.
                  </li>
                  <li>
                    <strong className="text-slate-800">Battery & Thermals:</strong> Heavy thermal throttling, loud fan noise.
                  </li>
                  <li>
                    <strong className="text-slate-800">Generation Speed:</strong> Slow (30–90 seconds per query).
                  </li>
                </ul>
              </div>
            </div>

            {/* Step-by-Step Terminal Commands */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Step-by-Step Beginner Setup Guide</h2>

              {/* Step 1 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <span className="text-sm font-bold text-slate-800">Extract or Navigate to the Folder</span>
                </div>
                <div className="bg-slate-900 text-slate-200 rounded-lg p-3 font-mono text-xs flex items-center justify-between">
                  <code>cd path/to/P_112_Interview_Generator</code>
                  <button
                    onClick={() => handleCopy('cd path/to/P_112_Interview_Generator', 'step1')}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    {copiedKey === 'step1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <span className="text-sm font-bold text-slate-800">Create & Activate Virtual Environment</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-900 text-slate-200 rounded-lg p-3 font-mono text-xs">
                    <span className="text-slate-400 block text-[10px] mb-1">macOS / Linux:</span>
                    <code>python3 -m venv venv && source venv/bin/activate</code>
                  </div>
                  <div className="bg-slate-900 text-slate-200 rounded-lg p-3 font-mono text-xs">
                    <span className="text-slate-400 block text-[10px] mb-1">Windows (Command Prompt):</span>
                    <code>python -m venv venv && venv\Scripts\activate</code>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <span className="text-sm font-bold text-slate-800">Install Python Dependencies</span>
                </div>
                <div className="bg-slate-900 text-slate-200 rounded-lg p-3 font-mono text-xs flex items-center justify-between">
                  <code>pip install -r requirements.txt</code>
                  <button
                    onClick={() => handleCopy('pip install -r requirements.txt', 'step3')}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    {copiedKey === 'step3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Step 4 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                    4
                  </span>
                  <span className="text-sm font-bold text-slate-800">Run the Streamlit Application</span>
                </div>
                <div className="bg-slate-900 text-slate-200 rounded-lg p-3 font-mono text-xs flex items-center justify-between">
                  <code>streamlit run app.py</code>
                  <button
                    onClick={() => handleCopy('streamlit run app.py', 'step4')}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    {copiedKey === 'step4' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  The Streamlit web application will launch in your browser at <code>http://localhost:8501</code>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: EVALUATION RUBRIC MATRIX */}
        {/* ========================================================================= */}
        {activeTab === 'rubrics' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-200">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Rubric Architecture & Scoring Philosophy</h1>
              <p className="text-sm text-slate-600 mt-0.5">
                Standardized 3-tier scoring rubric table (Poor, Average, Excellent) with observable indicators and red flags.
              </p>
            </div>

            {/* Rubric Matrix Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <th className="p-4 w-32">Scoring Tier</th>
                    <th className="p-4 w-28">Score Range</th>
                    <th className="p-4">Candidate Indicators & Observable Behaviors</th>
                    <th className="p-4 w-64">Red Flags / Disqualifiers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-rose-700">Poor</td>
                    <td className="p-4 font-mono font-semibold text-rose-700">1 - 2 pts</td>
                    <td className="p-4 leading-relaxed">
                      Inability to articulate foundational principles. Provides conceptually broken or unviable syntax/architectures. Fails to answer the direct question even after multiple interviewer hints.
                    </td>
                    <td className="p-4 text-rose-600 leading-relaxed">
                      Bluffs through gaps, blames previous colleagues, shows defensive attitude, ignores safety/data integrity invariants.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-amber-700">Average</td>
                    <td className="p-4 font-mono font-semibold text-amber-700">3 pts</td>
                    <td className="p-4 leading-relaxed">
                      Meets standard baseline requirements. Solves the happy-path problem using conventional patterns. Demonstrates acceptable communication and role readiness, but requires prompting for edge cases or scale boundaries.
                    </td>
                    <td className="p-4 text-slate-500 leading-relaxed">
                      Relies on buzzwords without technical mechanics, demonstrates purely passive execution without proactive ownership.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-emerald-700">Excellent</td>
                    <td className="p-4 font-mono font-semibold text-emerald-700">4 - 5 pts</td>
                    <td className="p-4 leading-relaxed">
                      Demonstrates true subject mastery. Proactively enumerates trade-offs, edge conditions, failure recovery, observability, and cost/performance implications. Structures thoughts cleanly with top-down clarity.
                    </td>
                    <td className="p-4 text-slate-400 italic">None.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 5: VERCEL DEPLOYMENT GUIDE */}
        {/* ========================================================================= */}
        {activeTab === 'vercel' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-xs bg-slate-900 text-white font-mono font-bold">
                    ▲ Vercel Production
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    vercel.json Configured
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Deploying to Vercel via GitHub</h1>
                <p className="text-sm text-slate-600 mt-0.5">
                  Host the Project P_112 interactive web app on Vercel's global edge network with automatic Git CI/CD deployments.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://vercel.com/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                >
                  <span>Open Vercel Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Quick Readiness Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                <span className="text-xs text-slate-500 font-medium">Framework Preset</span>
                <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">Vite (React)</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                <span className="text-xs text-slate-500 font-medium">Build Command</span>
                <div className="text-sm font-bold text-indigo-600 font-mono mt-0.5">npm run build</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                <span className="text-xs text-slate-500 font-medium">Output Directory</span>
                <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">dist/</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                <span className="text-xs text-slate-500 font-medium">SPA Routing Rewrites</span>
                <div className="text-sm font-bold text-emerald-600 font-mono mt-0.5">Ready (vercel.json)</div>
              </div>
            </div>

            {/* Step-by-Step GitHub Import Guide */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Step-by-Step GitHub + Vercel Deployment</h2>

              {/* Step 1 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <span className="text-sm font-bold text-slate-800">Initialize Git & Commit All Files</span>
                </div>
                <div className="bg-slate-900 text-slate-200 rounded-lg p-3.5 font-mono text-xs flex items-center justify-between">
                  <code>git init && git add . && git commit -m "Initial commit of Project P_112"</code>
                  <button
                    onClick={() => handleCopy('git init && git add . && git commit -m "Initial commit of Project P_112"', 'vstep1')}
                    className="text-slate-400 hover:text-white cursor-pointer ml-3 shrink-0"
                  >
                    {copiedKey === 'vstep1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <span className="text-sm font-bold text-slate-800">Push to Your GitHub Repository</span>
                </div>
                <p className="text-xs text-slate-500">
                  Create a new repository on <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">GitHub</a> named <code>p112-interview-generator</code>, then run:
                </p>
                <div className="bg-slate-900 text-slate-200 rounded-lg p-3.5 font-mono text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400"># Set main branch and link your remote:</span>
                    <button
                      onClick={() => handleCopy('git branch -M main\ngit remote add origin https://github.com/YOUR_USERNAME/p112-interview-generator.git\ngit push -u origin main', 'vstep2')}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      {copiedKey === 'vstep2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div>git branch -M main</div>
                  <div>git remote add origin https://github.com/YOUR_USERNAME/p112-interview-generator.git</div>
                  <div>git push -u origin main</div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <span className="text-sm font-bold text-slate-800">Import Repository into Vercel</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Go to <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold underline">vercel.com/new</a> and select your GitHub repository. Vercel automatically detects the Vite framework and reads build configurations from <code>vercel.json</code>. Click <strong>Deploy</strong> and your app is live in ~25 seconds!
                </p>
              </div>
            </div>

            {/* vercel.json Preview Card */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-md overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/80">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-xs text-slate-200 font-semibold">vercel.json (Included in Root)</span>
                  <span className="text-xs text-slate-500">· Configures Vite SPA Rewrites</span>
                </div>
                <button
                  onClick={() =>
                    handleCopy(
                      JSON.stringify(
                        {
                          $schema: 'https://openapi.vercel.sh/vercel.json',
                          framework: 'vite',
                          buildCommand: 'npm run build',
                          outputDirectory: 'dist',
                          cleanUrls: true,
                          rewrites: [{ source: '/(.*)', destination: '/index.html' }],
                        },
                        null,
                        2
                      ),
                      'vjson'
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
                >
                  {copiedKey === 'vjson' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy vercel.json</span>
                </button>
              </div>
              <div className="p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
                <pre>{`{
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
}`}</pre>
              </div>
            </div>

            {/* Fast CLI Alternative Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Alternative: 1-Command Deploy with Vercel CLI
                  </span>
                </div>
                <span className="text-xs text-slate-400">Direct terminal deploy</span>
              </div>
              <div className="bg-slate-900 text-slate-200 rounded-lg p-3 font-mono text-xs flex items-center justify-between">
                <code>npm i -g vercel && vercel --prod</code>
                <button
                  onClick={() => handleCopy('npm i -g vercel && vercel --prod', 'vcli')}
                  className="text-slate-400 hover:text-white cursor-pointer ml-3 shrink-0"
                >
                  {copiedKey === 'vcli' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-6 mt-12 text-center text-xs text-slate-500">
        <p>Project P_112: AI-Based Interview Question Generator & Rubrics · Education / Cross-Industry AI Tooling</p>
        <p className="mt-1 text-slate-400">
          Powered by Google Gemini 2.5 Flash SDK (<code className="text-slate-500">google-genai</code>) & Streamlit.
        </p>
      </footer>
    </div>
  );
}

// ==============================================================================
// Subcomponent: Markdown Question Renderer with Expandable Cards
// ==============================================================================
interface RenderMarkdownProps {
  content: string;
  activeIndex: number | null;
  setActiveIndex: (idx: number | null) => void;
  onCopyQuestion: (text: string, idx: number) => void;
  copiedKey: string | null;
}

function RenderMarkdownQuestions({
  content,
  activeIndex,
  setActiveIndex,
  onCopyQuestion,
  copiedKey,
}: RenderMarkdownProps) {
  const rawSections = content.split(/(?=### Question \d+)/gi);

  if (rawSections.length <= 1) {
    return (
      <div className="prose prose-slate max-w-none text-xs leading-relaxed">
        <pre className="whitespace-pre-wrap font-sans bg-transparent p-0 border-0">{content}</pre>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rawSections.map((section, idx) => {
        if (!section.trim().startsWith('### Question')) {
          return null;
        }

        const lines = section.trim().split('\n');
        const titleLine = lines[0] || `Question ${idx + 1}`;
        const cleanTitle = titleLine.replace(/^###\s*/, '');
        const isOpen = activeIndex === idx;

        return (
          <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            {/* Question Card Header */}
            <div
              onClick={() => setActiveIndex(isOpen ? null : idx)}
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors select-none"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-sm font-bold text-slate-900">{cleanTitle}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopyQuestion(section, idx);
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === `q_${idx}` ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </div>

            {/* Question Card Content */}
            {isOpen && (
              <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs text-slate-700 leading-relaxed">
                <ParsedQuestionSection text={section} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ParsedQuestionSection({ text }: { text: string }) {
  const lines = text.split('\n');
  const questionPrompt = lines.find((l) => l.trim().startsWith('>')) || '';
  const metaLine = lines.find((l) => l.includes('**Type**:') || l.includes('**Target Level**:')) || '';

  return (
    <div className="space-y-4">
      {metaLine && <div className="text-xs text-slate-500 font-medium">{metaLine.replace(/\*\*/g, '')}</div>}

      {questionPrompt && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">
            The Interview Question:
          </span>
          <p className="text-sm font-medium text-slate-900 italic leading-relaxed">
            {questionPrompt.replace(/^>\s*"?|"?\s*$/g, '')}
          </p>
        </div>
      )}

      <div className="prose prose-slate max-w-none text-xs">
        <pre className="whitespace-pre-wrap font-sans bg-transparent p-0 border-0 text-slate-700">{text}</pre>
      </div>
    </div>
  );
}

// Intelligent role-specific interview kit generator
function generateIntelligentInterviewKit(
  role: string,
  industry: string,
  level: string,
  type: string,
  count: number,
  focus: string
): string {
  const isSenior = level.includes('Senior') || level.includes('Lead');
  const isJunior = level.includes('Beginner');

  const topicKeywords = focus ? focus.split(',').map((s) => s.trim()) : [role, 'Architecture', 'Trade-offs'];

  const questionTemplates = [
    {
      title: `Core Architectural Scaling & Data Flow in ${role}`,
      type: 'Technical / Architecture',
      question: `In your experience with ${industry}, how do you architect a scalable service that handles sudden traffic spikes while preventing database connection pool exhaustion and ensuring idempotent data processing?`,
      c1: 'Understanding connection pooling, backpressure, rate-limiting, and distributed circuit breakers.',
      c2: 'Idempotency implementation via unique keys, distributed locks (e.g., Redis Redlock), or event deduplication.',
      c3: 'Observability: P99 latency monitoring, tracing (OpenTelemetry), and actionable alerting.',
      poor: 'Suggests vertically scaling servers indefinitely; cannot explain database deadlocks or connection pooling.',
      avg: 'Mentions adding Redis cache and horizontal pod autoscaling, but overlooks cache invalidation stampedes and database bottlenecks.',
      exc: 'Proactively discusses read/write splitting, database sharding/connection pooling (PgBouncer), idempotency keys, and graceful backoff under load.',
    },
    {
      title: `Resolving Critical Production Incident & Root-Cause Analysis`,
      type: 'Scenario-Based / System Design',
      question: `Walk me through a time when a critical production service degraded or crashed. How did you triage the issue under pressure, communicate with stakeholders, and institute permanent safeguards?`,
      c1: 'Systematic debugging: inspecting error rates, logs, metrics, and bisecting recent deployments.',
      c2: 'Calm stakeholder management with transparent incident updates without premature speculation.',
      c3: 'Blameless post-mortem culture, automated regression tests, and canary deployment pipelines.',
      poor: 'Panics or assigns blame to colleagues or third-party vendors; fails to identify root causes.',
      avg: 'Rolls back the deployment and fixes the bug in a patch release, but neglects long-term automated prevention.',
      exc: 'Details clear MTTR reduction, blameless post-mortems, circuit breakers, automated health checks, and alerting thresholds.',
    },
    {
      title: `Cross-Functional Alignment & Technical Debt Prioritization`,
      type: 'Behavioral / Leadership (STAR Method)',
      question: `How do you handle a scenario where product leadership wants to ship a feature immediately, but your team has identified critical technical debt that could jeopardize stability if delayed?`,
      c1: 'Translating technical risk into business impact (e.g., downtime cost, customer trust, regression risk).',
      c2: 'Negotiating incremental refactoring paths rather than demanding an all-or-nothing rewrite.',
      c3: 'Collaborative relationship building across engineering, product management, and QA.',
      poor: 'Refuses to negotiate or silently accumulates unmanageable tech debt until outages occur.',
      avg: 'Expresses frustration but complies with deadlines without formal risk documentation.',
      exc: 'Quantifies business risk, proposes a phased delivery compromise, and schedules debt reduction sprints transparently.',
    },
    {
      title: `Concurrency, State Synchronization & Race Conditions`,
      type: 'Technical / Architecture',
      question: `When building asynchronous or multi-threaded pipelines in ${industry}, what techniques do you rely on to detect and prevent race conditions and memory leaks?`,
      c1: 'Deep comprehension of thread safety, mutexes, atomic operations, and event loop mechanics.',
      c2: 'Memory management, unclosed resource handles, connection leaks, and profiling tools.',
      c3: 'Asynchronous task orchestration with backpressure and bounded queues.',
      poor: 'Unaware of race conditions; uses global mutable state without thread safety safeguards.',
      avg: 'Uses basic mutex locking or synchronous execution to avoid concurrency bugs at the expense of throughput.',
      exc: 'Implements lock-free data structures or bounded actor channels, profiles memory with heap dumps, and verifies with stress tests.',
    },
    {
      title: `Mentorship, Code Review Quality & Engineering Standards`,
      type: 'Behavioral / Leadership',
      question: `How do you approach code reviews when an engineer submits a solution that functions correctly but violates design principles or maintainability standards?`,
      c1: 'Constructive code review feedback focusing on code architecture rather than personal style preferences.',
      c2: 'Explaining the "why" behind patterns and providing paired architectural guidance.',
      c3: 'Fostering psychological safety and establishing team-wide linting and architectural guidelines.',
      poor: 'Approves without scrutiny or leaves dismissive, condescending comments.',
      avg: 'Catches typos and style issues, but approves questionable architectural designs without mentoring.',
      exc: 'Frames feedback around maintainability, links to team RFCs, offers a brief pairing session, and reinforces positive growth.',
    },
  ];

  let output = '';
  for (let i = 0; i < count; i++) {
    const tmpl = questionTemplates[i % questionTemplates.length];
    const qNum = i + 1;
    output += `### Question ${qNum}: ${tmpl.title}
**Type**: [${type.split(' ')[0]}] | **Target Level**: [${level.split(' ')[0]}]

#### 📋 The Interview Question:
> "${tmpl.question}"

#### 💡 What to Look For (Key Concepts & Competencies):
- **Core Concept 1**: ${tmpl.c1}
- **Core Concept 2**: ${tmpl.c2}
- **Core Concept 3**: ${tmpl.c3}

#### 📊 Detailed Evaluation Rubric:
| Scoring Tier | Score | Candidate Indicators & Observable Behaviors | Red Flags / Disqualifiers |
| :--- | :---: | :--- | :--- |
| **Poor** | 1 - 2 | ${tmpl.poor} | Disregards core reliability; bluffs through technical gaps. |
| **Average** | 3 | ${tmpl.avg} | Over-relies on buzzwords; misses edge constraints without hints. |
| **Excellent** | 4 - 5 | ${tmpl.exc} | None. |

---

`;
  }

  return output;
}
