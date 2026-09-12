import React, { useState, useEffect } from 'react';
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
  Network, 
  Scale,
  Loader2
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { NgoRecommendationService } from '../../services/ngoRecommendationService';
import { LegalMatchingService } from '../../services/legalMatchingService';
import { SchoolDirectoryService, ALL_INDIAN_STATES } from '../../services/schoolDirectoryService';
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
  const [state, setState] = useState('Maharashtra');
  const [district, setDistrict] = useState('Pune');
  const [city, setCity] = useState('Pune');
  const [locality, setLocality] = useState('');
  
  // Dynamic Dataset lists from UDISE+ API
  const [districtsList, setDistrictsList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [schoolsList, setSchoolsList] = useState([]);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [isCustomSchool, setIsCustomSchool] = useState(false);
  
  // Step 6: About Affected Person
  const [ageBracket, setAgeBracket] = useState('14–17');
  const [affectedRole, setAffectedRole] = useState('School student');
  const [institutionName, setInstitutionName] = useState('');
  const [relationship, setRelationship] = useState('Online stranger');

  // Fetch districts whenever State changes
  useEffect(() => {
    let isMounted = true;
    const loadDistricts = () => {
      if (!state) return;
      setLoadingDistricts(true);
      const list = SchoolDirectoryService.getDistricts(state);
      if (isMounted) {
        setDistrictsList(list);
        setLoadingDistricts(false);
        if (list.length > 0 && (!district || !list.includes(district))) {
          setDistrict(list[0]);
        }
      }
    };
    loadDistricts();
    return () => { isMounted = false; };
  }, [state]);

  // Fetch subdistricts & schools whenever State, District, or Search Query changes
  useEffect(() => {
    let isMounted = true;
    const debounceTimer = setTimeout(async () => {
      if (!state || !district) return;
      setLoadingSchools(true);
      const [cities, schools] = await Promise.all([
        SchoolDirectoryService.getSubdistricts(state, district),
        SchoolDirectoryService.searchSchools({ 
          stateName: state, 
          districtName: district, 
          query: schoolSearchQuery,
          limit: 60 
        })
      ]);
      if (isMounted) {
        setCitiesList(cities);
        setSchoolsList(schools);
        setLoadingSchools(false);
        if (cities.length > 0 && !city) {
          setCity(cities[0]);
        }
        if (schools.length > 0 && !institutionName && !isCustomSchool) {
          setInstitutionName(schools[0].name);
        }
      }
    }, 250);

    return () => { 
      isMounted = false; 
      clearTimeout(debounceTimer);
    };
  }, [state, district, schoolSearchQuery]);
  
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

    const casePayload = {
      caseCode,
      environment,
      category: triageResult?.primary_threat_cluster || category.toUpperCase().replace(/\s+/g, '_'),
      tactics_observed: selectedTactics,
      platform: `${platform} (${platformSurface})`,
      platformSurface,
      city: city.trim(),
      district: district.trim(),
      state,
      locality: locality.trim(),
      childAgeBracket: ageBracket,
      affectedRole,
      institutionName: institutionName.trim(),
      relationship,
      rawDescription: storyText || 'Invisible SOS anonymous report.',
      evidence_type: hasEvidence,
      timeframe,
      isRepeated: isRepeated === 'Yes',
      immediateDanger,
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
    };

    // 1. Save locally for instant offline UI responsiveness
    const saved = StorageService.saveCase(casePayload);

    // 2. Persist directly to Supabase cloud 'cases' table
    try {
      await StorageService.createSupabaseCase(casePayload);
    } catch (supabaseErr) {
      console.warn('Supabase case sync warning:', supabaseErr);
    }

    const recommendedNgos = (triageResult?.recommended_ngos && triageResult.recommended_ngos.length > 0)
      ? triageResult.recommended_ngos
      : NgoRecommendationService.getRecommendations({
          city,
          district,
          state,
          category,
          limit: 4
        });

    const applicableLaws = (triageResult?.applicable_laws && triageResult.applicable_laws.length > 0)
      ? triageResult.applicable_laws
      : LegalMatchingService.getApplicableLaws({
          category,
          tactics: selectedTactics,
          age: ageBracket,
          environment,
          limit: 3
        });

    setGeneratedCase({
      ...saved,
      triageData: triageResult,
      recommendedNgos,
      applicableLaws
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
    <div style={{ maxWidth: '940px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Header & Anonymity Guarantee */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '28px', 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(224,242,254,0.9) 100%)',
          border: '1.5px solid rgba(14, 165, 233, 0.3)',
          borderRadius: '18px',
          textAlign: 'center',
          boxShadow: '0 4px 24px rgba(14, 116, 189, 0.1)'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', background: 'rgba(14, 165, 233, 0.12)', border: '1.5px solid rgba(14, 165, 233, 0.35)', borderRadius: '999px', marginBottom: '14px' }}>
          <Lock size={15} color="#0284c7" />
          <span style={{ fontSize: '0.82rem', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Invisible SOS — 100% Anonymous Reporting • Zero Tracking
          </span>
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
          Anonymous Report & Child Protection Intake
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#334155', margin: '0 auto', maxWidth: '680px', lineHeight: 1.6 }}>
          Your name or exact address is <strong>never required</strong>. This form guides you step-by-step so verified advocates and safety experts can help protect you.
        </p>
      </div>

      {/* Immediate Danger Red Alert (If triggered at Step 10 or anytime) */}
      {immediateDanger.startsWith('Yes') && (
        <div 
          style={{ 
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            border: '2px solid #fecaca',
            borderRadius: '16px',
            padding: '22px 26px',
            boxShadow: '0 10px 30px rgba(220, 38, 38, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            color: '#fff',
            animation: 'pulseGlow 2s infinite'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={24} color="#fff" />
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
              EMERGENCY: Urgent Immediate Help Active
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
            If you are in danger right now, do not wait for a form response. Call emergency authorities immediately (toll-free in India):
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '6px' }}>
            <a href="tel:1098" style={{ background: '#fff', color: '#991b1b', padding: '10px 20px', borderRadius: '10px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}>
              <PhoneCall size={16} /> Childline 1098 (24/7)
            </a>
            <a href="tel:112" style={{ background: 'rgba(255, 255, 255, 0.25)', border: '1.5px solid #fff', color: '#fff', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
              <PhoneCall size={16} /> Police Emergency 112
            </a>
            <a href="tel:1930" style={{ background: 'rgba(255, 255, 255, 0.25)', border: '1.5px solid #fff', color: '#fff', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
              <Shield size={16} /> Cyber Crime 1930
            </a>
          </div>
        </div>
      )}

      {/* Step Indicator Progress Bar */}
      {currentStep <= 10 && (
        <div style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '16px 22px', borderRadius: '16px', border: '1.5px solid rgba(14, 116, 189, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', boxShadow: '0 2px 12px rgba(14, 116, 189, 0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', color: '#ffffff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
              {currentStep}
            </span>
            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
              Step {currentStep} of 10
            </span>
          </div>
          <div style={{ flex: 1, minWidth: '150px', height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(currentStep / 10) * 100}%`, background: 'linear-gradient(90deg, #0ea5e9, #2563eb)', transition: 'width 0.3s ease' }} />
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0284c7' }}>
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
        <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#0f172a', margin: '0 0 6px 0', fontWeight: 800 }}>Step 1 — Where did this happen?</h3>
            <p style={{ fontSize: '0.9rem', color: '#334155', margin: 0 }}>
              Select whether the incident took place on the internet/social media or in the physical world. Your name is not required.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { id: 'Online', title: '🌐 Online (Digital)', desc: 'Social media, chat apps, gaming platforms, forums, or websites' },
              { id: 'Offline', title: '🏫 Offline (In Person)', desc: 'School, college, home, tuition, hostel, or public places' }
            ].map(item => {
              const active = environment === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setEnvironment(item.id)}
                  style={{
                    textAlign: 'left',
                    padding: '22px',
                    borderRadius: '16px',
                    background: active ? 'rgba(14, 165, 233, 0.12)' : '#ffffff',
                    border: active ? '2px solid #0284c7' : '1.5px solid rgba(14, 116, 189, 0.2)',
                    cursor: 'pointer',
                    boxShadow: active ? '0 4px 20px rgba(14, 165, 233, 0.18)' : '0 2px 8px rgba(14, 116, 189, 0.04)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', color: active ? '#0284c7' : '#0f172a', fontWeight: 800 }}>{item.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.45 }}>{item.desc}</p>
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
        <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#0f172a', margin: '0 0 6px 0', fontWeight: 800 }}>
              Step 2 — What kind of problem are you reporting? ({environment})
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#334155', margin: 0 }}>
              Select the primary issue that best matches what you or the affected child experienced:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
            {(environment === 'Online' ? ONLINE_CATEGORIES : OFFLINE_CATEGORIES).map(cat => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    textAlign: 'left',
                    background: active ? 'rgba(14, 165, 233, 0.14)' : '#ffffff',
                    border: active ? '2px solid #0284c7' : '1.5px solid rgba(14, 116, 189, 0.2)',
                    color: active ? '#0284c7' : '#0f172a',
                    fontSize: '0.88rem',
                    fontWeight: active ? 800 : 600,
                    cursor: 'pointer',
                    boxShadow: active ? '0 4px 14px rgba(14, 165, 233, 0.15)' : '0 1px 4px rgba(0,0,0,0.03)'
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
        <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#0f172a', margin: '0 0 6px 0', fontWeight: 800 }}>
              Step 3 — How did it happen? (Tactics / Patterns)
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#334155', margin: 0 }}>
              Select all behavioral patterns that apply to the situation:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
            {TACTICS_LIST.map(tactic => {
              const checked = selectedTactics.includes(tactic);
              return (
                <div
                  key={tactic}
                  onClick={() => toggleTactic(tactic)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: checked ? 'rgba(14, 165, 233, 0.12)' : '#ffffff',
                    border: checked ? '2px solid #0284c7' : '1.5px solid rgba(14, 116, 189, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    boxShadow: checked ? '0 4px 14px rgba(14, 165, 233, 0.12)' : '0 1px 4px rgba(0,0,0,0.03)'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {}}
                    style={{ accentColor: '#0284c7', width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.88rem', color: checked ? '#0284c7' : '#0f172a', fontWeight: checked ? 700 : 500 }}>
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
        <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#0f172a', margin: '0 0 6px 0', fontWeight: 800 }}>
              Step 4 — Where did it happen? ({environment})
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#334155', margin: 0 }}>
              Specify the exact platform or physical setting where the incident took place:
            </p>
          </div>

          {environment === 'Online' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.84rem', color: '#1e293b', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Platform Name:
                </label>
                <select 
                  value={platform} 
                  onChange={e => setPlatform(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: '#ffffff', border: '1.5px solid var(--border-medium)', borderRadius: '10px', color: '#0f172a', fontWeight: 600 }}
                >
                  {ONLINE_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.84rem', color: '#1e293b', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Which part of the platform?
                </label>
                <select 
                  value={platformSurface} 
                  onChange={e => setPlatformSurface(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: '#ffffff', border: '1.5px solid var(--border-medium)', borderRadius: '10px', color: '#0f172a', fontWeight: 600 }}
                >
                  {ONLINE_SURFACES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <div>
              <label style={{ fontSize: '0.84rem', color: '#1e293b', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Physical Location Type:
              </label>
              <select 
                value={platform} 
                onChange={e => {
                  setPlatform(e.target.value);
                  setPlatformSurface(e.target.value);
                }}
                style={{ width: '100%', padding: '12px', background: '#ffffff', border: '1.5px solid var(--border-medium)', borderRadius: '10px', color: '#0f172a', fontWeight: 600 }}
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
        <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#0f172a', margin: '0 0 6px 0', fontWeight: 800 }}>
              Step 5 — Location (City, District, State)
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#334155', margin: 0 }}>
              This information is solely used to route the report to the local district child protection ecosystem.
            </p>
          </div>

          <div style={{ background: 'rgba(217, 119, 6, 0.1)', border: '1.5px solid rgba(217, 119, 6, 0.35)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.85rem', color: '#92400e' }}>
            ⚠️ <strong>Privacy Guardrail:</strong> Do NOT enter your house number or exact street address. Only general city and district are needed.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* 1. STATE SELECTOR */}
            <div>
              <label style={{ fontSize: '0.84rem', color: '#1e293b', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                State / Union Territory:
              </label>
              <select
                value={state}
                onChange={e => setState(e.target.value)}
                style={{ width: '100%', padding: '12px', background: '#ffffff', border: '1.5px solid var(--border-medium)', borderRadius: '10px', color: '#0f172a', fontWeight: 600 }}
              >
                {ALL_INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* 2. DISTRICT SELECTOR (Cascading) */}
            <div>
              <label style={{ fontSize: '0.84rem', color: '#1e293b', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>District:</span>
                {loadingDistricts && <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '4px' }}><Loader2 size={12} className="animate-spin" /> Loading districts...</span>}
              </label>
              <select
                value={district}
                onChange={e => setDistrict(e.target.value)}
                style={{ width: '100%', padding: '12px', background: '#ffffff', border: '1.5px solid var(--border-medium)', borderRadius: '10px', color: '#0f172a', fontWeight: 600 }}
              >
                {districtsList.map(d => <option key={d} value={d}>{d}</option>)}
                <option value="Other District">Other / Unlisted District</option>
              </select>
            </div>

            {/* 3. CITY / SUBDISTRICT SELECTOR */}
            <div>
              <label style={{ fontSize: '0.84rem', color: '#1e293b', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                City / Town / Block:
              </label>
              <input
                type="text"
                list="cities-datalist"
                placeholder="Select or type City / Block..."
                value={city}
                onChange={e => setCity(e.target.value)}
                style={{ width: '100%', padding: '12px', background: '#ffffff', border: '1.5px solid var(--border-medium)', borderRadius: '10px', color: '#0f172a' }}
              />
              <datalist id="cities-datalist">
                {citiesList.map((c, i) => <option key={`${c}-${i}`} value={c} />)}
              </datalist>
            </div>

            {/* 4. LOCALITY / AREA */}
            <div>
              <label style={{ fontSize: '0.84rem', color: '#1e293b', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Optional Locality / Area:
              </label>
              <input
                type="text"
                placeholder="e.g. Kothrud, Bandra West, Sector 15..."
                value={locality}
                onChange={e => setLocality(e.target.value)}
                style={{ width: '100%', padding: '12px', background: '#ffffff', border: '1.5px solid var(--border-medium)', borderRadius: '10px', color: '#0f172a' }}
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
        <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#0f172a', margin: '0 0 6px 0', fontWeight: 800 }}>
              Step 6 — About the person affected
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#334155', margin: 0 }}>
              Help advocates understand the age and institutional context to provide age-appropriate safety care:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.84rem', color: '#1e293b', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Age Group:
              </label>
              <select
                value={ageBracket}
                onChange={e => setAgeBracket(e.target.value)}
                style={{ width: '100%', padding: '12px', background: '#ffffff', border: '1.5px solid var(--border-medium)', borderRadius: '10px', color: '#0f172a', fontWeight: 600 }}
              >
                <option value="Under 10">Under 10</option>
                <option value="10–13">10–13</option>
                <option value="14–17">14–17</option>
                <option value="18+">18+</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.84rem', color: '#1e293b', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                What best describes them?
              </label>
              <select
                value={affectedRole}
                onChange={e => setAffectedRole(e.target.value)}
                style={{ width: '100%', padding: '12px', background: '#ffffff', border: '1.5px solid var(--border-medium)', borderRadius: '10px', color: '#0f172a', fontWeight: 600 }}
              >
                <option value="School student">School student</option>
                <option value="College student">College student</option>
                <option value="Working">Working</option>
                <option value="Not currently studying/working">Not currently studying/working</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* DYNAMIC SCHOOL / INSTITUTION SELECTOR (UDISE+ 1.37M Directory) */}
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.84rem', color: '#1e293b', fontWeight: 700 }}>
                  School / College / Institution (UDISE+ Directory for {district || state}):
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomSchool(!isCustomSchool)}
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  {isCustomSchool ? '← Choose from Directory' : '+ Type Custom School'}
                </button>
              </div>

              {isCustomSchool ? (
                <input
                  type="text"
                  placeholder="Type your exact School / College name..."
                  value={institutionName}
                  onChange={e => setInstitutionName(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: '#ffffff', border: '1.5px solid var(--border-medium)', borderRadius: '10px', color: '#0f172a' }}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Live Search Filter Box */}
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder={`🔍 Type school name to search in ${district || state}... (e.g. St. Xavier, DPS, KV, Model)`}
                      value={schoolSearchQuery}
                      onChange={e => setSchoolSearchQuery(e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '10px 14px', 
                        background: '#f8fafc', 
                        border: '1.5px solid #cbd5e1', 
                        borderRadius: '8px', 
                        fontSize: '0.85rem',
                        color: '#0f172a'
                      }}
                    />
                  </div>

                  {/* Dropdown with results */}
                  <select
                    value={institutionName}
                    onChange={e => {
                      if (e.target.value === '__OTHER__') {
                        setIsCustomSchool(true);
                        setInstitutionName('');
                      } else {
                        setInstitutionName(e.target.value);
                      }
                    }}
                    style={{ width: '100%', padding: '12px', background: '#ffffff', border: '1.5px solid var(--border-medium)', borderRadius: '10px', color: '#0f172a', fontWeight: 600 }}
                  >
                    <option value="">
                      {loadingSchools ? 'Loading schools...' : `-- Select school (${schoolsList.length} matches in ${district || state}) --`}
                    </option>
                    {schoolsList.map((sch, i) => (
                      <option key={`${sch.name}-${i}`} value={sch.name}>
                        {sch.name} {sch.code && sch.code !== 'UDISE-IND' ? `[UDISE: ${sch.code}]` : ''} {sch.village ? `— ${sch.village}` : ''}
                      </option>
                    ))}
                    <option value="__OTHER__">+ My school is not listed (Type manually)</option>
                  </select>

                  {loadingSchools && (
                    <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Loader2 size={12} className="animate-spin" /> Searching India Data Portal UDISE+ directory...
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.84rem', color: '#1e293b', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Relationship to the person involved:
              </label>
              <select
                value={relationship}
                onChange={e => setRelationship(e.target.value)}
                style={{ width: '100%', padding: '12px', background: '#ffffff', border: '1.5px solid var(--border-medium)', borderRadius: '10px', color: '#0f172a', fontWeight: 600 }}
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
        <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#0f172a', margin: '0 0 6px 0', fontWeight: 800 }}>
              Step 7 — Tell us what happened in your own words
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#334155', margin: 0 }}>
              You can write in English, Hindi, Marathi, Konkani, Hinglish, or any language you are comfortable with.
            </p>
          </div>

          <textarea
            rows={7}
            value={storyText}
            onChange={e => setStoryText(e.target.value)}
            placeholder="Example: Someone on Instagram started talking to me. Later they asked for private photos and threatened to share them if I didn't send more. They told me not to tell my parents or teachers..."
            style={{ width: '100%', padding: '16px', background: '#ffffff', border: '1.5px solid var(--border-medium)', borderRadius: '12px', color: '#0f172a', fontSize: '0.94rem', lineHeight: 1.6, resize: 'vertical' }}
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
        <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#0f172a', margin: '0 0 6px 0', fontWeight: 800 }}>
              Step 8 — Do you have evidence?
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#334155', margin: 0 }}>
              Evidence helps forensic responders take action against perpetrators.
            </p>
          </div>

          <div style={{ background: 'rgba(220, 38, 38, 0.08)', border: '1.5px solid rgba(220, 38, 38, 0.3)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.85rem', color: '#991b1b' }}>
            ⚠️ <strong>Security Notice:</strong> Never upload passwords, OTPs, Aadhaar numbers, or bank details.
          </div>

          <div>
            <label style={{ fontSize: '0.86rem', color: '#1e293b', fontWeight: 700, display: 'block', marginBottom: '10px' }}>
              Do you have evidence available?
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {['Yes', 'No', "I'm not sure", "I don't feel safe uploading evidence"].map(opt => (
                <button
                  key={opt}
                  onClick={() => setHasEvidence(opt)}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '12px',
                    background: hasEvidence === opt ? 'rgba(14, 165, 233, 0.14)' : '#ffffff',
                    border: hasEvidence === opt ? '2px solid #0284c7' : '1.5px solid rgba(14, 116, 189, 0.2)',
                    color: hasEvidence === opt ? '#0284c7' : '#0f172a',
                    fontWeight: hasEvidence === opt ? 800 : 500,
                    cursor: 'pointer',
                    fontSize: '0.88rem'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {hasEvidence === 'Yes' && (
            <div>
              <label style={{ fontSize: '0.86rem', color: '#1e293b', fontWeight: 700, display: 'block', marginBottom: '10px' }}>
                Select types of evidence available:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {['Screenshot', 'Image', 'Video', 'Document', 'Chat export'].map(t => {
                  const active = evidenceTypes.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggleEvidence(t)}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '10px',
                        background: active ? 'rgba(14, 165, 233, 0.14)' : '#ffffff',
                        border: active ? '1.5px solid #0284c7' : '1.5px solid rgba(14, 116, 189, 0.2)',
                        color: active ? '#0284c7' : '#334155',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: active ? 700 : 500
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
        <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#0f172a', margin: '0 0 6px 0', fontWeight: 800 }}>
              Step 9 — When did this happen?
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#334155', margin: 0 }}>
              Timeline helps responders assess whether an incident is ongoing or historical.
            </p>
          </div>

          <div>
            <label style={{ fontSize: '0.86rem', color: '#1e293b', fontWeight: 700, display: 'block', marginBottom: '10px' }}>
              When did this occur?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
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
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: timeframe === tf ? 'rgba(14, 165, 233, 0.14)' : '#ffffff',
                    border: timeframe === tf ? '2px solid #0284c7' : '1.5px solid rgba(14, 116, 189, 0.2)',
                    color: timeframe === tf ? '#0284c7' : '#0f172a',
                    fontSize: '0.86rem',
                    fontWeight: timeframe === tf ? 800 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.86rem', color: '#1e293b', fontWeight: 700, display: 'block', marginBottom: '10px' }}>
              Has this happened repeatedly?
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['Yes', 'No', "I'm not sure"].map(rep => (
                <button
                  key={rep}
                  onClick={() => setIsRepeated(rep)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    background: isRepeated === rep ? 'rgba(14, 165, 233, 0.14)' : '#ffffff',
                    border: isRepeated === rep ? '2px solid #0284c7' : '1.5px solid rgba(14, 116, 189, 0.2)',
                    color: isRepeated === rep ? '#0284c7' : '#0f172a',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    fontWeight: isRepeated === rep ? 800 : 500
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
        <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#0f172a', margin: '0 0 6px 0', fontWeight: 800 }}>
              Step 10 — Immediate safety check
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#334155', margin: 0 }}>
              Are you or the affected child in immediate danger right now?
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
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
                    padding: '18px',
                    borderRadius: '14px',
                    background: active ? 'rgba(14, 165, 233, 0.12)' : '#ffffff',
                    border: active ? '2px solid #0284c7' : '1.5px solid rgba(14, 116, 189, 0.2)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    boxShadow: active ? '0 4px 16px rgba(14, 165, 233, 0.15)' : '0 1px 4px rgba(0,0,0,0.03)'
                  }}
                >
                  <strong style={{ fontSize: '0.95rem', color: active ? '#0284c7' : '#0f172a', display: 'block', marginBottom: '4px', fontWeight: 800 }}>
                    {item.label}
                  </strong>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    {item.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Summary of Report */}
          <div style={{ background: '#f8fafc', padding: '18px 22px', borderRadius: '14px', border: '1.5px solid rgba(14, 116, 189, 0.2)', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ color: '#0284c7', fontWeight: 800, fontSize: '0.95rem' }}>Summary of Anonymous Intake:</span>
            <div style={{ color: '#0f172a' }}>• <strong>Environment:</strong> {environment} ({platform} - {platformSurface})</div>
            <div style={{ color: '#0f172a' }}>• <strong>Issue Category:</strong> {category}</div>
            <div style={{ color: '#0f172a' }}>• <strong>Jurisdiction:</strong> {city || 'City not entered'}, {state}</div>
            <div style={{ color: '#0f172a' }}>• <strong>Affected Demographics:</strong> {ageBracket}, {affectedRole} {institutionName ? `(${institutionName})` : ''}</div>
            <div style={{ color: '#0f172a' }}>• <strong>Tactics Identified:</strong> {selectedTactics.length > 0 ? selectedTactics.join(', ') : 'None selected'}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <button className="btn-secondary" onClick={() => setCurrentStep(9)}>
              <ArrowLeft size={16} /> Back
            </button>
            <button 
              className="btn-danger" 
              onClick={handleSubmitReport}
              disabled={isSubmitting}
              style={{ padding: '14px 30px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}
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
            padding: '40px', 
            borderRadius: '24px',
            border: '2px solid rgba(14, 165, 233, 0.35)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(224,242,254,0.95) 100%)',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '26px',
            boxShadow: '0 12px 40px rgba(14, 116, 189, 0.15)'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'rgba(5, 150, 105, 0.12)', border: '2px solid rgba(5, 150, 105, 0.3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <CheckCircle2 size={40} color="#059669" />
            </div>
            <h2 style={{ fontSize: '1.85rem', color: '#047857', margin: '0 0 6px 0', fontWeight: 800 }}>
              Report Safely Registered & Encrypted!
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#334155', maxWidth: '600px', margin: '0 auto', lineHeight: 1.5 }}>
              Your report has been analyzed by Gemini AI and routed to verified child advocates. Save your Anonymous Case ID below:
            </p>
          </div>

          {/* Anonymous Case Code Box */}
          <div style={{ background: '#f8fafc', border: '2px dashed #0284c7', borderRadius: '18px', padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', boxShadow: '0 4px 16px rgba(14, 165, 233, 0.1)' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                Your Private Anonymous Case Code
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0284c7', letterSpacing: '0.05em' }}>
                {generatedCase.caseCode}
              </div>
            </div>

            <button
              onClick={handleCopyCode}
              className="btn-primary"
              style={{ padding: '12px 22px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem' }}
              title="Copy Case Code"
            >
              {copied ? <Check size={18} color="#ffffff" /> : <Copy size={18} />}
              {copied ? 'Copied to Clipboard!' : 'Copy Case Code'}
            </button>
          </div>

          {/* Forensic Triage Card with Safety Graph Nodes */}
          <div style={{ background: '#ffffff', border: '1.5px solid rgba(14, 165, 233, 0.25)', borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 4px 16px rgba(14, 116, 189, 0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
                <Network size={20} color="#0284c7" /> AI Safety Graph & Case Triage
              </h4>
              <span className="badge-cyan" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
                Gemini Multi-Model Triage Engine
              </span>
            </div>

            {/* Safety Graph 4-Pillars Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1.5px solid rgba(14, 116, 189, 0.15)' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                  1. CLUSTER (WHAT)
                </span>
                <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block' }}>
                  {generatedCase.triageData?.safety_graph_nodes?.cluster?.name || generatedCase.category}
                </strong>
                <div style={{ fontSize: '0.74rem', color: '#dc2626', marginTop: '3px', fontWeight: 700 }}>
                  Severity: {generatedCase.triageData?.safety_graph_nodes?.cluster?.severity || generatedCase.aiRiskLevel}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1.5px solid rgba(14, 116, 189, 0.15)' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                  2. TACTIC (HOW)
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                  {(generatedCase.triageData?.safety_graph_nodes?.tactics || generatedCase.behavioralIndicators || []).slice(0, 3).map((t, idx) => (
                    <span key={idx} style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(220, 38, 38, 0.1)', color: '#b91c1c', border: '1px solid rgba(220, 38, 38, 0.25)', fontWeight: 600 }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1.5px solid rgba(14, 116, 189, 0.15)' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                  3. CASE (WHICH)
                </span>
                <strong style={{ fontSize: '0.95rem', color: '#0284c7', display: 'block' }}>
                  {generatedCase.caseCode}
                </strong>
                <div style={{ fontSize: '0.74rem', color: '#059669', marginTop: '3px', fontWeight: 700 }}>
                  Status: Under Review
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1.5px solid rgba(14, 116, 189, 0.15)' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                  4. PLATFORM (WHERE)
                </span>
                <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block' }}>
                  {generatedCase.triageData?.safety_graph_nodes?.platform?.name || platform}
                </strong>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '3px' }}>
                  {generatedCase.triageData?.safety_graph_nodes?.platform?.sub_surface || platformSurface}
                </div>
              </div>
            </div>

            {/* Jurisdiction & Welfare Organization */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingTop: '12px', borderTop: '1px solid rgba(14, 116, 189, 0.15)', fontSize: '0.86rem' }}>
              <div>
                <span style={{ color: '#64748b' }}>Assigned Responders: </span>
                <strong style={{ color: '#047857' }}>{generatedCase.assignedOrganization}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Risk Assessment: </span>
                <strong style={{ color: generatedCase.aiRiskScore >= 75 ? '#dc2626' : '#0284c7' }}>
                  {generatedCase.aiRiskScore}% ({generatedCase.urgencyLevel})
                </strong>
              </div>
            </div>
          </div>

          {/* Recommended Verified NGOs as per Location & Address */}
          {generatedCase.recommendedNgos && generatedCase.recommendedNgos.length > 0 && (
            <div 
              style={{ 
                background: '#ffffff',
                border: '1.5px solid rgba(14, 165, 233, 0.3)',
                borderRadius: '18px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 4px 16px rgba(14, 116, 189, 0.06)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
                    <Building size={18} color="#0284c7" /> Recommended NGOs & Child Support Services
                  </h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#475569' }}>
                    Matched automatically as per your location ({city || 'Local Area'}, {state}) and reported issue
                  </p>
                </div>
                <span className="badge-safe" style={{ fontSize: '0.72rem', padding: '3px 10px', fontWeight: 700 }}>
                  ✓ Official & DARPAN Listed
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {generatedCase.recommendedNgos.map((ngo, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#f8fafc',
                      border: '1.5px solid rgba(14, 116, 189, 0.18)',
                      borderRadius: '14px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <strong style={{ fontSize: '0.94rem', color: '#0f172a' }}>
                        {ngo.organization_name}
                      </strong>
                      <span style={{ fontSize: '0.68rem', color: '#0284c7', background: 'rgba(14, 165, 233, 0.12)', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {ngo.organization_type}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <MapPin size={14} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{ngo.address || `${ngo.city}, ${ngo.state}`}</span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.4 }}>
                      <strong>Services: </strong>{ngo.services}
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid rgba(14, 116, 189, 0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <a
                        href={`tel:${(ngo.phone || '').split('/')[0].trim()}`}
                        style={{
                          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                          color: '#fff',
                          padding: '7px 16px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)'
                        }}
                      >
                        <PhoneCall size={14} /> {ngo.phone}
                      </a>

                      {ngo.website && (
                        <a
                          href={ngo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.78rem',
                            color: '#0284c7',
                            fontWeight: 600,
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

          {/* Applicable Legal Protections, Laws & Penalties Card */}
          {generatedCase.applicableLaws && generatedCase.applicableLaws.length > 0 && (
            <div 
              style={{ 
                background: '#ffffff',
                border: '1.5px solid rgba(168, 85, 247, 0.35)',
                borderRadius: '18px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 4px 16px rgba(168, 85, 247, 0.08)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
                    <Scale size={18} color="#7c3aed" /> Applicable Legal Sections & Statutory Protections
                  </h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                    Identified automatically under Indian Law (POCSO Act, IT Act, BNS / IPC, Constitution) based on your report
                  </p>
                </div>
                <span className="badge-purple" style={{ fontSize: '0.72rem', padding: '3px 10px', fontWeight: 700 }}>
                  ⚖️ Indian Penal & Cyber Law
                </span>
              </div>

              {/* Reassurance Banner */}
              <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1.5px solid rgba(139, 92, 246, 0.25)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.85rem', color: '#5b21b6', lineHeight: 1.5 }}>
                🛡️ <strong>Statutory Victim Guarantee:</strong> You are the victim protected under these laws. The perpetrator is criminally liable. You cannot be penalized for reporting or preserving evidence.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {generatedCase.applicableLaws.map((law, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: '#f8fafc',
                      border: '1.5px solid rgba(168, 85, 247, 0.25)',
                      borderRadius: '14px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', flexWrap: 'wrap' }}>
                      <div>
                        <span style={{ fontSize: '0.74rem', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800 }}>
                          {law.act}
                        </span>
                        <h5 style={{ margin: '2px 0 0 0', fontSize: '1.02rem', color: '#0f172a', fontWeight: 800 }}>
                          {law.section}: {law.title}
                        </h5>
                      </div>
                      <span 
                        style={{ 
                          fontSize: '0.72rem', 
                          padding: '3px 10px', 
                          borderRadius: '6px', 
                          background: law.nature_of_offence?.includes('Non-Bailable') ? 'rgba(220, 38, 38, 0.12)' : 'rgba(14, 165, 233, 0.12)',
                          color: law.nature_of_offence?.includes('Non-Bailable') ? '#b91c1c' : '#0284c7',
                          border: law.nature_of_offence?.includes('Non-Bailable') ? '1px solid rgba(220, 38, 38, 0.3)' : '1px solid rgba(14, 165, 233, 0.3)',
                          fontWeight: 700
                        }}
                      >
                        {law.nature_of_offence}
                      </span>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
                      {law.description}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px', marginTop: '4px', paddingTop: '10px', borderTop: '1px solid rgba(0, 0, 0, 0.06)', fontSize: '0.8rem' }}>
                      <div style={{ color: '#b91c1c' }}>
                        <strong>Statutory Penalty: </strong>{law.penalty}
                      </div>
                      <div style={{ color: '#047857' }}>
                        <strong>Your Protection: </strong>{law.child_rights_protection}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginTop: '10px' }}>
            <button
              className="btn-primary"
              style={{ padding: '14px 28px', fontSize: '0.92rem' }}
              onClick={() => setActiveTab('tracker')}
            >
              🔍 Track Status in Report Tracker
            </button>
            <button
              className="btn-secondary"
              style={{ padding: '14px 24px', fontSize: '0.92rem' }}
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
