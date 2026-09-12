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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      
      {/* Chat Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ marginBottom: '8px' }}>Conversation Safety</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Simulate a multi-message conversation to see how the AI evaluates escalating risk.
        </p>
        
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', minHeight: '250px', margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto', fontStyle: 'italic' }}>
              Add messages to analyze the conversation.
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isAlex = msg.sender === 'Alex';
              return (
                <div key={idx} style={{ 
                  alignSelf: isAlex ? 'flex-start' : 'flex-end', 
                  background: isAlex ? 'rgba(56, 189, 248, 0.1)' : 'rgba(168, 85, 247, 0.1)', 
                  border: isAlex ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(168, 85, 247, 0.3)', 
                  padding: '10px 14px', 
                  borderRadius: '12px', 
                  maxWidth: '80%', 
                  color: '#f8fafc' 
                }}>
                  <div style={{ fontSize: '0.7rem', color: isAlex ? '#38bdf8' : '#c084fc', marginBottom: '4px', textAlign: isAlex ? 'left' : 'right' }}>
                    {msg.sender} (Message {idx + 1})
                  </div>
                  {msg.text}
                </div>
              );
            })
          )}
        </div>
        
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <select 
            value={currentSender} 
            onChange={(e) => setCurrentSender(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'rgba(15, 23, 42, 0.8)', color: 'white', outline: 'none' }}
          >
            <option value="Alex">Alex</option>
            <option value="Sam">Sam</option>
          </select>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Type a message as ${currentSender}...`}
            style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'rgba(15, 23, 42, 0.8)', color: 'white' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '0 24px', borderRadius: '8px' }}>
            <Send size={18} /> Send
          </button>
        </form>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleAnalyze} 
            disabled={messages.length === 0 || isAnalyzing}
            style={{ 
              flex: 2, 
              padding: '14px', 
              background: messages.length > 0 ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)', 
              border: messages.length > 0 ? '1px solid #38bdf8' : '1px solid var(--border-subtle)', 
              color: messages.length > 0 ? '#38bdf8' : 'var(--text-muted)',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: messages.length > 0 && !isAnalyzing ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease'
            }}
          >
            {isAnalyzing ? 'Analyzing conversation...' : 'Analyze Conversation'}
          </button>

          <button 
            onClick={handleReset} 
            disabled={messages.length === 0}
            style={{ 
              flex: 1, 
              padding: '14px', 
              background: messages.length > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)', 
              border: messages.length > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border-subtle)', 
              color: messages.length > 0 ? '#ef4444' : 'var(--text-muted)',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: messages.length > 0 ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease'
            }}
          >
            Reset
          </button>
        </div>
        
        {error && <div style={{ color: '#ef4444', marginTop: '14px', fontSize: '0.9rem' }}>⚠️ {error}</div>}
      </div>
      
      {/* Analysis Results Section */}
      {analysisResult && (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Overall Risk */}
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Conversation Risk</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: getRiskColor(analysisResult.overall_severity) }}>
                {analysisResult.overall_risk_score} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ 100</span>
              </div>
              <div style={{ background: getRiskColor(analysisResult.overall_severity) + '22', color: getRiskColor(analysisResult.overall_severity), padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', border: `1px solid ${getRiskColor(analysisResult.overall_severity)}` }}>
                {analysisResult.overall_severity} RISK
              </div>
            </div>
            
            <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', borderLeft: `4px solid ${analysisResult.escalation ? '#ef4444' : '#34d399'}` }}>
              <div style={{ fontWeight: 'bold', color: '#f8fafc', fontSize: '1.05rem' }}>
                {analysisResult.escalation ? 'Risk is increasing across this conversation.' : 'No significant escalation detected.'}
              </div>
              {analysisResult.escalation && (
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Multiple warning signals appeared over time.
                </div>
              )}
            </div>
          </div>
          
          {/* Progression */}
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Risk Progression</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
              {analysisResult.risk_progression.map((r, i) => (
                <React.Fragment key={i}>
                  <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '10px 18px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-subtle)', minWidth: '80px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Message {r.message_number}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '4px' }}>
                      {r.score}
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: getRiskColor(r.severity) }}>
                      {r.severity}
                    </div>
                  </div>
                  {i < analysisResult.risk_progression.length - 1 && <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {/* Warning Signals */}
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Warning Signals Detected</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {analysisResult.detected_patterns && analysisResult.detected_patterns.length > 0 ? (
                analysisResult.detected_patterns.map((p, i) => (
                  <div key={i} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '8px 14px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                    <AlertTriangle size={16} color="#ef4444" /> 
                    {p.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </div>
                ))
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', background: 'rgba(52, 211, 153, 0.1)', padding: '8px 14px', borderRadius: '6px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                  <ShieldCheck size={18} /> No warning signals detected
                </div>
              )}
            </div>
          </div>
          
          {/* Safety Explanation */}
          {analysisResult.safety_explanation && (
            <div style={{ marginTop: '10px', padding: '24px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '1.05rem', color: '#f8fafc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {analysisResult.overall_category === 'safe' ? '✅' : '⚠️'} {analysisResult.safety_explanation.title}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {analysisResult.safety_explanation.reason}
                </p>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '1.05rem', color: '#f8fafc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🛡️ {analysisResult.safety_explanation.action_title}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {analysisResult.safety_explanation.action}
                </p>
              </div>
              
              <div style={{ padding: '12px 16px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', borderLeft: '4px solid #38bdf8' }}>
                <p style={{ color: '#38bdf8', fontSize: '0.95rem', fontWeight: 'bold', margin: 0 }}>
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
