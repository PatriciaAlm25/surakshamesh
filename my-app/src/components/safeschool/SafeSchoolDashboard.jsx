import React, { useState } from 'react';
import { 
  MapPin, 
  ShieldCheck, 
  BarChart2, 
  AlertTriangle, 
  Building, 
  BookOpen, 
  Users, 
  Info,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const REGIONAL_ZONES = [
  { id: 'mum-north', name: 'Western Zone / Mumbai Metro', schoolsCount: 42, reportsCount: 14, safetyScore: 82, dominantThreat: 'Online Grooming & Secrecy', riskLevel: 'HIGH', lat: 19.0760, lng: 72.8777 },
  { id: 'pune-east', name: 'Pune East Academic Hub', schoolsCount: 28, reportsCount: 9, safetyScore: 86, dominantThreat: 'Cyberbullying & Defamation', riskLevel: 'MEDIUM', lat: 18.5204, lng: 73.8567 },
  { id: 'goa-coast', name: 'Goa Coastal Schools Zone', schoolsCount: 19, reportsCount: 4, safetyScore: 94, dominantThreat: 'Gaming Scams & Phishing', riskLevel: 'LOW', lat: 15.2993, lng: 74.1240 },
  { id: 'blr-south', name: 'Bengaluru Tech Corridor', schoolsCount: 35, reportsCount: 8, safetyScore: 88, dominantThreat: 'Identity Harvesting & Doxxing', riskLevel: 'MEDIUM', lat: 12.9716, lng: 77.5946 },
  { id: 'delhi-ncr', name: 'Delhi NCR District Zone', schoolsCount: 50, reportsCount: 19, safetyScore: 78, dominantThreat: 'Harassment & Coercion', riskLevel: 'HIGH', lat: 28.7041, lng: 77.1025 }
];

const CATEGORY_DATA = [
  { name: 'Grooming', count: 38, color: '#ef4444' },
  { name: 'Bullying', count: 29, color: '#f59e0b' },
  { name: 'Phishing', count: 18, color: '#38bdf8' },
  { name: 'Doxxing', count: 12, color: '#c084fc' },
  { name: 'Other', count: 6, color: '#94a3b8' }
];

const MONTHLY_TRENDS = [
  { month: 'Apr', reports: 12, resolved: 10 },
  { month: 'May', reports: 19, resolved: 16 },
  { month: 'Jun', reports: 15, resolved: 14 },
  { month: 'Jul', reports: 26, resolved: 22 },
  { month: 'Aug', reports: 31, resolved: 27 },
  { month: 'Sep', reports: 22, resolved: 20 }
];

export default function SafeSchoolDashboard({ setActiveTab }) {
  const [selectedZone, setSelectedZone] = useState(REGIONAL_ZONES[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '22px 28px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '1.4rem' }}>🗺️ SafeSchool Regional Safety Heatmap</h2>
            <span className="badge-cyan">Zero-PII Aggregated Intelligence</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Zone-level safety metrics to help school principals, counsellors, and education departments deploy proactive cyber workshops.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge-safe">🛡️ Zero Child Names</span>
          <span className="badge-purple">Coarse Geolocation Only</span>
        </div>
      </div>

      {/* Map & District List Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
        
        {/* District Zones Selector / Heatmap Map View */}
        <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="#38bdf8" /> Regional Safety Index (India)
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Updated: Sep 2026</span>
          </div>

          {/* Regional Cards List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {REGIONAL_ZONES.map((zone) => {
              const isSelected = selectedZone.id === zone.id;
              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.7)',
                    border: isSelected ? '2px solid #38bdf8' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.88rem', color: isSelected ? '#38bdf8' : 'var(--text-primary)' }}>
                      {zone.name}
                    </strong>
                    <span className={zone.riskLevel === 'HIGH' ? 'badge-danger' : (zone.riskLevel === 'MEDIUM' ? 'badge-warning' : 'badge-safe')} style={{ fontSize: '0.65rem' }}>
                      {zone.riskLevel}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Dominant: <strong style={{ color: '#cbd5e1' }}>{zone.dominantThreat}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>{zone.schoolsCount} Affiliated Schools</span>
                    <span style={{ color: '#34d399', fontWeight: 600 }}>Score: {zone.safetyScore}/100</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Monthly Trends Bar Chart */}
          <div style={{ marginTop: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>
              📊 Incident Resolution Velocity (Last 6 Months)
            </div>

            <div style={{ width: '100%', height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_TRENDS}>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #38bdf8', borderRadius: '8px', fontSize: '0.75rem' }} />
                  <Bar dataKey="reports" fill="#ef4444" name="Incoming Alerts" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" fill="#10b981" name="Protected & Resolved" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Selected Zone Deep Dive & Preventive Toolkit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Zone Detail Card */}
          <div className="glass-panel" style={{ padding: '22px', borderLeft: '3px solid #38bdf8' }}>
            <span className="badge-cyan" style={{ fontSize: '0.7rem', marginBottom: '6px' }}>
              Selected Zone Profile
            </span>
            <h3 style={{ fontSize: '1.2rem', color: '#38bdf8' }}>{selectedZone.name}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>School Safety Index:</span>
                <strong style={{ color: '#34d399' }}>{selectedZone.safetyScore}% Safe</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Active Triage Alerts:</span>
                <strong style={{ color: '#f87171' }}>{selectedZone.reportsCount} Anonymous Cases</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Primary Risk Factor:</span>
                <strong style={{ color: '#fbbf24' }}>{selectedZone.dominantThreat}</strong>
              </div>
            </div>
          </div>

          {/* Categorical Distribution Pie Chart */}
          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>
              Threat Breakdown by Category
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '120px', height: '120px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={CATEGORY_DATA} dataKey="count" innerRadius={28} outerRadius={50} paddingAngle={4}>
                      {CATEGORY_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.72rem' }}>
                {CATEGORY_DATA.map((cat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{cat.name}:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{cat.count}%</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actionable Toolkit for Principals */}
          <div className="glass-panel" style={{ padding: '18px' }}>
            <h4 style={{ fontSize: '0.88rem', color: '#38bdf8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={16} /> Preventive Action for Schools
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Conduct dedicated <em>"Grooming & Secrecy Awareness"</em> student sessions and train homeroom teachers to recognize emotional withdrawal signs.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
