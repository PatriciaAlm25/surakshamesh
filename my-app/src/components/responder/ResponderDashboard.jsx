import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Filter, 
  FileText, 
  UserCheck, 
  Sparkles, 
  AlertTriangle, 
  X, 
  Check, 
  Building, 
  RefreshCw,
  Search
} from 'lucide-react';
import { StorageService } from '../../services/storageService';

export default function ResponderDashboard({ setActiveTab }) {
  const [cases, setCases] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [selectedCase, setSelectedCase] = useState(null);
  const [responderNote, setResponderNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const reloadCases = () => {
    const list = StorageService.getCases();
    setCases(list);
  };

  useEffect(() => {
    reloadCases();
  }, []);

  const handleUpdateStatus = (caseId, nextStatus) => {
    StorageService.updateCaseStatus(caseId, nextStatus, responderNote || 'Status transitioned by authorized responder');
    reloadCases();
    if (selectedCase && (selectedCase.id === caseId || selectedCase.caseCode === caseId)) {
      const updated = StorageService.getCaseByCode(selectedCase.caseCode);
      setSelectedCase(updated);
    }
    setResponderNote('');
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.caseCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.rawDescription && c.rawDescription.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;

    if (selectedFilter === 'HIGH') return c.aiRiskLevel === 'HIGH';
    if (selectedFilter === 'MEDIUM') return c.aiRiskLevel === 'MEDIUM';
    if (selectedFilter === 'RESOLVED') return c.status === 'RESOLVED';
    if (selectedFilter === 'ACTIVE') return c.status !== 'RESOLVED';
    return true;
  });

  const highCount = cases.filter(c => c.aiRiskLevel === 'HIGH' && c.status !== 'RESOLVED').length;
  const medCount = cases.filter(c => c.aiRiskLevel === 'MEDIUM' && c.status !== 'RESOLVED').length;
  const resolvedCount = cases.filter(c => c.status === 'RESOLVED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header */}
      <div className="glass-panel" style={{ padding: '22px 28px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '1.4rem' }}>👨‍💼 Responder & NGO Command Center</h2>
            <span className="badge-warning">Authorized Triage Console</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Role-Based Access for Childline advocates, School Counselors, and Cyber Cell officers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={reloadCases} style={{ fontSize: '0.82rem' }}>
            <RefreshCw size={14} /> Refresh Queue
          </button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        <div className="glass-panel-danger" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={26} color="#ef4444" />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f87171' }}>{highCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>P1 High Risk Alerts</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '3px solid #f59e0b' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={26} color="#fbbf24" />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24' }}>{medCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>P2 Priority Cases</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '3px solid #10b981' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={26} color="#34d399" />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>{resolvedCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Resolved & Protected</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '3px solid #38bdf8' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building size={26} color="#38bdf8" />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8' }}>14</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Partner NGOs & Units</div>
          </div>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedFilter('ALL')}
            style={{
              background: selectedFilter === 'ALL' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
              color: selectedFilter === 'ALL' ? '#38bdf8' : 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600
            }}
          >
            All Reports ({cases.length})
          </button>
          <button
            onClick={() => setSelectedFilter('HIGH')}
            style={{
              background: selectedFilter === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
              color: selectedFilter === 'HIGH' ? '#f87171' : 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600
            }}
          >
            🔴 High Risk ({highCount})
          </button>
          <button
            onClick={() => setSelectedFilter('MEDIUM')}
            style={{
              background: selectedFilter === 'MEDIUM' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
              color: selectedFilter === 'MEDIUM' ? '#fbbf24' : 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600
            }}
          >
            🟠 Medium Risk ({medCount})
          </button>
          <button
            onClick={() => setSelectedFilter('RESOLVED')}
            style={{
              background: selectedFilter === 'RESOLVED' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: selectedFilter === 'RESOLVED' ? '#34d399' : 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600
            }}
          >
            🟢 Resolved ({resolvedCount})
          </button>
        </div>

        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Filter by code or text..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '6px 10px 6px 30px', fontSize: '0.78rem' }}
          />
        </div>
      </div>

      {/* Case Table */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#090e1a', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '14px 18px' }}>Case ID</th>
              <th style={{ padding: '14px 18px' }}>Incident Category</th>
              <th style={{ padding: '14px 18px' }}>AI Risk Score</th>
              <th style={{ padding: '14px 18px' }}>Assigned Support Unit</th>
              <th style={{ padding: '14px 18px' }}>Current Status</th>
              <th style={{ padding: '14px 18px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((c) => (
              <tr 
                key={c.id || c.caseCode} 
                style={{ 
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  background: selectedCase?.caseCode === c.caseCode ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                  transition: 'background 0.2s ease'
                }}
              >
                <td style={{ padding: '14px 18px', fontWeight: 700, color: '#38bdf8' }}>
                  {c.caseCode}
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.category.replace('_', ' ')}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.platform} • {c.childAgeBracket}</div>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, color: c.aiRiskLevel === 'HIGH' ? '#f87171' : '#fbbf24' }}>
                      {c.aiRiskScore}%
                    </span>
                    <span className={c.aiRiskLevel === 'HIGH' ? 'badge-danger' : 'badge-warning'} style={{ fontSize: '0.68rem' }}>
                      {c.aiRiskLevel}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                  {c.assignedOrganization || 'Child Welfare Cell'}
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span className={c.status === 'RESOLVED' ? 'badge-safe' : 'badge-cyan'} style={{ fontSize: '0.72rem' }}>
                    {c.status.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <button
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    onClick={() => setSelectedCase(c)}
                  >
                    <Eye size={13} /> Triage Case
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Deep Inspection Drawer / Modal */}
      {selectedCase && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)', zIndex: 900, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: '620px', background: '#090e1a', height: '100vh', overflowY: 'auto', padding: '28px', borderLeft: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge-cyan" style={{ marginBottom: '6px' }}>Forensic Case Dossier</span>
                <h3 style={{ fontSize: '1.4rem', color: '#38bdf8' }}>{selectedCase.caseCode}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Reported on {new Date(selectedCase.createdAt).toLocaleString()}
                </div>
              </div>

              <button 
                onClick={() => setSelectedCase(null)} 
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '6px', borderRadius: '50%' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* AI Case Translator Breakdown */}
            <div className="glass-panel" style={{ padding: '18px', borderLeft: '3px solid #38bdf8' }}>
              <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} /> AI Case Translator Structured Summary
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '12px', lineHeight: 1.5 }}>
                {selectedCase.aiSummary}
              </p>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Behavioral Threat Indicators:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {selectedCase.behavioralIndicators?.map((ind, i) => (
                  <span key={i} className="badge-danger" style={{ fontSize: '0.72rem' }}>
                    ⚠️ {ind}
                  </span>
                ))}
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Evidence Snippets:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {selectedCase.evidenceSnippets?.map((snip, i) => (
                  <div key={i} style={{ background: '#040812', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem', borderLeft: '2px solid #a855f7' }}>
                    "{snip}"
                  </div>
                ))}
              </div>
            </div>

            {/* Raw Child Testimony */}
            <div className="glass-panel" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                User Reported Description:
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', background: '#050811', padding: '10px 14px', borderRadius: '8px' }}>
                {selectedCase.rawDescription}
              </div>
            </div>

            {/* Workflow Actions */}
            <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Advance Case Status</h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  className="btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '8px' }}
                  onClick={() => handleUpdateStatus(selectedCase.caseCode, 'UNDER_REVIEW')}
                >
                  Mark Under Review
                </button>
                <button
                  className="btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '8px' }}
                  onClick={() => handleUpdateStatus(selectedCase.caseCode, 'ASSIGNED')}
                >
                  Assign to NGO Counsellor
                </button>
                <button
                  className="btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '8px' }}
                  onClick={() => handleUpdateStatus(selectedCase.caseCode, 'INTERVENTION_ACTIVE')}
                >
                  Trigger Active Intervention
                </button>
                <button
                  className="btn-primary"
                  style={{ fontSize: '0.75rem', padding: '8px' }}
                  onClick={() => handleUpdateStatus(selectedCase.caseCode, 'RESOLVED')}
                >
                  ✓ Mark Incident Resolved
                </button>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Optional caseworker action note..."
                  value={responderNote}
                  onChange={e => setResponderNote(e.target.value)}
                  style={{ width: '100%', fontSize: '0.8rem', padding: '8px 12px', marginTop: '4px' }}
                />
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
