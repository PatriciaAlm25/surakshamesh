import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Building, 
  UserCheck, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { StorageService } from '../../services/storageService';

const STATUS_STEPS = [
  { key: 'RECEIVED', label: '1. Report Received', desc: 'Secure ingestion & encryption' },
  { key: 'AI_ANALYZED', label: '2. AI Pattern Analysis', desc: 'Multilingual NLP & Risk scoring' },
  { key: 'UNDER_REVIEW', label: '3. Authorized Review', desc: 'Triaged by verified case officer' },
  { key: 'ASSIGNED', label: '4. Support Assigned', desc: 'Routed to counsellor or NGO cell' },
  { key: 'INTERVENTION_ACTIVE', label: '5. Action & Protection', desc: 'Ground-level or cyber intervention' },
  { key: 'RESOLVED', label: '6. Resolved & Safe', desc: 'Incident closed with child welfare verified' }
];

export default function CaseTracker({ setActiveTab }) {
  const [searchInput, setSearchInput] = useState('SM-2026-84291');
  const [activeCase, setActiveCase] = useState(StorageService.getCaseByCode('SM-2026-84291'));
  const [hasSearched, setHasSearched] = useState(true);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const found = StorageService.getCaseByCode(searchInput.trim());
    setActiveCase(found || null);
    setHasSearched(true);
  };

  const handleSelectQuick = (code) => {
    setSearchInput(code);
    const found = StorageService.getCaseByCode(code);
    setActiveCase(found || null);
    setHasSearched(true);
  };

  const getStepIndex = (status) => {
    const map = {
      'RECEIVED': 0,
      'AI_ANALYZED': 1,
      'UNDER_REVIEW': 2,
      'ASSIGNED': 3,
      'INTERVENTION_ACTIVE': 4,
      'RESOLVED': 5
    };
    return map[status] ?? 2;
  };

  const currentStepIdx = activeCase ? getStepIndex(activeCase.status) : 0;

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>📊 Anonymous Case Tracker</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto' }}>
          Enter your private Case ID to see real-time verification and assignment updates from child welfare organizations.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ maxWidth: '540px', margin: '20px auto 10px auto', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="e.g. SM-2026-84291"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            style={{ flex: 1, padding: '12px 16px', fontSize: '1rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '12px 22px' }}>
            <Search size={18} /> Search Status
          </button>
        </form>

        {/* Quick Test Codes */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span>Demo Case IDs:</span>
          <button 
            onClick={() => handleSelectQuick('SM-2026-84291')}
            style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.3)' }}
          >
            SM-2026-84291 (Grooming / Review)
          </button>
          <button 
            onClick={() => handleSelectQuick('SM-2026-39102')}
            style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(168, 85, 247, 0.3)' }}
          >
            SM-2026-39102 (Bullying / Assigned)
          </button>
          <button 
            onClick={() => handleSelectQuick('SM-2026-51204')}
            style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}
          >
            SM-2026-51204 (Phishing / Resolved)
          </button>
        </div>
      </div>

      {/* Case Details & Visual Stepper */}
      {activeCase ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Summary Overview Card */}
          <div className="glass-panel-glow" style={{ padding: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tracking Case</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8' }}>{activeCase.caseCode}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Category: <strong>{activeCase.category.replace('_', ' ')}</strong> • Origin: {activeCase.platform}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Assigned Support Unit:</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#34d399' }}>
                  {activeCase.assignedOrganization || 'Child Welfare Cell'}
                </div>
              </div>
              <span className={activeCase.aiRiskLevel === 'HIGH' ? 'badge-danger' : 'badge-warning'} style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                {activeCase.aiRiskLevel || 'HIGH'} PRIORITY
              </span>
            </div>
          </div>

          {/* Milestone Stepper Bar */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#38bdf8" /> Protection Workflow Progress
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', position: 'relative' }}>
              {STATUS_STEPS.map((stepItem, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div
                    key={stepItem.key}
                    style={{
                      padding: '14px 10px',
                      borderRadius: '12px',
                      background: isCurrent ? 'rgba(56, 189, 248, 0.15)' : (isPassed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.5)'),
                      border: isCurrent ? '2px solid #38bdf8' : (isPassed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)'),
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '0.75rem', 
                        fontWeight: 700,
                        background: isPassed ? '#10b981' : '#334155',
                        color: '#fff'
                      }}>
                        {isPassed ? '✓' : idx + 1}
                      </span>
                      {isCurrent && <span className="badge-cyan" style={{ fontSize: '0.65rem' }}>Active</span>}
                    </div>

                    <strong style={{ fontSize: '0.82rem', color: isPassed ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {stepItem.label}
                    </strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                      {stepItem.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Log & Counselor Contact */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* Timeline Audit List */}
            <div className="glass-panel" style={{ padding: '22px' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '14px', color: 'var(--text-primary)' }}>
                Activity & Verification Events
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeCase.timeline?.map((evt, idx) => (
                  <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '10px 14px', borderRadius: '10px', borderLeft: '3px solid #38bdf8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>{evt.actor}</span>
                      <span>{evt.time}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', marginTop: '2px' }}>
                      {evt.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Child Welfare Guarantee & Support Contacts */}
            <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-cyan)' }}>
                🛡️ Your Safety is Guaranteed
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Your report is under care. An authorized child advocate from <strong>{activeCase.assignedOrganization}</strong> has been notified to provide confidential assistance.
              </p>

              <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)', fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '2px' }}>Immediate Help:</div>
                <div>Call Childline directly at <strong>1098</strong> (Toll-Free, 24/7) and quote Case ID <code>{activeCase.caseCode}</code>.</div>
              </div>

              <button className="btn-secondary" style={{ marginTop: 'auto', width: '100%' }} onClick={() => setActiveTab('assistant')}>
                💬 Open Suraksha Assistant for Safe Guidance
              </button>
            </div>

          </div>

        </div>
      ) : (
        hasSearched && (
          <div className="glass-panel" style={{ padding: '36px', textAlign: 'center' }}>
            <AlertCircle size={36} color="#f59e0b" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>No Case Found for "{searchInput}"</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto 18px auto' }}>
              Please check the Case ID code format (e.g. <code>SM-2026-84291</code>) or file a new anonymous SOS report.
            </p>
            <button className="btn-primary" onClick={() => setActiveTab('report')}>
              File New Anonymous SOS
            </button>
          </div>
        )
      )}

    </div>
  );
}
