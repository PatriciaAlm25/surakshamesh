import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Building, 
  BookOpen, 
  Activity, 
  RefreshCw, 
  Database, 
  Filter, 
  Flame,
  Globe,
  Radio,
  School,
  Sparkles
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { StorageService } from '../../services/storageService';

// ============================================================================
// COARSE REGION-LEVEL GEOLOCATION MAPPING (INDIA)
// Strict Zero-PII Policy: Coarse region centers only, never individual child locations.
// ============================================================================
const COARSE_REGIONS = {
  'Mumbai Metro': { lat: 19.0760, lng: 72.8777, name: 'Mumbai Metro' },
  'Pune Academic Zone': { lat: 18.5204, lng: 73.8567, name: 'Pune Academic Zone' },
  'Goa Coastal Zone': { lat: 15.2993, lng: 74.1240, name: 'Goa Coastal Zone' },
  'Delhi NCR Zone': { lat: 28.7041, lng: 77.1025, name: 'Delhi NCR Zone' },
  'Bengaluru Tech Corridor': { lat: 12.9716, lng: 77.5946, name: 'Bengaluru Tech Corridor' },
  'Hyderabad Zone': { lat: 17.3850, lng: 78.4867, name: 'Hyderabad Zone' },
  'Chennai Metro': { lat: 13.0827, lng: 80.2707, name: 'Chennai Metro' },
  'Kolkata Region': { lat: 22.5726, lng: 88.3639, name: 'Kolkata Region' },
  'General': { lat: 20.5937, lng: 78.9629, name: 'Central India Zone' }
};

// Fallback seed cases if DB empty
const SEED_CASES = [
  {
    case_id: 'c101',
    report_text: 'Someone named Alex asked me not to tell my parents about our chats and asked for private photos of me in my room.',
    platform: 'Instagram Direct',
    region: 'Mumbai Metro',
    school_name: 'St. Jude International Academy',
    risk_score: 94
  },
  {
    case_id: 'c102',
    report_text: 'Classmates created a Discord server sharing edited abusive photos and threatening to make everyone hate me at school.',
    platform: 'Discord Server',
    region: 'Pune Academic Zone',
    school_name: 'Delhi Public School, Pune',
    risk_score: 82
  },
  {
    case_id: 'c103',
    report_text: 'Anonymous account threatening to leak my private photos to all my friends unless I pay money or send more pictures.',
    platform: 'WhatsApp',
    region: 'Mumbai Metro',
    school_name: 'Ryan International School',
    risk_score: 96
  },
  {
    case_id: 'c104',
    report_text: 'Free reward link offered free Robux but asked for my login password and exact school location.',
    platform: 'Roblox Chat',
    region: 'Goa Coastal Zone',
    school_name: 'Sharada Mandir High School',
    risk_score: 64
  },
  {
    case_id: 'c105',
    report_text: 'Cyberbullying group created targeting 9th grade students with fake profiles.',
    platform: 'Instagram Direct',
    region: 'Delhi NCR Zone',
    school_name: 'Modern School, Barakhamba',
    risk_score: 88
  },
  {
    case_id: 'c106',
    report_text: 'Doxxing threats and location leaks via gaming chat server.',
    platform: 'Discord Server',
    region: 'Bengaluru Tech Corridor',
    school_name: 'National Public School, Indiranagar',
    risk_score: 76
  }
];

// Helper to determine dominant threat cluster
function getThreatCluster(text = '') {
  const lower = text.toLowerCase();
  if (lower.includes('blackmail') || lower.includes('extort') || lower.includes('leak') || lower.includes('pay') || lower.includes('money')) {
    return 'Blackmail & Sextortion';
  }
  if (lower.includes('secret') || lower.includes('tell') || lower.includes('parent') || lower.includes('room') || lower.includes('photo')) {
    return 'Online Grooming';
  }
  if (lower.includes('bull') || lower.includes('hate') || lower.includes('server') || lower.includes('group') || lower.includes('edited')) {
    return 'Cyberbullying & Harassment';
  }
  return 'Phishing, Scams & Privacy Abuse';
}

// Risk Color Code Helper: Red = high (>=85% or avg >=75), Orange = medium (70-84%), Yellow = moderate (45-69%), Green = low (<45%)
function getRiskDetails(avgRisk = 50) {
  if (avgRisk >= 85) return { color: '#ef4444', label: 'CRITICAL RISK', bg: 'rgba(239, 68, 68, 0.18)', border: '#ef4444' };
  if (avgRisk >= 70) return { color: '#f97316', label: 'HIGH RISK', bg: 'rgba(249, 115, 22, 0.18)', border: '#f97316' };
  if (avgRisk >= 45) return { color: '#eab308', label: 'MODERATE RISK', bg: 'rgba(234, 179, 8, 0.18)', border: '#eab308' };
  return { color: '#10b981', label: 'LOW RISK', bg: 'rgba(16, 185, 129, 0.18)', border: '#10b981' };
}

export default function SafeSchoolDashboard({ setActiveTab }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbSource, setDbSource] = useState('Supabase Live DB');
  const [selectedRegion, setSelectedRegion] = useState(null);

  // Load cases from Supabase
  const fetchMapData = async () => {
    setLoading(true);
    const data = await StorageService.fetchSupabaseCases();
    if (data && data.length > 0) {
      setCases(data);
      setDbSource('Supabase Live Database');
    } else {
      setCases(SEED_CASES);
      setDbSource('Demo Seed Cases');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMapData();
  }, []);

  // Aggregate cases by coarse region
  const regionHeatmapData = useMemo(() => {
    const map = new Map();

    // Group cases into coarse regions
    cases.forEach(c => {
      let regKey = c.region || 'General';
      
      // Match key or find fuzzy match
      const matchedKey = Object.keys(COARSE_REGIONS).find(
        k => k.toLowerCase() === regKey.toLowerCase() || regKey.toLowerCase().includes(k.toLowerCase())
      ) || 'General';

      if (!map.has(matchedKey)) {
        const coords = COARSE_REGIONS[matchedKey];
        map.set(matchedKey, {
          regionKey: matchedKey,
          name: coords.name,
          lat: coords.lat,
          lng: coords.lng,
          caseCount: 0,
          totalRisk: 0,
          maxRisk: 0,
          clusters: {},
          platforms: {},
          schoolsSet: new Set(),
          casesList: []
        });
      }

      const rObj = map.get(matchedKey);
      const risk = c.risk_score || 50;
      const cluster = getThreatCluster(c.report_text || '');
      const platform = c.platform || 'Direct';

      rObj.caseCount += 1;
      rObj.totalRisk += risk;
      rObj.maxRisk = Math.max(rObj.maxRisk, risk);
      rObj.clusters[cluster] = (rObj.clusters[cluster] || 0) + 1;
      rObj.platforms[platform] = (rObj.platforms[platform] || 0) + 1;

      if (c.school_name && c.school_name !== 'General / Unspecified') {
        rObj.schoolsSet.add(c.school_name);
      }
      rObj.casesList.push(c);
    });

    // Compute final aggregated metrics
    const results = Array.from(map.values()).map(r => {
      const avgRisk = Math.round(r.totalRisk / (r.caseCount || 1));
      
      // Find dominant cluster
      let dominantCluster = 'Online Grooming';
      let maxC = 0;
      Object.entries(r.clusters).forEach(([cName, count]) => {
        if (count > maxC) {
          maxC = count;
          dominantCluster = cName;
        }
      });

      // Find common platform
      let commonPlatform = 'Instagram Direct';
      let maxP = 0;
      Object.entries(r.platforms).forEach(([pName, count]) => {
        if (count > maxP) {
          maxP = count;
          commonPlatform = pName;
        }
      });

      const riskDetails = getRiskDetails(avgRisk);

      return {
        ...r,
        avgRisk,
        dominantCluster,
        commonPlatform,
        riskDetails,
        schools: Array.from(r.schoolsSet)
      };
    });

    return results;
  }, [cases]);

  // Set default selected region when data changes
  useEffect(() => {
    if (regionHeatmapData.length > 0 && (!selectedRegion || !regionHeatmapData.find(r => r.regionKey === selectedRegion.regionKey))) {
      setSelectedRegion(regionHeatmapData[0]);
    }
  }, [regionHeatmapData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Top Banner Header */}
      <div className="glass-panel" style={{ padding: '22px 28px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <Flame color="#ef4444" size={24} /> SafeSchool India Threat Heatmap
            </h2>
            <span className="badge-purple" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Database size={12} /> Supabase `cases` Table
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Coarse region-level heat intensity derived from aggregated risk scores. <strong style={{ color: '#0284c7' }}>Strict Zero-PII Policy:</strong> Coarse coordinates only, individual child locations are never displayed.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span className="badge-cyan" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Radio size={12} className="animate-pulse" /> {dbSource}
          </span>

          <button 
            className="btn-secondary" 
            style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={fetchMapData}
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Heatmap
          </button>
        </div>
      </div>

      {/* Main Heatmap Grid: Leaflet Map (Left) + Region Detail Panel (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '20px' }}>
        
        {/* Leaflet Heatmap Canvas Container */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px', padding: '0 6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              <MapPin size={18} color="#0284c7" /> Coarse Region Heat Map (India)
            </div>
            
            {/* Heat Intensity Color Legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', fontSize: '0.72rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#dc2626', fontWeight: 700 }}>
                ● Critical (≥85)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ea580c', fontWeight: 700 }}>
                ● High (70-84)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#d97706', fontWeight: 700 }}>
                ● Moderate (45-69)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontWeight: 700 }}>
                ● Low (&lt;45)
              </span>
            </div>
          </div>

          {/* Interactive Leaflet React Map */}
          <div style={{ height: 'clamp(360px, 50vh, 520px)', width: '100%', borderRadius: '14px', overflow: 'hidden', border: '1.5px solid rgba(14, 116, 189, 0.2)', position: 'relative' }}>
            {loading ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', background: '#0b1329', color: '#94a3b8' }}>
                <RefreshCw className="animate-spin" size={32} color="#0284c7" />
                <span>Aggregating Supabase region scores into heatmap...</span>
              </div>
            ) : (
              <MapContainer 
                center={[20.5937, 78.9629]} 
                zoom={5} 
                scrollWheelZoom={true} 
                style={{ height: '100%', width: '100%', background: '#090d16' }}
              >
                {/* Sleek Dark Mode Map Tiles (100% Free, Zero API Key Required) */}
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://www.esri.com/">Esri</a>'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                />

                {/* Heatmap Region Circles */}
                {regionHeatmapData.map((reg) => {
                  const isSelected = selectedRegion?.regionKey === reg.regionKey;
                  const radius = Math.max(22, 18 + reg.caseCount * 6);

                  return (
                    <React.Fragment key={reg.regionKey}>
                      
                      {/* Outer Heat Glow Aura */}
                      <CircleMarker
                        center={[reg.lat, reg.lng]}
                        radius={radius + 12}
                        pathOptions={{
                          fillColor: reg.riskDetails.color,
                          fillOpacity: isSelected ? 0.35 : 0.18,
                          stroke: false
                        }}
                      />

                      {/* Main Coarse Region Marker */}
                      <CircleMarker
                        center={[reg.lat, reg.lng]}
                        radius={radius}
                        pathOptions={{
                          fillColor: reg.riskDetails.color,
                          fillOpacity: 0.75,
                          color: isSelected ? '#ffffff' : reg.riskDetails.border,
                          weight: isSelected ? 3 : 1.5
                        }}
                        eventHandlers={{
                          click: () => setSelectedRegion(reg)
                        }}
                      >
                        <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                          <div style={{ background: '#0f172a', color: '#f8fafc', padding: '6px 10px', borderRadius: '6px', border: `1px solid ${reg.riskDetails.color}`, fontSize: '0.78rem' }}>
                            <strong>{reg.name}</strong>
                            <div>Avg Risk: <span style={{ color: reg.riskDetails.color, fontWeight: 800 }}>{reg.avgRisk}%</span></div>
                            <div>Active Cases: {reg.caseCount}</div>
                          </div>
                        </Tooltip>

                        <Popup>
                          <div style={{ color: '#0f172a', fontSize: '0.82rem' }}>
                            <strong style={{ fontSize: '0.9rem' }}>{reg.name}</strong><br />
                            <strong>Avg Risk:</strong> {reg.avgRisk}% ({reg.riskDetails.label})<br />
                            <strong>Total Reports:</strong> {reg.caseCount}<br />
                            <strong>Dominant Threat:</strong> {reg.dominantCluster}
                          </div>
                        </Popup>
                      </CircleMarker>

                    </React.Fragment>
                  );
                })}

              </MapContainer>
            )}

            {/* Floating Info Overlay */}
            <div style={{ position: 'absolute', bottom: '12px', left: '12px', zIndex: 1000, background: 'rgba(255, 255, 255, 0.94)', backdropFilter: 'blur(8px)', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(14, 116, 189, 0.25)', fontSize: '0.74rem', color: 'var(--text-secondary)', boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)' }}>
              💡 Click any regional circle to inspect risk metrics and affiliated schools.
            </div>

          </div>

        </div>

        {/* Selected Region Detailed Metrics & School Panel (Right) */}
        <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {selectedRegion ? (
            <>
              <div>
                <span className="badge-cyan" style={{ fontSize: '0.7rem', marginBottom: '6px', display: 'inline-block' }}>
                  Regional Intelligence Profile
                </span>
                
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                  <Globe color="#0284c7" size={20} /> {selectedRegion.name}
                </h3>
              </div>

              {/* Risk Level Badge & Score Meter */}
              <div style={{ background: selectedRegion.riskDetails.bg, border: `1.5px solid ${selectedRegion.riskDetails.border}`, padding: '12px 16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: selectedRegion.riskDetails.color, fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    {selectedRegion.riskDetails.label}
                  </span>
                  <span style={{ color: selectedRegion.riskDetails.color, fontWeight: 900, fontSize: '1.2rem' }}>
                    {selectedRegion.avgRisk}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: '6px', background: 'rgba(15, 23, 42, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${selectedRegion.avgRisk}%`, height: '100%', background: selectedRegion.riskDetails.color, transition: 'width 0.4s ease' }} />
                </div>
              </div>

              {/* Key Aggregated Stats */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1.5px solid rgba(14, 116, 189, 0.15)', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(14, 116, 189, 0.1)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Total Case Count:</span>
                  <strong style={{ color: '#0284c7', fontSize: '0.95rem' }}>{selectedRegion.caseCount} Incident(s)</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(14, 116, 189, 0.1)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Dominant Cluster:</span>
                  <strong style={{ color: '#e11d48' }}>{selectedRegion.dominantCluster}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(14, 116, 189, 0.1)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Common Platform:</span>
                  <strong style={{ color: '#7c3aed' }}>{selectedRegion.commonPlatform}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Highest Single Case Risk:</span>
                  <strong style={{ color: '#dc2626' }}>{selectedRegion.maxRisk}%</strong>
                </div>

              </div>

              {/* Affiliated Schools List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <School size={16} color="#db2777" /> Affiliated Schools in Region ({selectedRegion.schools.length}):
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                  {selectedRegion.schools.length > 0 ? (
                    selectedRegion.schools.map((sch, idx) => (
                      <div key={idx} style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', color: '#9d174d', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                        <span>🏫</span> {sch}
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '6px' }}>
                      General / Unspecified School
                    </div>
                  )}
                </div>
              </div>

              {/* Actionable Preventive Advisory */}
              <div className="glass-panel" style={{ padding: '14px', borderLeft: '3px solid #0284c7', background: '#f8fafc', marginTop: 'auto' }}>
                <h4 style={{ fontSize: '0.82rem', color: '#0284c7', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpen size={14} /> Preventive Action Plan
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  Recommend conducting mandatory <em>"{selectedRegion.dominantCluster}"</em> awareness workshops for student welfare counsellors across schools in {selectedRegion.name}.
                </p>
              </div>

            </>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', marginTop: '40px' }}>
              Select a region marker on the map to inspect details.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
