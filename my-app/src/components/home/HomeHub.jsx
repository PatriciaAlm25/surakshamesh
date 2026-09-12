import React from 'react';
import { 
  Shield, 
  Sparkles, 
  FileSearch, 
  Lock, 
  Activity, 
  MessageSquare, 
  Eye, 
  Network, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Globe, 
  UserCheck, 
  ChevronRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export default function HomeHub({ setActiveTab, userAge, setUserAge }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      
      {/* 1. HERO SECTION */}
      <section className="glass-panel-glow" style={{ padding: '48px 36px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.18), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '10%', width: '340px', height: '340px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15), transparent 70%)', pointerEvents: 'none' }} />
        
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '999px', marginBottom: '18px' }}>
            <Sparkles size={16} color="#38bdf8" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#38bdf8', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              National Child Online Safety & Protection Protocol
            </span>
          </div>

          <h1 style={{ fontSize: '2.8rem', lineHeight: 1.15, fontWeight: 800, marginBottom: '20px' }}>
            Detect the Pattern. Protect the Child.{' '}
            <span style={{ background: 'linear-gradient(90deg, #38bdf8 0%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Trigger the Right Intervention.
            </span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px', maxWidth: '740px', margin: '0 auto 32px auto' }}>
            SURAKSHA MESH is not just a keyword filter. It is an explainable, multilingual AI architecture that analyzes multi-day conversation escalation, intercepts harmful media before viewing, preserves child anonymity, and routes verified digital alerts to ground-level child protection advocates.
          </p>

          {/* Call to Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
            <button
              className="btn-primary"
              style={{ fontSize: '1rem', padding: '14px 28px' }}
              onClick={() => setActiveTab('simulator')}
            >
              <Sparkles size={18} />
              Launch Live AI Chat Lab (Centerpiece Demo)
            </button>
            <button
              className="btn-purple"
              style={{ fontSize: '1rem', padding: '14px 26px' }}
              onClick={() => setActiveTab('report')}
            >
              <Lock size={18} />
              Anonymous Invisible SOS
            </button>
            <button
              className="btn-secondary"
              style={{ fontSize: '1rem', padding: '14px 24px' }}
              onClick={() => setActiveTab('responder')}
            >
              <Eye size={18} />
              Responder Command Center
            </button>
          </div>

          {/* Trust Guarantees */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', marginTop: '36px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#34d399" />
              <span>Multi-Day Grooming Radar</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#38bdf8" />
              <span>Indic Multilingual NLP (Hindi/Hinglish/Marathi)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#c084fc" />
              <span>Encrypted Anonymous Case ID (`SM-2026-XXXXX`)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE THREE PILLARS (CORE SYSTEM ARCHITECTURE) */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
            The 3-Pillar Protection Architecture
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Bridging digital detection with immediate physical and psychological intervention.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
          
          {/* Pillar 1: Digital Guardrails */}
          <div className="glass-panel" style={{ padding: '28px', borderTop: '3px solid #38bdf8', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={22} color="#38bdf8" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>1. Digital Guardrails</h3>
                <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>Detect Danger Early</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#38bdf8' }}>•</span>
                <span><strong>Multi-Stage Grooming Radar:</strong> Analyzes progression (flattery → secrecy → photo request) rather than isolated keywords.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#38bdf8' }}>•</span>
                <span><strong>Multilingual Indic NLP:</strong> Evaluates English, Hindi, Hinglish, Marathi, and Konkani vernaculars.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#38bdf8' }}>•</span>
                <span><strong>Pre-View Media Shield:</strong> Intercepts incoming photo/video payloads and blurs before exposure.</span>
              </li>
            </ul>
            <button className="btn-secondary" style={{ marginTop: 'auto', width: '100%' }} onClick={() => setActiveTab('simulator')}>
              Explore Chat Lab <ArrowRight size={15} />
            </button>
          </div>

          {/* Pillar 2: Support Ecosystem */}
          <div className="glass-panel" style={{ padding: '28px', borderTop: '3px solid #a855f7', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={22} color="#c084fc" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>2. Support Ecosystem</h3>
                <span style={{ fontSize: '0.75rem', color: '#c084fc' }}>Safe & Empathetic Reporting</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#c084fc' }}>•</span>
                <span><strong>Invisible Anonymous SOS:</strong> Report without forced accounts; generates secure ID e.g. <code>SM-2026-84291</code>.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#c084fc' }}>•</span>
                <span><strong>AI Case Translator:</strong> Converts child natural language stories into clinical forensic triage evidence.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#c084fc' }}>•</span>
                <span><strong>Suraksha Assistant:</strong> Empathetic non-judgmental guidance with zero victim-blaming.</span>
              </li>
            </ul>
            <button className="btn-secondary" style={{ marginTop: 'auto', width: '100%' }} onClick={() => setActiveTab('report')}>
              Open Anonymous SOS <ArrowRight size={15} />
            </button>
          </div>

          {/* Pillar 3: Physical-Digital Link */}
          <div className="glass-panel" style={{ padding: '28px', borderTop: '3px solid #10b981', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCheck size={22} color="#34d399" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>3. Physical-Digital Link</h3>
                <span style={{ fontSize: '0.75rem', color: '#34d399' }}>Real-World Intervention</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#34d399' }}>•</span>
                <span><strong>Priority-Based Case Triage:</strong> Immediate P1 dispatch for severe grooming vs P3 for cyber hygiene advice.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#34d399' }}>•</span>
                <span><strong>Safety Graph Pattern Cluster:</strong> Correlates cross-platform repeat offender tactics while keeping child identity private.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#34d399' }}>•</span>
                <span><strong>SafeSchool Regional Heatmap:</strong> Anonymized zone insights for proactive anti-bullying school workshops.</span>
              </li>
            </ul>
            <button className="btn-secondary" style={{ marginTop: 'auto', width: '100%' }} onClick={() => setActiveTab('responder')}>
              View Responder Portal <ArrowRight size={15} />
            </button>
          </div>

        </div>
      </section>

      {/* 3. FEATURE SHOWCASE PORTALS GRID */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '22px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>
              Explore Interactive Platform Modules
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Select any component to test live AI classification, OCR extraction, or responder workflows.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
          
          {/* Card 1: Chat Simulator */}
          <div 
            className="glass-panel" 
            style={{ padding: '22px', cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative' }}
            onClick={() => setActiveTab('simulator')}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#38bdf8'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          >
            <span className="badge-cyan" style={{ position: 'absolute', top: '16px', right: '16px' }}>Centerpiece</span>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Sparkles size={22} color="#38bdf8" />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>AI Safety Lab (Chat)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Interactive Instagram/WhatsApp DM simulator with age modes (&lt;14 vs 14+), multi-day grooming escalation radar, and media shields.
            </p>
            <div style={{ color: '#38bdf8', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Test Live Simulator <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 2: Screenshot OCR */}
          <div 
            className="glass-panel" 
            style={{ padding: '22px', cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => setActiveTab('ocr')}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#a855f7'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          >
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <FileSearch size={22} color="#c084fc" />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>OCR & Screenshot Lab</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Upload conversation screenshots or comment threads to test simulated OCR text extraction and multi-lingual risk scoring.
            </p>
            <div style={{ color: '#c084fc', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Run Screenshot Analysis <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 3: Invisible SOS */}
          <div 
            className="glass-panel" 
            style={{ padding: '22px', cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => setActiveTab('report')}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#10b981'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          >
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Lock size={22} color="#34d399" />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Invisible SOS Reporting</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Zero-friction child reporting with AI Case Translator that extracts categories, urgency, and encrypted evidence tokens.
            </p>
            <div style={{ color: '#34d399', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              File Anonymous Report <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 4: Track Case ID */}
          <div 
            className="glass-panel" 
            style={{ padding: '22px', cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => setActiveTab('tracker')}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#38bdf8'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          >
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Activity size={22} color="#38bdf8" />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Report Tracker</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Lookup active reports with Anonymous Case ID (e.g., <code>SM-2026-84291</code>) to track progress across support stages.
            </p>
            <div style={{ color: '#38bdf8', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Track Case ID <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 5: Suraksha Assistant */}
          <div 
            className="glass-panel" 
            style={{ padding: '22px', cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => setActiveTab('assistant')}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#38bdf8'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          >
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <MessageSquare size={22} color="#38bdf8" />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Suraksha AI Copilot</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Safe conversational companion offering trauma-informed advice, safety checkups, and guided help.
            </p>
            <div style={{ color: '#38bdf8', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Chat with Assistant <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 6: Responder Desk */}
          <div 
            className="glass-panel" 
            style={{ padding: '22px', cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => setActiveTab('responder')}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#f59e0b'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          >
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Eye size={22} color="#fbbf24" />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Responder Command Center</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Triage queue for verified NGOs, School Counselors, and Cyber Cell officers with automated priority classification.
            </p>
            <div style={{ color: '#fbbf24', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Open Responder Desk <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 7: Safety Graph */}
          <div 
            className="glass-panel" 
            style={{ padding: '22px', cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => setActiveTab('graph')}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#a855f7'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          >
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Network size={22} color="#c084fc" />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Safety Graph Cluster</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Visualizes cross-platform predatory patterns and tactics across anonymized cases to spot serial grooming rings.
            </p>
            <div style={{ color: '#c084fc', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Explore Graph <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 8: SafeSchool Map */}
          <div 
            className="glass-panel" 
            style={{ padding: '22px', cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => setActiveTab('safeschool')}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#38bdf8'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          >
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <MapPin size={22} color="#38bdf8" />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>SafeSchool Regional Heatmap</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Aggregated geographical safety metrics and threat distributions across school zones with zero personal identity exposure.
            </p>
            <div style={{ color: '#38bdf8', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              View SafeSchool Map <ChevronRight size={14} />
            </div>
          </div>

        </div>
      </section>

      {/* 4. EXPLAINABLE PIPELINE BANNER */}
      <section className="glass-panel" style={{ padding: '32px', background: 'linear-gradient(135deg, rgba(16, 26, 47, 0.9) 0%, rgba(20, 15, 38, 0.9) 100%)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', alignItems: 'center' }}>
          <div>
            <span className="badge-purple" style={{ marginBottom: '12px' }}>AI Technical Difference</span>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>
              Why SURAKSHA MESH Beats Simple Keyword Filters
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Standard filters miss grooming because predators initially use innocent words like <em>"You are so mature"</em> or <em>"Let's play together"</em>. Our hybrid engine detects relational trajectory, boundary erosion, secrecy pacing, and coercive escalation.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ background: 'rgba(7, 11, 20, 0.8)', padding: '12px 16px', borderRadius: '10px', borderLeft: '3px solid #ef4444' }}>
              <div style={{ fontSize: '0.78rem', color: '#f87171', fontWeight: 700 }}>GENERIC KEYWORD APPROACH ❌</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>"Photo" = Flagged; "Don't tell mom" = Missed; Zero contextual trajectory.</div>
            </div>

            <div style={{ background: 'rgba(7, 11, 20, 0.8)', padding: '12px 16px', borderRadius: '10px', borderLeft: '3px solid #38bdf8' }}>
              <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }}>SURAKSHA MESH PIPELINE ✅</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>Conversation History → Indic NLP → Pattern Escalation Radar → Explainable Score → Actionable Shield.</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
