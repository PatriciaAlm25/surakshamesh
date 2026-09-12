import React, { useState } from 'react';
import { 
  Lock, 
  Shield, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  FileText, 
  Copy, 
  Check, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { translateChildTestimony } from '../../services/aiEngine';
import { StorageService } from '../../services/storageService';
import confetti from 'canvas-confetti';

const INCIDENT_CHOICES = [
  {
    id: 'ONLINE_GROOMING',
    title: '🟣 Someone is asking for private photos / keeping secrets',
    subtitle: 'Asking to hide chats from parents, promising gifts or special friendship'
  },
  {
    id: 'CYBERBULLYING',
    title: '🔴 Someone is bullying, insulting, or threatening me',
    subtitle: 'Nasty messages, leaking chats, spreading rumors or blackmail'
  },
  {
    id: 'PRIVACY_DOXXING',
    title: '🟠 Someone is asking for my address / school location',
    subtitle: 'Probing where I live, school details, or family information'
  },
  {
    id: 'MALICIOUS_PHISHING',
    title: '🔵 Someone sent a suspicious link or fake game reward',
    subtitle: 'Free Robux/V-Bucks scams, password phishing links'
  },
  {
    id: 'OTHER_CONCERN',
    title: '⚪ Something else online is making me uncomfortable',
    subtitle: 'General online distress, strange accounts or creepy messages'
  }
];

export default function AnonymousReportWizard({ setActiveTab }) {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('ONLINE_GROOMING');
  const [storyText, setStoryText] = useState('');
  const [platform, setPlatform] = useState('Instagram Direct');
  const [ageBracket, setAgeBracket] = useState('UNDER_14');
  const [generatedCase, setGeneratedCase] = useState(null);
  const [copied, setCopied] = useState(false);

  // Live AI Case Translator calculation
  const aiTranslation = translateChildTestimony(
    storyText || "Someone online keeps messaging me and asking not to tell my parents...",
    ageBracket
  );

  const handleSubmitReport = (e) => {
    e.preventDefault();
    
    // Save report to persistent storage
    const saved = StorageService.saveCase({
      category: selectedCategory,
      childAgeBracket: ageBracket,
      platform: platform,
      rawDescription: storyText || 'Child reported online distress.',
      aiRiskScore: aiTranslation.riskScore,
      aiRiskLevel: aiTranslation.riskScore >= 75 ? 'HIGH' : (aiTranslation.riskScore >= 40 ? 'MEDIUM' : 'LOW'),
      urgencyLevel: aiTranslation.urgency,
      aiSummary: aiTranslation.structuredSummary,
      behavioralIndicators: aiTranslation.detectedIndicators,
      evidenceSnippets: aiTranslation.evidenceSnippets,
      recommendedAction: aiTranslation.recommendedAction,
      assignedOrganization: aiTranslation.assignedOrganization,
      regionZone: 'Western Zone / Mumbai Metro'
    });

    setGeneratedCase(saved);
    setStep(3); // Success step

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  const handleCopyCode = () => {
    if (generatedCase?.caseCode) {
      navigator.clipboard.writeText(generatedCase.caseCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '999px', marginBottom: '10px' }}>
          <Lock size={14} color="#34d399" />
          <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600 }}>
            100% Anonymous & Encrypted • Zero Identity Tracking
          </span>
        </div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>Invisible SOS Child Reporting Portal</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
          You don't have to share your name or phone number. We give you a private Case ID so you can check when help is assigned.
        </p>
      </div>

      {/* STEP 1: What Happened? */}
      {step === 1 && (
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Step 1: What happened online?</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Choose the option that best describes what you are experiencing:
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {INCIDENT_CHOICES.map((choice) => {
              const isSelected = selectedCategory === choice.id;
              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => setSelectedCategory(choice.id)}
                  style={{
                    textAlign: 'left',
                    padding: '16px',
                    borderRadius: '12px',
                    background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.7)',
                    border: isSelected ? '2px solid #38bdf8' : '1px solid var(--border-subtle)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <strong style={{ fontSize: '0.95rem', color: isSelected ? '#38bdf8' : 'var(--text-primary)' }}>
                    {choice.title}
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {choice.subtitle}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button className="btn-primary" onClick={() => setStep(2)}>
              Next Step: Tell Us What Happened <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Story Input & Live AI Case Translator Preview */}
      {step === 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Child Story Form */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '4px' }}>Step 2: Tell us in your own words</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Write what the person said or what made you feel uncomfortable.
              </p>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Your Story (English, Hindi, Hinglish, Marathi...):
              </label>
              <textarea
                rows={6}
                value={storyText}
                onChange={e => setStoryText(e.target.value)}
                placeholder="Example: Someone named Alex told me not to tell my mom and asked for a private picture in my room. When I said no, they got angry..."
                style={{ width: '100%', fontSize: '0.88rem', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Platform Origin:
                </label>
                <select 
                  value={platform} 
                  onChange={e => setPlatform(e.target.value)}
                  style={{ width: '100%', fontSize: '0.82rem' }}
                >
                  <option value="Instagram Direct">Instagram Direct</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Roblox / Discord">Roblox / Discord</option>
                  <option value="YouTube Comments">YouTube Comments</option>
                  <option value="Other App">Other App</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Age Bracket:
                </label>
                <select 
                  value={ageBracket} 
                  onChange={e => setAgeBracket(e.target.value)}
                  style={{ width: '100%', fontSize: '0.82rem' }}
                >
                  <option value="UNDER_14">Under 14 years old</option>
                  <option value="14_PLUS">14–17 years old</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
              <button className="btn-secondary" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="btn-danger" onClick={handleSubmitReport} style={{ padding: '10px 22px' }}>
                🚀 Submit Anonymous Report
              </button>
            </div>
          </div>

          {/* Live AI Case Translator Preview Card */}
          <div className="glass-panel" style={{ padding: '24px', borderLeft: '3px solid #38bdf8', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#38bdf8" /> AI Case Translator (Live)
              </h3>
              <span className="badge-cyan" style={{ fontSize: '0.7rem' }}>Real-time NLP</span>
            </div>
            
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              See how the AI converts your natural testimony into clinical forensic triage tokens for verified advocates:
            </p>

            <div style={{ background: '#090e1a', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Assigned Urgency: </span>
                <strong style={{ color: aiTranslation.riskScore >= 75 ? '#f87171' : '#fbbf24' }}>
                  {aiTranslation.urgency}
                </strong>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Risk Score: </span>
                <strong style={{ color: '#38bdf8' }}>{aiTranslation.riskScore}%</strong>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Behavioral Flags: </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                  {aiTranslation.detectedIndicators.map((ind, i) => (
                    <span key={i} className="badge-danger" style={{ fontSize: '0.68rem' }}>
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Routed Organization: </span>
                <div style={{ color: '#34d399', fontWeight: 600, marginTop: '2px' }}>
                  {aiTranslation.assignedOrganization}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 'auto' }}>
              🔒 Zero personal identity or phone number is saved on the server.
            </div>
          </div>

        </div>
      )}

      {/* STEP 3: Submission Success & Anonymous Case ID Generated */}
      {step === 3 && generatedCase && (
        <div className="glass-panel-glow" style={{ padding: '36px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={36} color="#34d399" />
          </div>

          <div>
            <h2 style={{ fontSize: '1.6rem', color: '#34d399', marginBottom: '6px' }}>
              Your Report is Safely Submitted!
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto' }}>
              Our AI Safety Engine has categorized your report and routed it to verified child advocates. Save your Anonymous Case ID below:
            </p>
          </div>

          {/* Big Case ID Card */}
          <div style={{ background: '#090e1a', border: '2px dashed #38bdf8', borderRadius: '16px', padding: '20px 32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Your Private Anonymous Case ID
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em' }}>
                {generatedCase.caseCode}
              </div>
            </div>

            <button
              onClick={handleCopyCode}
              className="btn-secondary"
              style={{ padding: '10px 14px' }}
              title="Copy Case Code"
            >
              {copied ? <Check size={18} color="#34d399" /> : <Copy size={18} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="btn-primary"
              onClick={() => setActiveTab('tracker')}
            >
              🔍 Track Status in Report Tracker
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                setStep(1);
                setStoryText('');
              }}
            >
              Submit Another Report
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
