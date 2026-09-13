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
  Globe,
  UserCheck,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

export default function HomeHub({ setActiveTab, userAge, setUserAge }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '44px' }}>

      {/* 1. HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(224,242,254,0.9) 100%)',
        border: '1.5px solid rgba(14, 165, 233, 0.25)',
        borderRadius: '24px',
        padding: '52px 40px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(14, 116, 189, 0.12)'
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '340px', height: '340px', background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '5%', width: '320px', height: '320px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', background: 'rgba(14, 165, 233, 0.1)', border: '1.5px solid rgba(14, 165, 233, 0.3)', borderRadius: '999px', marginBottom: '20px' }}>
            <Sparkles size={15} color="#0ea5e9" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284c7', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              National Child Online Safety & Protection Protocol
            </span>
          </div>

          <h1 style={{ fontSize: '2.8rem', lineHeight: 1.12, fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
            Detect the Pattern. Protect the Child.{' '}
            <span style={{ background: 'linear-gradient(90deg, #0ea5e9 0%, #6366f1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Trigger the Right Intervention.
            </span>
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#334155', lineHeight: 1.65, marginBottom: '36px', maxWidth: '740px', margin: '0 auto 36px auto' }}>
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
              Launch Live AI Chat Lab
            </button>
            <button
              className="btn-purple"
              style={{ fontSize: '1rem', padding: '14px 26px' }}
              onClick={() => setActiveTab('report')}
            >
              <Lock size={18} />
              Anonymous Invisible SOS
            </button>

          </div>

          {/* Trust Guarantees */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', marginTop: '36px', paddingTop: '24px', borderTop: '1px solid rgba(14, 116, 189, 0.15)', fontSize: '0.85rem', color: '#334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#059669" />
              <span>Multi-Day Grooming Radar</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#0ea5e9" />
              <span>Indic Multilingual NLP (Hindi/Hinglish/Marathi)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#7c3aed" />
              <span>Encrypted Anonymous Case ID (SM-2026-XXXXX)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE THREE PILLARS */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '8px', color: '#0f172a' }}>
            The 3-Pillar Protection Architecture
          </h2>
          <p style={{ color: '#334155', fontSize: '0.95rem' }}>
            Bridging digital detection with immediate physical and psychological intervention.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>

          {/* Pillar 1: Digital Guardrails */}
          <div style={{
            background: 'rgba(255,255,255,0.9)',
            border: '1.5px solid rgba(14, 165, 233, 0.2)',
            borderTop: '4px solid #0ea5e9',
            borderRadius: '16px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 4px 20px rgba(14, 116, 189, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(14, 165, 233, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={22} color="#0ea5e9" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#0f172a' }}>1. Digital Guardrails</h3>
                <span style={{ fontSize: '0.75rem', color: '#0ea5e9', fontWeight: 600 }}>Detect Danger Early</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.87rem', color: '#334155' }}>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#0ea5e9', fontWeight: 700 }}>•</span>
                <span><strong>Multi-Stage Grooming Radar:</strong> Analyzes progression (flattery → secrecy → photo request) rather than isolated keywords.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#0ea5e9', fontWeight: 700 }}>•</span>
                <span><strong>Multilingual Indic NLP:</strong> Evaluates English, Hindi, Hinglish, Marathi, and Konkani vernaculars.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#0ea5e9', fontWeight: 700 }}>•</span>
                <span><strong>Pre-View Media Shield:</strong> Intercepts incoming photo/video payloads and blurs before exposure.</span>
              </li>
            </ul>
            <button className="btn-secondary" style={{ marginTop: 'auto', width: '100%' }} onClick={() => setActiveTab('simulator')}>
              Explore Chat Lab <ArrowRight size={15} />
            </button>
          </div>

          {/* Pillar 2: Support Ecosystem */}
          <div style={{
            background: 'rgba(255,255,255,0.9)',
            border: '1.5px solid rgba(139, 92, 246, 0.2)',
            borderTop: '4px solid #8b5cf6',
            borderRadius: '16px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={22} color="#8b5cf6" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#0f172a' }}>2. Support Ecosystem</h3>
                <span style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 600 }}>Safe & Empathetic Reporting</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.87rem', color: '#334155' }}>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#8b5cf6', fontWeight: 700 }}>•</span>
                <span><strong>Invisible Anonymous SOS:</strong> Report without forced accounts; generates secure ID e.g. <code style={{ background: '#f1f5f9', borderRadius: '4px', padding: '1px 5px', color: '#0f172a' }}>SM-2026-84291</code>.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#8b5cf6', fontWeight: 700 }}>•</span>
                <span><strong>AI Case Translator:</strong> Converts child natural language stories into clinical forensic triage evidence.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#8b5cf6', fontWeight: 700 }}>•</span>
                <span><strong>Suraksha Assistant:</strong> Empathetic non-judgmental guidance with zero victim-blaming.</span>
              </li>
            </ul>
            <button className="btn-secondary" style={{ marginTop: 'auto', width: '100%' }} onClick={() => setActiveTab('report')}>
              Open Anonymous SOS <ArrowRight size={15} />
            </button>
          </div>

          {/* Pillar 3: Physical-Digital Link */}
          <div style={{
            background: 'rgba(255,255,255,0.9)',
            border: '1.5px solid rgba(5, 150, 105, 0.2)',
            borderTop: '4px solid #059669',
            borderRadius: '16px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 4px 20px rgba(5, 150, 105, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(5, 150, 105, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCheck size={22} color="#059669" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#0f172a' }}>3. Physical-Digital Link</h3>
                <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Real-World Intervention</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.87rem', color: '#334155' }}>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#059669', fontWeight: 700 }}>•</span>
                <span><strong>Priority-Based Case Triage:</strong> Immediate P1 dispatch for severe grooming vs P3 for cyber hygiene advice.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#059669', fontWeight: 700 }}>•</span>
                <span><strong>Safety Graph Pattern Cluster:</strong> Correlates cross-platform repeat offender tactics while keeping child identity private.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#059669', fontWeight: 700 }}>•</span>
                <span><strong>SafeSchool Regional Heatmap:</strong> Anonymized zone insights for proactive anti-bullying school workshops.</span>
              </li>
            </ul>

          </div>

        </div>
      </section>

      {/* 3. FEATURE SHOWCASE PORTALS GRID */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '22px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '4px', color: '#0f172a' }}>
              Explore Interactive Platform Modules
            </h2>
            <p style={{ color: '#334155', fontSize: '0.9rem' }}>
              Select any component to test live AI classification, OCR extraction, or responder workflows.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>

          {[
            { id: 'simulator', icon: <Sparkles size={22} color="#0ea5e9" />, color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)', label: 'Centerpiece', title: 'AI Safety Lab (Chat)', desc: 'Interactive Instagram/WhatsApp DM simulator with age modes (<14 vs 14+), multi-day grooming escalation radar, and media shields.', cta: 'Test Live Simulator' },
            { id: 'ocr', icon: <FileSearch size={22} color="#8b5cf6" />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', title: 'OCR & Screenshot Lab', desc: 'Upload conversation screenshots or comment threads to test simulated OCR text extraction and multi-lingual risk scoring.', cta: 'Run Screenshot Analysis' },
            { id: 'report', icon: <Lock size={22} color="#059669" />, color: '#059669', bg: 'rgba(5,150,105,0.1)', title: 'Invisible SOS Reporting', desc: 'Zero-friction child reporting with AI Case Translator that extracts categories, urgency, and encrypted evidence tokens.', cta: 'File Anonymous Report' },
            { id: 'assistant', icon: <MessageSquare size={22} color="#0ea5e9" />, color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)', title: 'Suraksha AI Copilot', desc: 'Safe conversational companion offering trauma-informed advice, safety checkups, and guided help in 11 Indian languages.', cta: 'Chat with Assistant' },

            { id: 'graph', icon: <Network size={22} color="#8b5cf6" />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', title: 'Safety Graph Cluster', desc: 'Visualizes cross-platform predatory patterns and tactics across anonymized cases to spot serial grooming rings.', cta: 'Explore Graph' },
            { id: 'safeschool', icon: <MapPin size={22} color="#0ea5e9" />, color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)', title: 'SafeSchool Regional Heatmap', desc: 'Aggregated geographical safety metrics and threat distributions across school zones with zero personal identity exposure.', cta: 'View SafeSchool Map' }
          ].map((card) => (
            <div
              key={card.id}
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: '1.5px solid rgba(14, 116, 189, 0.15)',
                borderRadius: '16px',
                padding: '22px',
                cursor: 'pointer',
                transition: 'all 0.22s ease',
                boxShadow: '0 2px 12px rgba(14, 116, 189, 0.07)',
                position: 'relative'
              }}
              onClick={() => setActiveTab(card.id)}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = card.color;
                e.currentTarget.style.boxShadow = `0 8px 30px ${card.color}22`;
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(14, 116, 189, 0.15)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(14, 116, 189, 0.07)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {card.label && (
                <span className="badge-cyan" style={{ position: 'absolute', top: '14px', right: '14px', fontSize: '0.62rem' }}>{card.label}</span>
              )}
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '8px', color: '#0f172a' }}>{card.title}</h3>
              <p style={{ fontSize: '0.84rem', color: '#334155', marginBottom: '14px', lineHeight: 1.5 }}>{card.desc}</p>
              <div style={{ color: card.color, fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                {card.cta} <ChevronRight size={14} />
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* 4. EXPLAINABLE PIPELINE BANNER */}
      <section style={{
        background: 'linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)',
        border: '1.5px solid rgba(99, 102, 241, 0.25)',
        borderRadius: '20px',
        padding: '36px',
        boxShadow: '0 4px 24px rgba(99, 102, 241, 0.1)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px', alignItems: 'center' }}>
          <div>
            <span className="badge-purple" style={{ marginBottom: '14px', display: 'inline-flex' }}>AI Technical Difference</span>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '10px', color: '#0f172a' }}>
              Why SURAKSHA MESH Beats Simple Keyword Filters
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.6 }}>
              Standard filters miss grooming because predators initially use innocent words like <em>"You are so mature"</em> or <em>"Let's play together"</em>. Our hybrid engine detects relational trajectory, boundary erosion, secrecy pacing, and coercive escalation.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: 'rgba(254, 242, 242, 0.9)', padding: '14px 18px', borderRadius: '12px', borderLeft: '4px solid #ef4444', border: '1px solid rgba(220,38,38,0.15)', borderLeftWidth: '4px' }}>
              <div style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: 700, marginBottom: '4px' }}>GENERIC KEYWORD APPROACH ❌</div>
              <div style={{ fontSize: '0.83rem', color: '#64748b' }}>"Photo" = Flagged; "Don't tell mom" = Missed; Zero contextual trajectory.</div>
            </div>

            <div style={{ background: 'rgba(240, 249, 255, 0.9)', padding: '14px 18px', borderRadius: '12px', borderLeft: '4px solid #0ea5e9', border: '1px solid rgba(14,165,233,0.15)', borderLeftWidth: '4px' }}>
              <div style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 700, marginBottom: '4px' }}>SURAKSHA MESH PIPELINE ✅</div>
              <div style={{ fontSize: '0.83rem', color: '#0f172a' }}>Conversation History → Indic NLP → Pattern Escalation Radar → Explainable Score → Actionable Shield.</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
