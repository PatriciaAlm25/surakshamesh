import React, { useState } from 'react';
import { 
  Network, 
  Layers, 
  ShieldAlert, 
  Info, 
  Sparkles, 
  Maximize2, 
  Eye, 
  Filter,
  CheckCircle2
} from 'lucide-react';

const GRAPH_NODES = [
  // Clusters
  { id: 'cluster-1', type: 'cluster', label: 'Cluster Alpha: Secrecy & Media Grooming Ring', x: 420, y: 180, color: '#ef4444', size: 38, count: 4 },
  { id: 'cluster-2', type: 'cluster', label: 'Cluster Beta: Academic Doxxing & Extortion', x: 200, y: 340, color: '#f59e0b', size: 32, count: 3 },
  { id: 'cluster-3', type: 'cluster', label: 'Cluster Gamma: Game Currency Phishing Lure', x: 650, y: 320, color: '#38bdf8', size: 30, count: 2 },
  
  // Cases
  { id: 'case-84291', type: 'case', label: 'Case SM-2026-84291', x: 320, y: 80, color: '#ef4444', size: 24 },
  { id: 'case-39102', type: 'case', label: 'Case SM-2026-39102', x: 120, y: 240, color: '#f59e0b', size: 22 },
  { id: 'case-51204', type: 'case', label: 'Case SM-2026-51204', x: 740, y: 220, color: '#38bdf8', size: 20 },
  { id: 'case-99104', type: 'case', label: 'Case SM-2026-99104', x: 500, y: 80, color: '#ef4444', size: 22 },

  // Tactics
  { id: 'tactic-secrecy', type: 'tactic', label: 'Tactic: "Don\'t tell parents"', x: 310, y: 270, color: '#c084fc', size: 18 },
  { id: 'tactic-media', type: 'tactic', label: 'Tactic: Private Photo Solicitation', x: 480, y: 290, color: '#c084fc', size: 18 },
  { id: 'tactic-phish', type: 'tactic', label: 'Tactic: Fake Diamond URLs', x: 670, y: 430, color: '#c084fc', size: 18 },

  // Platforms
  { id: 'plat-ig', type: 'platform', label: 'Platform: Instagram DM', x: 230, y: 130, color: '#60a5fa', size: 16 },
  { id: 'plat-roblox', type: 'platform', label: 'Platform: Roblox Chat', x: 730, y: 380, color: '#60a5fa', size: 16 }
];

const GRAPH_LINKS = [
  { from: 'case-84291', to: 'cluster-1' },
  { from: 'case-99104', to: 'cluster-1' },
  { from: 'cluster-1', to: 'tactic-secrecy' },
  { from: 'cluster-1', to: 'tactic-media' },
  { from: 'case-84291', to: 'plat-ig' },
  
  { from: 'case-39102', to: 'cluster-2' },
  { from: 'cluster-2', to: 'tactic-secrecy' },
  
  { from: 'case-51204', to: 'cluster-3' },
  { from: 'cluster-3', to: 'tactic-phish' },
  { from: 'cluster-3', to: 'plat-roblox' }
];

export default function SafetyGraph({ setActiveTab }) {
  const [selectedNode, setSelectedNode] = useState(GRAPH_NODES[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '22px 28px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '1.4rem' }}>🕸️ Safety Graph Threat Pattern Visualizer</h2>
            <span className="badge-purple">Graph AI Intelligence</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Correlates anonymous tactical signatures across multiple reports to detect repeat predatory networks without disclosing child PII.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge-safe">🛡️ Zero Identity Exposure</span>
          <span className="badge-cyan">Tactical Pattern Clustering</span>
        </div>
      </div>

      {/* Main Graph Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        
        {/* SVG Interactive Canvas */}
        <div className="graph-viewport" style={{ position: 'relative' }}>
          
          <svg style={{ width: '100%', height: '100%' }}>
            {/* Draw Links */}
            {GRAPH_LINKS.map((link, idx) => {
              const src = GRAPH_NODES.find(n => n.id === link.from);
              const tgt = GRAPH_NODES.find(n => n.id === link.to);
              if (!src || !tgt) return null;

              return (
                <line
                  key={idx}
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke="rgba(56, 189, 248, 0.25)"
                  strokeWidth={2}
                  strokeDasharray={src.type === 'cluster' ? '4 4' : 'none'}
                />
              );
            })}

            {/* Draw Nodes */}
            {GRAPH_NODES.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Outer Pulsing Ring for Selected */}
                  {isSelected && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.size + 8}
                      fill="none"
                      stroke={node.color}
                      strokeWidth={2}
                      className="animate-pulse-glow"
                    />
                  )}

                  {/* Main Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size}
                    fill={node.color}
                    fillOpacity={0.85}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 3 : 1}
                  />

                  {/* Icon or Count inside */}
                  {node.count && (
                    <text
                      x={node.x}
                      y={node.y + 4}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={12}
                      fontWeight={700}
                    >
                      {node.count}
                    </text>
                  )}

                  {/* Label Text */}
                  <text
                    x={node.x}
                    y={node.y + node.size + 14}
                    textAnchor="middle"
                    fill={isSelected ? '#38bdf8' : '#cbd5e1'}
                    fontSize={10}
                    fontWeight={isSelected ? 700 : 500}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Canvas Overlay Legend */}
          <div style={{ position: 'absolute', bottom: '14px', left: '16px', background: 'rgba(7, 11, 20, 0.85)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', gap: '12px', fontSize: '0.72rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444' }}>
              ● Threat Cluster
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8' }}>
              ● Anonymous Case
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#c084fc' }}>
              ● Modus Operandi Tactic
            </span>
          </div>
        </div>

        {/* Selected Node Details Drawer */}
        <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span className="badge-cyan" style={{ fontSize: '0.7rem' }}>
              Node Type: {selectedNode.type?.toUpperCase()}
            </span>
            <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginTop: '6px' }}>
              {selectedNode.label}
            </h3>
          </div>

          <div style={{ background: '#090e1a', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Graph Significance: </span>
              <strong style={{ color: '#38bdf8' }}>
                {selectedNode.type === 'cluster' ? 'Cross-Platform Grooming Ring' : 'Individual Encrypted Signal'}
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)' }}>Correlated Incidents: </span>
              <span>{selectedNode.count ? `${selectedNode.count} linked anonymous reports` : '1 active node'}</span>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)' }}>Investigative Advisory: </span>
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                {selectedNode.type === 'cluster' 
                  ? 'High probability of repeat predator targeting regional youth gaming servers. Recommend issuing safety alerts to affiliated school clusters.'
                  : 'Encrypted case token linked via shared linguistic and behavioral evasion markers.'}
              </p>
            </div>
          </div>

          <button
            className="btn-secondary"
            style={{ width: '100%', marginTop: 'auto', fontSize: '0.8rem' }}
            onClick={() => setActiveTab('responder')}
          >
            🔍 View Cases in Responder Triage
          </button>
        </div>

      </div>
    </div>
  );
}
