import React from 'react';
import { Shield, PhoneCall, Lock, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(180deg, #e0f2fe 0%, #dbeafe 100%)',
      borderTop: '1px solid rgba(14, 116, 189, 0.18)',
      padding: '40px 24px 20px 24px',
      marginTop: 'auto'
    }}>
      <div style={{ maxWidth: '1380px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '30px', marginBottom: '30px' }}>

        {/* Col 1: Mission */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div className="brand-icon-box" style={{ width: '32px', height: '32px', borderRadius: '10px' }}>
              <Shield size={18} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
              SURAKSHA MESH
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.65 }}>
            "Detect the Pattern. Protect the Child. Trigger the Right Intervention."
            An explainable, privacy-first AI safety network integrating multilingual NLP, grooming progression radar, and child welfare responders.
          </p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
            <span className="badge-safe">🛡️ Zero PII Stored</span>
            <span className="badge-cyan">🇮🇳 DPDP Compliant</span>
          </div>
        </div>

        {/* Col 2: Helplines */}
        <div>
          <h4 style={{ fontSize: '0.92rem', color: '#0284c7', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
            <PhoneCall size={16} /> Verified Emergency Helplines (India)
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', padding: 0 }}>
            <li style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '4px', color: '#334155', borderBottom: '1px solid rgba(14, 116, 189, 0.12)', paddingBottom: '6px' }}>
              <span>Childline National Helpline:</span>
              <strong style={{ color: '#0284c7' }}>1098</strong>
            </li>
            <li style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '4px', color: '#334155', borderBottom: '1px solid rgba(14, 116, 189, 0.12)', paddingBottom: '6px' }}>
              <span>National Cybercrime Helpline:</span>
              <strong style={{ color: '#dc2626' }}>1930</strong>
            </li>
            <li style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '4px', color: '#334155', borderBottom: '1px solid rgba(14, 116, 189, 0.12)', paddingBottom: '6px' }}>
              <span>NCPCR e-BaalNidan:</span>
              <strong style={{ color: '#7c3aed', wordBreak: 'break-all' }}>baalnidan.ncpcr.gov.in</strong>
            </li>
            <li style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '4px', color: '#334155' }}>
              <span>KIRAN Mental Health:</span>
              <strong style={{ color: '#059669' }}>1800-599-0019</strong>
            </li>
          </ul>
        </div>

        {/* Col 3: Architecture & Privacy */}
        <div>
          <h4 style={{ fontSize: '0.92rem', color: '#7c3aed', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
            <Lock size={16} /> Privacy & Tech Stack
          </h4>
          <p style={{ fontSize: '0.83rem', color: '#334155', marginBottom: '10px', lineHeight: 1.6 }}>
            Powered by <strong>React + Vite</strong>, <strong>FastAPI Hybrid NLP</strong>, <strong>Indic Transformer Pipeline</strong>, and <strong>Supabase PostgreSQL</strong> with client-side zero-knowledge encryption.
          </p>
          <div style={{ fontSize: '0.78rem', color: '#64748b', padding: '8px 12px', background: 'rgba(255,255,255,0.6)', borderRadius: '8px', border: '1px solid rgba(14,116,189,0.12)' }}>
            No child biometric or raw location data is ever shared with unverified parties.
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1380px', margin: '0 auto', paddingTop: '18px', borderTop: '1px solid rgba(14, 116, 189, 0.15)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: '#64748b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Heart size={12} color="#ef4444" fill="#ef4444" />
          © 2026 SURAKSHA MESH AI Protocol • National Child Online Safety Framework
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
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
