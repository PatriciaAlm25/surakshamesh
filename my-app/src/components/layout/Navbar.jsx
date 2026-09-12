import React from 'react';
import { Shield, Sparkles, AlertCircle, FileSearch, MessageSquare, Lock, Activity, Eye, Network, MapPin } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, userAge, setUserAge }) {
  return (
    <header className="navbar">
      <div className="nav-inner">
        {/* Brand */}
        <div className="brand-logo" onClick={() => setActiveTab('home')}>
          <div className="brand-icon-box">
            <Shield size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #38bdf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                SURAKSHA MESH
              </span>
              <span className="badge-cyan" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                AI Shield v2.0
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
              AI Digital Guardrails & Child Protection Protocol
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav>
          <ul className="nav-links">
            <li>
              <button
                className={`nav-item-btn ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                🏠 Home
              </button>
            </li>
            <li>
              <button
                className={`nav-item-btn ${activeTab === 'simulator' ? 'active' : ''}`}
                onClick={() => setActiveTab('simulator')}
                style={{ position: 'relative' }}
              >
                <Sparkles size={15} color="#38bdf8" />
                AI Safety Lab (Chat)
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', position: 'absolute', top: '6px', right: '6px' }} />
              </button>
            </li>
            <li>
              <button
                className={`nav-item-btn ${activeTab === 'ocr' ? 'active' : ''}`}
                onClick={() => setActiveTab('ocr')}
              >
                <FileSearch size={15} color="#a855f7" />
                OCR & Screenshot Lab
              </button>
            </li>
            <li>
              <button
                className={`nav-item-btn ${activeTab === 'report' ? 'active' : ''}`}
                onClick={() => setActiveTab('report')}
              >
                <Lock size={15} color="#10b981" />
                Invisible SOS
              </button>
            </li>
            <li>
              <button
                className={`nav-item-btn ${activeTab === 'tracker' ? 'active' : ''}`}
                onClick={() => setActiveTab('tracker')}
              >
                <Activity size={15} />
                Track Case ID
              </button>
            </li>
            <li>
              <button
                className={`nav-item-btn ${activeTab === 'assistant' ? 'active' : ''}`}
                onClick={() => setActiveTab('assistant')}
              >
                <MessageSquare size={15} color="#38bdf8" />
                Suraksha Assistant
              </button>
            </li>
            <li>
              <button
                className={`nav-item-btn ${activeTab === 'responder' ? 'active' : ''}`}
                onClick={() => setActiveTab('responder')}
              >
                <Eye size={15} color="#f59e0b" />
                Responder Desk
              </button>
            </li>
            <li>
              <button
                className={`nav-item-btn ${activeTab === 'graph' ? 'active' : ''}`}
                onClick={() => setActiveTab('graph')}
              >
                <Network size={15} color="#c084fc" />
                Safety Graph
              </button>
            </li>
            <li>
              <button
                className={`nav-item-btn ${activeTab === 'safeschool' ? 'active' : ''}`}
                onClick={() => setActiveTab('safeschool')}
              >
                <MapPin size={15} color="#38bdf8" />
                SafeSchool Map
              </button>
            </li>
          </ul>
        </nav>

        {/* Age Toggle & Quick SOS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Age Selection Pill */}
          <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '4px 8px', borderRadius: '10px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>User Mode:</span>
            <button
              onClick={() => setUserAge(12)}
              style={{
                fontSize: '0.75rem',
                padding: '3px 8px',
                borderRadius: '6px',
                background: userAge < 14 ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'transparent',
                color: userAge < 14 ? '#fff' : 'var(--text-muted)',
                fontWeight: userAge < 14 ? 700 : 400
              }}
              title="Under 14: AI Guardrails automatically LOCKED ON"
            >
              👦 &lt;14 (Protected)
            </button>
            <button
              onClick={() => setUserAge(16)}
              style={{
                fontSize: '0.75rem',
                padding: '3px 8px',
                borderRadius: '6px',
                background: userAge >= 14 ? 'linear-gradient(135deg, #a855f7, #7c3aed)' : 'transparent',
                color: userAge >= 14 ? '#fff' : 'var(--text-muted)',
                fontWeight: userAge >= 14 ? 700 : 400
              }}
              title="14+: User controls AI Guardrail toggle"
            >
              🧑 14+ (Controlled)
            </button>
          </div>

          {/* Quick SOS */}
          <button
            className="btn-danger"
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
            onClick={() => setActiveTab('report')}
          >
            <AlertCircle size={15} />
            SOS 1098
          </button>
        </div>
      </div>
    </header>
  );
}
