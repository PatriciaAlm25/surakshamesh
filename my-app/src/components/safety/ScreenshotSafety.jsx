import React, { useState, useRef, useEffect } from 'react';
import { Upload, AlertTriangle, ShieldCheck, FileSearch, CheckCircle2, RotateCcw, Image as ImageIcon } from 'lucide-react';
import Tesseract from 'tesseract.js';
import { API_BASE_URL } from '../../services/apiConfig';

export default function ScreenshotSafety() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [extractionStatus, setExtractionStatus] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [language, setLanguage] = useState('eng'); // Default to English
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }
    
    setImage(file);
    setImageUrl(URL.createObjectURL(file));
    setExtractedText('');
    setAnalysisResult(null);
    setError(null);
    setExtractionProgress(0);
    setExtractionStatus('');
  };

  const extractText = async () => {
    if (!image) return;
    
    setIsExtracting(true);
    setError(null);
    setExtractionStatus('Initializing OCR engine...');
    setExtractionProgress(10);
    
    try {
      const result = await Tesseract.recognize(
        image,
        language,
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setExtractionStatus('Reading screenshot...');
              setExtractionProgress(Math.floor(m.progress * 100));
            } else {
              setExtractionStatus(m.status);
            }
          }
        }
      );
      
      if (!result.data.text.trim()) {
        setError("Couldn't read enough text from this image. Try uploading a clearer screenshot.");
        setExtractedText('');
      } else {
        setExtractedText(result.data.text);
      }
    } catch (err) {
      setError("OCR extraction failed: " + err.message);
    } finally {
      setIsExtracting(false);
      setExtractionStatus('');
    }
  };
  
  const handleAnalyze = async () => {
    if (!extractedText.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    // Split text by newlines and filter empty lines
    const messages = extractedText.split('\n').filter(line => line.trim().length > 0);
    
    if (messages.length === 0) {
      setError("No text available to analyze.");
      setIsAnalyzing(false);
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze-conversation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze screenshot');
      }
      
      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      setError("Analysis failed: " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl('');
    setExtractedText('');
    setAnalysisResult(null);
    setError(null);
    setExtractionProgress(0);
    setExtractionStatus('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getRiskColor = (severity) => {
    if (severity === 'CRITICAL' || severity === 'HIGH') return '#ef4444';
    if (severity === 'MEDIUM') return '#fbbf24';
    return '#34d399';
  };
  
  const getActionPlan = (category) => {
    if (category === 'cyberbullying') {
      return (
        <ol style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-secondary)' }}>
          <li style={{ marginBottom: '8px' }}>Don't fight back or continue the argument.</li>
          <li style={{ marginBottom: '8px' }}>Save the messages/screenshots.</li>
          <li style={{ marginBottom: '8px' }}>Block or report the person if needed.</li>
          <li style={{ marginBottom: '8px' }}>Tell a parent, teacher, counselor, or another trusted adult.</li>
          <li>If you feel unsafe, ask an adult for help immediately.</li>
        </ol>
      );
    } else if (category === 'grooming') {
      return (
        <ol style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-secondary)' }}>
          <li style={{ marginBottom: '8px' }}>Stop replying.</li>
          <li style={{ marginBottom: '8px' }}>Don't send photos or personal information.</li>
          <li style={{ marginBottom: '8px' }}>Don't meet the person.</li>
          <li style={{ marginBottom: '8px' }}>Block/report them.</li>
          <li>Tell a trusted adult.</li>
        </ol>
      );
    } else if (category === 'scam') {
      return (
        <ol style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-secondary)' }}>
          <li style={{ marginBottom: '8px' }}>Don't click suspicious links.</li>
          <li style={{ marginBottom: '8px' }}>Don't share passwords or OTPs.</li>
          <li style={{ marginBottom: '8px' }}>Don't send money.</li>
          <li>Tell a trusted adult.</li>
        </ol>
      );
    }
    return (
      <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-secondary)' }}>
        <li>Keep protecting your private information online.</li>
        <li>Tell a trusted adult if anything ever makes you uncomfortable.</li>
      </ul>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      
      {/* Upload Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileSearch color="#38bdf8" /> Screenshot Safety Lab
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
          Upload a screenshot of a conversation, comment thread, DM, or post to investigate for safety risks.
        </p>
        
        <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.85rem', color: '#38bdf8' }}>
          <strong>Privacy Notice:</strong> Your screenshot is processed on your device to extract text and only the text is sent to our AI for safety analysis. Avoid uploading passwords or payment details.
        </div>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {/* Left Column: Upload */}
          <div style={{ flex: '1 1 min(100%, 280px)', minWidth: 0 }}>
            <div 
              style={{ 
                border: '2px dashed var(--border-subtle)', 
                borderRadius: '12px', 
                padding: '30px 16px', 
                textAlign: 'center',
                background: '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '180px'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {imageUrl ? (
                <div style={{ position: 'relative', width: '100%', maxHeight: '280px', overflow: 'hidden', borderRadius: '8px' }}>
                  <img src={imageUrl} alt="Uploaded screenshot" style={{ width: '100%', objectFit: 'contain', maxHeight: '280px' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0}>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>Click to change image</span>
                  </div>
                </div>
              ) : (
                <>
                  <ImageIcon size={42} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
                  <h4 style={{ color: '#0f172a', marginBottom: '6px' }}>Upload Screenshot</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Supported: Chat • Comments • DMs • Social Posts</p>
                </>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/png, image/jpeg, image/webp" 
              style={{ display: 'none' }} 
            />
            
            {image && !extractedText && !isExtracting && (
              <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{ flex: '1 1 120px', padding: '10px', borderRadius: '8px', border: '1.5px solid var(--border-medium)', background: '#ffffff', color: '#0f172a', outline: 'none' }}
                >
                  <option value="eng">English</option>
                  <option value="hin">Hindi</option>
                  <option value="kan">Kannada</option>
                  <option value="mar">Marathi</option>
                  <option value="tam">Tamil</option>
                  <option value="tel">Telugu</option>
                  <option value="mal">Malayalam</option>
                  <option value="ben">Bengali</option>
                  <option value="eng+hin">English + Hindi</option>
                  <option value="eng+kan">English + Kannada</option>
                </select>
                <button onClick={extractText} className="btn-primary" style={{ flex: '1 1 120px', padding: '10px', borderRadius: '8px' }}>
                  Extract Text
                </button>
              </div>
            )}
            
            {isExtracting && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <span>{extractionStatus}</span>
                  <span>{extractionProgress}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${extractionProgress}%`, height: '100%', background: '#0ea5e9', transition: 'width 0.2s' }}></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column: Extracted Text */}
          <div style={{ flex: '1 1 min(100%, 280px)', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '10px', color: '#0f172a', fontWeight: 700 }}>
              📝 Extracted Conversation
            </h3>
            
            {extractedText || isExtracting ? (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
                <textarea 
                  value={extractedText} 
                  onChange={(e) => setExtractedText(e.target.value)}
                  placeholder="Extracted text will appear here..."
                  disabled={isExtracting}
                  style={{ 
                    flex: 1, 
                    minHeight: '180px', 
                    padding: '14px', 
                    borderRadius: '8px', 
                    border: '1.5px solid var(--border-medium)', 
                    background: '#ffffff', 
                    color: '#0f172a',
                    resize: 'vertical',
                    fontFamily: 'monospace',
                    fontSize: '0.88rem',
                    lineHeight: '1.5'
                  }}
                />
                
                {extractedText && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <AlertTriangle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    OCR can make mistakes. You can edit the text above before analyzing.
                  </div>
                )}
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', border: '1px dashed var(--border-subtle)', borderRadius: '8px', color: 'var(--text-muted)', minHeight: '180px', fontStyle: 'italic', padding: '16px', textAlign: 'center' }}>
                Upload an image and extract text to begin.
              </div>
            )}
          </div>
        </div>
        
        {/* Analyze Button */}
        {extractedText && (
          <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="btn-primary"
              style={{ 
                flex: '2 1 180px', 
                padding: '12px', 
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: !isAnalyzing ? 'pointer' : 'not-allowed'
              }}
            >
              {isAnalyzing ? 'Analyzing safety...' : 'Analyze Safety'}
            </button>

            <button 
              onClick={handleReset} 
              className="btn-secondary"
              style={{ 
                flex: '1 1 100px', 
                padding: '12px', 
                borderRadius: '8px',
                fontWeight: 'bold',
                color: '#dc2626',
                borderColor: 'rgba(220, 38, 38, 0.3)',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
          </div>
        )}
        
        {error && <div style={{ color: '#ef4444', marginTop: '14px', fontSize: '0.9rem' }}>⚠️ {error}</div>}
      </div>
      
      {/* Analysis Results Section */}
      {analysisResult && (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Overall Risk */}
          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800 }}>Overall Risk</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: '900', color: getRiskColor(analysisResult.overall_severity) }}>
                {analysisResult.overall_risk_score} <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ 100</span>
              </div>
              <div style={{ background: getRiskColor(analysisResult.overall_severity) + '18', color: getRiskColor(analysisResult.overall_severity), padding: '6px 14px', borderRadius: '999px', fontWeight: 'bold', border: `1.5px solid ${getRiskColor(analysisResult.overall_severity)}`, fontSize: '0.85rem' }}>
                {analysisResult.overall_severity} RISK
              </div>
              <div style={{ background: '#f8fafc', color: '#0f172a', padding: '6px 14px', borderRadius: '8px', border: '1.5px solid rgba(14, 116, 189, 0.2)', fontSize: '0.85rem' }}>
                Category: <span style={{ fontWeight: 'bold', color: '#0284c7' }}>{analysisResult.overall_category.toUpperCase()}</span>
              </div>
            </div>
            
            <div style={{ marginTop: '14px', padding: '14px 18px', background: '#f8fafc', borderRadius: '10px', borderLeft: `4px solid ${analysisResult.escalation ? '#ef4444' : '#059669'}`, border: '1.5px solid rgba(14, 116, 189, 0.18)', borderLeftWidth: '4px' }}>
              <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1rem' }}>
                {analysisResult.escalation ? '⚠️ Risk escalates across the extracted messages.' : '✅ No significant escalation detected.'}
              </div>
            </div>
          </div>
          
          {/* Progression */}
          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800 }}>Risk Progression</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              {analysisResult.risk_progression.map((r, i) => (
                <React.Fragment key={i}>
                  <div style={{ background: '#ffffff', padding: '10px 16px', borderRadius: '10px', textAlign: 'center', border: '1.5px solid rgba(14, 116, 189, 0.2)', minWidth: '78px', boxShadow: '0 2px 8px rgba(14,116,189,0.06)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Line {r.message_number}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '2px' }}>
                      {r.score}
                    </div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 'bold', color: getRiskColor(r.severity) }}>
                      {r.severity}
                    </div>
                  </div>
                  {i < analysisResult.risk_progression.length - 1 && <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>➔</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {/* Evidence View */}
          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800 }}>🔎 What we noticed</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {analysisResult.detected_patterns && analysisResult.detected_patterns.length > 0 ? (
                analysisResult.detected_patterns.map((p, i) => (
                  <div key={i} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1.5px solid rgba(239, 68, 68, 0.35)', color: '#b91c1c', padding: '7px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700 }}>
                    <AlertTriangle size={15} color="#dc2626" /> 
                    {p.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </div>
                ))
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#047857', background: 'rgba(5, 150, 105, 0.1)', padding: '8px 14px', borderRadius: '8px', border: '1.5px solid rgba(5, 150, 105, 0.3)', fontWeight: 700, fontSize: '0.86rem' }}>
                  <ShieldCheck size={18} color="#059669" /> No warning signals detected
                </div>
              )}
            </div>
          </div>
          
          {/* Safety Explanation & Action Plan */}
          {analysisResult.safety_explanation && (
            <div style={{ marginTop: '6px', padding: '20px', background: '#f8fafc', borderRadius: '14px', border: '1.5px solid rgba(14, 116, 189, 0.2)' }}>
              
              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
                  {analysisResult.overall_category === 'safe' ? '✅' : '⚠️'} Why is this harmful?
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.55' }}>
                  {analysisResult.safety_explanation.reason}
                </p>
              </div>
              
              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
                  🛡️ What should I do now?
                </h4>
                {getActionPlan(analysisResult.overall_category)}
              </div>
              
              <div style={{ padding: '12px 16px', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '10px', borderLeft: '4px solid #0284c7' }}>
                <p style={{ color: '#0369a1', fontSize: '0.9rem', fontWeight: 'bold', margin: 0 }}>
                  💙 {analysisResult.safety_explanation.reassurance}
                </p>
              </div>
            </div>
          )}
          
        </div>
      )}
    </div>

  );
}
