import React, { useState, useEffect, useMemo } from 'react';
import { 
  Network, 
  Layers, 
  ShieldAlert, 
  Info, 
  Sparkles, 
  Maximize2, 
  Eye, 
  Filter,
  CheckCircle2,
  RefreshCw,
  PlusCircle,
  Database,
  Radio,
  Share2,
  AlertTriangle,
  Zap,
  Target,
  Globe,
  Compass,
  FileText,
  HelpCircle,
  Activity,
  Lock,
  UserX
} from 'lucide-react';
import { StorageService } from '../../services/storageService';

// ============================================================================
// CURATED COLOR SYSTEM & 4 EXACT CLUSTER TYPES
// ============================================================================
const CLUSTER_TYPES = {
  grooming: {
    id: 'cluster-grooming',
    label: 'Online Grooming',
    color: '#f43f5e',       // Rose Red
    stroke: '#fb7185',
    description: 'Trust building, secrecy demands ("don\'t tell parents"), private photo/video solicitation, and isolation.'
  },
  cyberbullying: {
    id: 'cluster-cyberbullying',
    label: 'Cyberbullying & Harassment',
    color: '#f97316',       // Warm Orange
    stroke: '#fb923c',
    description: 'Targeted group harassment, altered media sharing, reputation attacks, and abusive messages.'
  },
  sextortion: {
    id: 'cluster-sextortion',
    label: 'Blackmail & Sextortion',
    color: '#a855f7',       // Electric Violet
    stroke: '#c084fc',
    description: 'Coercion, threats to leak private photos/info, financial/gift card demands, and extortion.'
  },
  phishing: {
    id: 'cluster-phishing',
    label: 'Phishing, Scams & Privacy Abuse',
    color: '#06b6d4',       // Electric Cyan
    stroke: '#22d3ee',
    description: 'Fake reward lures (Robux/Gems), malicious links, password harvesting, and location probing.'
  }
};

const COLOR_SYSTEM = {
  tier1_cluster: {
    name: 'Cluster (WHAT)'
  },
  tier2_case: {
    critical: '#ef4444',      // Crimson Red (≥85%)
    high: '#f97316',          // Warm Orange (70-84%)
    moderate: '#eab308',      // Electric Gold (45-69%)
    low: '#10b981',           // Emerald Green (<45%)
    name: 'Case (WHICH)'
  },
  tier3_tactic: {
    primary: '#a855f7',      // Electric Violet
    stroke: '#c084fc',
    name: 'Tactic (HOW)'
  },
  tier4_platform: {
    primary: '#06b6d4',      // Electric Cyan
    stroke: '#22d3ee',
    name: 'Platform (WHERE)'
  },
  similarity: {
    stroke: '#38bdf8'
  }
};

function getCaseRiskColor(score = 50) {
  if (score >= 85) return COLOR_SYSTEM.tier2_case.critical;
  if (score >= 70) return COLOR_SYSTEM.tier2_case.high;
  if (score >= 45) return COLOR_SYSTEM.tier2_case.moderate;
  return COLOR_SYSTEM.tier2_case.low;
}

function getCaseRiskBadge(score = 50) {
  if (score >= 85) return { bg: 'rgba(239, 68, 68, 0.2)', text: '#fca5a5', border: '#ef4444', label: 'CRITICAL RISK (≥85%)', color: '#ef4444' };
  if (score >= 70) return { bg: 'rgba(249, 115, 22, 0.2)', text: '#fdba74', border: '#f97316', label: 'HIGH RISK (70-84%)', color: '#f97316' };
  if (score >= 45) return { bg: 'rgba(234, 179, 8, 0.2)', text: '#fde047', border: '#eab308', label: 'MODERATE RISK (45-69%)', color: '#eab308' };
  return { bg: 'rgba(16, 185, 129, 0.2)', text: '#6ee7b7', border: '#10b981', label: 'LOW RISK (<45%)', color: '#10b981' };
}

function getPlatformColor(platformName = '') {
  const p = platformName.toLowerCase();
  if (p.includes('instagram')) return { primary: '#ec4899', stroke: '#f472b6', bg: 'rgba(236, 72, 153, 0.15)', name: 'Instagram' };
  if (p.includes('discord')) return { primary: '#6366f1', stroke: '#818cf8', bg: 'rgba(99, 102, 241, 0.15)', name: 'Discord' };
  if (p.includes('roblox')) return { primary: '#06b6d4', stroke: '#38bdf8', bg: 'rgba(6, 182, 212, 0.15)', name: 'Roblox' };
  if (p.includes('whatsapp')) return { primary: '#10b981', stroke: '#34d399', bg: 'rgba(16, 185, 129, 0.15)', name: 'WhatsApp' };
  return { primary: '#06b6d4', stroke: '#22d3ee', bg: 'rgba(6, 182, 212, 0.15)', name: 'Direct' };
}

// Fallback seed cases covering all 4 Cluster Types
const MOCK_SEED_CASES = [
  {
    case_id: 'c101-grooming',
    report_text: 'Someone named Alex asked me not to tell my parents about our chats and asked for private photos of me in my room.',
    platform: 'Instagram Direct',
    region: 'Mumbai Metro',
    school_name: 'St. Jude International Academy',
    language: 'en',
    age_bracket: 'UNDER_14',
    risk_score: 94,
    status: 'UNDER_REVIEW',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    case_id: 'c102-cyberbullying',
    report_text: 'Classmates created a Discord server sharing edited abusive photos and threatening to make everyone hate me at school.',
    platform: 'Discord Server',
    region: 'Pune Academic Zone',
    school_name: 'Delhi Public School, Pune',
    language: 'hi',
    age_bracket: '14_PLUS',
    risk_score: 82,
    status: 'UNDER_REVIEW',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    case_id: 'c103-sextortion',
    report_text: 'Anonymous account threatening to leak my private photos to all my friends unless I pay money or send more pictures.',
    platform: 'WhatsApp',
    region: 'Mumbai Metro',
    school_name: 'Ryan International School',
    language: 'mr',
    age_bracket: 'UNDER_14',
    risk_score: 96,
    status: 'UNDER_REVIEW',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    case_id: 'c104-phishing',
    report_text: 'Free reward link offered free Robux but asked for my login password and exact school location.',
    platform: 'Roblox Chat',
    region: 'Goa Coastal Zone',
    school_name: 'Sharada Mandir High School',
    language: 'en',
    age_bracket: 'UNDER_14',
    risk_score: 64,
    status: 'RESOLVED',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

// Helper to derive tactics from report_text
function extractTactics(text = '') {
  const lower = text.toLowerCase();
  const tactics = [];

  if (lower.includes('secret') || lower.includes('tell') || lower.includes('parent') || lower.includes('mat batana')) {
    tactics.push({ id: 'tactic-secrecy', label: 'Demand for Secrecy ("Don\'t tell parents")', code: 'HOW' });
  }
  if (lower.includes('photo') || lower.includes('picture') || lower.includes('room') || lower.includes('media')) {
    tactics.push({ id: 'tactic-media', label: 'Private Media / Photo Solicitation', code: 'HOW' });
  }
  if (lower.includes('password') || lower.includes('login') || lower.includes('link') || lower.includes('robux')) {
    tactics.push({ id: 'tactic-phish', label: 'Credential & Location Harvesting', code: 'HOW' });
  }
  if (lower.includes('threat') || lower.includes('reputation') || lower.includes('money') || lower.includes('blackmail') || lower.includes('extort') || lower.includes('pay') || lower.includes('leak')) {
    tactics.push({ id: 'tactic-extort', label: 'Reputational Extortion & Coercion', code: 'HOW' });
  }

  if (tactics.length === 0) {
    tactics.push({ id: 'tactic-generic', label: 'Unsolicited Contact Strategy', code: 'HOW' });
  }

  return tactics;
}

// Helper to categorize text into the exact 4 requested Cluster Types
function extractCluster(text = '', riskScore = 50) {
  const lower = text.toLowerCase();

  // 1. Blackmail & Sextortion
  if (lower.includes('blackmail') || lower.includes('extort') || lower.includes('leak') || lower.includes('pay') || lower.includes('money') || (lower.includes('threat') && lower.includes('photo'))) {
    return {
      id: CLUSTER_TYPES.sextortion.id,
      label: CLUSTER_TYPES.sextortion.label,
      description: CLUSTER_TYPES.sextortion.description,
      color: CLUSTER_TYPES.sextortion.color,
      stroke: CLUSTER_TYPES.sextortion.stroke
    };
  }

  // 2. Online Grooming
  if (lower.includes('secret') || lower.includes('tell') || lower.includes('parent') || lower.includes('room') || lower.includes('photo') || lower.includes('picture') || lower.includes('mat batana')) {
    return {
      id: CLUSTER_TYPES.grooming.id,
      label: CLUSTER_TYPES.grooming.label,
      description: CLUSTER_TYPES.grooming.description,
      color: CLUSTER_TYPES.grooming.color,
      stroke: CLUSTER_TYPES.grooming.stroke
    };
  }

  // 3. Cyberbullying & Harassment
  if (lower.includes('bull') || lower.includes('hate') || lower.includes('server') || lower.includes('group') || lower.includes('mock') || lower.includes('abusive') || lower.includes('edited') || lower.includes('troll')) {
    return {
      id: CLUSTER_TYPES.cyberbullying.id,
      label: CLUSTER_TYPES.cyberbullying.label,
      description: CLUSTER_TYPES.cyberbullying.description,
      color: CLUSTER_TYPES.cyberbullying.color,
      stroke: CLUSTER_TYPES.cyberbullying.stroke
    };
  }

  // 4. Phishing, Scams & Privacy Abuse
  if (lower.includes('password') || lower.includes('login') || lower.includes('link') || lower.includes('robux') || lower.includes('scam') || lower.includes('location') || lower.includes('gift')) {
    return {
      id: CLUSTER_TYPES.phishing.id,
      label: CLUSTER_TYPES.phishing.label,
      description: CLUSTER_TYPES.phishing.description,
      color: CLUSTER_TYPES.phishing.color,
      stroke: CLUSTER_TYPES.phishing.stroke
    };
  }

  // Default fallback based on risk score
  if (riskScore >= 75) {
    return {
      id: CLUSTER_TYPES.grooming.id,
      label: CLUSTER_TYPES.grooming.label,
      description: CLUSTER_TYPES.grooming.description,
      color: CLUSTER_TYPES.grooming.color,
      stroke: CLUSTER_TYPES.grooming.stroke
    };
  }

  return {
    id: CLUSTER_TYPES.phishing.id,
    label: CLUSTER_TYPES.phishing.label,
    description: CLUSTER_TYPES.phishing.description,
    color: CLUSTER_TYPES.phishing.color,
    stroke: CLUSTER_TYPES.phishing.stroke
  };
}

export default function SafetyGraph({ setActiveTab }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbSource, setDbSource] = useState('Supabase Live');
  const [selectedNode, setSelectedNode] = useState(null);

  // Add Case Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCaseText, setNewCaseText] = useState('');
  const [newCasePlatform, setNewCasePlatform] = useState('Instagram Direct');
  const [newCaseRegion, setNewCaseRegion] = useState('Mumbai Metro');
  const [newCaseSchool, setNewCaseSchool] = useState('');
  const [newCaseLanguage, setNewCaseLanguage] = useState('en');
  const [newCaseAge, setNewCaseAge] = useState('UNDER_14');
  const [newCaseRisk, setNewCaseRisk] = useState(88);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [clusterFilter, setClusterFilter] = useState('ALL');
  const [minRiskScore, setMinRiskScore] = useState(0);

  // Compute dynamic list of unique states / regions present in cases
  const availableStates = useMemo(() => {
    const set = new Set();
    cases.forEach(c => {
      if (c.region) set.add(c.region);
    });
    return Array.from(set);
  }, [cases]);

  // Load cases from Supabase
  const loadGraphData = async () => {
    setLoading(true);
    const dbCases = await StorageService.fetchSupabaseCases();
    if (dbCases && dbCases.length > 0) {
      setCases(dbCases);
      setDbSource('Supabase Live Database');
    } else {
      setCases(MOCK_SEED_CASES);
      setDbSource('Database Empty - Seed Demo Graph');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadGraphData();
  }, []);

  // Filtered cases
  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      if (platformFilter !== 'ALL' && c.platform !== platformFilter) return false;
      if (stateFilter !== 'ALL' && c.region !== stateFilter) return false;
      if ((c.risk_score || 0) < minRiskScore) return false;

      if (clusterFilter !== 'ALL') {
        const cl = extractCluster(c.report_text, c.risk_score);
        if (cl.label !== clusterFilter) return false;
      }

      return true;
    });
  }, [cases, platformFilter, stateFilter, clusterFilter, minRiskScore]);

  // Dynamically build 4-Tier Graph: Cluster (WHAT) → Cases (WHICH) → Tactics (HOW) → Platform (WHERE)
  const graph = useMemo(() => {
    const nodes = [];
    const links = [];

    if (filteredCases.length === 0) return { nodes, links };

    const clustersMap = new Map();
    const tacticsMap = new Map();
    const platformsMap = new Map();
    const caseNodes = [];

    // Process each case row from Supabase `cases` table
    filteredCases.forEach((c, index) => {
      const caseId = c.case_id || `case-${index}`;
      const shortCode = typeof caseId === 'string' && caseId.length > 8 ? caseId.slice(0, 8) : caseId;

      // Extract details
      const clusterObj = extractCluster(c.report_text, c.risk_score || 50);
      const caseTactics = extractTactics(c.report_text);
      const platformName = c.platform || 'Direct';
      const platColors = getPlatformColor(platformName);

      // 1. Collect Clusters (WHAT)
      if (!clustersMap.has(clusterObj.id)) {
        clustersMap.set(clusterObj.id, {
          ...clusterObj,
          linkedCases: []
        });
      }
      clustersMap.get(clusterObj.id).linkedCases.push(caseId);

      // 2. Collect Tactics (HOW)
      caseTactics.forEach(t => {
        if (!tacticsMap.has(t.id)) {
          tacticsMap.set(t.id, {
            ...t,
            linkedCases: []
          });
        }
        tacticsMap.get(t.id).linkedCases.push(caseId);
      });

      // 3. Collect Platforms (WHERE)
      if (!platformsMap.has(platformName)) {
        platformsMap.set(platformName, {
          id: `plat-${platformName.toLowerCase().replace(/\s+/g, '-')}`,
          label: platformName,
          platformName,
          colors: platColors,
          linkedCases: []
        });
      }
      platformsMap.get(platformName).linkedCases.push(caseId);

      // 4. Create Case Node (WHICH)
      const risk = c.risk_score || 50;
      const riskColor = getCaseRiskColor(risk);

      const caseNode = {
        id: `case-${caseId}`,
        tier: 2,
        tierName: 'Case (WHICH)',
        type: 'case',
        label: `Case #${shortCode}`,
        sub: `Risk ${risk}% | ${c.age_bracket || 'UNDER_14'}`,
        color: riskColor,
        stroke: riskColor,
        size: 24,
        rawCase: c,
        clusterId: clusterObj.id,
        tacticIds: caseTactics.map(t => t.id),
        platformId: `plat-${platformName.toLowerCase().replace(/\s+/g, '-')}`
      };
      caseNodes.push(caseNode);
    });

    // Layout Canvas Dimensions
    const canvasWidth = 960;
    const canvasHeight = 540;

    // Tier Coordinates (X columns)
    const TIER_X = {
      cluster: 110,   // Tier 1: Cluster (WHAT) - Left
      case: 350,      // Tier 2: Case (WHICH) - Center-Left
      tactic: 630,    // Tier 3: Tactics (HOW) - Center-Right
      platform: 870   // Tier 4: Platform (WHERE) - Right
    };

    // 1. Build Cluster Nodes (Tier 1)
    const clusterList = Array.from(clustersMap.values());
    clusterList.forEach((cl, i) => {
      const spacing = canvasHeight / (clusterList.length + 1);
      const node = {
        id: cl.id,
        tier: 1,
        tierName: 'Cluster (WHAT)',
        type: 'cluster',
        label: cl.label,
        sub: `${cl.linkedCases.length} linked report(s)`,
        color: cl.color,
        stroke: cl.stroke,
        size: 34,
        x: TIER_X.cluster,
        y: spacing * (i + 1),
        description: cl.description,
        caseCount: cl.linkedCases.length
      };
      nodes.push(node);
    });

    // 2. Build Case Nodes (Tier 2)
    caseNodes.forEach((cn, i) => {
      const spacing = canvasHeight / (caseNodes.length + 1);
      cn.x = TIER_X.case;
      cn.y = spacing * (i + 1);
      nodes.push(cn);

      // Link Cluster → Case
      links.push({
        from: cn.clusterId,
        to: cn.id,
        type: 'cluster-case',
        color: clustersMap.get(cn.clusterId)?.color || '#f43f5e'
      });

      // Link Case → Tactics
      cn.tacticIds.forEach(tId => {
        links.push({
          from: cn.id,
          to: tId,
          type: 'case-tactic',
          color: 'rgba(168, 85, 247, 0.45)'
        });
      });

      // Link Case → Platform
      links.push({
        from: cn.id,
        to: cn.platformId,
        type: 'case-platform',
        color: 'rgba(6, 182, 212, 0.45)'
      });
    });

    // 3. Build Similarity Links (Case ↔ Case) based on shared patterns
    for (let i = 0; i < caseNodes.length; i++) {
      for (let j = i + 1; j < caseNodes.length; j++) {
        const c1 = caseNodes[i];
        const c2 = caseNodes[j];

        const sharedCluster = c1.clusterId === c2.clusterId;
        const sharedPlatform = c1.platformId === c2.platformId;
        const sharedTactic = c1.tacticIds.some(t => c2.tacticIds.includes(t));

        if (sharedCluster || sharedPlatform || sharedTactic) {
          links.push({
            from: c1.id,
            to: c2.id,
            type: 'case-similarity',
            color: COLOR_SYSTEM.similarity.stroke,
            isSimilarity: true,
            reason: sharedCluster ? 'Same Cluster' : sharedTactic ? 'Shared Tactic' : 'Same Platform'
          });
        }
      }
    }

    // 4. Build Tactic Nodes (Tier 3)
    const tacticList = Array.from(tacticsMap.values());
    tacticList.forEach((tc, i) => {
      const spacing = canvasHeight / (tacticList.length + 1);
      const node = {
        id: tc.id,
        tier: 3,
        tierName: 'Tactic (HOW)',
        type: 'tactic',
        label: tc.label,
        sub: `Appears in ${tc.linkedCases.length} report(s)`,
        color: COLOR_SYSTEM.tier3_tactic.primary,
        stroke: COLOR_SYSTEM.tier3_tactic.stroke,
        size: 26,
        x: TIER_X.tactic,
        y: spacing * (i + 1),
        caseCount: tc.linkedCases.length
      };
      nodes.push(node);
    });

    // 5. Build Platform Nodes (Tier 4)
    const platformList = Array.from(platformsMap.values());
    platformList.forEach((pl, i) => {
      const spacing = canvasHeight / (platformList.length + 1);
      const node = {
        id: pl.id,
        tier: 4,
        tierName: 'Platform (WHERE)',
        type: 'platform',
        label: pl.label,
        sub: `Incident origin: ${pl.linkedCases.length} case(s)`,
        color: pl.colors.primary,
        stroke: pl.colors.stroke,
        size: 26,
        x: TIER_X.platform,
        y: spacing * (i + 1),
        caseCount: pl.linkedCases.length
      };
      nodes.push(node);
    });

    return { nodes, links };
  }, [filteredCases]);

  // Set initial selected node
  useEffect(() => {
    if (graph.nodes.length > 0 && !selectedNode) {
      setSelectedNode(graph.nodes[0]);
    }
  }, [graph]);

  // Connected nodes set for active highlights
  const highlightedIds = useMemo(() => {
    if (!selectedNode) return new Set();

    const ids = new Set([selectedNode.id]);
    graph.links.forEach(l => {
      if (l.from === selectedNode.id) ids.add(l.to);
      if (l.to === selectedNode.id) ids.add(l.from);
    });

    return ids;
  }, [selectedNode, graph]);

  // Handle adding new row to Supabase `cases` table
  const handleCreateCase = async (e) => {
    e.preventDefault();
    if (!newCaseText.trim()) return;

    setIsSubmitting(true);
    const newRecord = {
      report_text: newCaseText,
      platform: newCasePlatform,
      region: newCaseRegion,
      school_name: newCaseSchool,
      language: newCaseLanguage,
      age_bracket: newCaseAge,
      risk_score: parseInt(newCaseRisk, 10),
      status: 'UNDER_REVIEW'
    };

    const saved = await StorageService.createSupabaseCase(newRecord);
    if (saved) {
      setCases(prev => [saved, ...prev]);
    } else {
      const localCase = { case_id: `c-${Date.now()}`, ...newRecord, created_at: new Date().toISOString() };
      setCases(prev => [localCase, ...prev]);
    }

    setNewCaseText('');
    setIsSubmitting(false);
    setShowAddModal(false);
  };

  const seedSampleDataToSupabase = async () => {
    setLoading(true);
    for (const item of MOCK_SEED_CASES) {
      await StorageService.createSupabaseCase(item);
    }
    await loadGraphData();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Top Banner & Header */}
      <div className="glass-panel" style={{ padding: '22px 28px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc' }}>
              <Network color="#38bdf8" size={24} /> Safety Graph Threat Visualizer
            </h2>
            <span className="badge-purple" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Database size={12} /> Supabase `cases` Table
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Correlates safety reports into 4 defined clusters: <strong style={{ color: CLUSTER_TYPES.grooming.color }}>Online Grooming</strong>, <strong style={{ color: CLUSTER_TYPES.cyberbullying.color }}>Cyberbullying & Harassment</strong>, <strong style={{ color: CLUSTER_TYPES.sextortion.color }}>Blackmail & Sextortion</strong>, and <strong style={{ color: CLUSTER_TYPES.phishing.color }}>Phishing, Scams & Privacy Abuse</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span className="badge-cyan" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Radio size={12} className="animate-pulse" /> {dbSource}
          </span>

          <button 
            className="btn-secondary" 
            style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={loadGraphData}
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh DB
          </button>

          <button 
            className="btn-primary" 
            style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => setShowAddModal(true)}
          >
            <PlusCircle size={14} /> Add Case to DB
          </button>
        </div>
      </div>

      {/* 4 Defined Clusters Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        
        <div className="glass-panel" style={{ padding: '12px 14px', borderLeft: `4px solid ${CLUSTER_TYPES.grooming.color}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldAlert color={CLUSTER_TYPES.grooming.color} size={20} />
          <div>
            <div style={{ fontSize: '0.7rem', color: CLUSTER_TYPES.grooming.color, fontWeight: 700, textTransform: 'uppercase' }}>1. Cluster Type</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>Online Grooming</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '12px 14px', borderLeft: `4px solid ${CLUSTER_TYPES.cyberbullying.color}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <UserX color={CLUSTER_TYPES.cyberbullying.color} size={20} />
          <div>
            <div style={{ fontSize: '0.7rem', color: CLUSTER_TYPES.cyberbullying.color, fontWeight: 700, textTransform: 'uppercase' }}>2. Cluster Type</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>Cyberbullying & Harassment</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '12px 14px', borderLeft: `4px solid ${CLUSTER_TYPES.sextortion.color}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Lock color={CLUSTER_TYPES.sextortion.color} size={20} />
          <div>
            <div style={{ fontSize: '0.7rem', color: CLUSTER_TYPES.sextortion.color, fontWeight: 700, textTransform: 'uppercase' }}>3. Cluster Type</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>Blackmail & Sextortion</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '12px 14px', borderLeft: `4px solid ${CLUSTER_TYPES.phishing.color}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap color={CLUSTER_TYPES.phishing.color} size={20} />
          <div>
            <div style={{ fontSize: '0.7rem', color: CLUSTER_TYPES.phishing.color, fontWeight: 700, textTransform: 'uppercase' }}>4. Cluster Type</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>Phishing, Scams & Abuse</div>
          </div>
        </div>

      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '14px 22px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={14} color="#f43f5e" />
            <strong style={{ color: 'var(--text-muted)' }}>Cluster:</strong>
            <select 
              className="select-input" 
              value={clusterFilter} 
              onChange={e => setClusterFilter(e.target.value)}
              style={{ padding: '4px 10px', fontSize: '0.8rem' }}
            >
              <option value="ALL">All 4 Threat Clusters</option>
              <option value={CLUSTER_TYPES.grooming.label}>Online Grooming</option>
              <option value={CLUSTER_TYPES.cyberbullying.label}>Cyberbullying & Harassment</option>
              <option value={CLUSTER_TYPES.sextortion.label}>Blackmail & Sextortion</option>
              <option value={CLUSTER_TYPES.phishing.label}>Phishing, Scams & Privacy Abuse</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="#38bdf8" />
            <strong style={{ color: 'var(--text-muted)' }}>Platform:</strong>
            <select 
              className="select-input" 
              value={platformFilter} 
              onChange={e => setPlatformFilter(e.target.value)}
              style={{ padding: '4px 10px', fontSize: '0.8rem' }}
            >
              <option value="ALL">All Platforms</option>
              <option value="Instagram Direct">Instagram Direct</option>
              <option value="Discord Server">Discord Server</option>
              <option value="Roblox Chat">Roblox Chat</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Direct">Direct</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Compass size={14} color="#f59e0b" />
            <strong style={{ color: 'var(--text-muted)' }}>State / Region:</strong>
            <select 
              className="select-input" 
              value={stateFilter} 
              onChange={e => setStateFilter(e.target.value)}
              style={{ padding: '4px 10px', fontSize: '0.8rem' }}
            >
              <option value="ALL">All States / Regions</option>
              {availableStates.map((st, idx) => (
                <option key={idx} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <strong style={{ color: 'var(--text-muted)' }}>Min Risk:</strong>
            <input 
              type="range" 
              min="0" 
              max="90" 
              step="10" 
              value={minRiskScore} 
              onChange={e => setMinRiskScore(parseInt(e.target.value, 10))} 
              style={{ accentColor: '#ef4444', cursor: 'pointer' }}
            />
            <span style={{ color: '#ef4444', fontWeight: 700 }}>{minRiskScore}%+</span>
          </div>

        </div>

        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          Active Nodes: <strong style={{ color: '#38bdf8' }}>{graph.nodes.length}</strong> | Links: <strong style={{ color: '#c084fc' }}>{graph.links.length}</strong>
        </div>
      </div>

      {/* Main Interactive Graph & Node Inspector Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        
        {/* SVG Interactive Canvas */}
        <div className="graph-viewport" style={{ position: 'relative', minHeight: '540px', background: '#030712', borderRadius: '14px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
          
          {loading ? (
            <div style={{ height: '540px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--text-muted)' }}>
              <RefreshCw className="animate-spin" size={32} color="#38bdf8" />
              <span>Building dynamic 4-tier threat graph from Supabase `cases`...</span>
            </div>
          ) : graph.nodes.length === 0 ? (
            <div style={{ height: '540px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', color: 'var(--text-muted)' }}>
              <ShieldAlert size={40} color="#f59e0b" />
              <p>No rows in `cases` match the active filters.</p>
              <button className="btn-secondary" onClick={seedSampleDataToSupabase} style={{ fontSize: '0.8rem' }}>
                🌱 Seed Sample Data into Supabase DB
              </button>
            </div>
          ) : (
            <svg style={{ width: '100%', height: '540px', display: 'block' }}>
              
              {/* Background Column Guidelines */}
              <line x1={110} y1={20} x2={110} y2={520} stroke="rgba(255,255,255,0.03)" strokeWidth={1} strokeDasharray="4 4" />
              <line x1={350} y1={20} x2={350} y2={520} stroke="rgba(255,255,255,0.03)" strokeWidth={1} strokeDasharray="4 4" />
              <line x1={630} y1={20} x2={630} y2={520} stroke="rgba(255,255,255,0.03)" strokeWidth={1} strokeDasharray="4 4" />
              <line x1={870} y1={20} x2={870} y2={520} stroke="rgba(255,255,255,0.03)" strokeWidth={1} strokeDasharray="4 4" />

              {/* Draw Edges / Links */}
              {graph.links.map((link, idx) => {
                const src = graph.nodes.find(n => n.id === link.from);
                const tgt = graph.nodes.find(n => n.id === link.to);
                if (!src || !tgt) return null;

                const isHighlight = selectedNode && (selectedNode.id === src.id || selectedNode.id === tgt.id);
                const opacity = selectedNode ? (isHighlight ? 1 : 0.15) : 0.45;

                // Bezier Curve Path for smooth tier transitions
                const deltaX = tgt.x - src.x;
                const pathD = link.isSimilarity
                  ? `M ${src.x} ${src.y} Q ${(src.x + tgt.x)/2} ${(src.y + tgt.y)/2 - 40} ${tgt.x} ${tgt.y}`
                  : `M ${src.x} ${src.y} C ${src.x + deltaX * 0.5} ${src.y}, ${tgt.x - deltaX * 0.5} ${tgt.y}, ${tgt.x} ${tgt.y}`;

                return (
                  <path
                    key={idx}
                    d={pathD}
                    fill="none"
                    stroke={link.isSimilarity ? COLOR_SYSTEM.similarity.stroke : isHighlight ? '#38bdf8' : (link.color || '#64748b')}
                    strokeWidth={isHighlight ? (link.isSimilarity ? 2.5 : 2) : 1}
                    strokeDasharray={link.isSimilarity ? '4 4' : 'none'}
                    opacity={opacity}
                  />
                );
              })}

              {/* Draw Nodes */}
              {graph.nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isHighlighted = highlightedIds.has(node.id);
                const opacity = selectedNode ? (isHighlighted ? 1 : 0.25) : 1;

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{ cursor: 'pointer', transition: 'opacity 0.2s ease' }}
                    opacity={opacity}
                  >
                    {/* Glowing outer ring for selection */}
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.size + 8}
                        fill="none"
                        stroke={node.stroke || node.color}
                        strokeWidth={2.5}
                        className="animate-pulse-glow"
                      />
                    )}

                    {/* Main Node Circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.size}
                      fill={node.color}
                      fillOpacity={0.9}
                      stroke={node.stroke || '#ffffff'}
                      strokeWidth={isSelected ? 3 : 1.5}
                    />

                    {/* Node Inner Label / Icon */}
                    <text
                      x={node.x}
                      y={node.y + 4}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={node.type === 'cluster' ? 10 : 10}
                      fontWeight={700}
                    >
                      {node.type === 'cluster' ? 'WHAT' : node.type === 'case' ? `${node.rawCase.risk_score}%` : node.type === 'tactic' ? 'HOW' : 'WHERE'}
                    </text>

                    {/* Node Label Text */}
                    <text
                      x={node.x}
                      y={node.y + node.size + 14}
                      textAnchor="middle"
                      fill={isSelected ? '#38bdf8' : '#cbd5e1'}
                      fontSize={10}
                      fontWeight={isSelected ? 700 : 500}
                    >
                      {node.label.length > 28 ? node.label.slice(0, 26) + '...' : node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}

          {/* Detailed Color Code Legend Bar for 4 Cluster Types */}
          <div style={{ 
            position: 'absolute', 
            bottom: '10px', 
            left: '10px', 
            right: '10px',
            background: 'rgba(7, 11, 22, 0.94)', 
            backdropFilter: 'blur(8px)',
            padding: '10px 14px', 
            borderRadius: '10px', 
            border: '1px solid var(--border-subtle)', 
            display: 'flex', 
            flexWrap: 'wrap',
            justify: 'space-between',
            alignItems: 'center',
            gap: '12px', 
            fontSize: '0.72rem' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>4 Threat Clusters:</span>
              
              <span style={{ color: CLUSTER_TYPES.grooming.color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                ● Online Grooming
              </span>

              <span style={{ color: CLUSTER_TYPES.cyberbullying.color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                ● Cyberbullying & Harassment
              </span>

              <span style={{ color: CLUSTER_TYPES.sextortion.color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                ● Blackmail & Sextortion
              </span>

              <span style={{ color: CLUSTER_TYPES.phishing.color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                ● Phishing, Scams & Abuse
              </span>
            </div>

            <div style={{ color: '#38bdf8', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>╍╍ Shared Pattern Link</span>
            </div>
          </div>

        </div>

        {/* Selected Node Details Drawer */}
        <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {selectedNode ? (
            <>
              <div>
                <span style={{ 
                  display: 'inline-block',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  background: selectedNode.type === 'cluster' ? 'rgba(244, 63, 94, 0.18)' :
                              selectedNode.type === 'tactic' ? 'rgba(168, 85, 247, 0.18)' :
                              selectedNode.type === 'platform' ? 'rgba(6, 182, 212, 0.18)' : 'rgba(2, 132, 199, 0.15)',
                  color: selectedNode.type === 'cluster' ? '#be123c' :
                         selectedNode.type === 'tactic' ? '#7e22ce' :
                         selectedNode.type === 'platform' ? '#0e7490' : '#0369a1',
                  border: `1.5px solid ${selectedNode.color}`
                }}>
                  TIER {selectedNode.tier}: {selectedNode.tierName}
                </span>
                
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginTop: '8px', lineHeight: 1.3 }}>
                  {selectedNode.label}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {selectedNode.sub}
                </p>
              </div>

              {selectedNode.type === 'case' ? (
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1.5px solid rgba(14, 116, 189, 0.18)', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
                  
                  {/* Risk Badge */}
                  {(() => {
                    const badge = getCaseRiskBadge(selectedNode.rawCase.risk_score || 50);
                    return (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: badge.bg, border: `1.5px solid ${badge.border}`, padding: '6px 10px', borderRadius: '6px' }}>
                        <span style={{ color: badge.text, fontWeight: 700, fontSize: '0.75rem' }}>{badge.label}</span>
                        <span style={{ color: badge.color, fontWeight: 800, fontSize: '1rem' }}>{selectedNode.rawCase.risk_score}%</span>
                      </div>
                    );
                  })()}

                  <div>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Original Report Text:</span>
                    <p style={{ color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.4, fontStyle: 'italic', background: '#f0f9ff', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(14, 116, 189, 0.15)' }}>
                      "{selectedNode.rawCase.report_text}"
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Platform: </span>
                      <strong style={{ color: '#0284c7' }}>{selectedNode.rawCase.platform || 'N/A'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Region: </span>
                      <strong style={{ color: '#d97706' }}>{selectedNode.rawCase.region || 'N/A'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>School: </span>
                      <strong style={{ color: '#db2777' }}>{selectedNode.rawCase.school_name || 'N/A'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Language: </span>
                      <strong style={{ color: 'var(--text-primary)' }}>{selectedNode.rawCase.language || 'en'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Age Bracket: </span>
                      <strong style={{ color: 'var(--text-primary)' }}>{selectedNode.rawCase.age_bracket || 'UNDER_14'}</strong>
                    </div>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Submitted: </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {new Date(selectedNode.rawCase.created_at).toLocaleString()}
                    </span>
                  </div>

                </div>
              ) : (
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1.5px solid rgba(14, 116, 189, 0.18)', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Correlated Reports: </span>
                    <strong style={{ color: selectedNode.color, display: 'block', marginTop: '2px' }}>
                      {selectedNode.caseCount || 0} linked case(s) in `cases` table
                    </strong>
                  </div>

                  {selectedNode.description && (
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Pattern Insights: </span>
                      <p style={{ color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                        {selectedNode.description}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <button
                className="btn-secondary"
                style={{ width: '100%', marginTop: 'auto', fontSize: '0.8rem' }}
                onClick={() => setActiveTab && setActiveTab('responder')}
              >
                🔍 View Cases in Responder Triage
              </button>
            </>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', marginTop: '40px' }}>
              Click any node on the graph to inspect details.
            </div>
          )}
        </div>

      </div>

      {/* Add New Case Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '28px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PlusCircle color="#38bdf8" size={20} /> Insert Case into Supabase `cases` Table
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCase} style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '4px' }}>Report Text:</label>
                <textarea 
                  className="input-field" 
                  rows={3} 
                  required
                  placeholder="Describe the incident report..."
                  value={newCaseText} 
                  onChange={e => setNewCaseText(e.target.value)} 
                  style={{ width: '100%', padding: '10px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '4px' }}>Platform:</label>
                  <select className="select-input" value={newCasePlatform} onChange={e => setNewCasePlatform(e.target.value)} style={{ width: '100%' }}>
                    <option value="Instagram Direct">Instagram Direct</option>
                    <option value="Discord Server">Discord Server</option>
                    <option value="Roblox Chat">Roblox Chat</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Direct">Direct</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '4px' }}>Region / State:</label>
                  <select className="select-input" value={newCaseRegion} onChange={e => setNewCaseRegion(e.target.value)} style={{ width: '100%' }}>
                    <option value="Mumbai Metro">Mumbai Metro</option>
                    <option value="Pune Academic Zone">Pune Academic Zone</option>
                    <option value="Goa Coastal Zone">Goa Coastal Zone</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '4px' }}>School Name:</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Enter school name..."
                    value={newCaseSchool} 
                    onChange={e => setNewCaseSchool(e.target.value)} 
                    style={{ width: '100%', padding: '10px', marginBottom: '12px' }} 
                  />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '4px' }}>Language:</label>
                  <input type="text" className="input-field" value={newCaseLanguage} onChange={e => setNewCaseLanguage(e.target.value)} style={{ width: '100%' }} />
                </div>

                <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '4px' }}>Age Bracket:</label>
                  <select className="select-input" value={newCaseAge} onChange={e => setNewCaseAge(e.target.value)} style={{ width: '100%' }}>
                    <option value="UNDER_14">UNDER_14</option>
                    <option value="14_PLUS">14_PLUS</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '4px' }}>Risk Score ({newCaseRisk}%):</label>
                  <input type="range" min="10" max="100" value={newCaseRisk} onChange={e => setNewCaseRisk(e.target.value)} style={{ width: '100%', accentColor: '#ef4444' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ flex: 1 }}>
                  {isSubmitting ? 'Saving...' : 'Submit to Supabase'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
