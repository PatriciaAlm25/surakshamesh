import React from 'react';
import { Shield, PhoneCall, Globe, Lock, Heart, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#050811', borderTop: '1px solid var(--border-subtle)', padding: '40px 24px 20px 24px', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1380px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '30px' }}>
        
        {/* Col 1: Mission */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div className="brand-icon-box" style={{ width: '32px', height: '32px' }}>
              <Shield size={18} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              SURAKSHA MESH
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            “Detect the Pattern. Protect the Child. Trigger the Right Intervention.”
            An explainable, privacy-first AI safety network integrating multilingual NLP, grooming progression radar, and child welfare responders.
          </p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
            <span className="badge-safe">🛡️ Zero PII Stored</span>
            <span className="badge-cyan">🇮🇳 DPDP Compliant</span>
          </div>
        </div>

        {/* Col 2: Helplines */}
        <div>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-cyan)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PhoneCall size={16} /> Verified Emergency Helplines (India)
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
              <span>Childline National Helpline:</span>
              <strong style={{ color: '#38bdf8' }}>1098</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
              <span>National Cybercrime Helpline:</span>
              <strong style={{ color: '#f87171' }}>1930</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
              <span>NCPCR e-BaalNidan:</span>
              <strong style={{ color: '#c084fc' }}>baalnidan.ncpcr.gov.in</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>KIRAN Mental Health:</span>
              <strong style={{ color: '#34d399' }}>1800-599-0019</strong>
            </li>
          </ul>
        </div>

        {/* Col 3: Architecture & Privacy */}
        <div>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-purple)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={16} /> Privacy & Tech Stack
          </h4>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            Powered by <strong>React + Vite</strong>, <strong>FastAPI Hybrid NLP</strong>, <strong>Indic Transformer Pipeline</strong>, and <strong>Supabase PostgreSQL</strong> with client-side zero-knowledge encryption.
          </p>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            No child biometric or raw location data is ever shared with unverified parties.
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1380px', margin: '0 auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <div>
          © 2026 SURAKSHA MESH AI Protocol • National Child Online Safety Framework
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>Digital Guardrails</span>
          <span>•</span>
          <span>Support Ecosystem</span>
          <span>•</span>
          <span>Physical-Digital Link</span>
        </div>
      </div>
    </footer>
  );
}
