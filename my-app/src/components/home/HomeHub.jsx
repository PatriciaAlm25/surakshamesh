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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* 1. HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(224,242,254,0.9) 100%)',
        border: '1.5px solid rgba(14, 165, 233, 0.25)',
        borderRadius: '24px',
        padding: 'clamp(28px, 6vw, 52px) clamp(16px, 4vw, 40px)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(14, 116, 189, 0.12)'
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '340px', height: '340px', background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '5%', width: '320px', height: '320px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(14, 165, 233, 0.1)', border: '1.5px solid rgba(14, 165, 233, 0.3)', borderRadius: '999px', marginBottom: '18px', maxWidth: '100%' }}>
            <Sparkles size={15} color="#0ea5e9" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0284c7', letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.3 }}>
              National Child Online Safety Protocol
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.75rem, 4.5vw, 2.75rem)', lineHeight: 1.18, fontWeight: 800, marginBottom: '18px', color: '#0f172a' }}>
            Detect the Pattern. Protect the Child.{' '}
            <span style={{ background: 'linear-gradient(90deg, #0ea5e9 0%, #6366f1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Trigger the Right Intervention.
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(0.88rem, 2vw, 1.02rem)', color: '#334155', lineHeight: 1.6, marginBottom: '28px', maxWidth: '740px', margin: '0 auto 28px auto' }}>
            SURAKSHA MESH is an explainable, multilingual AI architecture that analyzes multi-day conversation escalation, intercepts harmful media before viewing, preserves child anonymity, and routes verified digital alerts to ground-level child protection advocates.
          </p>

          {/* Call to Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            <button
              className="btn-primary"
              style={{ fontSize: '0.94rem', padding: '12px 24px' }}
              onClick={() => setActiveTab('simulator')}
            >
              <Sparkles size={17} />
              Launch Live AI Chat Lab
            </button>
            <button
              className="btn-purple"
              style={{ fontSize: '0.94rem', padding: '12px 22px' }}
              onClick={() => setActiveTab('report')}
            >
              <Lock size={17} />
              Anonymous Invisible SOS
            </button>
          </div>

          {/* Trust Guarantees */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(14, 116, 189, 0.15)', fontSize: '0.82rem', color: '#334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="#059669" />
              <span>Multi-Day Grooming Radar</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="#0ea5e9" />
              <span>Indic Multilingual NLP</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="#7c3aed" />
              <span>Encrypted Anonymous Case ID</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE THREE PILLARS */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.75rem)', marginBottom: '6px', color: '#0f172a' }}>
            The 3-Pillar Protection Architecture
          </h2>
          <p style={{ color: '#334155', fontSize: '0.9rem' }}>
            Bridging digital detection with immediate physical and psychological intervention.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '18px' }}>

          {/* Pillar 1: Digital Guardrails */}
          <div style={{
            background: 'rgba(255,255,255,0.9)',
            border: '1.5px solid rgba(14, 165, 233, 0.2)',
            borderTop: '4px solid #0ea5e9',
            borderRadius: '16px',
            padding: 'clamp(18px, 3.5vw, 26px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 4px 20px rgba(14, 116, 189, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(14, 165, 233, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Shield size={20} color="#0ea5e9" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', color: '#0f172a' }}>1. Digital Guardrails</h3>
                <span style={{ fontSize: '0.74rem', color: '#0ea5e9', fontWeight: 600 }}>Detect Danger Early</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#334155' }}>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#0ea5e9', fontWeight: 700 }}>•</span>
                <span><strong>Multi-Stage Grooming Radar:</strong> Analyzes escalation rather than isolated keywords.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#0ea5e9', fontWeight: 700 }}>•</span>
                <span><strong>Multilingual Indic NLP:</strong> Evaluates English, Hindi, Hinglish, Marathi vernculars.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#0ea5e9', fontWeight: 700 }}>•</span>
                <span><strong>Pre-View Media Shield:</strong> Intercepts incoming photo/video payloads before exposure.</span>
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
            padding: 'clamp(18px, 3.5vw, 26px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Lock size={20} color="#8b5cf6" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', color: '#0f172a' }}>2. Support Ecosystem</h3>
                <span style={{ fontSize: '0.74rem', color: '#8b5cf6', fontWeight: 600 }}>Safe Reporting</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#334155' }}>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#8b5cf6', fontWeight: 700 }}>•</span>
                <span><strong>Invisible Anonymous SOS:</strong> Zero forced accounts with secure ID.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#8b5cf6', fontWeight: 700 }}>•</span>
                <span><strong>AI Case Translator:</strong> Converts child natural language stories into clinical triage evidence.</span>
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
            padding: 'clamp(18px, 3.5vw, 26px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 4px 20px rgba(5, 150, 105, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(5, 150, 105, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <UserCheck size={20} color="#059669" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', color: '#0f172a' }}>3. Physical-Digital Link</h3>
                <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 600 }}>Real-World Care</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#334155' }}>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#059669', fontWeight: 700 }}>•</span>
                <span><strong>Priority-Based Case Triage:</strong> Immediate P1 dispatch for severe grooming vs P3 for cyber advice.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#059669', fontWeight: 700 }}>•</span>
                <span><strong>Safety Graph Cluster:</strong> Correlates cross-platform repeat offender tactics anonymously.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#059669', fontWeight: 700 }}>•</span>
                <span><strong>SafeSchool Heatmap:</strong> Anonymized zone insights for proactive anti-bullying school workshops.</span>
              </li>
            </ul>
            <button className="btn-secondary" style={{ marginTop: 'auto', width: '100%' }} onClick={() => setActiveTab('graph')}>
              Explore Safety Graph <ArrowRight size={15} />
            </button>
          </div>

        </div>
      </section>

      {/* 3. FEATURE SHOWCASE PORTALS GRID */}
      <section>
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', marginBottom: '4px', color: '#0f172a' }}>
            Explore Interactive Platform Modules
          </h2>
          <p style={{ color: '#334155', fontSize: '0.88rem' }}>
            Select any component to test live AI classification, OCR extraction, or responder workflows.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '16px' }}>

          {[
            { id: 'simulator', icon: <Sparkles size={20} color="#0ea5e9" />, color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)', label: 'Centerpiece', title: 'AI Safety Lab (Chat)', desc: 'Interactive Instagram/WhatsApp DM simulator with age modes (<14 vs 14+), multi-day grooming escalation radar, and media shields.', cta: 'Test Live Simulator' },
            { id: 'ocr', icon: <FileSearch size={20} color="#8b5cf6" />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', title: 'OCR & Screenshot Lab', desc: 'Upload conversation screenshots or comment threads to test simulated OCR text extraction and multi-lingual risk scoring.', cta: 'Run Screenshot Analysis' },
            { id: 'report', icon: <Lock size={20} color="#059669" />, color: '#059669', bg: 'rgba(5,150,105,0.1)', title: 'Invisible SOS Reporting', desc: 'Zero-friction child reporting with AI Case Translator that extracts categories, urgency, and encrypted evidence tokens.', cta: 'File Anonymous Report' },
            { id: 'assistant', icon: <MessageSquare size={20} color="#0ea5e9" />, color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)', title: 'Suraksha AI Copilot', desc: 'Safe conversational companion offering trauma-informed advice, safety checkups, and guided help in 11 Indian languages.', cta: 'Chat with Assistant' },
            { id: 'graph', icon: <Network size={20} color="#8b5cf6" />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', title: 'Safety Graph Cluster', desc: 'Visualizes cross-platform predatory patterns and tactics across anonymized cases to spot serial grooming rings.', cta: 'Explore Graph' },
            { id: 'safeschool', icon: <MapPin size={20} color="#0ea5e9" />, color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)', title: 'SafeSchool Regional Heatmap', desc: 'Aggregated geographical safety metrics and threat distributions across school zones with zero personal identity exposure.', cta: 'View SafeSchool Map' }
          ].map((card) => (
            <div
              key={card.id}
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: '1.5px solid rgba(14, 116, 189, 0.15)',
                borderRadius: '16px',
                padding: '18px',
                cursor: 'pointer',
                transition: 'all 0.22s ease',
                boxShadow: '0 2px 12px rgba(14, 116, 189, 0.07)',
                position: 'relative'
              }}
              onClick={() => setActiveTab(card.id)}
            >
              {card.label && (
                <span className="badge-cyan" style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '0.62rem' }}>{card.label}</span>
              )}
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: '1rem', marginBottom: '6px', color: '#0f172a' }}>{card.title}</h3>
              <p style={{ fontSize: '0.82rem', color: '#334155', marginBottom: '12px', lineHeight: 1.5 }}>{card.desc}</p>
              <div style={{ color: card.color, fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
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
        padding: 'clamp(20px, 4vw, 32px)',
        boxShadow: '0 4px 24px rgba(99, 102, 241, 0.1)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '20px', alignItems: 'center' }}>
          <div>
            <span className="badge-purple" style={{ marginBottom: '10px', display: 'inline-flex' }}>AI Technical Difference</span>
            <h3 style={{ fontSize: 'clamp(1.15rem, 3vw, 1.35rem)', marginBottom: '8px', color: '#0f172a' }}>
              Why SURAKSHA MESH Beats Simple Keyword Filters
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.6 }}>
              Standard filters miss grooming because predators initially use innocent words like <em>"You are so mature"</em> or <em>"Let's play together"</em>. Our hybrid engine detects relational trajectory, boundary erosion, secrecy pacing, and coercive escalation.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ background: 'rgba(254, 242, 242, 0.9)', padding: '12px 16px', borderRadius: '12px', borderLeft: '4px solid #ef4444', border: '1px solid rgba(220,38,38,0.15)', borderLeftWidth: '4px' }}>
              <div style={{ fontSize: '0.76rem', color: '#dc2626', fontWeight: 700, marginBottom: '2px' }}>GENERIC KEYWORD APPROACH ❌</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>"Photo" = Flagged; "Don't tell mom" = Missed; Zero contextual trajectory.</div>
            </div>

            <div style={{ background: 'rgba(240, 249, 255, 0.9)', padding: '12px 16px', borderRadius: '12px', borderLeft: '4px solid #0ea5e9', border: '1px solid rgba(14,165,233,0.15)', borderLeftWidth: '4px' }}>
              <div style={{ fontSize: '0.76rem', color: '#0284c7', fontWeight: 700, marginBottom: '2px' }}>SURAKSHA MESH PIPELINE ✅</div>
              <div style={{ fontSize: '0.8rem', color: '#0f172a' }}>Conversation History → Indic NLP → Pattern Escalation Radar → Explainable Score → Actionable Shield.</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
