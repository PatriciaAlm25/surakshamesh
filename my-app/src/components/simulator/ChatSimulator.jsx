import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.8)', padding: '6px 14px', borderRadius: '10px', fontSize: '0.75rem', border: '1px solid var(--border-subtle)' }}>
            <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={14} /> SIMULATED INSTAGRAM / WHATSAPP DM (DEMO ONLY)
            </span>
            <span style={{ color: 'var(--text-muted)' }}>Strict Sandboxed Sandbox</span>
          </div>

          {/* Chat Phone Frame */}
          <div className="chat-phone-frame">
            
            {/* Header */}
            <div className="chat-phone-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img 
                  src={currentScenario.contact.avatar} 
                  alt={currentScenario.contact.name}
                  style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38bdf8' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {currentScenario.contact.name}
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }} title="Online" />
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {currentScenario.contact.handle} • Unknown Contact
                  </div>
                </div>
              </div>

              {/* Quick Header Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={handleBlockUser}
                  style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="Block this contact"
                >
                  <UserX size={13} /> Block
                </button>
              </div>
            </div>

            {/* Blocked Notification Overlay */}
            {isBlocked && (
              <div style={{ background: 'rgba(239, 68, 68, 0.95)', color: '#fff', padding: '10px', fontSize: '0.8rem', textAlign: 'center', fontWeight: 600 }}>
                🚫 Contact {currentScenario.contact.name} has been blocked and muted.
              </div>
            )}

            {/* Messages Area */}
            <div className="chat-messages-area">
              <div style={{ textAlign: 'center', margin: '8px 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                🔒 Messages are monitored by SURAKSHA MESH AI Layer
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
                        <span style={{ fontSize: '0.68rem', padding: '2px 8px', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', borderRadius: '999px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
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
                            <div style={{ marginTop: '6px', padding: '6px 10px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '6px', fontSize: '0.75rem', color: '#fca5a5' }}>
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
                                <AlertTriangle size={26} color="#ef4444" style={{ marginBottom: '6px' }} />
                                <strong style={{ fontSize: '0.8rem', color: '#f87171' }}>⚠️ Potentially Unsafe Media Intercepted</strong>
                                <p style={{ fontSize: '0.7rem', color: '#cbd5e1', margin: '4px 0 8px 0' }}>
                                  AI Shield detected possible explicit or sensitive imagery before display.
                                </p>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button 
                                    onClick={() => handleTriggerSOS()} 
                                    className="btn-danger" 
                                    style={{ padding: '4px 10px', fontSize: '0.7rem' }}
                                  >
                                    Report SOS
                                  </button>
                                  <button 
                                    onClick={() => handleBlockUser()} 
                                    className="btn-secondary" 
                                    style={{ padding: '4px 10px', fontSize: '0.7rem' }}
                                  >
                                    Block Sender
                                  </button>
                                  <button 
                                    onClick={() => setRevealedMedia({ ...revealedMedia, [msg.id]: true })} 
                                    style={{ background: 'transparent', color: '#94a3b8', fontSize: '0.68rem', padding: '2px 6px' }}
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
                              <div style={{ fontSize: '0.68rem', color: '#f87171', marginTop: '4px' }}>
                                [Warning: Synthetic safety test image]
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Meta */}
                      <div className="message-meta">
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="message-bubble message-incoming" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'fit-content' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', animation: 'pulseGlow 1s infinite' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', animation: 'pulseGlow 1s infinite 0.2s' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', animation: 'pulseGlow 1s infinite 0.4s' }} />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '4px' }}>{currentScenario.contact.name} is typing...</span>
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
                style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
              />
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ padding: '8px 12px' }}
                disabled={isBlocked || !customInputText.trim()}
              >
                <Send size={15} />
              </button>
            </form>

            {/* AI Safety Bottom Control Bar */}
            <div className="chat-ai-status-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={16} color={isAiEnabled ? (analysis.level === 'HIGH' ? '#ef4444' : '#38bdf8') : '#64748b'} />
                <span>
                  {userAge < 14 ? (
                    <strong style={{ color: '#38bdf8' }}>🛡️ AI SAFETY: ACTIVE (Protected Mode)</strong>
                  ) : (
                    <strong>
                      🛡️ AI SAFETY: {isAiEnabled ? <span style={{ color: '#34d399' }}>● ON</span> : <span style={{ color: '#64748b' }}>○ OFF</span>}
                    </strong>
                  )}
                </span>
              </div>

              {/* Toggle for 14+ */}
              {userAge >= 14 ? (
                <button
                  onClick={() => setIsAiEnabled(!isAiEnabled)}
                  style={{
                    background: isAiEnabled ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    color: isAiEnabled ? '#38bdf8' : 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 600
                  }}
                >
                  {isAiEnabled ? 'Disable AI' : 'Enable AI'}
                </button>
              ) : (
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  🔒 Auto-Locked for minor protection
                </span>
              )}
            </div>

          </div>
        </div>

        {/* COLUMN 3: Explainable AI Analytics Engine & Live Risk Radar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Main Risk Score Card */}
          <div className={`glass-panel ${analysis.level === 'HIGH' ? 'glass-panel-danger' : ''}`} style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Live Risk Assessment
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: analysis.level === 'HIGH' ? '#f87171' : (analysis.level === 'MEDIUM' ? '#fbbf24' : '#34d399') }}>
                    {isAiEnabled ? `${analysis.score}/100` : '--/--'}
                  </span>
                  {isAiEnabled && (
                    <span className={analysis.level === 'HIGH' ? 'badge-danger' : (analysis.level === 'MEDIUM' ? 'badge-warning' : 'badge-safe')}>
                      {analysis.level} RISK
                    </span>
                  )}
                </div>
              </div>

              {isAiEnabled && analysis.level === 'HIGH' && (
                <div className="animate-pulse-glow" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={20} color="#ef4444" />
                </div>
              )}
            </div>

            {/* Risk Meter Bar */}
            {isAiEnabled && (
              <div style={{ background: '#0a101d', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '14px' }}>
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
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Category: <strong style={{ color: 'var(--text-primary)' }}>{analysis.category.replace('_', ' ')}</strong>
            </div>

            {/* Detected Behavioral Indicators */}
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                Detected Progression Indicators:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {analysis.indicators.length > 0 ? (
                  analysis.indicators.map((ind, i) => (
                    <span key={i} className="badge-danger" style={{ fontSize: '0.7rem' }}>
                      ⚠️ {ind}
                    </span>
                  ))
                ) : (
                  <span className="badge-safe" style={{ fontSize: '0.7rem' }}>
                    ✅ No harmful patterns detected
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Recharts Risk Progression Timeline Graph */}
          {isAiEnabled && (
            <div className="glass-panel" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                  📈 Multi-Step Escalation Curve
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Progression Radar</span>
              </div>

              <div style={{ width: '100%', height: 140 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analysis.progression}>
                    <XAxis dataKey="step" stroke="#475569" fontSize={10} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#475569" fontSize={10} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ background: '#0f172a', border: '1px solid #38bdf8', borderRadius: '8px', fontSize: '0.75rem' }}
                      formatter={(val) => [`${val}% Risk`, 'Score']}
                    />
                    <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="3 3" />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#38bdf8" 
                      strokeWidth={2.5} 
                      dot={{ r: 4, fill: '#38bdf8' }}
                      activeDot={{ r: 6, fill: '#ef4444' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Action Recommendations Card */}
          <div className="glass-panel" style={{ padding: '18px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#34d399" />
              Recommended Protective Action
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {analysis.recommendations.map((rec, i) => (
                <div key={i} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '8px 10px', borderRadius: '8px', borderLeft: '2px solid #38bdf8' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc' }}>
                    {rec.action}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    {rec.detail}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action Button */}
            {analysis.level === 'HIGH' && (
              <button 
                className="btn-danger" 
                style={{ width: '100%', marginTop: '12px', fontSize: '0.82rem', padding: '10px' }}
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
