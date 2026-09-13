import React, { useState } from 'react';
import { Shield, Sparkles, AlertCircle, FileSearch, MessageSquare, Lock, Network, MapPin, Menu, X } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, userAge, setUserAge }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'simulator', label: 'AI Safety Lab', icon: <Sparkles size={14} color="#0ea5e9" /> },
    { id: 'safety', label: 'Conversation Safety', icon: <Shield size={14} color="#10b981" /> },
    { id: 'ocr', label: 'OCR Lab', icon: <FileSearch size={14} color="#8b5cf6" /> },
    { id: 'report', label: 'Invisible SOS', icon: <Lock size={14} color="#059669" /> },
    { id: 'assistant', label: 'AI Assistant', icon: <MessageSquare size={14} color="#0ea5e9" /> },
    { id: 'graph', label: 'Safety Graph', icon: <Network size={14} color="#8b5cf6" /> },
    { id: 'safeschool', label: 'SafeSchool', icon: <MapPin size={14} color="#0ea5e9" /> }
  ];

  return (
    <>
      <header className="navbar">
        <div className="nav-inner">
          {/* Brand */}
          <div className="brand-logo" onClick={() => handleSelectTab('home')}>
            <div className="brand-icon-box">
              <Shield size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #0ea5e9, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  SURAKSHA MESH
                </span>
                <span className="badge-cyan" style={{ fontSize: '0.6rem', padding: '1px 6px' }}>
                  v2.0
                </span>
              </div>
              <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: 0, whiteSpace: 'nowrap' }}>
                Child Protection Protocol
              </p>
            </div>
          </div>

          {/* Desktop Center Nav Links */}
          <nav className="nav-desktop">
            <ul className="nav-links">
              {navItems.map(item => (
                <li key={item.id}>
                  <button
                    className={`nav-item-btn ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => handleSelectTab(item.id)}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Age Toggle & Quick SOS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Age Selection Pill (Hidden on tiny screens, shown in drawer) */}
            <div className="nav-desktop" style={{
              background: 'rgba(241, 245, 249, 0.95)',
              padding: '3px 6px',
              borderRadius: '8px',
              border: '1.5px solid rgba(14, 116, 189, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Mode:</span>
              <button
                onClick={() => setUserAge(12)}
                style={{
                  fontSize: '0.72rem',
                  padding: '3px 7px',
                  borderRadius: '6px',
                  background: userAge < 14 ? 'linear-gradient(135deg, #0ea5e9, #2563eb)' : 'transparent',
                  color: userAge < 14 ? '#fff' : 'var(--text-muted)',
                  fontWeight: userAge < 14 ? 700 : 400,
                  border: 'none',
                  cursor: 'pointer'
                }}
                title="Under 14: AI Guardrails automatically LOCKED ON"
              >
                👦 &lt;14
              </button>
              <button
                onClick={() => setUserAge(16)}
                style={{
                  fontSize: '0.72rem',
                  padding: '3px 7px',
                  borderRadius: '6px',
                  background: userAge >= 14 ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'transparent',
                  color: userAge >= 14 ? '#fff' : 'var(--text-muted)',
                  fontWeight: userAge >= 14 ? 700 : 400,
                  border: 'none',
                  cursor: 'pointer'
                }}
                title="14+: User controls AI Guardrail toggle"
              >
                🧑 14+
              </button>
            </div>

            {/* Quick SOS */}
            <button
              className="btn-danger"
              style={{ padding: '7px 12px', fontSize: '0.78rem', borderRadius: '8px', whiteSpace: 'nowrap' }}
              onClick={() => handleSelectTab('report')}
            >
              <AlertCircle size={14} />
              SOS
            </button>

            {/* Mobile Hamburger Button */}
            <button
              className="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          {/* Mobile Age Mode Switch */}
          <div style={{
            background: 'rgba(241, 245, 249, 0.95)',
            padding: '8px 12px',
            borderRadius: '12px',
            border: '1.5px solid rgba(14, 116, 189, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Safety Mode:</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setUserAge(12)}
                style={{
                  fontSize: '0.78rem',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  background: userAge < 14 ? 'linear-gradient(135deg, #0ea5e9, #2563eb)' : 'transparent',
                  color: userAge < 14 ? '#fff' : 'var(--text-muted)',
                  fontWeight: userAge < 14 ? 700 : 500,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                👦 &lt;14 Protected
              </button>
              <button
                onClick={() => setUserAge(16)}
                style={{
                  fontSize: '0.78rem',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  background: userAge >= 14 ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'transparent',
                  color: userAge >= 14 ? '#fff' : 'var(--text-muted)',
                  fontWeight: userAge >= 14 ? 700 : 500,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                🧑 14+ Controlled
              </button>
            </div>
          </div>

          {/* Navigation Links Grid */}
          <ul className="mobile-nav-list">
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  className={`mobile-nav-item-btn ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => handleSelectTab(item.id)}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

