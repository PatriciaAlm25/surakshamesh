import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Shield, 
  Sparkles, 
  PhoneCall, 
  Lock, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Globe, 
  AlertTriangle, 
  ArrowRight,
  RefreshCw,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { 
  VoiceAssistantService, 
  SUPPORTED_LANGUAGES 
} from '../../services/voiceAssistantService';

export default function SurakshaAssistant({ setActiveTab }) {
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "👋 नमस्ते! मैं आपका **सुरक्षा साथी (Suraksha Assistant)** हूँ।\n\nआप यहाँ बिल्कुल सुरक्षित हैं। यदि इंटरनेट पर कोई आपको परेशान कर रहा है, आपकी गुप्त बातें पूछ रहा है, या कोई तस्वीर मांग रहा है, तो बेझिझक बोलकर या लिखकर बताएं। मदद मांगने में आपकी कोई गलती नहीं है।",
      timestamp: 'Just now',
      languageCode: 'hi-IN',
      pipelineTrace: {
        language_layer: 'Sarvam AI (Hindi)',
        situation_layer: 'Gemini Context Engine',
        safety_layer: 'Python Safety Engine (Safe)',
        audio_layer: 'Sarvam Bulbul TTS'
      }
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);

  const chatEndRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isRecording]);

  // Handle Recording Timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Update welcome greeting when language changes
  const handleLanguageChange = (newCode) => {
    setSelectedLanguage(newCode);
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === newCode) || SUPPORTED_LANGUAGES[0];

    const langGreeting = {
      id: `lang-change-${Date.now()}`,
      sender: 'bot',
      text: `${langObj.welcome}\n\nLanguage switched to **${langObj.name} (${langObj.native})**. You can speak 🎙️ or type 💬 in your preferred dialect.`,
      timestamp: 'Just now',
      languageCode: newCode,
      pipelineTrace: {
        language_layer: `Sarvam AI (${langObj.name})`,
        situation_layer: 'Gemini Context Engine',
        safety_layer: 'Python Safety Engine',
        audio_layer: 'Sarvam Bulbul Voice'
      }
    };
    setMessages(prev => [...prev, langGreeting]);
  };

  // Start Mic Recording
  const handleStartRecord = async () => {
    try {
      await VoiceAssistantService.startRecording();
      setIsRecording(true);
    } catch (e) {
      alert('Could not access microphone: ' + e.message);
    }
  };

  // Stop Mic Recording and Process
  const handleStopRecord = async () => {
    if (!isRecording) return;
    setIsRecording(false);
    setIsTyping(true);

    try {
      const audioBlob = await VoiceAssistantService.stopRecording();
      
      const langObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage);
      const userAudioMsg = {
        id: `user-audio-${Date.now()}`,
        sender: 'user',
        text: `🎙️ [Voice message in ${langObj.name}]`,
        timestamp: 'Just now',
        isAudioInput: true
      };
      setMessages(prev => [...prev, userAudioMsg]);

      // Call multimodal pipeline
      const result = await VoiceAssistantService.processAssistantQuery({
        audioBlob,
        languageCode: selectedLanguage
      });

      const botReply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: result.response_text,
        timestamp: 'Just now',
        languageCode: selectedLanguage,
        audioBase64: result.audio_base64,
        situation: result.situation_assessment,
        riskLevel: result.risk_level,
        riskScore: result.risk_score,
        indicators: result.detected_indicators,
        pipelineTrace: result.pipeline_trace
      };

      setMessages(prev => [...prev, botReply]);
      setIsTyping(false);

      if (autoPlayAudio) {
        handlePlayAudio(botReply);
      }
    } catch (e) {
      console.error(e);
      setIsTyping(false);
    }
  };

  // Send Text Message
  const handleSendText = async (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const query = inputText.trim();
    setInputText('');

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const result = await VoiceAssistantService.processAssistantQuery({
        text: query,
        languageCode: selectedLanguage
      });

      const botReply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: result.response_text,
        timestamp: 'Just now',
        languageCode: selectedLanguage,
        audioBase64: result.audio_base64,
        situation: result.situation_assessment,
        riskLevel: result.risk_level,
        riskScore: result.risk_score,
        indicators: result.detected_indicators,
        pipelineTrace: result.pipeline_trace
      };

      setMessages(prev => [...prev, botReply]);
      setIsTyping(false);

      if (autoPlayAudio) {
        handlePlayAudio(botReply);
      }
    } catch (e) {
      console.error(e);
      setIsTyping(false);
    }
  };

  // Play Audio for a message
  const handlePlayAudio = (msg) => {
    if (currentlyPlayingId === msg.id) {
      VoiceAssistantService.stopAudio();
      setCurrentlyPlayingId(null);
      return;
    }

    setCurrentlyPlayingId(msg.id);
    VoiceAssistantService.playAudio(
      msg.audioBase64,
      msg.text,
      msg.languageCode || selectedLanguage,
      () => setCurrentlyPlayingId(null)
    );
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Top Header & Multilingual Selector - Light Blue Themed */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '16px 20px', 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '12px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(224,242,254,0.9) 100%)',
          border: '1.5px solid rgba(14, 165, 233, 0.3)',
          boxShadow: '0 4px 24px rgba(14, 116, 189, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(14, 165, 233, 0.4)',
              flexShrink: 0
            }}
          >
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 'clamp(1.15rem, 3vw, 1.4rem)', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #0ea5e9 0%, #2563eb 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Suraksha AI Assistant
              </h2>
              <span 
                style={{ 
                  fontSize: '0.65rem', 
                  padding: '2px 8px', 
                  borderRadius: '999px', 
                  background: 'rgba(14, 165, 233, 0.12)', 
                  border: '1px solid rgba(14, 165, 233, 0.4)', 
                  color: '#0284c7',
                  fontWeight: 700
                }}
              >
                Sarvam + Gemini
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#334155', margin: 0, marginTop: '2px' }}>
              Speak or type in any Indian language. Empathetic triage & audio guidance.
            </p>
          </div>
        </div>

        {/* Language Selection & Audio Settings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', width: '100%', maxWidth: 'fit-content' }}>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: 'rgba(241, 245, 249, 0.95)', 
              padding: '5px 10px', 
              borderRadius: '8px', 
              border: '1.5px solid rgba(14, 165, 233, 0.3)',
              boxShadow: '0 2px 8px rgba(14, 116, 189, 0.08)',
              flex: '1 1 auto'
            }}
          >
            <Globe size={15} color="#0ea5e9" />
            <select
              value={selectedLanguage}
              onChange={e => handleLanguageChange(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#0f172a', fontSize: '0.82rem', padding: '2px', cursor: 'pointer', outline: 'none', width: '100%' }}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} style={{ background: '#ffffff', color: '#0f172a' }}>
                  {lang.flag} {lang.native} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setAutoPlayAudio(!autoPlayAudio)}
            style={{ 
              padding: '6px 12px', 
              fontSize: '0.78rem',
              borderRadius: '8px',
              background: autoPlayAudio ? 'rgba(14, 165, 233, 0.12)' : 'rgba(241, 245, 249, 0.9)',
              border: '1.5px solid rgba(14, 165, 233, 0.35)',
              color: autoPlayAudio ? '#0284c7' : '#64748b',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontWeight: 700,
              cursor: 'pointer',
              flexShrink: 0
            }}
            title="Toggle automatic audio read-aloud"
          >
            {autoPlayAudio ? <Volume2 size={15} color="#0ea5e9" /> : <VolumeX size={15} color="#64748b" />}
            {autoPlayAudio ? 'Voice: ON' : 'Voice: OFF'}
          </button>
        </div>
      </div>

      {/* 4-Layer Architecture Pipeline Bar - Light Blue Styling */}
      <div 
        style={{ 
          background: 'linear-gradient(90deg, rgba(224,242,254,0.9) 0%, rgba(219,234,254,0.85) 100%)', 
          border: '1.5px solid rgba(14, 165, 233, 0.25)', 
          borderRadius: '12px', 
          padding: '10px 14px', 
          display: 'flex', 
          flexWrap: 'wrap', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '6px', 
          fontSize: '0.74rem',
          boxShadow: '0 2px 12px rgba(14, 116, 189, 0.08)'
        }}
      >
        <span style={{ color: '#334155', fontWeight: 700 }}>AI Pipeline:</span>
        <span style={{ color: '#0284c7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0ea5e9' }} /> 1. Speech (Sarvam)
        </span>
        <span style={{ color: '#94a3b8' }}>➔</span>
        <span style={{ color: '#2563eb', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563eb' }} /> 2. Situation (Gemini)
        </span>
        <span style={{ color: '#94a3b8' }}>➔</span>
        <span style={{ color: '#7c3aed', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b5cf6' }} /> 3. Risk (Safety)
        </span>
        <span style={{ color: '#94a3b8' }}>➔</span>
        <span style={{ color: '#0284c7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0ea5e9' }} /> 4. Audio (Bulbul)
        </span>
      </div>

      {/* Main Chat Conversation Window - Glowing Light Blue Frame */}
      <div 
        style={{ 
          height: 'clamp(440px, 60vh, 540px)', 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(14, 165, 233, 0.08), transparent 70%), #f8fafc',
          border: '1.5px solid rgba(14, 165, 233, 0.25)',
          borderRadius: '18px',
          boxShadow: '0 8px 40px rgba(14, 116, 189, 0.12)'
        }}
      >
        
        {/* Messages Scroll Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '14px', WebkitOverflowScrolling: 'touch' }}>

          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            const isPlaying = currentlyPlayingId === msg.id;

            return (
              <div 
                key={msg.id} 
                style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  alignSelf: isBot ? 'flex-start' : 'flex-end',
                  maxWidth: '85%'
                }}
              >
                {isBot && (
                  <div 
                    style={{ 
                      width: '38px', 
                      height: '38px', 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0,
                      boxShadow: '0 4px 14px rgba(14, 165, 233, 0.35)'
                    }}
                  >
                    <Shield size={20} color="#ffffff" />
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  
                  {/* Situation & Risk Diagnostics Chip (Only on Bot Answers) */}
                  {isBot && msg.situation && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                      <span 
                        style={{ 
                          fontSize: '0.68rem', 
                          padding: '3px 10px', 
                          borderRadius: '999px',
                          background: msg.riskLevel === 'HIGH' ? '#fee2e2' : '#e0f2fe',
                          border: msg.riskLevel === 'HIGH' ? '1.5px solid #ef4444' : '1.5px solid #0284c7',
                          color: msg.riskLevel === 'HIGH' ? '#dc2626' : '#0369a1',
                          fontWeight: 700
                        }}
                      >
                        {msg.riskLevel || 'MEDIUM'} RISK ({msg.riskScore || 60}%)
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#0369a1', background: '#f0f9ff', border: '1px solid #bae6fd', padding: '3px 10px', borderRadius: '6px', fontWeight: 600 }}>
                        Context: {msg.situation}
                      </span>
                    </div>
                  )}

                  {/* Message Bubble - Light Blue Themed */}
                  <div 
                    style={{ 
                      background: isBot 
                        ? '#ffffff' 
                        : 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
                      color: isBot ? '#0f172a' : '#ffffff',
                      padding: '14px 18px',
                      borderRadius: '18px',
                      borderBottomLeftRadius: isBot ? '4px' : '18px',
                      borderBottomRightRadius: isBot ? '18px' : '4px',
                      fontSize: '0.9rem',
                      lineHeight: 1.55,
                      border: isBot ? '1px solid rgba(14, 116, 189, 0.15)' : 'none',
                      boxShadow: isBot 
                        ? '0 2px 12px rgba(14, 116, 189, 0.08)' 
                        : '0 4px 16px rgba(14, 165, 233, 0.3)'
                    }}
                  >
                    <div style={{ whiteSpace: 'pre-line', fontWeight: isBot ? 400 : 600 }}>
                      {msg.text}
                    </div>

                    {/* Bottom Metadata & Voice Playback Button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: isBot ? '1px solid rgba(14, 116, 189, 0.1)' : '1px solid rgba(255,255,255,0.25)' }}>
                      <span style={{ fontSize: '0.7rem', opacity: 0.7, color: isBot ? '#64748b' : 'rgba(255,255,255,0.8)' }}>
                        {msg.timestamp}
                      </span>

                      {/* Audio Play Button for Bot Replies */}
                      {isBot && (
                        <button
                          onClick={() => handlePlayAudio(msg)}
                          style={{
                            background: isPlaying ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.08)',
                            color: '#0284c7',
                            border: '1px solid rgba(14, 165, 233, 0.35)',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '0.74rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            cursor: 'pointer',
                            fontWeight: 700,
                            boxShadow: isPlaying ? '0 0 10px rgba(14, 165, 233, 0.25)' : 'none'
                          }}
                        >
                          {isPlaying ? <VolumeX size={14} /> : <Volume2 size={14} />}
                          <span>{isPlaying ? 'Stop Audio' : 'Play Audio'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* High Risk SOS Trigger */}
                  {isBot && msg.riskLevel === 'HIGH' && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                      <button
                        className="btn-danger"
                        style={{ padding: '6px 14px', fontSize: '0.75rem', borderRadius: '8px' }}
                        onClick={() => setActiveTab('report')}
                      >
                        🚨 File 100% Anonymous SOS Report
                      </button>
                    </div>
                  )}

                </div>
              </div>
            );
          })}

          {/* Typing State */}
          {isTyping && (
            <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(14,165,233,0.3)' }}>
                <Shield size={20} color="#ffffff" />
              </div>
              <div style={{ background: '#ffffff', border: '1px solid rgba(14, 165, 233, 0.2)', padding: '12px 16px', borderRadius: '18px', fontSize: '0.84rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 2px 8px rgba(14,116,189,0.08)' }}>
                <RefreshCw className="animate-spin" size={15} color="#0ea5e9" />
                <span>Sarvam & Gemini are analyzing in {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name}...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Live Audio Recording Modal / Banner */}
        {isRecording && (
          <div 
            style={{ 
              background: 'linear-gradient(90deg, rgba(224,242,254,0.98) 0%, rgba(219,234,254,0.98) 100%)', 
              borderTop: '2px solid #0ea5e9', 
              padding: '14px 22px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              boxShadow: '0 -4px 20px rgba(14, 165, 233, 0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#0ea5e9', boxShadow: '0 0 14px #0ea5e9', animation: 'pulseGlow 1s infinite' }} />
              <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>
                Listening in {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name}... (00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds})
              </strong>
              <span style={{ fontSize: '0.78rem', color: '#334155' }}>Speak your question or concern now</span>
            </div>

            <button
              onClick={handleStopRecord}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.82rem', borderRadius: '8px' }}
            >
              Done / Send Voice
            </button>
          </div>
        )}

        {/* Suggested Queries - Light Blue Frosted Pills */}
        <div 
          style={{ 
            padding: '10px 18px', 
            background: '#f0f9ff', 
            borderTop: '1px solid rgba(14, 165, 233, 0.15)', 
            display: 'flex', 
            gap: '8px', 
            overflowX: 'auto', 
            whiteSpace: 'nowrap' 
          }}
        >
          {[
            "किसी ने मेरी निजी तस्वीर मांगी है, मैं क्या करूँ?",
            "मला कोणीतरी धमकावत आहे, मी पालकांना सांगावे का?",
            "Someone is asking me to keep our chat a secret.",
            "How do I block someone safely without them knowing?"
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(prompt)}
              style={{
                background: 'rgba(14, 165, 233, 0.1)',
                color: '#0284c7',
                border: '1px solid rgba(14, 165, 233, 0.3)',
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '0.76rem',
                flexShrink: 0,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: 500
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(14, 165, 233, 0.2)';
                e.currentTarget.style.color = '#0369a1';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(14, 165, 233, 0.1)';
                e.currentTarget.style.color = '#0284c7';
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar with Light Blue Audio Mic Button & Text Send */}
        <form 
          onSubmit={handleSendText} 
          style={{ 
            padding: '14px 18px', 
            background: '#ffffff', 
            borderTop: '1px solid rgba(14, 165, 233, 0.15)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px' 
          }}
        >
          {/* Audio Mic Button */}
          <button
            type="button"
            onClick={isRecording ? handleStopRecord : handleStartRecord}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: isRecording 
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
                : 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: isRecording ? '0 0 16px rgba(239,68,68,0.4)' : '0 4px 14px rgba(14,165,233,0.35)',
              transition: 'all 0.2s ease'
            }}
            title={isRecording ? "Stop recording" : "Record voice query"}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <input
            type="text"
            placeholder={`Type or speak in ${SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name} (हिन्दी, मराठी, English)...`}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            disabled={isRecording}
            style={{ 
              flex: 1, 
              padding: '12px 16px', 
              fontSize: '0.9rem',
              background: '#f8fafc',
              border: '1.5px solid rgba(14, 165, 233, 0.3)',
              borderRadius: '12px',
              color: '#0f172a'
            }}
          />

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ 
              padding: '12px 18px',
              borderRadius: '12px'
            }} 
            disabled={!inputText.trim() || isRecording}
          >
            <Send size={18} />
          </button>
        </form>

      </div>

      {/* Helpline Info Bar - Light Blue Accent */}
      <div 
        style={{ 
          padding: '16px 22px', 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '12px',
          background: 'linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)',
          border: '1.5px solid rgba(14, 165, 233, 0.25)',
          borderRadius: '14px',
          boxShadow: '0 2px 12px rgba(14, 116, 189, 0.08)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PhoneCall size={20} color="#0284c7" />
          <span style={{ fontSize: '0.85rem', color: '#334155' }}>
            Need to speak to a verified counsellor right now? Call <strong style={{ color: '#0284c7' }}>Childline 1098</strong> (Toll-Free, 24/7).
          </span>
        </div>
        <button className="btn-danger" style={{ fontSize: '0.78rem', padding: '8px 16px', borderRadius: '8px' }} onClick={() => setActiveTab('report')}>
          File Invisible SOS <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
}
