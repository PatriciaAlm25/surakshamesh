import React, { useState } from 'react';
import { Send, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function ConversationSafety() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [currentSender, setCurrentSender] = useState('Alex');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    setMessages([...messages, { text: inputValue.trim(), sender: currentSender }]);
    setInputValue('');
    setAnalysisResult(null); // Clear previous analysis when a new message is added
  };

  const handleReset = () => {
    setMessages([]);
    setAnalysisResult(null);
    setError(null);
    setInputValue('');
  };

  const handleAnalyze = async () => {
    if (messages.length === 0) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/analyze-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages.map(m => m.text) })
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze conversation');
      }
      
      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (severity) => {
    if (severity === 'CRITICAL' || severity === 'HIGH') return '#ef4444';
    if (severity === 'MEDIUM') return '#fbbf24';
    return '#34d399';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '840px', margin: '0 auto', width: '100%' }}>
      
      {/* Chat Section */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h2 style={{ marginBottom: '8px', color: '#0f172a' }}>Conversation Safety Radar</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
          Simulate a multi-message conversation to see how the AI evaluates escalating risk and behavioral tactics.
        </p>
        
        <div style={{ background: '#f8fafc', border: '1.5px solid rgba(14, 116, 189, 0.18)', padding: '18px', borderRadius: '14px', minHeight: '260px', margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto', fontStyle: 'italic', fontSize: '0.9rem' }}>
              💬 Add messages below to analyze the conversation progression.
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isAlex = msg.sender === 'Alex';
              return (
                <div key={idx} style={{ 
                  alignSelf: isAlex ? 'flex-start' : 'flex-end', 
                  background: isAlex ? '#ffffff' : 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', 
                  border: isAlex ? '1.5px solid rgba(14, 116, 189, 0.2)' : 'none', 
                  padding: '10px 16px', 
                  borderRadius: '16px', 
                  maxWidth: '80%', 
                  color: isAlex ? '#0f172a' : '#ffffff',
                  boxShadow: '0 2px 8px rgba(14, 116, 189, 0.08)'
                }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: isAlex ? '#0284c7' : '#e0f2fe', marginBottom: '3px', textAlign: isAlex ? 'left' : 'right' }}>
                    {msg.sender} (Message {idx + 1})
                  </div>
                  <div style={{ fontSize: '0.9rem', lineHeight: 1.45 }}>{msg.text}</div>
                </div>
              );
            })
          )}
        </div>
        
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <select 
            value={currentSender} 
            onChange={(e) => setCurrentSender(e.target.value)}
            style={{ padding: '12px 14px', borderRadius: '10px', border: '1.5px solid var(--border-medium)', background: '#ffffff', color: '#0f172a', fontWeight: 600, outline: 'none' }}
          >
            <option value="Alex">Alex (Contact)</option>
            <option value="Sam">Sam (Child)</option>
          </select>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Type a message as ${currentSender}...`}
            style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-medium)', background: '#ffffff', color: '#0f172a', fontSize: '0.92rem' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '0 24px', borderRadius: '10px' }}>
            <Send size={18} /> Send
          </button>
        </form>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleAnalyze} 
            disabled={messages.length === 0 || isAnalyzing}
            className="btn-primary"
            style={{ 
              flex: 2, 
              padding: '14px', 
              borderRadius: '10px',
              fontWeight: 'bold',
              opacity: messages.length > 0 && !isAnalyzing ? 1 : 0.6,
              cursor: messages.length > 0 && !isAnalyzing ? 'pointer' : 'not-allowed'
            }}
          >
            {isAnalyzing ? 'Analyzing conversation...' : '🔍 Analyze Conversation Safety'}
          </button>

          <button 
            onClick={handleReset} 
            disabled={messages.length === 0}
            className="btn-secondary"
            style={{ 
              flex: 1, 
              padding: '14px', 
              borderRadius: '10px',
              fontWeight: 'bold',
              color: '#dc2626',
              borderColor: 'rgba(220, 38, 38, 0.3)',
              opacity: messages.length > 0 ? 1 : 0.6,
              cursor: messages.length > 0 ? 'pointer' : 'not-allowed'
            }}
          >
            Reset
          </button>
        </div>
        
        {error && <div style={{ color: '#dc2626', marginTop: '14px', fontSize: '0.9rem', fontWeight: 600 }}>⚠️ {error}</div>}
      </div>
      
      {/* Analysis Results Section */}
      {analysisResult && (
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Overall Risk */}
          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800 }}>Conversation Risk Level</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: getRiskColor(analysisResult.overall_severity) }}>
                {analysisResult.overall_risk_score} <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ 100</span>
              </div>
              <div style={{ background: getRiskColor(analysisResult.overall_severity) + '18', color: getRiskColor(analysisResult.overall_severity), padding: '6px 16px', borderRadius: '999px', fontWeight: 'bold', border: `1.5px solid ${getRiskColor(analysisResult.overall_severity)}`, fontSize: '0.85rem' }}>
                {analysisResult.overall_severity} RISK
              </div>
            </div>
            
            <div style={{ marginTop: '16px', padding: '16px 20px', background: '#f8fafc', borderRadius: '12px', border: '1.5px solid rgba(14, 116, 189, 0.18)', borderLeft: `5px solid ${analysisResult.escalation ? '#ef4444' : '#059669'}` }}>
              <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.05rem' }}>
                {analysisResult.escalation ? '⚠️ Risk is escalating across this conversation.' : '✅ No significant escalation detected.'}
              </div>
              {analysisResult.escalation && (
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Multiple warning signals appeared as the conversation progressed.
                </div>
              )}
            </div>
          </div>
          
          {/* Progression */}
          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800 }}>Risk Progression by Message</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              {analysisResult.risk_progression.map((r, i) => (
                <React.Fragment key={i}>
                  <div style={{ background: '#ffffff', padding: '12px 18px', borderRadius: '12px', textAlign: 'center', border: '1.5px solid rgba(14, 116, 189, 0.2)', boxShadow: '0 2px 8px rgba(14, 116, 189, 0.06)', minWidth: '90px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>Message {r.message_number}</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '2px' }}>
                      {r.score}
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 'bold', color: getRiskColor(r.severity) }}>
                      {r.severity}
                    </div>
                  </div>
                  {i < analysisResult.risk_progression.length - 1 && <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', fontSize: '1.2rem' }}>➔</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {/* Warning Signals */}
          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800 }}>Warning Signals Detected</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {analysisResult.detected_patterns && analysisResult.detected_patterns.length > 0 ? (
                analysisResult.detected_patterns.map((p, i) => (
                  <div key={i} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1.5px solid rgba(239, 68, 68, 0.35)', color: '#b91c1c', padding: '8px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 700 }}>
                    <AlertTriangle size={16} color="#dc2626" /> 
                    {p.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </div>
                ))
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#047857', background: 'rgba(5, 150, 105, 0.1)', padding: '10px 16px', borderRadius: '10px', border: '1.5px solid rgba(5, 150, 105, 0.3)', fontWeight: 700, fontSize: '0.88rem' }}>
                  <ShieldCheck size={18} color="#059669" /> No warning signals detected
                </div>
              )}
            </div>
          </div>
          
          {/* Safety Explanation */}
          {analysisResult.safety_explanation && (
            <div style={{ marginTop: '6px', padding: '24px', background: '#f8fafc', borderRadius: '14px', border: '1.5px solid rgba(14, 116, 189, 0.22)', boxShadow: '0 4px 16px rgba(14, 116, 189, 0.06)' }}>
              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
                  {analysisResult.overall_category === 'safe' ? '✅' : '⚠️'} {analysisResult.safety_explanation.title}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
                  {analysisResult.safety_explanation.reason}
                </p>
              </div>
              
              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
                  🛡️ {analysisResult.safety_explanation.action_title}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
                  {analysisResult.safety_explanation.action}
                </p>
              </div>
              
              <div style={{ padding: '14px 18px', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '10px', borderLeft: '4px solid #0284c7' }}>
                <p style={{ color: '#0369a1', fontSize: '0.92rem', fontWeight: 'bold', margin: 0 }}>
                  💙 {analysisResult.safety_explanation.reassurance}
                </p>
              </div>
            </div>
          )}
          
        </div>
      )}
    </div>
  );
}
