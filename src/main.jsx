import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Check, ChevronDown, CircleHelp, Clock3, Copy, Cpu, FileText, GitBranch, Layers3, Lightbulb, Menu, Play, Sparkles, WandSparkles, X } from 'lucide-react';
import './styles.css';

const sample = 'AI agents are the future of tech. They can think, plan, and act on their own. LangGraph helps you build these agents with proper control and memory.';
const apiBaseUrl = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '')).replace(/\/$/, '');
const steps = [
  { number: '01', key: 'raw_input', name: 'Raw idea', note: 'Your starting point', icon: FileText, color: 'mint' },
  { number: '02', key: 'edited_text', name: 'Editor node', note: 'Grammar & clarity', icon: WandSparkles, color: 'violet' },
  { number: '03', key: 'script_text', name: 'Scriptwriter node', note: 'Hook & storytelling', icon: Sparkles, color: 'blue' },
  { number: '04', key: 'final_output', name: 'Hinglish node', note: 'Natural localization', icon: Layers3, color: 'amber' },
];

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('final_output');
  const [copied, setCopied] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  async function generate() {
    if (input.trim().length < 8) { setError('Add a little more context so the pipeline has something to work with.'); return; }
    if (!apiBaseUrl) { setError('The API URL is not configured. Add VITE_API_URL in your Vercel project settings and redeploy.'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const response = await fetch(`${apiBaseUrl}/api/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ raw_input: input.trim() }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Something went wrong. Check that the API is running.');
      setResult(data); setActiveTab('final_output');
    } catch (err) { setError(err.message.includes('fetch') ? 'Could not reach the API. Start the Python backend, then try again.' : err.message); }
    finally { setLoading(false); }
  }

  async function copyOutput() {
    if (!result) return;
    await navigator.clipboard.writeText(result[activeTab]); setCopied(true); setTimeout(() => setCopied(false), 1600);
  }

  const outputs = result ? { edited_text: result.edited_text, script_text: result.script_text, final_output: result.final_output } : null;

  return <>
    <header className="topbar"><a className="brand" href="#home"><span className="brand-mark"><GitBranch size={18}/></span><span>scriptflow<span className="brand-dot">.</span></span></a>
      <nav className={mobileMenu ? 'nav open' : 'nav'}><a href="#studio" onClick={()=>setMobileMenu(false)}>Studio</a><a href="#workflow" onClick={()=>setMobileMenu(false)}>Workflow</a><a href="#about" onClick={()=>setMobileMenu(false)}>About</a></nav>
      <a className="top-cta" href="#studio">Try the studio <ArrowUpRight size={15}/></a><button className="menu-toggle" onClick={()=>setMobileMenu(!mobileMenu)} aria-label="Toggle navigation">{mobileMenu?<X/>:<Menu/>}</button>
    </header>
    <main id="home">
      <section className="hero wrap">
        <div className="hero-copy"><div className="eyebrow"><span className="live-dot"/> A FIRST AGENTIC AI PROJECT <span className="eyebrow-line"/></div>
          <h1>Your idea.<br/><span className="gradient-text">A better script.</span></h1>
          <p className="hero-lead">A thoughtful, multi-step writing pipeline that turns a rough idea into a polished video script — then makes it sound like you.</p>
          <div className="hero-actions"><a className="button primary" href="#studio">Write your first script <ArrowRight size={17}/></a><a className="text-link" href="#workflow">See how it works <ArrowDownRight size={16}/></a></div>
          <div className="hero-meta"><span><span className="meta-icon"><GitBranch size={13}/></span> LangGraph-powered</span><i/><span><span className="meta-icon"><Layers3 size={13}/></span> 3 connected nodes</span></div>
        </div>
        <div className="hero-art" aria-label="Abstract visualization of a connected AI workflow"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-core"><GitBranch size={32}/></div><div className="float-node node-a"><WandSparkles size={16}/></div><div className="float-node node-b"><Sparkles size={16}/></div><div className="float-node node-c"><Layers3 size={16}/></div><span className="orbit-label label-a">EDIT</span><span className="orbit-label label-b">WRITE</span><span className="orbit-label label-c">LOCALIZE</span><div className="art-caption"><span className="live-dot"/> IDEAS IN MOTION</div></div>
        <a className="scroll-cue" href="#studio"><span>SCROLL TO CREATE</span><ArrowDown size={14}/></a>
      </section>

      <section className="studio-section" id="studio"><div className="wrap studio-grid">
        <div className="studio-intro"><div className="eyebrow">01 — THE WRITING STUDIO</div><h2>Start with a thought.<br/><span className="muted-text">See where it goes.</span></h2><p>Drop in a rough idea, a few notes, or a draft. Your AI writing pipeline will take it through each step.</p><div className="suggestion-card"><div className="suggestion-top"><span className="suggestion-icon"><Lightbulb size={15}/></span><span>NEED A STARTING POINT?</span><span className="suggestion-tag">SUGGESTION</span></div><p>“{sample}”</p><button onClick={()=>{setInput(sample);setError('');document.getElementById('idea-input')?.focus()}}>Use this example <ArrowRight size={14}/></button></div></div>
        <div className="editor-card"><div className="editor-head"><div><div className="editor-label"><span className="live-dot"/> YOUR RAW IDEA</div><span className="editor-hint">The rougher, the better.</span></div><span className="char-count">{input.length} <span>/ 8,000</span></span></div><textarea id="idea-input" value={input} onChange={e=>{setInput(e.target.value.slice(0,8000));setError('')}} placeholder="Write your idea here… a topic, a first draft, a voice note transcription — anything to get started." maxLength={8000}/><div className="editor-foot"><span><CircleHelp size={13}/> Your idea stays yours</span><button className="button primary generate-button" onClick={generate} disabled={loading}><span>{loading?'Writing your script…':'Build my script'}</span>{loading?<span className="spinner"/>:<Sparkles size={16}/>}</button></div>{error&&<div className="error-message">{error}</div>}
          <div className="mini-flow">{steps.map((s,i)=><React.Fragment key={s.key}><div className={`mini-step ${s.color}`}><s.icon size={13}/><span>{s.name}</span></div>{i<steps.length-1&&<ArrowRight className="mini-arrow" size={13}/>}</React.Fragment>)}</div>
        </div>
      </div>
      {loading&&<div className="wrap loading-track"><span className="loading-bar"/></div>}
      {result&&<div className="wrap results-wrap"><div className="results-head"><div><span className="eyebrow"><span className="live-dot"/> YOUR PIPELINE RESULTS</span><h3>From rough idea to ready-to-record.</h3></div><button className="copy-button" onClick={copyOutput}>{copied?<Check size={15}/>:<Copy size={15}/>} {copied?'Copied':'Copy output'}</button></div><div className="result-card"><div className="result-tabs">{steps.slice(1).map(s=><button key={s.key} onClick={()=>setActiveTab(s.key)} className={activeTab===s.key?'active':''}><s.icon size={14}/>{s.name}</button>)}</div><div className="result-body"><div className="result-step-label">{steps.find(s=>s.key===activeTab)?.number} / {steps.find(s=>s.key===activeTab)?.note}</div><p>{outputs[activeTab]}</p></div></div></div>}
      </section>

      <section className="workflow-section section-pad" id="workflow"><div className="wrap"><div className="section-heading"><div><div className="eyebrow">02 — UNDER THE HOOD</div><h2>One idea. <span className="muted-text">Three focused nodes.</span></h2></div><p>Each node does one job well. LangGraph passes the shared state from one specialist to the next, in a clear, controlled sequence.</p></div>
        <div className="workflow-visual"><div className="workflow-start"><span className="start-dot"/><div><small>INPUT</small><strong>Your raw idea</strong></div></div><div className="workflow-line"><span/></div>{steps.slice(1).map((s,i)=><React.Fragment key={s.key}><div className={`workflow-node ${s.color}`}><div className="node-top"><span className="node-number">{s.number}</span><span className="node-icon"><s.icon size={18}/></span><span className="node-check"><Check size={12}/></span></div><h3>{s.name}</h3><p>{s.note}</p><small>{['Fixes grammar & sharpens your tone','Finds the hook & writes for spoken delivery','Adapts the script into natural Hinglish'][i]}</small></div><div className="workflow-line"><span/></div></React.Fragment>)}<div className="workflow-end"><span className="end-icon"><Play size={14} fill="currentColor"/></span><div><small>OUTPUT</small><strong>Ready to record</strong></div></div></div>
        <div className="state-note"><span className="state-icon"><Cpu size={16}/></span><p><strong>Shared state, passed forward.</strong> Each node reads the work so far and adds its result. The next node gets the updated state — no manual handoffs, and every stage stays visible.</p><span className="state-code">StateGraph → app.invoke()</span></div>
        <div className="reference-card"><div className="reference-copy"><span className="eyebrow">THE ORIGINAL SKETCH</span><h3>The idea that started it all.</h3><p>A simple sequential workflow on paper — now brought to life as an interactive writing studio.</p></div><img src="/workflow-reference.png" alt="Original project sketch: raw data moves through Editor, Scriptwriter and Hinglish nodes to an output."/></div>
      </div></section>

      <section className="about-section section-pad" id="about"><div className="wrap"><div className="section-heading"><div><div className="eyebrow">03 — ABOUT THE PROJECT</div><h2>A small project.<br/><span className="gradient-text">A big idea.</span></h2></div><p>This is the first project in my journey of learning agentic AI: exploring how to give language models structure, clear responsibilities, and a reliable path from input to output.</p></div>
        <div className="about-grid"><article className="about-card about-main"><span className="card-kicker">THE PROJECT</span><div className="about-mark"><GitBranch size={24}/></div><h3>A multi-stage scriptwriting pipeline.</h3><p>Built for a creator who starts with a rough script and wants a sharper, more engaging result. Three focused LangGraph nodes refine the idea, shape it into a spoken video script, and adapt it into natural Hinglish.</p><div className="tech-tags"><span>Python</span><span>LangGraph</span><span>LangChain</span><span>Groq</span><span>React</span></div></article>
          <article className="about-card"><span className="card-kicker">WHY LANGGRAPH?</span><h3>More control over the flow.</h3><p>LangChain offers useful components for working with language models. LangGraph builds on that ecosystem with an explicit graph: nodes do the work, edges define the route, and shared state carries context between steps. That makes a multi-stage pipeline easier to trace, extend, and later branch or loop.</p><div className="compare"><div><span>LANGCHAIN</span><strong>Useful building blocks</strong></div><ArrowRight size={15}/><div><span>LANGGRAPH</span><strong>Controlled workflows</strong></div></div></article>
          <article className="about-card"><span className="card-kicker">WHAT I LEARNED</span><h3>Good agents need good structure.</h3><p>Breaking one big task into smaller specialist nodes makes each step easier to reason about. I learned how to define state, create nodes, connect them with edges, compile a graph, and pass results through a sequential workflow.</p><div className="learning-list"><span><Check size={13}/> Design a shared state</span><span><Check size={13}/> Give each node one clear job</span><span><Check size={13}/> Compose a predictable workflow</span></div></article>
          <article className="about-card"><span className="card-kicker">WHAT COMES NEXT</span><h3>A foundation to keep building.</h3><p>This first version follows a straight line from input to output. The same graph can grow into review loops, conditional routes, human feedback, and persistent memory as I keep learning agentic AI.</p><a className="text-link card-link" href="#studio">Try the pipeline <ArrowUpRight size={14}/></a></article></div>
      </div></section>

      <section className="faq-section"><div className="wrap faq-grid"><div><div className="eyebrow">A FEW QUICK ANSWERS</div><h2>Curious about<br/><span className="muted-text">the workflow?</span></h2></div><div className="faq-list">{[{q:'What happens to my input?',a:'Your text is sent to the local Python API, then passed through the three LangGraph nodes in sequence. The results are returned to the studio so you can inspect each stage.'},{q:'Do I need to write a polished prompt?',a:'No. Start with a rough idea, a topic, or an early draft. The editor node is there to improve clarity before the scriptwriter shapes it.'},{q:'Why does the final result use Hinglish?',a:'The third node is designed to localize the conversational script into natural Hindi-English speech for an Indian audience. You can inspect the edited and scriptwriter stages too.'}].map((item,i)=><div className={`faq-item ${openFaq===i?'expanded':''}`} key={item.q}><button onClick={()=>setOpenFaq(openFaq===i?-1:i)}><span>{item.q}</span><ChevronDown size={16}/></button>{openFaq===i&&<p>{item.a}</p>}</div>)}</div></div></section>
      <footer className="footer"><div className="wrap footer-inner"><a className="brand" href="#home"><span className="brand-mark"><GitBranch size={18}/></span><span>scriptflow<span className="brand-dot">.</span></span></a><span>Built with curiosity, LangGraph & a first step into agentic AI.</span><a href="#home">Back to top ↑</a></div></footer>
    </main>
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
