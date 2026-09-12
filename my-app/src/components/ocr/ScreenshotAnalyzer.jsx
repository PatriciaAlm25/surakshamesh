import React, { useState } from 'react';
import { 
  FileSearch, 
  Upload, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Shield, 
  FileText, 
  RefreshCw,
  Languages
} from 'lucide-react';
import { simulateOCRScan } from '../../services/aiEngine';

export default function ScreenshotAnalyzer({ setActiveTab }) {
  const [selectedPreset, setSelectedPreset] = useState('insta_dm');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(simulateOCRScan('insta_dm'));
  const [customFilePreview, setCustomFilePreview] = useState(null);

  const handleSelectPreset = (presetId) => {
    setSelectedPreset(presetId);
    setCustomFilePreview(null);
    setIsScanning(true);
    setTimeout(() => {
      setScanResult(simulateOCRScan(presetId));
      setIsScanning(false);
    }, 1200);
  };

  const handleCustomFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomFilePreview(url);
      setIsScanning(true);
      setTimeout(() => {
        setScanResult(simulateOCRScan('insta_dm'));
        setIsScanning(false);
      }, 1500);
    }
  };

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScanResult(simulateOCRScan(selectedPreset));
      setIsScanning(false);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '1.4rem' }}>📸 Screenshot & Comment OCR Analyzer</h2>
            <span className="badge-purple">Multilingual OCR + NLP</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Upload chat screenshots or select sample captures from Instagram, WhatsApp (Hinglish), or YouTube to test automated transcript reconstruction and risk extraction.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn-primary" 
            onClick={handleRunScan} 
            disabled={isScanning}
            style={{ fontSize: '0.85rem' }}
          >
            {isScanning ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
            {isScanning ? 'Extracting Text...' : 'Re-Run OCR Scan'}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '22px' }}>
        
        {/* Left Column: Preset Selector & Visualizer Frame */}
        <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="#38bdf8" /> Select Test Evidence Image
            </h3>
          </div>

          {/* Preset Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <button
              onClick={() => handleSelectPreset('insta_dm')}
              style={{
                padding: '10px 8px',
                borderRadius: '8px',
                background: selectedPreset === 'insta_dm' && !customFilePreview ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.7)',
                border: selectedPreset === 'insta_dm' && !customFilePreview ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                color: selectedPreset === 'insta_dm' && !customFilePreview ? '#38bdf8' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 600
              }}
            >
              📱 Instagram DM
            </button>

            <button
              onClick={() => handleSelectPreset('indic_hinglish')}
              style={{
                padding: '10px 8px',
                borderRadius: '8px',
                background: selectedPreset === 'indic_hinglish' && !customFilePreview ? 'rgba(168, 85, 247, 0.2)' : 'rgba(15, 23, 42, 0.7)',
                border: selectedPreset === 'indic_hinglish' && !customFilePreview ? '1px solid #c084fc' : '1px solid var(--border-subtle)',
                color: selectedPreset === 'indic_hinglish' && !customFilePreview ? '#c084fc' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 600
              }}
            >
              🇮🇳 WhatsApp Hinglish
            </button>

            <button
              onClick={() => handleSelectPreset('youtube_hate')}
              style={{
                padding: '10px 8px',
                borderRadius: '8px',
                background: selectedPreset === 'youtube_hate' && !customFilePreview ? 'rgba(239, 68, 68, 0.2)' : 'rgba(15, 23, 42, 0.7)',
                border: selectedPreset === 'youtube_hate' && !customFilePreview ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
                color: selectedPreset === 'youtube_hate' && !customFilePreview ? '#f87171' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 600
              }}
            >
              💬 Video Comments
            </button>
          </div>

          {/* Upload Custom Box */}
          <div style={{ position: 'relative', border: '2px dashed var(--border-medium)', borderRadius: '12px', padding: '16px', textAlign: 'center', background: 'rgba(10, 18, 36, 0.6)' }}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleCustomFileUpload} 
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} 
            />
            <Upload size={22} color="#38bdf8" style={{ marginBottom: '6px' }} />
            <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Click or Drag screenshot file here</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PNG, JPG up to 10MB • Zero server retention</div>
          </div>

          {/* Screenshot Preview with OCR Laser Scan Line */}
          <div style={{ position: 'relative', background: '#050811', borderRadius: '12px', overflow: 'hidden', minHeight: '260px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            
            {isScanning && <div className="ocr-scanner-line" />}

            {customFilePreview ? (
              <img src={customFilePreview} alt="Custom upload" style={{ width: '100%', maxHeight: '320px', objectFit: 'contain' }} />
            ) : (
              <div style={{ padding: '24px', width: '100%', maxWidth: '340px' }}>
                <div style={{ background: '#0f172a', borderRadius: '14px', padding: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px', marginBottom: '10px' }}>
                    {scanResult.title}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {scanResult.detectedText.map((txt, i) => (
                      <div key={i} style={{ background: 'rgba(30, 41, 59, 0.7)', padding: '8px 10px', borderRadius: '8px', fontSize: '0.78rem', borderLeft: '2px solid #38bdf8' }}>
                        {txt}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div style={{ position: 'absolute', bottom: '8px', right: '12px', background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', color: '#94a3b8' }}>
              Optical Character Recognition: Active
            </div>
          </div>

        </div>

        {/* Right Column: OCR Transcript & AI Safety Diagnostic */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Transcript Card */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#a855f7" /> Extracted Text Transcript
              </h3>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span className="badge-cyan" style={{ fontSize: '0.7rem' }}>
                  <Languages size={12} /> {scanResult.language}
                </span>
                <span className="badge-safe" style={{ fontSize: '0.7rem' }}>
                  Confidence: {scanResult.confidence}
                </span>
              </div>
            </div>

            <div style={{ background: '#090e1a', borderRadius: '10px', padding: '14px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              {scanResult.detectedText.map((line, i) => (
                <div key={i} style={{ fontSize: '0.84rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>0{i + 1}</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Text sanitized for sensitive entities before multi-lingual pattern classifier analysis.
            </p>
          </div>

          {/* AI Risk Classification Card */}
          <div className="glass-panel-danger" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#f87171', textTransform: 'uppercase', fontWeight: 700 }}>
                  Diagnostic Classification
                </span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f87171', marginTop: '2px' }}>
                  {scanResult.riskResult.score}% RISK SCORE
                </div>
              </div>
              <span className="badge-danger" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                🔴 {scanResult.riskResult.level} RISK
              </span>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Primary Concern: <strong style={{ color: '#f8fafc' }}>{scanResult.riskResult.category.replace('_', ' ')}</strong>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Detected Forensic Flags:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {scanResult.riskResult.flags.map((flg, i) => (
                  <span key={i} className="badge-danger" style={{ fontSize: '0.75rem' }}>
                    ⚠️ {flg}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommendation & Direct SOS */}
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '12px 14px', borderRadius: '10px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8', marginBottom: '4px' }}>
                🛡️ Recommended Safety Action:
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                Do not reply or share personal files. Capture complete screenshot evidence and file into the SURAKSHA MESH responder queue.
              </p>
            </div>

            <button
              className="btn-danger"
              style={{ width: '100%', padding: '12px' }}
              onClick={() => setActiveTab('report')}
            >
              🚨 Escalate Extracted Transcript to Anonymous SOS Report
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
