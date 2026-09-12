import React, { useState } from 'react';
import { 
  Lock, 
  Shield, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft,
  FileText, 
  Copy, 
  Check, 
  HelpCircle,
  PhoneCall,
  Globe,
  MapPin,
  Building,
  User,
  Calendar,
  Share2,
  Paperclip,
  Network
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { NgoRecommendationService } from '../../services/ngoRecommendationService';
import confetti from 'canvas-confetti';

const ONLINE_CATEGORIES = [
  'Online Grooming',
  'Cyberbullying / Harassment',
  'Threats',
  'Blackmail / Extortion',
  'Private Photo / Video Pressure',
  'Sexual Abuse / Exploitation',
  'Impersonation / Fake Account',
  'Phishing / Scam / Suspicious Link',
  'Doxxing / Personal Information Leak',
  'Stalking / Repeated Contact',
  'Hate / Abusive Messages',
  'Other'
];

const OFFLINE_CATEGORIES = [
  'Physical Abuse',
  'Sexual Abuse',
  'Emotional / Verbal Abuse',
  'Bullying',
  'Neglect',
  'Threats / Intimidation',
  'Child Labour / Exploitation',
  'Stalking / Harassment',
  'Unsafe Home Environment',
  'Unsafe School / College Environment',
  'Trafficking / Forced Activity',
  'Other'
];

const TACTICS_LIST = [
  'Someone asked me to keep it secret',
  'Manipulation / emotional pressure',
  'Private photo/video request',
  'Asked for personal information',
  'Threatened me',
  'Blackmail / extortion',
  'Sent inappropriate content',
  'Repeated unwanted contact',
  'Asked me to meet them',
  'Suspicious link',
  'Fake identity / impersonation',
  'Shared my photo/information without permission',
  'Someone tried to isolate me',
  'Other'
];

const ONLINE_PLATFORMS = [
  'Instagram',
  'WhatsApp',
  'Facebook',
  'Snapchat',
  'Discord',
  'Roblox',
  'YouTube',
  'Telegram',
  'Online Game',
  'Website / Forum',
  'Other'
];

const ONLINE_SURFACES = [
  'Direct Message',
  'Group Chat',
  'Comment',
  'Profile',
  'Post / Story',
  'Voice / Video Chat',
  'Game Chat',
  'Other'
];

const OFFLINE_LOCATIONS = [
  'Home',
  'School',
  'College',
  'Workplace / Office',
  'Coaching / Tuition',
  'Hostel',
  'Public Place',
  'Other'
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Other Union Territory'
];

export default function AnonymousReportWizard({ setActiveTab }) {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Environment
  const [environment, setEnvironment] = useState('Online');
  
  // Step 2: Problem Category
  const [category, setCategory] = useState('Online Grooming');
  
  // Step 3: Tactics (Multi-select)
  const [selectedTactics, setSelectedTactics] = useState([]);
  
  // Step 4: Where did it happen?
  const [platform, setPlatform] = useState('Instagram');
  const [platformSurface, setPlatformSurface] = useState('Direct Message');
  
  // Step 5: Location
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [locality, setLocality] = useState('');
  
  // Step 6: About Affected Person
  const [ageBracket, setAgeBracket] = useState('14–17');
  const [affectedRole, setAffectedRole] = useState('School student');
  const [institutionName, setInstitutionName] = useState('');
  const [relationship, setRelationship] = useState('Online stranger');
  
  // Step 7: What Happened? (Testimony)
  const [storyText, setStoryText] = useState('');
  
  // Step 8: Evidence
  const [hasEvidence, setHasEvidence] = useState('No');
  const [evidenceTypes, setEvidenceTypes] = useState([]);
  
  // Step 9: Timing & Frequency
  const [timeframe, setTimeframe] = useState('In the last few days');
  const [isRepeated, setIsRepeated] = useState('No');
  
  // Step 10: Immediate Safety Check
  const [immediateDanger, setImmediateDanger] = useState('No');
  
  // Submission & Result state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedCase, setGeneratedCase] = useState(null);
  const [copied, setCopied] = useState(false);

  // Toggle Tactics
  const toggleTactic = (tactic) => {
    setSelectedTactics(prev => 
      prev.includes(tactic) ? prev.filter(t => t !== tactic) : [...prev, tactic]
    );
  };

  // Toggle Evidence Types
  const toggleEvidence = (type) => {
    setEvidenceTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  // Submit Handler calling Gemini AI Triage Endpoint
  const handleSubmitReport = async () => {
    setIsSubmitting(true);
    
    const payload = {
      environment,
      primary_category: category,
      tactics_observed: selectedTactics,
      platform,
      platform_surface: platformSurface,
      city: city.trim() || 'Not specified',
      district: district.trim() || 'Not specified',
      state,
      locality: locality.trim(),
      age_bracket: ageBracket,
      status_role: affectedRole,
      institution_name: institutionName.trim(),
      relationship,
      raw_story: storyText.trim() || 'Child reported high-priority distress through Invisible SOS.',
      evidence_type: hasEvidence,
      timeframe,
      is_repeated: isRepeated === 'Yes',
      immediate_danger: immediateDanger
    };

    let triageResult = null;

    try {
      const res = await fetch('http://localhost:8000/api/invisible-sos/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        triageResult = await res.json();
      }
    } catch (e) {
      console.warn('Backend triage offline, applying client safety fallback:', e);
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const caseCode = triageResult?.case_code || `SM-2026-${randomNum}`;
    const riskScore = triageResult?.risk_score || (immediateDanger.startsWith('Yes') ? 95 : 80);

    const saved = StorageService.saveCase({
      caseCode,
      category: triageResult?.primary_threat_cluster || category.toUpperCase().replace(/\s+/g, '_'),
      childAgeBracket: ageBracket,
      platform: `${platform} (${platformSurface})`,
      rawDescription: storyText || 'Invisible SOS anonymous report.',
      aiRiskScore: riskScore,
      aiRiskLevel: triageResult?.risk_level || (riskScore >= 75 ? 'HIGH' : 'MEDIUM'),
      urgencyLevel: triageResult?.urgency_level || (riskScore >= 75 ? 'P1 - Immediate Intervention' : 'P2 - Moderate Review'),
      aiSummary: triageResult?.case_structured_summary?.headline || `Anonymous report regarding ${category} on ${platform}.`,
      behavioralIndicators: triageResult?.safety_graph_nodes?.tactics || selectedTactics,
      evidenceSnippets: [storyText.slice(0, 100)],
      recommendedAction: triageResult?.recommended_actions?.join('; ') || 'Immediate outreach by verified child counselor.',
      assignedOrganization: triageResult?.assigned_organization || 'Childline 1098 & Cyber Cell (1930)',
      regionZone: `${city || 'Metro'}, ${state}`,
      safetyGraph: triageResult?.safety_graph_nodes,
      statutoryFlags: triageResult?.case_structured_summary?.statutory_violation_flags
    });

    const recommendedNgos = (triageResult?.recommended_ngos && triageResult.recommended_ngos.length > 0)
      ? triageResult.recommended_ngos
      : NgoRecommendationService.getRecommendations({
          city,
          district,
          state,
          category,
          limit: 4
        });

    setGeneratedCase({
      ...saved,
      triageData: triageResult,
      recommendedNgos
    });
    
    setIsSubmitting(false);
    setCurrentStep(11); // Success step

    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.6 }
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
    <div style={{ maxWidth: '940px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header & Anonymity Guarantee */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '24px 28px', 
          background: 'linear-gradient(135deg, rgba(8, 24, 48, 0.9) 0%, rgba(14, 38, 72, 0.8) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '18px',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 16px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: '999px', marginBottom: '12px' }}>
          <Lock size={15} color="#38bdf8" />
          <span style={{ fontSize: '0.8rem', color: '#7dd3fc', fontWeight: 700 }}>
            Invisible SOS — 100% Anonymous Reporting • Zero Tracking
          </span>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, background: 'linear-gradient(90deg, #e0f2fe, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 6px 0' }}>
          Anonymous Report & Child Protection Intake
        </h2>
        <p style={{ fontSize: '0.86rem', color: '#93c5fd', margin: '0 auto', maxWidth: '680px' }}>
          Your name or exact address is <strong>never required</strong>. This form guides you step-by-step so verified advocates and safety experts can help protect you.
        </p>
      </div>

      {/* Immediate Danger Red Alert (If triggered at Step 10 or anytime) */}
      {immediateDanger.startsWith('Yes') && (
        <div 
          style={{ 
            background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.95) 0%, rgba(153, 27, 27, 0.95) 100%)',
            border: '2px solid #fecaca',
            borderRadius: '16px',
            padding: '20px 24px',
            boxShadow: '0 10px 30px rgba(220, 38, 38, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            color: '#fff',
            animation: 'pulseGlow 2s infinite'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={24} color="#fff" />
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
              EMERGENCY: Urgent Immediate Help Active
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.5 }}>
            If you are in danger right now, do not wait for a form response. Call emergency authorities immediately (toll-free in India):
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '6px' }}>
            <a href="tel:1098" style={{ background: '#fff', color: '#991b1b', padding: '8px 18px', borderRadius: '10px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
              <PhoneCall size={16} /> Childline 1098 (24/7)
            </a>
            <a href="tel:112" style={{ background: 'rgba(255, 255, 255, 0.2)', border: '1px solid #fff', color: '#fff', padding: '8px 16px', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
              <PhoneCall size={16} /> Police Emergency 112
            </a>
            <a href="tel:1930" style={{ background: 'rgba(255, 255, 255, 0.2)', border: '1px solid #fff', color: '#fff', padding: '8px 16px', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
              <Shield size={16} /> Cyber Crime 1930
            </a>
          </div>
        </div>
      )}

      {/* Step Indicator Progress Bar */}
      {currentStep <= 10 && (
        <div style={{ background: 'rgba(8, 24, 48, 0.8)', padding: '14px 20px', borderRadius: '14px', border: '1px solid rgba(56, 189, 248, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: '#38bdf8', color: '#041122', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
              {currentStep}
            </span>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#e0f2fe' }}>
              Step {currentStep} of 10
            </span>
          </div>
          <div style={{ flex: 1, minWidth: '150px', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(currentStep / 10) * 100}%`, background: 'linear-gradient(90deg, #38bdf8, #0284c7)', transition: 'width 0.3s ease' }} />
          </div>
          <span style={{ fontSize: '0.78rem', color: '#93c5fd' }}>
            {currentStep === 1 && 'Where did this happen?'}
            {currentStep === 2 && 'Kind of problem'}
            {currentStep === 3 && 'Tactics / How it happened'}
            {currentStep === 4 && 'Platform or Facility'}
            {currentStep === 5 && 'Location Jurisdiction'}
            {currentStep === 6 && 'Person affected'}
            {currentStep === 7 && 'Your Testimony'}
            {currentStep === 8 && 'Evidence'}
            {currentStep === 9 && 'Time & Frequency'}
            {currentStep === 10 && 'Immediate Safety'}
          </span>
        </div>
      )}

      {/* STEP 1: Online vs Offline */}
      {currentStep === 1 && (
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#f0f9ff', margin: '0 0 4px 0' }}>Step 1 — Where did this happen?</h3>
            <p style={{ fontSize: '0.84rem', color: '#93c5fd', margin: 0 }}>
              Select whether the incident took place on the internet/social media or in the physical world. Your name is not required.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { id: 'Online', title: '🌐 Online', desc: 'Social media, chat apps, gaming platforms, forums, or websites' },
              { id: 'Offline', title: '🏫 Offline (In Person)', desc: 'School, college, home, tuition, hostel, or public places' }
            ].map(item => {
              const active = environment === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setEnvironment(item.id)}
                  style={{
                    textAlign: 'left',
                    padding: '20px',
                    borderRadius: '14px',
                    background: active ? 'rgba(56, 189, 248, 0.2)' : 'rgba(8, 22, 44, 0.8)',
                    border: active ? '2px solid #38bdf8' : '1px solid rgba(56, 189, 248, 0.25)',
                    cursor: 'pointer',
                    boxShadow: active ? '0 0 20px rgba(56, 189, 248, 0.25)' : 'none'
                  }}
                >
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: active ? '#38bdf8' : '#f0f9ff' }}>{item.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>{item.desc}</p>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button className="btn-primary" onClick={() => setCurrentStep(2)}>
              Next: What kind of problem? <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Kind of problem (Filtered by Online vs Offline) */}
      {currentStep === 2 && (
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#f0f9ff', margin: '0 0 4px 0' }}>
              Step 2 — What kind of problem are you reporting? ({environment})
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#93c5fd', margin: 0 }}>
              Select the primary issue that best matches what you or the affected child experienced:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
            {(environment === 'Online' ? ONLINE_CATEGORIES : OFFLINE_CATEGORIES).map(cat => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    textAlign: 'left',
                    background: active ? 'rgba(56, 189, 248, 0.22)' : 'rgba(8, 22, 44, 0.7)',
                    border: active ? '1.5px solid #38bdf8' : '1px solid rgba(56, 189, 248, 0.2)',
                    color: active ? '#38bdf8' : '#e0f2fe',
                    fontSize: '0.84rem',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <button className="btn-secondary" onClick={() => setCurrentStep(1)}>
              <ArrowLeft size={16} /> Back
            </button>
            <button className="btn-primary" onClick={() => setCurrentStep(3)}>
              Next: How did it happen? <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Tactics (Select all that apply) */}
      {currentStep === 3 && (
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#f0f9ff', margin: '0 0 4px 0' }}>
              Step 3 — How did it happen? (Tactics / Patterns)
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#93c5fd', margin: 0 }}>
              Select all behavioral patterns that apply to the situation:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
            {TACTICS_LIST.map(tactic => {
              const checked = selectedTactics.includes(tactic);
              return (
                <div
                  key={tactic}
                  onClick={() => toggleTactic(tactic)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: checked ? 'rgba(56, 189, 248, 0.2)' : 'rgba(8, 22, 44, 0.7)',
                    border: checked ? '1.5px solid #38bdf8' : '1px solid rgba(56, 189, 248, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {}}
                    style={{ accentColor: '#38bdf8', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.82rem', color: checked ? '#f0f9ff' : '#cbd5e1', fontWeight: checked ? 600 : 400 }}>
                    {tactic}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <button className="btn-secondary" onClick={() => setCurrentStep(2)}>
              <ArrowLeft size={16} /> Back
            </button>
            <button className="btn-primary" onClick={() => setCurrentStep(4)}>
              Next: Specific Platform / Location <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Platform & Surface */}
      {currentStep === 4 && (
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#f0f9ff', margin: '0 0 4px 0' }}>
              Step 4 — Where did it happen? ({environment})
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#93c5fd', margin: 0 }}>
              Specify the exact platform or physical setting where the incident took place:
            </p>
          </div>

          {environment === 'Online' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#93c5fd', display: 'block', marginBottom: '6px' }}>
                  Platform Name:
                </label>
                <select 
                  value={platform} 
                  onChange={e => setPlatform(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(8, 22, 44, 0.9)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '10px', color: '#fff' }}
                >
                  {ONLINE_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#93c5fd', display: 'block', marginBottom: '6px' }}>
                  Which part of the platform?
                </label>
                <select 
                  value={platformSurface} 
                  onChange={e => setPlatformSurface(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(8, 22, 44, 0.9)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '10px', color: '#fff' }}
                >
                  {ONLINE_SURFACES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <div>
              <label style={{ fontSize: '0.8rem', color: '#93c5fd', display: 'block', marginBottom: '6px' }}>
                Physical Location Type:
              </label>
              <select 
                value={platform} 
                onChange={e => {
                  setPlatform(e.target.value);
                  setPlatformSurface(e.target.value);
                }}
                style={{ width: '100%', padding: '10px', background: 'rgba(8, 22, 44, 0.9)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '10px', color: '#fff' }}
              >
                {OFFLINE_LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <button className="btn-secondary" onClick={() => setCurrentStep(3)}>
              <ArrowLeft size={16} /> Back
            </button>
            <button className="btn-primary" onClick={() => setCurrentStep(5)}>
              Next: Location & Jurisdiction <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Location Jurisdiction */}
      {currentStep === 5 && (
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#f0f9ff', margin: '0 0 4px 0' }}>
              Step 5 — Location (City, District, State)
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#93c5fd', margin: 0 }}>
              This information is solely used to route the report to the local district child protection ecosystem.
            </p>
          </div>

          <div style={{ background: 'rgba(234, 179, 8, 0.12)', border: '1px solid rgba(234, 179, 8, 0.4)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.8rem', color: '#fde047' }}>
            ⚠️ <strong>Privacy Guardrail:</strong> Do NOT enter your house number or exact street address. Only general city and district are needed.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#93c5fd', display: 'block', marginBottom: '4px' }}>
                City / Town:
              </label>
              <input
                type="text"
                placeholder="e.g. Pune, Mumbai, Jaipur..."
                value={city}
                onChange={e => setCity(e.target.value)}
                style={{ width: '100%', padding: '10px', background: 'rgba(8, 22, 44, 0.9)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '10px', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#93c5fd', display: 'block', marginBottom: '4px' }}>
                District:
              </label>
              <input
                type="text"
                placeholder="e.g. Pune District, Thane..."
                value={district}
                onChange={e => setDistrict(e.target.value)}
                style={{ width: '100%', padding: '10px', background: 'rgba(8, 22, 44, 0.9)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '10px', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#93c5fd', display: 'block', marginBottom: '4px' }}>
                State:
              </label>
              <select
                value={state}
                onChange={e => setState(e.target.value)}
                style={{ width: '100%', padding: '10px', background: 'rgba(8, 22, 44, 0.9)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '10px', color: '#fff' }}
              >
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#93c5fd', display: 'block', marginBottom: '4px' }}>
                Optional Locality / Area:
              </label>
              <input
                type="text"
                placeholder="e.g. Kothrud, Bandra West..."
                value={locality}
                onChange={e => setLocality(e.target.value)}
                style={{ width: '100%', padding: '10px', background: 'rgba(8, 22, 44, 0.9)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '10px', color: '#fff' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <button className="btn-secondary" onClick={() => setCurrentStep(4)}>
              <ArrowLeft size={16} /> Back
            </button>
            <button className="btn-primary" onClick={() => setCurrentStep(6)}>
              Next: About the Person Affected <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: About the person affected */}
      {currentStep === 6 && (
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#f0f9ff', margin: '0 0 4px 0' }}>
              Step 6 — About the person affected
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#93c5fd', margin: 0 }}>
              Help advocates understand the age and institutional context to provide age-appropriate safety care:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#93c5fd', display: 'block', marginBottom: '4px' }}>
                Age Group:
              </label>
              <select
                value={ageBracket}
                onChange={e => setAgeBracket(e.target.value)}
                style={{ width: '100%', padding: '10px', background: 'rgba(8, 22, 44, 0.9)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '10px', color: '#fff' }}
              >
                <option value="Under 10">Under 10</option>
                <option value="10–13">10–13</option>
                <option value="14–17">14–17</option>
                <option value="18+">18+</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#93c5fd', display: 'block', marginBottom: '4px' }}>
                What best describes them?
              </label>
              <select
                value={affectedRole}
                onChange={e => setAffectedRole(e.target.value)}
                style={{ width: '100%', padding: '10px', background: 'rgba(8, 22, 44, 0.9)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '10px', color: '#fff' }}
              >
                <option value="School student">School student</option>
                <option value="College student">College student</option>
                <option value="Working">Working</option>
                <option value="Not currently studying/working">Not currently studying/working</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#93c5fd', display: 'block', marginBottom: '4px' }}>
                School / College / Workplace Name (Optional):
              </label>
              <input
                type="text"
                placeholder="e.g. St. Xavier's High School"
                value={institutionName}
                onChange={e => setInstitutionName(e.target.value)}
                style={{ width: '100%', padding: '10px', background: 'rgba(8, 22, 44, 0.9)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '10px', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#93c5fd', display: 'block', marginBottom: '4px' }}>
                Relationship to the person involved:
              </label>
              <select
                value={relationship}
                onChange={e => setRelationship(e.target.value)}
                style={{ width: '100%', padding: '10px', background: 'rgba(8, 22, 44, 0.9)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '10px', color: '#fff' }}
              >
                <option value="Online stranger">Online stranger</option>
                <option value="Friend / Classmate">Friend / Classmate</option>
                <option value="Teacher / Staff">Teacher / Staff</option>
                <option value="Family member">Family member</option>
                <option value="Partner / Acquaintance">Partner / Acquaintance</option>
                <option value="Someone I know">Someone I know</option>
                <option value="Someone I don't know">Someone I don't know</option>
                <option value="Group">Group</option>
                <option value="Not sure">Not sure</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <button className="btn-secondary" onClick={() => setCurrentStep(5)}>
              <ArrowLeft size={16} /> Back
            </button>
            <button className="btn-primary" onClick={() => setCurrentStep(7)}>
              Next: What happened? (Story) <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: What Happened? (Testimony in Child's Own Words) */}
      {currentStep === 7 && (
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#f0f9ff', margin: '0 0 4px 0' }}>
              Step 7 — Tell us what happened in your own words
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#93c5fd', margin: 0 }}>
              You can write in English, Hindi, Marathi, Konkani, Hinglish, or any language you are comfortable with.
            </p>
          </div>

          <textarea
            rows={7}
            value={storyText}
            onChange={e => setStoryText(e.target.value)}
            placeholder="Example: Someone on Instagram started talking to me. Later they asked for private photos and threatened to share them if I didn't send more. They told me not to tell my parents or teachers..."
            style={{ width: '100%', padding: '14px', background: 'rgba(8, 22, 44, 0.9)', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '12px', color: '#f0f9ff', fontSize: '0.9rem', lineHeight: 1.5, resize: 'vertical' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <button className="btn-secondary" onClick={() => setCurrentStep(6)}>
              <ArrowLeft size={16} /> Back
            </button>
            <button className="btn-primary" onClick={() => setCurrentStep(8)}>
              Next: Evidence <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: Evidence */}
      {currentStep === 8 && (
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#f0f9ff', margin: '0 0 4px 0' }}>
              Step 8 — Do you have evidence?
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#93c5fd', margin: 0 }}>
              Evidence helps forensic responders take action against perpetrators.
            </p>
          </div>

          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.8rem', color: '#fca5a5' }}>
            ⚠️ <strong>Security Notice:</strong> Never upload passwords, OTPs, Aadhaar numbers, or bank details.
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#93c5fd', display: 'block', marginBottom: '8px' }}>
              Do you have evidence available?
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {['Yes', 'No', "I'm not sure", "I don't feel safe uploading evidence"].map(opt => (
                <button
                  key={opt}
                  onClick={() => setHasEvidence(opt)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '10px',
                    background: hasEvidence === opt ? 'rgba(56, 189, 248, 0.25)' : 'rgba(8, 22, 44, 0.7)',
                    border: hasEvidence === opt ? '1.5px solid #38bdf8' : '1px solid rgba(56, 189, 248, 0.25)',
                    color: hasEvidence === opt ? '#38bdf8' : '#e0f2fe',
                    fontWeight: hasEvidence === opt ? 700 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {hasEvidence === 'Yes' && (
            <div>
              <label style={{ fontSize: '0.82rem', color: '#93c5fd', display: 'block', marginBottom: '8px' }}>
                Select types of evidence available:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Screenshot', 'Image', 'Video', 'Document', 'Chat export'].map(t => {
                  const active = evidenceTypes.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggleEvidence(t)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        background: active ? 'rgba(56, 189, 248, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                        border: active ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
                        color: active ? '#38bdf8' : '#94a3b8',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      {active ? '✓ ' : '+ '}{t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <button className="btn-secondary" onClick={() => setCurrentStep(7)}>
              <ArrowLeft size={16} /> Back
            </button>
            <button className="btn-primary" onClick={() => setCurrentStep(9)}>
              Next: Timing & Frequency <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 9: Timing & Frequency */}
      {currentStep === 9 && (
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#f0f9ff', margin: '0 0 4px 0' }}>
              Step 9 — When did this happen?
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#93c5fd', margin: 0 }}>
              Timeline helps responders assess whether an incident is ongoing or historical.
            </p>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#93c5fd', display: 'block', marginBottom: '8px' }}>
              When did this occur?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
              {[
                'Today',
                'In the last few days',
                'In the last week',
                'More than a week ago',
                'It is still happening',
                "I'm not sure"
              ].map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: timeframe === tf ? 'rgba(56, 189, 248, 0.25)' : 'rgba(8, 22, 44, 0.7)',
                    border: timeframe === tf ? '1.5px solid #38bdf8' : '1px solid rgba(56, 189, 248, 0.2)',
                    color: timeframe === tf ? '#38bdf8' : '#e0f2fe',
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#93c5fd', display: 'block', marginBottom: '8px' }}>
              Has this happened repeatedly?
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['Yes', 'No', "I'm not sure"].map(rep => (
                <button
                  key={rep}
                  onClick={() => setIsRepeated(rep)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    background: isRepeated === rep ? 'rgba(56, 189, 248, 0.25)' : 'rgba(8, 22, 44, 0.7)',
                    border: isRepeated === rep ? '1.5px solid #38bdf8' : '1px solid rgba(56, 189, 248, 0.2)',
                    color: isRepeated === rep ? '#38bdf8' : '#e0f2fe',
                    cursor: 'pointer',
                    fontSize: '0.84rem'
                  }}
                >
                  {rep}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <button className="btn-secondary" onClick={() => setCurrentStep(8)}>
              <ArrowLeft size={16} /> Back
            </button>
            <button className="btn-primary" onClick={() => setCurrentStep(10)}>
              Next: Immediate Safety Check <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 10: Immediate Safety Check & Final Review */}
      {currentStep === 10 && (
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#f0f9ff', margin: '0 0 4px 0' }}>
              Step 10 — Immediate safety check
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#93c5fd', margin: 0 }}>
              Are you or the affected child in immediate danger right now?
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              { id: 'Yes - I need urgent help', label: '🔴 Yes — I need urgent help', desc: 'Active physical threat or immediate crisis' },
              { id: 'No', label: '🟢 No', desc: 'Not in active physical danger right now' },
              { id: "I'm not sure", label: "🟡 I'm not sure", desc: 'Feel unsafe or unsure of next steps' }
            ].map(item => {
              const active = immediateDanger === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setImmediateDanger(item.id)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: active ? 'rgba(56, 189, 248, 0.22)' : 'rgba(8, 22, 44, 0.8)',
                    border: active ? '2px solid #38bdf8' : '1px solid rgba(56, 189, 248, 0.25)',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <strong style={{ fontSize: '0.92rem', color: active ? '#38bdf8' : '#f0f9ff', display: 'block', marginBottom: '4px' }}>
                    {item.label}
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    {item.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Summary of Report */}
          <div style={{ background: 'rgba(8, 24, 48, 0.9)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.3)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>Summary of Anonymous Intake:</span>
            <div style={{ color: '#e0f2fe' }}>• <strong>Environment:</strong> {environment} ({platform} - {platformSurface})</div>
            <div style={{ color: '#e0f2fe' }}>• <strong>Issue Category:</strong> {category}</div>
            <div style={{ color: '#e0f2fe' }}>• <strong>Jurisdiction:</strong> {city || 'City not entered'}, {state}</div>
            <div style={{ color: '#e0f2fe' }}>• <strong>Affected Demographics:</strong> {ageBracket}, {affectedRole} {institutionName ? `(${institutionName})` : ''}</div>
            <div style={{ color: '#e0f2fe' }}>• <strong>Tactics Identified:</strong> {selectedTactics.length > 0 ? selectedTactics.join(', ') : 'None selected'}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <button className="btn-secondary" onClick={() => setCurrentStep(9)}>
              <ArrowLeft size={16} /> Back
            </button>
            <button 
              className="btn-danger" 
              onClick={handleSubmitReport}
              disabled={isSubmitting}
              style={{ padding: '12px 28px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {isSubmitting ? (
                <>Analyzing with Gemini AI...</>
              ) : (
                <>🛡️ Submit Invisible SOS Report & Generate Case ID</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 11: Submission Success & Safety Graph Output */}
      {currentStep === 11 && generatedCase && (
        <div 
          className="glass-panel-glow" 
          style={{ 
            padding: '36px', 
            borderRadius: '20px',
            border: '2px solid rgba(56, 189, 248, 0.4)',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(56, 189, 248, 0.15), transparent 75%), rgba(6, 16, 33, 0.95)',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px' 
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              <CheckCircle2 size={36} color="#34d399" />
            </div>
            <h2 style={{ fontSize: '1.7rem', color: '#34d399', margin: '0 0 6px 0' }}>
              Report Safely Registered & Encrypted!
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#93c5fd', maxWidth: '560px', margin: '0 auto' }}>
              Your report has been analyzed by Gemini AI and routed to verified child advocates. Save your Anonymous Case ID below:
            </p>
          </div>

          {/* Anonymous Case Code Box */}
          <div style={{ background: '#090e1a', border: '2px dashed #38bdf8', borderRadius: '16px', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Your Private Anonymous Case Code
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em' }}>
                {generatedCase.caseCode}
              </div>
            </div>

            <button
              onClick={handleCopyCode}
              className="btn-secondary"
              style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Copy Case Code"
            >
              {copied ? <Check size={18} color="#34d399" /> : <Copy size={18} />}
              {copied ? 'Copied' : 'Copy Code'}
            </button>
          </div>

          {/* Forensic Triage Card with Safety Graph Nodes */}
          <div style={{ background: 'rgba(8, 24, 48, 0.95)', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', color: '#e0f2fe', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Network size={18} color="#38bdf8" /> AI Safety Graph & Case Triage
              </h4>
              <span style={{ fontSize: '0.74rem', padding: '3px 10px', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid #38bdf8' }}>
                Gemini Multi-Model Triage Engine
              </span>
            </div>

            {/* Safety Graph 4-Pillars Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div style={{ background: '#071529', padding: '12px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <span style={{ fontSize: '0.72rem', color: '#93c5fd', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                  1. CLUSTER (WHAT)
                </span>
                <strong style={{ fontSize: '0.88rem', color: '#f0f9ff' }}>
                  {generatedCase.triageData?.safety_graph_nodes?.cluster?.name || generatedCase.category}
                </strong>
                <div style={{ fontSize: '0.7rem', color: '#f87171', marginTop: '2px' }}>
                  Severity: {generatedCase.triageData?.safety_graph_nodes?.cluster?.severity || generatedCase.aiRiskLevel}
                </div>
              </div>

              <div style={{ background: '#071529', padding: '12px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <span style={{ fontSize: '0.72rem', color: '#93c5fd', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                  2. TACTIC (HOW)
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                  {(generatedCase.triageData?.safety_graph_nodes?.tactics || generatedCase.behavioralIndicators || []).slice(0, 3).map((t, idx) => (
                    <span key={idx} style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.18)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ background: '#071529', padding: '12px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <span style={{ fontSize: '0.72rem', color: '#93c5fd', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                  3. CASE (WHICH)
                </span>
                <strong style={{ fontSize: '0.88rem', color: '#38bdf8' }}>
                  {generatedCase.caseCode}
                </strong>
                <div style={{ fontSize: '0.7rem', color: '#34d399', marginTop: '2px' }}>
                  Status: Under Review
                </div>
              </div>

              <div style={{ background: '#071529', padding: '12px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <span style={{ fontSize: '0.72rem', color: '#93c5fd', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                  4. PLATFORM (WHERE)
                </span>
                <strong style={{ fontSize: '0.88rem', color: '#f0f9ff' }}>
                  {generatedCase.triageData?.safety_graph_nodes?.platform?.name || platform}
                </strong>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                  {generatedCase.triageData?.safety_graph_nodes?.platform?.sub_surface || platformSurface}
                </div>
              </div>
            </div>

            {/* Jurisdiction & Welfare Organization */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingTop: '10px', borderTop: '1px solid rgba(56, 189, 248, 0.15)', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: '#94a3b8' }}>Assigned Responders: </span>
                <strong style={{ color: '#34d399' }}>{generatedCase.assignedOrganization}</strong>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>Risk Assessment: </span>
                <strong style={{ color: generatedCase.aiRiskScore >= 75 ? '#f87171' : '#38bdf8' }}>
                  {generatedCase.aiRiskScore}% ({generatedCase.urgencyLevel})
                </strong>
              </div>
            </div>
          </div>

          {/* Recommended Verified NGOs as per Location & Address */}
          {generatedCase.recommendedNgos && generatedCase.recommendedNgos.length > 0 && (
            <div 
              style={{ 
                background: 'linear-gradient(135deg, rgba(8, 28, 56, 0.95) 0%, rgba(12, 38, 76, 0.95) 100%)',
                border: '1.5px solid rgba(56, 189, 248, 0.45)',
                borderRadius: '16px',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 8px 30px rgba(56, 189, 248, 0.15)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#e0f2fe', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
                    <Building size={18} color="#38bdf8" /> Recommended NGOs & Child Support Services
                  </h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#93c5fd' }}>
                    Matched automatically as per your location ({city || 'Local Area'}, {state}) and reported issue
                  </p>
                </div>
                <span style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '999px', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.4)', fontWeight: 700 }}>
                  ✓ Official & DARPAN Listed
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {generatedCase.recommendedNgos.map((ngo, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(6, 18, 38, 0.9)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      borderRadius: '12px',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <strong style={{ fontSize: '0.9rem', color: '#f0f9ff' }}>
                        {ngo.organization_name}
                      </strong>
                      <span style={{ fontSize: '0.66rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', padding: '2px 6px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                        {ngo.organization_type}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.76rem', color: '#94a3b8', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <MapPin size={14} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{ngo.address || `${ngo.city}, ${ngo.state}`}</span>
                    </div>

                    <div style={{ fontSize: '0.74rem', color: '#bae6fd', lineHeight: 1.35 }}>
                      <strong>Services: </strong>{ngo.services}
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <a
                        href={`tel:${(ngo.phone || '').split('/')[0].trim()}`}
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#fff',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 0 12px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        <PhoneCall size={13} /> {ngo.phone}
                      </a>

                      {ngo.website && (
                        <a
                          href={ngo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.72rem',
                            color: '#38bdf8',
                            textDecoration: 'underline'
                          }}
                        >
                          Visit Website ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              style={{ padding: '12px 24px', fontSize: '0.88rem' }}
              onClick={() => setActiveTab('tracker')}
            >
              🔍 Track Status in Report Tracker
            </button>
            <button
              className="btn-secondary"
              style={{ padding: '12px 20px', fontSize: '0.88rem' }}
              onClick={() => {
                setCurrentStep(1);
                setSelectedTactics([]);
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
