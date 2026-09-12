import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  ShieldCheck,
  Sparkles, 
  AlertTriangle, 
  Send, 
  Lock, 
  Unlock, 
  UserX, 
  PhoneCall, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  Info, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Radio, 
  Layers, 
  HelpCircle,
  MessageCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { SCENARIO_PRESETS, evaluateConversationSafety } from '../../services/aiEngine';
import confetti from 'canvas-confetti';

export default function ChatSimulator({ userAge, setUserAge, setActiveTab }) {
  const [selectedScenarioId, setSelectedScenarioId] = useState('grooming_progression');
  const [currentScenario, setCurrentScenario] = useState(SCENARIO_PRESETS[0]);
  const [visibleMessageCount, setVisibleMessageCount] = useState(3);
  const [isAiEnabled, setIsAiEnabled] = useState(true); // Always true for under 14
  const [isTyping, setIsTyping] = useState(false);
  const [customInputText, setCustomInputText] = useState('');
  const [revealedMedia, setRevealedMedia] = useState({});
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedAlert, setBlockedAlert] = useState(false);
  const messagesEndRef = useRef(null);

  // Sync scenario
  useEffect(() => {
    const found = SCENARIO_PRESETS.find(s => s.id === selectedScenarioId) || SCENARIO_PRESETS[0];
    setCurrentScenario(found);
    setVisibleMessageCount(Math.min(3, found.messages.length));
    setIsBlocked(false);
    setRevealedMedia({});
  }, [selectedScenarioId]);

  // Keep AI enabled for < 14
  useEffect(() => {
    if (userAge < 14) {
      setIsAiEnabled(true);
    }
  }, [userAge]);

  // Slice visible messages
  const activeMessages = currentScenario.messages.slice(0, visibleMessageCount);

  // Safety evaluation
  const analysis = evaluateConversationSafety(activeMessages, userAge);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, visibleMessageCount, isTyping]);

  const handleNextMessage = () => {
    if (visibleMessageCount < currentScenario.messages.length) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setVisibleMessageCount(prev => prev + 1);
      }, 700);
    }
  };

  const handleResetChat = () => {
    setVisibleMessageCount(2);
    setIsBlocked(false);
    setRevealedMedia({});
  };

  const handleSendCustomMessage = (e) => {
    e.preventDefault();
    if (!customInputText.trim() || isBlocked) return;

    const newMsg = {
      id: `custom-${Date.now()}`,
      sender: 'child',
      text: customInputText.trim(),
      timestamp: 'Just now'
    };

    const updated = {
      ...currentScenario,
      messages: [...currentScenario.messages, newMsg]
    };

    setCurrentScenario(updated);
    setVisibleMessageCount(updated.messages.length);
    setCustomInputText('');

    // Trigger AI response simulation
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const contactReply = {
          id: `reply-${Date.now()}`,
          sender: 'contact',
          text: 'Haha okay, remember keep our secret safe! What else are you doing right now?',
          timestamp: 'Just now'
        };
        const finalScenario = {
          ...updated,
          messages: [...updated.messages, contactReply]
        };
        setCurrentScenario(finalScenario);
        setVisibleMessageCount(finalScenario.messages.length);
      }, 1200);
    }, 600);
  };

  const handleBlockUser = () => {
    setIsBlocked(true);
    setBlockedAlert(true);
    setTimeout(() => setBlockedAlert(false), 5000);
  };

  const handleTriggerSOS = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setActiveTab('report');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header & Context */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '1.4rem' }}>🧪 AI Safety Lab — Simulated Social Chat</h2>
            <span className="badge-cyan">Centerpiece AI Demo</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Interactive Instagram/WhatsApp DM simulator demonstrating multi-stage grooming trajectory, Indic regional NLP, and media protection shields.
          </p>
        </div>

        {/* Age Mode Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Protection Profile:</div>
            <strong style={{ fontSize: '0.88rem', color: userAge < 14 ? '#38bdf8' : '#c084fc' }}>
              {userAge < 14 ? '👦 Under 14 (Mandatory AI Guardrails)' : '🧑 14+ (Controlled Guardrails)'}
            </strong>
          </div>
          <button 
            className="btn-secondary" 
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            onClick={() => setUserAge(userAge < 14 ? 16 : 12)}
          >
            Switch to {userAge < 14 ? '14+' : '<14'}
          </button>
        </div>
      </div>

      {/* 3-Column Simulator Grid */}
      <div className="simulator-layout">
        
        {/* COLUMN 1: Scenario Selector & Presets */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="#38bdf8" />
            <h3 style={{ fontSize: '1rem' }}>Select Test Scenario</h3>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Choose a preset scenario to observe how the AI evaluates different behavioral trajectories:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {SCENARIO_PRESETS.map((sc) => {
              const isSelected = sc.id === selectedScenarioId;
              return (
                <button
                  key={sc.id}
                  onClick={() => setSelectedScenarioId(sc.id)}
                  style={{
                    textAlign: 'left',
                    padding: '12px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                    border: isSelected ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.85rem', color: isSelected ? '#38bdf8' : 'var(--text-primary)' }}>
                      {sc.title}
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                    {sc.description}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Stepper Controls */}
          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span>Conversation Progress:</span>
              <strong style={{ color: '#38bdf8' }}>{visibleMessageCount} of {currentScenario.messages.length} messages</strong>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', padding: '10px' }}
              onClick={handleNextMessage}
              disabled={visibleMessageCount >= currentScenario.messages.length || isBlocked}
            >
              {visibleMessageCount >= currentScenario.messages.length ? 'All Messages Revealed' : '▶ Advance Next Message'}
            </button>

            <button
              className="btn-secondary"
              style={{ width: '100%', padding: '8px', fontSize: '0.8rem' }}
              onClick={handleResetChat}
            >
              <RefreshCw size={14} /> Reset Simulation
            </button>
          </div>
        </div>

        {/* COLUMN 2: Social Media Direct Message Simulation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Label Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '8px 16px', borderRadius: '12px', fontSize: '0.78rem', border: '1.5px solid rgba(14, 116, 189, 0.2)', boxShadow: '0 2px 8px rgba(14, 116, 189, 0.05)' }}>
            <span style={{ color: '#b45309', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={15} color="#d97706" /> SIMULATED INSTAGRAM / WHATSAPP DM
            </span>
            <span style={{ color: '#0284c7', fontWeight: 600 }}>Sandboxed Safe Demo</span>
          </div>

          {/* Chat Phone Frame */}
          <div className="chat-phone-frame">
            
            {/* Header */}
            <div className="chat-phone-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img 
                  src={currentScenario.contact.avatar} 
                  alt={currentScenario.contact.name}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0284c7' }}
                />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {currentScenario.contact.name}
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }} title="Online" />
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 500 }}>
                    {currentScenario.contact.handle} • Unknown Contact
                  </div>
                </div>
              </div>

              {/* Quick Header Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={handleBlockUser}
                  style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#b91c1c', border: '1.5px solid rgba(220, 38, 38, 0.3)', padding: '6px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                  title="Block this contact"
                >
                  <UserX size={14} /> Block
                </button>
              </div>
            </div>

            {/* Blocked Notification Overlay */}
            {isBlocked && (
              <div style={{ background: '#dc2626', color: '#ffffff', padding: '10px', fontSize: '0.82rem', textAlign: 'center', fontWeight: 700 }}>
                🚫 Contact {currentScenario.contact.name} has been blocked and muted.
              </div>
            )}

            {/* Messages Area */}
            <div className="chat-messages-area">
              <div style={{ textAlign: 'center', margin: '8px 0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                🔒 Monitored by SURAKSHA MESH Real-Time AI Radar
              </div>

              {activeMessages.map((msg, idx) => {
                const isChild = msg.sender === 'child';
                const isUnsafeMedia = msg.media_type === 'image' && msg.is_unsafe;
                const isMediaRevealed = revealedMedia[msg.id];

                return (
                  <div key={msg.id || idx} style={{ display: 'flex', flexDirection: 'column' }}>
                    
                    {/* Stage Marker if available */}
                    {msg.stage && (
                      <div style={{ textAlign: 'center', margin: '6px 0' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', background: 'rgba(124, 58, 237, 0.12)', color: '#7c3aed', borderRadius: '999px', border: '1px solid rgba(124, 58, 237, 0.3)' }}>
                          Stage: {msg.stage}
                        </span>
                      </div>
                    )}

                    <div className={`message-bubble ${isChild ? 'message-outgoing' : 'message-incoming'}`}>
                      
                      {/* Text content */}
                      {msg.text && (
                        <div>
                          {msg.text}
                          {/* Highlight malicious link if present */}
                          {msg.text.includes('http') && (
                            <div style={{ marginTop: '8px', padding: '8px 12px', background: 'rgba(220, 38, 38, 0.1)', border: '1.5px solid #dc2626', borderRadius: '8px', fontSize: '0.78rem', color: '#991b1b', fontWeight: 600 }}>
                              ⚠️ <strong>SURAKSHA Warning:</strong> Suspicious external domain detected. Do not click.
                            </div>
                          )}
                        </div>
                      )}

                      {/* Unsafe Media Shield Overlay */}
                      {isUnsafeMedia && (
                        <div style={{ marginTop: '8px' }}>
                          {!isMediaRevealed ? (
                            <div className="media-shield-box">
                              <img src={msg.media_url} alt="Blurred thumbnail" className="media-blur-layer" />
                              <div className="media-shield-content">
                                <AlertTriangle size={28} color="#dc2626" style={{ marginBottom: '6px' }} />
                                <strong style={{ fontSize: '0.84rem', color: '#991b1b', fontWeight: 800 }}>⚠️ Potentially Unsafe Media Intercepted</strong>
                                <p style={{ fontSize: '0.74rem', color: '#334155', margin: '4px 0 10px 0', lineHeight: 1.4 }}>
                                  AI Shield detected possible explicit or sensitive imagery before display.
                                </p>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                  <button 
                                    onClick={() => handleTriggerSOS()} 
                                    className="btn-danger" 
                                    style={{ padding: '6px 12px', fontSize: '0.74rem' }}
                                  >
                                    Report SOS
                                  </button>
                                  <button 
                                    onClick={() => handleBlockUser()} 
                                    className="btn-secondary" 
                                    style={{ padding: '6px 12px', fontSize: '0.74rem' }}
                                  >
                                    Block Sender
                                  </button>
                                  <button 
                                    onClick={() => setRevealedMedia({ ...revealedMedia, [msg.id]: true })} 
                                    style={{ background: 'transparent', color: '#64748b', fontSize: '0.7rem', padding: '2px 6px', textDecoration: 'underline' }}
                                    title="View synthetic demo image"
                                  >
                                    [Demo Reveal]
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <img src={msg.media_url} alt="Revealed" style={{ width: '100%', borderRadius: '10px', maxHeight: '180px', objectFit: 'cover' }} />
                              <div style={{ fontSize: '0.72rem', color: '#dc2626', marginTop: '4px', fontWeight: 600 }}>
                                [Warning: Synthetic safety test image]
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Meta */}
                      <div className="message-meta" style={{ color: isChild ? '#e0f2fe' : '#64748b' }}>
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="message-bubble message-incoming" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'fit-content' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0284c7', animation: 'pulseGlow 1s infinite' }} />
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0284c7', animation: 'pulseGlow 1s infinite 0.2s' }} />
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0284c7', animation: 'pulseGlow 1s infinite 0.4s' }} />
                  <span style={{ fontSize: '0.74rem', color: '#475569', marginLeft: '4px', fontWeight: 600 }}>{currentScenario.contact.name} is typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Custom Input Bar */}
            <form onSubmit={handleSendCustomMessage} className="chat-input-bar">
              <input
                type="text"
                placeholder={isBlocked ? "Contact blocked" : "Type a reply (English, Hindi, Marathi)..."}
                value={customInputText}
                onChange={e => setCustomInputText(e.target.value)}
                disabled={isBlocked}
                style={{ flex: 1, padding: '10px 14px', fontSize: '0.88rem', background: '#ffffff', borderRadius: '10px' }}
              />
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ padding: '10px 14px', borderRadius: '10px' }}
                disabled={isBlocked || !customInputText.trim()}
              >
                <Send size={16} />
              </button>
            </form>

            {/* AI Safety Bottom Control Bar */}
            <div className="chat-ai-status-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={16} color={isAiEnabled ? (analysis.level === 'HIGH' ? '#dc2626' : '#0284c7') : '#64748b'} />
                <span>
                  {userAge < 14 ? (
                    <strong style={{ color: '#0284c7' }}>🛡️ AI SAFETY: ACTIVE (Protected Mode)</strong>
                  ) : (
                    <strong style={{ color: '#0f172a' }}>
                      🛡️ AI SAFETY: {isAiEnabled ? <span style={{ color: '#047857', fontWeight: 800 }}>● ON</span> : <span style={{ color: '#64748b' }}>○ OFF</span>}
                    </strong>
                  )}
                </span>
              </div>

              {/* Toggle for 14+ */}
              {userAge >= 14 ? (
                <button
                  onClick={() => setIsAiEnabled(!isAiEnabled)}
                  style={{
                    background: isAiEnabled ? 'rgba(14, 165, 233, 0.12)' : 'rgba(0, 0, 0, 0.05)',
                    color: isAiEnabled ? '#0284c7' : 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isAiEnabled ? 'Disable AI' : 'Enable AI'}
                </button>
              ) : (
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                  🔒 Auto-Locked for minor protection
                </span>
              )}
            </div>

          </div>
        </div>

        {/* COLUMN 3: Explainable AI Analytics Engine & Live Risk Radar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Main Risk Score Card */}
          <div className={`glass-panel ${analysis.level === 'HIGH' ? 'glass-panel-danger' : ''}`} style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                  Live Risk Assessment
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 900, color: analysis.level === 'HIGH' ? '#dc2626' : (analysis.level === 'MEDIUM' ? '#d97706' : '#047857') }}>
                    {isAiEnabled ? `${analysis.score}/100` : '--/--'}
                  </span>
                  {isAiEnabled && (
                    <span className={analysis.level === 'HIGH' ? 'badge-danger' : (analysis.level === 'MEDIUM' ? 'badge-warning' : 'badge-safe')} style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                      {analysis.level} RISK
                    </span>
                  )}
                </div>
              </div>

              {isAiEnabled && analysis.level === 'HIGH' && (
                <div className="animate-pulse-glow" style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={22} color="#dc2626" />
                </div>
              )}
            </div>

            {/* Risk Meter Bar */}
            {isAiEnabled && (
              <div style={{ background: '#e2e8f0', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '14px' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${analysis.score}%`, 
                    background: analysis.score >= 75 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : (analysis.score >= 40 ? '#f59e0b' : '#10b981'),
                    transition: 'width 0.4s ease'
                  }} 
                />
              </div>
            )}

            {/* AI Category */}
            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Category: <strong style={{ color: 'var(--text-primary)' }}>{analysis.category.replace('_', ' ')}</strong>
            </div>

            {/* Detected Behavioral Indicators */}
            <div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', fontWeight: 700 }}>
                Detected Progression Indicators:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {analysis.indicators.length > 0 ? (
                  analysis.indicators.map((ind, i) => (
                    <span key={i} className="badge-danger" style={{ fontSize: '0.74rem' }}>
                      ⚠️ {ind}
                    </span>
                  ))
                ) : (
                  <span className="badge-safe" style={{ fontSize: '0.74rem' }}>
                    ✅ No harmful patterns detected
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Recharts Risk Progression Timeline Graph */}
          {isAiEnabled && (
            <div className="glass-panel" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0284c7' }}>
                  📈 Multi-Step Escalation Curve
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Progression Radar</span>
              </div>

              <div style={{ width: '100%', height: 140 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analysis.progression}>
                    <XAxis dataKey="step" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ background: '#ffffff', border: '1.5px solid #0ea5e9', borderRadius: '8px', fontSize: '0.78rem', color: '#0f172a', fontWeight: 700 }}
                      formatter={(val) => [`${val}% Risk`, 'Score']}
                    />
                    <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="3 3" />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#0284c7" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#0284c7' }}
                      activeDot={{ r: 6, fill: '#dc2626' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Action Recommendations Card */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
              <ShieldCheck size={18} color="#047857" />
              Recommended Protective Action
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {analysis.recommendations.map((rec, i) => (
                <div key={i} style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid rgba(14, 116, 189, 0.18)', borderLeft: '4px solid #0284c7' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>
                    {rec.action}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {rec.detail}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action Button */}
            {analysis.level === 'HIGH' && (
              <button 
                className="btn-danger" 
                style={{ width: '100%', marginTop: '14px', fontSize: '0.86rem', padding: '12px', borderRadius: '10px' }}
                onClick={handleTriggerSOS}
              >
                🚨 Escalate to Anonymous SOS Report
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
