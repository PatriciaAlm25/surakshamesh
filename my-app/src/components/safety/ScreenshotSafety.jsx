import React, { useState, useRef, useEffect } from 'react';
import { Upload, AlertTriangle, ShieldCheck, FileSearch, CheckCircle2, RotateCcw, Image as ImageIcon } from 'lucide-react';
import Tesseract from 'tesseract.js';

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
      const response = await fetch('http://localhost:8000/api/analyze-conversation', {
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
        
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {/* Left Column: Upload */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div 
              style={{ 
                border: '2px dashed var(--border-subtle)', 
                borderRadius: '12px', 
                padding: '40px 20px', 
                textAlign: 'center',
                background: 'rgba(15, 23, 42, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {imageUrl ? (
                <div style={{ position: 'relative', width: '100%', maxHeight: '300px', overflow: 'hidden', borderRadius: '8px' }}>
                  <img src={imageUrl} alt="Uploaded screenshot" style={{ width: '100%', objectFit: 'contain', maxHeight: '300px' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0}>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>Click to change image</span>
                  </div>
                </div>
              ) : (
                <>
                  <ImageIcon size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                  <h4 style={{ color: '#f8fafc', marginBottom: '8px' }}>Upload Screenshot</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Supported: Chat • Comments • DMs • Social Posts</p>
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
              <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'rgba(15, 23, 42, 0.8)', color: 'white', outline: 'none' }}
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
                <button onClick={extractText} className="btn-primary" style={{ flex: 2, padding: '12px', borderRadius: '8px' }}>
                  Extract Text
                </button>
              </div>
            )}
            
            {isExtracting && (
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span>{extractionStatus}</span>
                  <span>{extractionProgress}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${extractionProgress}%`, height: '100%', background: '#38bdf8', transition: 'width 0.2s' }}></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column: Extracted Text */}
          <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '12px', color: 'var(--text-muted)' }}>
              📝 Extracted Conversation
            </h3>
            
            {extractedText || isExtracting ? (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '12px' }}>
                <textarea 
                  value={extractedText} 
                  onChange={(e) => setExtractedText(e.target.value)}
                  placeholder="Extracted text will appear here..."
                  disabled={isExtracting}
                  style={{ 
                    flex: 1, 
                    minHeight: '200px', 
                    padding: '16px', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border-subtle)', 
                    background: 'rgba(15, 23, 42, 0.6)', 
                    color: 'white',
                    resize: 'vertical',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    lineHeight: '1.5'
                  }}
                />
                
                {extractedText && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <AlertTriangle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    OCR can make mistakes. You can edit the text above before analyzing.
                  </div>
                )}
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.3)', border: '1px dashed var(--border-subtle)', borderRadius: '8px', color: 'var(--text-muted)', minHeight: '200px', fontStyle: 'italic' }}>
                Upload an image and extract text to begin.
              </div>
            )}
          </div>
        </div>
        
        {/* Analyze Button */}
        {extractedText && (
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              style={{ 
                flex: 2, 
                padding: '14px', 
                background: 'rgba(56, 189, 248, 0.15)', 
                border: '1px solid #38bdf8', 
                color: '#38bdf8',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: !isAnalyzing ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease'
              }}
            >
              {isAnalyzing ? 'Analyzing safety...' : 'Analyze Safety'}
            </button>

            <button 
              onClick={handleReset} 
              style={{ 
                flex: 1, 
                padding: '14px', 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid rgba(239, 68, 68, 0.3)', 
                color: '#ef4444',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
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
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Overall Risk */}
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall Risk</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: getRiskColor(analysisResult.overall_severity) }}>
                {analysisResult.overall_risk_score} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ 100</span>
              </div>
              <div style={{ background: getRiskColor(analysisResult.overall_severity) + '22', color: getRiskColor(analysisResult.overall_severity), padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', border: `1px solid ${getRiskColor(analysisResult.overall_severity)}` }}>
                {analysisResult.overall_severity} RISK
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', color: '#f8fafc', padding: '6px 14px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                Category: <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>{analysisResult.overall_category.toUpperCase()}</span>
              </div>
            </div>
            
            <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', borderLeft: `4px solid ${analysisResult.escalation ? '#ef4444' : '#34d399'}` }}>
              <div style={{ fontWeight: 'bold', color: '#f8fafc', fontSize: '1.05rem' }}>
                {analysisResult.escalation ? 'Risk escalates across the extracted messages.' : 'No significant escalation detected.'}
              </div>
            </div>
          </div>
          
          {/* Progression */}
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Risk Progression</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
              {analysisResult.risk_progression.map((r, i) => (
                <React.Fragment key={i}>
                  <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '10px 18px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-subtle)', minWidth: '80px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Line {r.message_number}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '4px' }}>
                      {r.score}
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: getRiskColor(r.severity) }}>
                      {r.severity}
                    </div>
                  </div>
                  {i < analysisResult.risk_progression.length - 1 && <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {/* Evidence View */}
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🔎 What we noticed</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {analysisResult.detected_patterns && analysisResult.detected_patterns.length > 0 ? (
                analysisResult.detected_patterns.map((p, i) => (
                  <div key={i} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '8px 14px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                    <AlertTriangle size={16} color="#ef4444" /> 
                    {p.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </div>
                ))
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', background: 'rgba(52, 211, 153, 0.1)', padding: '8px 14px', borderRadius: '6px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                  <ShieldCheck size={18} /> No warning signals detected
                </div>
              )}
            </div>
          </div>
          
          {/* Safety Explanation & Action Plan */}
          {analysisResult.safety_explanation && (
            <div style={{ marginTop: '10px', padding: '24px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1.05rem', color: '#f8fafc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {analysisResult.overall_category === 'safe' ? '✅' : '⚠️'} Why is this harmful?
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {analysisResult.safety_explanation.reason}
                </p>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1.05rem', color: '#f8fafc', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🛡️ What should I do now?
                </h4>
                {getActionPlan(analysisResult.overall_category)}
              </div>
              
              <div style={{ padding: '12px 16px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', borderLeft: '4px solid #38bdf8' }}>
                <p style={{ color: '#38bdf8', fontSize: '0.95rem', fontWeight: 'bold', margin: 0 }}>
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
