import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Shield, 
  Sparkles, 
  PhoneCall, 
  Lock, 
  Heart, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';

const INITIAL_BOT_MESSAGES = [
  {
    id: 'welcome',
    sender: 'bot',
    text: "👋 Hi! I'm your Suraksha Assistant. You are safe here. I can help you understand what to do if someone online makes you feel uncomfortable, asks for private photos, or threatens you. You are never in trouble for asking for help.",
    timestamp: 'Just now'
  }
];

const SUGGESTED_QUESTIONS = [
  "Someone online is asking for my private photos. What should I do?",
  "Someone is threatening to share my private chats with my school friends.",
  "How do I block and report someone safely?",
  "Will my parents be mad at me if I report this?",
  "What is Childline 1098 and who answers the call?"
];

export default function SurakshaAssistant({ setActiveTab }) {
  const [messages, setMessages] = useState(INITIAL_BOT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateAssistantReply = (userQuery) => {
    const q = userQuery.toLowerCase();
    
    if (q.includes('photo') || q.includes('pic') || q.includes('tasveer') || q.includes('selfie')) {
      return "🛑 **Please do not send any photos.** You have the right to say NO. No real friend will ever pressure you or ask you to keep secrets from your parents. You can take screenshots as evidence, block their account, and use our **Invisible SOS** to alert child advocates anonymously. Would you like me to help you submit a report?";
    }
    
    if (q.includes('threat') || q.includes('leak') || q.includes('bully') || q.includes('hate') || q.includes('blackmail')) {
      return "🛡️ **Please remember: This is NOT your fault.** Predators and bullies try to make you feel isolated and scared. Do not pay them or do what they demand. Keep the chat screenshots safely, block them, and talk to a trusted adult. You can also call **1098 (Childline)** or **1930 (National Cyber Cell)** 24/7.";
    }

    if (q.includes('parent') || q.includes('mad') || q.includes('trouble') || q.includes('gussa')) {
      return "❤️ **You are not in trouble.** Children are often tricked by manipulators online. Caring parents and guardians want to protect you from harm, not punish you. If you feel scared to tell them alone, our verified NGO counsellors or a school teacher can help you talk to them together.";
    }

    if (q.includes('1098') || q.includes('childline')) {
      return "📞 **Childline 1098** is a free, 24/7 national emergency phone service in India for children in need of care and protection. Trained counsellors answer with kindness, keep your call confidential, and help you stay safe.";
    }

    if (q.includes('block') || q.includes('report')) {
      return "🔒 To stay safe: 1) Stop replying immediately. 2) Tap the three dots on their profile and select **Block** and **Report**. 3) File an **Invisible SOS Report** right here on SURAKSHA MESH to get a private Case ID.";
    }

    return "💬 I understand this is concerning. Remember that you are never alone and this is not your fault. I strongly recommend not responding to suspicious accounts, taking evidence screenshots, and clicking our **Invisible SOS** button to notify verified child advocates. You can also reach Childline at **1098** anytime.";
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botReply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: generateAssistantReply(userMsg.text),
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, botReply]);
    }, 900);
  };

  const handleSelectSuggested = (prompt) => {
    setInputText(prompt);
  };

  return (
    <div style={{ maxWidth: '940px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '22px 28px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #0284c7, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={22} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem' }}>Suraksha AI Safety Assistant</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Empathetic, non-judgmental guidance & verified child protection advice.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge-safe">🛡️ Safe Space</span>
          <span className="badge-cyan">24/7 Childline 1098</span>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="glass-panel" style={{ height: '540px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div 
                key={msg.id} 
                style={{ 
                  display: 'flex', 
                  gap: '10px', 
                  alignSelf: isBot ? 'flex-start' : 'flex-end',
                  maxWidth: '85%'
                }}
              >
                {isBot && (
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Shield size={16} color="#040914" />
                  </div>
                )}
                <div 
                  style={{ 
                    background: isBot ? 'rgba(30, 41, 59, 0.85)' : 'linear-gradient(135deg, #0284c7, #2563eb)',
                    color: '#f8fafc',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    borderBottomLeftRadius: isBot ? '4px' : '16px',
                    borderBottomRightRadius: isBot ? '16px' : '4px',
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                  <div style={{ fontSize: '0.68rem', opacity: 0.7, textAlign: 'right', marginTop: '4px' }}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={16} color="#040914" />
              </div>
              <div style={{ background: 'rgba(30, 41, 59, 0.85)', padding: '10px 14px', borderRadius: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Suraksha Assistant is writing...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div style={{ padding: '8px 16px', background: '#0a101d', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSuggested(q)}
              style={{
                background: 'rgba(56, 189, 248, 0.1)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '999px',
                padding: '4px 12px',
                fontSize: '0.74rem',
                flexShrink: 0
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} style={{ padding: '12px 16px', background: '#090e1a', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Ask anything safely (e.g. 'Someone is asking for my pictures...')"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', fontSize: '0.88rem' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '10px 16px' }} disabled={!inputText.trim()}>
            <Send size={16} />
          </button>
        </form>

      </div>

      {/* Safety Helplines Bar */}
      <div className="glass-panel" style={{ padding: '16px 22px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PhoneCall size={20} color="#34d399" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Need to speak to a real counsellor right now? Call <strong>1098 (Childline)</strong> Toll-Free.
          </span>
        </div>
        <button className="btn-danger" style={{ fontSize: '0.8rem', padding: '6px 14px' }} onClick={() => setActiveTab('report')}>
          File Invisible SOS <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
}
