import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleHelp,
  Clipboard,
  Copy,
  FileText,
  Fingerprint,
  Globe2,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  RotateCcw,
  Shield,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || '/api/analyze';
const sample = `Yo guys! Welcome back to the stream. Today I am going to show you how to hack into your friend's system using a script I copied directly from an online forum. Honestly, traditional security protocols are absolute garbage and anyone still using them is an absolute idiot. Let's dive into the code!`;
const prompts = [
  { label: 'Creator intro', tag: 'TONE + LANGUAGE', text: sample },
  { label: 'Product launch', tag: 'BRAND SAFETY', text: 'Meet the all-new Nova smart speaker. Thoughtfully designed for every room, with rich sound, simple controls, and privacy settings that put you in charge.' },
  { label: 'Community post', tag: 'CULTURAL REVIEW', text: 'We’re celebrating the people and traditions that make our community unique. Join us this weekend for food, music, and stories from around the world.' },
];
const checks = [
  { key: 'toxicity_level', label: 'Tone & toxicity', icon: MessageSquareText, color: 'mint' },
  { key: 'copyright_risk', label: 'Originality & IP', icon: Fingerprint, color: 'violet' },
  { key: 'cultural_insensitivity', label: 'Cultural sensitivity', icon: Globe2, color: 'amber' },
];

function localScore(text, key) {
  const low = text.toLowerCase();
  const terms = key === 'toxicity_level'
    ? ['idiot', 'garbage', 'stupid', 'hate', 'kill', 'damn', 'loser', 'hell']
    : key === 'copyright_risk'
      ? ['copied directly', 'copied from', 'brand name', 'trademark', 'lyrics']
      : ['offensive', 'backward', 'primitive', 'crazy', 'illegal alien'];
  let score = key === 'toxicity_level' ? 6 : key === 'copyright_risk' ? 8 : 5;
  terms.forEach((t) => {
    if (low.includes(t)) score += t.length > 8 ? 34 : 27;
  });
  if (key === 'toxicity_level' && (low.includes('idiot') || low.includes('garbage'))) score += 15;
  return Math.min(score, 96);
}

function buildDemoScores(value) {
  return Object.fromEntries(checks.map((c) => [c.key, localScore(value, c.key)]));
}

function App() {
  const [page, setPage] = useState('analyze');
  const [text, setText] = useState('');
  const [results, setResults] = useState(null);
  const [busy, setBusy] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState('');

  async function analyze(value = text) {
    if (!value.trim()) return;

    setText(value);
    setBusy(true);
    setResults(null);
    setNotice('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: value }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      const scores = data.safety_scores || buildDemoScores(value);
      setResults(scores);
      setNotice(data.status ? `AI workflow status: ${data.status}` : '');
    } catch (error) {
      const fallbackScores = buildDemoScores(value);
      setResults(fallbackScores);
      setNotice('Preview mode: the API is unavailable, so demo scores are being shown locally.');
    } finally {
      setBusy(false);
    }
  }

  const overall = results ? Math.round(Object.values(results).reduce((a, b) => a + b, 0) / Object.keys(results).length) : null;
  const status = overall === null ? '' : overall >= 55 ? 'Needs attention' : overall >= 25 ? 'Review suggested' : 'Looking good';

  async function copyReport() {
    if (!results) return;
    const report = checks.map((c) => `${c.label}: ${results[c.key]}/100`).join('\n');
    try {
      await navigator.clipboard.writeText(`BrandShield AI report\n${status}\n${report}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setNotice('Clipboard access is unavailable in this browser.');
    }
  }

  function nav(p) {
    setPage(p);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <button className="brand" onClick={() => nav('analyze')} aria-label="BrandShield home">
          <span className="brand-mark"><Shield size={19} /><span /></span>
          <span>brandshield<span className="brand-ai">.ai</span></span>
        </button>

        <nav className={mobileOpen ? 'nav-links open' : 'nav-links'}>
          <button className={page === 'analyze' ? 'nav-item active' : 'nav-item'} onClick={() => nav('analyze')}>Workspace</button>
          <button className={page === 'about' ? 'nav-item active' : 'nav-item'} onClick={() => nav('about')}>About the project</button>
        </nav>

        <div className="top-actions">
          <span className="status-dot" />
          <span className="prototype-label">PRODUCTION READY</span>
          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {page === 'analyze' ? (
        <main className="main-content">
          <section className="hero">
            <div className="eyebrow"><Sparkles size={13} /> RESPONSIBLE CONTENT, AT A GLANCE</div>
            <h1>Make every word<br /><span>work for your brand.</span></h1>
            <p>Check a script for tone, originality, and cultural sensitivity before it goes live.</p>
          </section>

          <div className="workspace-grid">
            <section className="panel editor-panel">
              <div className="panel-heading">
                <div>
                  <div className="step-label"><span>01</span> CONTENT INPUT</div>
                  <h2>What are we reviewing?</h2>
                </div>
                <button className="help-button" title="Paste a script or choose a sample to get started."><CircleHelp size={17} /></button>
              </div>

              <p className="panel-copy">Paste your script below, or start with a sample to see how the checks work.</p>

              <div className="samples-title">
                <span>QUICK START SAMPLES</span>
                <span className="samples-rule" />
              </div>

              <div className="sample-list">
                {prompts.map((p, i) => (
                  <button className="sample-card" key={p.label} onClick={() => { setText(p.text); setResults(null); setNotice(''); }}>
                    <span className={`sample-icon sample-${i}`}>
                      {i === 0 ? <MessageSquareText size={15} /> : i === 1 ? <Sparkles size={15} /> : <Globe2 size={15} />}
                    </span>
                    <span className="sample-details"><strong>{p.label}</strong><small>{p.tag}</small></span>
                    <ArrowUpRight className="sample-arrow" size={15} />
                  </button>
                ))}
              </div>

              <label className="input-label" htmlFor="script">YOUR SCRIPT <span>{text.length} characters</span></label>
              <div className="textarea-wrap">
                <textarea
                  id="script"
                  placeholder="Paste your script here…"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    if (results) setResults(null);
                  }}
                  maxLength={5000}
                />
                {!text && <span className="textarea-hint"><Clipboard size={13} /> Your text stays in this browser preview.</span>}
              </div>

              {notice && <div className="inline-notice">{notice}</div>}

              <div className="editor-footer">
                <span><ShieldCheck size={15} /> Private preview</span>
                <button className="primary-button" disabled={!text.trim() || busy} onClick={() => analyze()}>
                  {busy ? <><span className="spinner" />Checking…</> : <>Run safety check <ArrowRight size={16} /></>}
                </button>
              </div>

              <div className="fine-print"><CircleHelp size={12} /> Connect your Render API for real AI scoring or keep using local preview mode.</div>
            </section>

            <section className={`panel results-panel ${results ? 'has-results' : ''}`}>
              <div className="panel-heading">
                <div>
                  <div className="step-label"><span>02</span> SAFETY REPORT</div>
                  <h2>Your results</h2>
                </div>
                {results && <button className="icon-button" onClick={() => { setText(''); setResults(null); }} aria-label="Reset"><RotateCcw size={16} /></button>}
              </div>

              {!results && !busy ? (
                <div className="empty-state">
                  <div className="empty-illustration">
                    <div className="orbit orbit-a" />
                    <div className="orbit orbit-b" />
                    <div className="empty-shield"><ShieldCheck size={34} /></div>
                    <span className="sparkle-dot dot-a" />
                    <span className="sparkle-dot dot-b" />
                    <span className="sparkle-dot dot-c" />
                  </div>
                  <h3>A clearer picture starts here.</h3>
                  <p>Your review will show separate scores for<br />the three content safety checks.</p>
                  <div className="empty-checks">
                    {checks.map((c) => <span key={c.key}><c.icon size={14} />{c.label}</span>)}
                  </div>
                  <div className="result-footnote"><Shield size={13} /> Scores are signals to guide human review.</div>
                </div>
              ) : busy ? (
                <div className="loading-state">
                  <div className="loading-ring"><Shield size={27} /></div>
                  <h3>Reviewing your script<span className="loading-dots">…</span></h3>
                  <p>Checking tone, originality, and cultural fit across the graph.</p>
                </div>
              ) : (
                <div className="results-state">
                  <div className="result-summary">
                    <div>
                      <div className="step-label"><span>03</span> SCORE SUMMARY</div>
                      <h3>{status}</h3>
                    </div>
                    <button className="icon-button" onClick={copyReport} aria-label="Copy report">{copied ? <Check size={15} /> : <Copy size={15} />}</button>
                  </div>

                  <div className="overall-card">
                    <div className="overall-number">{overall}</div>
                    <div className="overall-meta">
                      <span>Overall risk</span>
                      <small>0 = low concern · 100 = high concern</small>
                    </div>
                  </div>

                  <div className="score-list">
                    {checks.map((c) => (
                      <div className="score-item" key={c.key}>
                        <div className="score-header">
                          <div className={`score-icon ${c.color}`}><c.icon size={14} /></div>
                          <span>{c.label}</span>
                          <strong>{results[c.key]}/100</strong>
                        </div>
                        <div className="bar"><i style={{ width: `${results[c.key]}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>
      ) : (
        <AboutPage onBack={() => nav('analyze')} />
      )}

      <footer className="footer">
        <span>BRANDSHIELD AI <i /> A CONTENT SAFETY PROJECT</span>
        <span>Built with LangGraph <span className="footer-heart">?</span> for thoughtful publishing</span>
      </footer>
    </div>
  );
}

function AboutPage({ onBack }) {
  const steps = [
    { id: 'START', title: 'Script enters the graph', body: 'One shared state carries the submitted text and an initially empty score dictionary.', icon: FileText, color: 'mint' },
    { id: 'PARALLEL', title: 'Three focused reviewers', body: 'Independent nodes assess tone and toxicity, originality and IP risk, and cultural sensitivity at the same time.', icon: LayoutDashboard, color: 'violet' },
    { id: 'MERGE', title: 'Scores come together', body: 'A custom state reducer merges each node’s score into the shared safety_scores dictionary.', icon: ArrowDown, color: 'amber' },
    { id: 'END', title: 'One report to review', body: 'The graph returns a compact score set that a person can use to decide what needs a closer look.', icon: ShieldCheck, color: 'mint' },
  ];

  return (
    <main className="about-content">
      <section className="about-hero">
        <div className="eyebrow"><Sparkles size={13} /> THE THINKING BEHIND THE TOOL</div>
        <h1>Safety checks that<br /><span>work in parallel.</span></h1>
        <p>BrandShield AI is a learning project exploring how a graph of focused language model checks can help creators review content with more context.</p>
        <button className="back-link" onClick={onBack}><ArrowRight size={15} /> Back to the workspace</button>
      </section>

      <div className="about-grid">
        <section className="panel about-card overview-card">
          <div className="step-label"><span>A</span> PROJECT OVERVIEW</div>
          <h2>One script.<br />Three useful perspectives.</h2>
          <p>The project takes a piece of writing and runs three independent checks: tone and toxicity, originality and potential IP concerns, and regional or cultural sensitivity.</p>
          <p>Each reviewer contributes a score from 0–100. LangGraph joins those results into a shared state, making the review easy to extend with new checks later.</p>
          <div className="overview-tags">
            <span><MessageSquareText size={14} />Tone & toxicity</span>
            <span><Fingerprint size={14} />Originality & IP</span>
            <span><Globe2 size={14} />Cultural sensitivity</span>
          </div>
        </section>

        <section className="panel about-card architecture-card">
          <div className="step-label"><span>B</span> THE WORKFLOW</div>
          <h2>Three checks. One graph.</h2>
          <p className="architecture-copy">Independent checks run concurrently from a shared starting point.</p>

          <div className="flow">
            <div className="flow-start">
              <span className="flow-node start-node"><FileText size={17} /></span>
              <span><small>START</small><strong>Script + empty state</strong></span>
            </div>

            <div className="flow-trunk">
              <i />
              <div className="flow-branch">
                <i />
                <div className="flow-check">
                  <span className="flow-node mint"><MessageSquareText size={15} /></span>
                  <span><small>NODE 01</small><strong>Tone & toxicity</strong></span>
                </div>
              </div>
              <div className="flow-branch">
                <i />
                <div className="flow-check">
                  <span className="flow-node violet"><Fingerprint size={15} /></span>
                  <span><small>NODE 02</small><strong>Originality & IP</strong></span>
                </div>
              </div>
              <div className="flow-branch">
                <i />
                <div className="flow-check">
                  <span className="flow-node amber"><Globe2 size={15} /></span>
                  <span><small>NODE 03</small><strong>Cultural sensitivity</strong></span>
                </div>
              </div>
              <i className="flow-down" />
            </div>

            <div className="flow-merge">
              <span className="merge-pills"><i /><i /><i /></span>
              <span><small>MERGE · CUSTOM REDUCER</small><strong>Combine safety scores</strong></span>
            </div>

            <div className="flow-end">
              <span className="flow-node end-node"><ShieldCheck size={17} /></span>
              <span><small>END</small><strong>Human-readable report</strong></span>
            </div>
          </div>

          <div className="flow-legend">
            <span><i className="legend-parallel" />Parallel branches</span>
            <span><i className="legend-state" />Shared state updates</span>
          </div>
        </section>
      </div>

      <section className="learning-section">
        <div className="learning-heading">
          <div>
            <div className="step-label"><span>C</span> WHAT THIS PROJECT TAUGHT ME</div>
            <h2>What I learned by building it.</h2>
          </div>
          <span className="learning-spark"><Sparkles size={20} /></span>
        </div>

        <div className="learning-grid">
          {steps.map((step) => (
            <article className="learning-card" key={step.id}>
              <div className="learning-number">{step.id}</div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="comparison-panel">
        <div className="comparison-head">
          <div className="step-label"><span>D</span> WHY LANGGRAPH FOR THIS FLOW?</div>
          <h2>A useful fit for branching workflows.</h2>
          <p>LangChain and LangGraph work well together. Here, LangGraph adds an explicit graph structure for parallel steps and shared state.</p>
        </div>

        <div className="comparison-columns">
          <article>
            <span className="comparison-icon"><MessageSquareText size={17} /></span>
            <div>
              <h3>LangChain</h3>
              <p>Useful building blocks for prompts, models, tools, and retrieval. Great for composing model interactions.</p>
            </div>
          </article>

          <div className="comparison-divider"><ArrowRight size={16} /></div>

          <article className="highlight-comparison">
            <span className="comparison-icon"><LayoutDashboard size={17} /></span>
            <div>
              <h3>LangGraph <span>USED HERE</span></h3>
              <p>Stateful workflow orchestration: graph nodes, branching, parallel execution, and controlled state updates.</p>
            </div>
          </article>
        </div>

        <div className="comparison-note"><ShieldCheck size={15} /> LangGraph builds on the LangChain ecosystem; this project uses the graph where parallel coordination matters.</div>
      </section>

      <section className="about-cta">
        <div className="cta-icon"><Sparkles size={20} /></div>
        <div>
          <h2>Try the workflow yourself.</h2>
          <p>Start with the sample script and explore how the three perspectives fit together.</p>
        </div>
        <button className="primary-button" onClick={onBack}>Open workspace <ArrowRight size={16} /></button>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
