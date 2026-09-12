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
import { StorageService } from '../../services/storageService';
import confetti from 'canvas-confetti';

export default function SurakshaAssistant({ setActiveTab }) {
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN');
  const [chatSessionId] = useState(() => `SESH-2026-${Math.floor(10000 + Math.random() * 90000)}`);
  const [registeredCases, setRegisteredCases] = useState({});
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
        isAudioInput: true,
        languageCode: selectedLanguage
      };
      setMessages(prev => [...prev, userAudioMsg]);

      // Save user message to Supabase chat logs
      StorageService.saveChatMessage(userAudioMsg, chatSessionId);

      // Call multimodal pipeline
      const result = await VoiceAssistantService.processAssistantQuery({
        audioBlob,
        languageCode: selectedLanguage
      });

      const isHighPriority = result.risk_level === 'HIGH' || result.risk_level === 'CRITICAL' || (result.risk_score && result.risk_score >= 55);

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
        pipelineTrace: result.pipeline_trace,
        promptedForReport: isHighPriority,
        isHighPriority: isHighPriority
      };

      setMessages(prev => [...prev, botReply]);
      setIsTyping(false);

      // Save bot reply to Supabase chat logs
      StorageService.saveChatMessage(botReply, chatSessionId);

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
      timestamp: 'Just now',
      languageCode: selectedLanguage
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Save user message to Supabase chat logs
    StorageService.saveChatMessage(userMsg, chatSessionId);

    // Check if the user is answering "yes" or requesting report for previous concern
    const lowerQuery = query.toLowerCase();
    const isAffirmative = /^(yes|yeah|yup|yep|sure|please|haan|ha|haa|report|register|kar do|kar dijiye|ho|hoy|aam|aama|avunu|sari|theek hai|bilkul|ok|okay)/i.test(lowerQuery);
    
    // Find if last bot message had high priority and not yet reported
    const lastBotMsg = [...messages].reverse().find(m => m.sender === 'bot');
    const wasPrompted = lastBotMsg?.isHighPriority && !registeredCases[lastBotMsg.id];

    if (isAffirmative && wasPrompted) {
      setTimeout(() => {
        handleConfirmReport(lastBotMsg);
        setIsTyping(false);
      }, 500);
      return;
    }

    try {
      const result = await VoiceAssistantService.processAssistantQuery({
        text: query,
        languageCode: selectedLanguage
      });

      const isHighPriority = result.risk_level === 'HIGH' || result.risk_level === 'CRITICAL' || (result.risk_score && result.risk_score >= 55);

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
        pipelineTrace: result.pipeline_trace,
        promptedForReport: isHighPriority,
        isHighPriority: isHighPriority
      };

      setMessages(prev => [...prev, botReply]);
      setIsTyping(false);

      // Save bot reply to Supabase chat logs
      StorageService.saveChatMessage(botReply, chatSessionId);

      if (autoPlayAudio) {
        handlePlayAudio(botReply);
      }
    } catch (e) {
      console.error(e);
      setIsTyping(false);
    }
  };

  // User confirms registering the high priority case
  const handleConfirmReport = (targetBotMsg) => {
    // Register official anonymous case
    const createdCase = StorageService.registerCaseFromChat({
      chatHistory: messages,
      riskData: {
        riskScore: targetBotMsg.riskScore || 85,
        riskLevel: targetBotMsg.riskLevel || 'HIGH',
        situation: targetBotMsg.situation,
        indicators: targetBotMsg.indicators
      },
      languageCode: selectedLanguage
    });

    setRegisteredCases(prev => ({
      ...prev,
      [targetBotMsg.id]: createdCase
    }));

    // Confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Confirmation message from assistant
    const confirmationMsg = {
      id: `bot-registered-${Date.now()}`,
      sender: 'bot',
      text: `✅ **सुरक्षा रिपोर्ट सफलतापूर्वक दर्ज हो गई है! (Report Successfully Registered)**\n\nआपका गोपनीय केस नंबर है: **${createdCase.caseCode}**\n\nइस मामले को प्राथमिकता के आधार पर चाइल्डलाइन एवं बाल कल्याण यूनिट को सौंप दिया गया है। आप किसी भी समय **Report Tracker** में इस केस आईडी से स्थिति देख सकते हैं। आप बिल्कुल सुरक्षित हैं।`,
      timestamp: 'Just now',
      languageCode: selectedLanguage,
      registeredCaseCode: createdCase.caseCode
    };

    setMessages(prev => [...prev, confirmationMsg]);
    StorageService.saveChatMessage(confirmationMsg, chatSessionId);
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
    <div style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Header & Multilingual Selector - Light Blue Themed */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '22px 26px', 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '16px',
          background: 'linear-gradient(135deg, rgba(8, 24, 48, 0.85) 0%, rgba(14, 38, 72, 0.75) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          boxShadow: '0 8px 32px rgba(56, 189, 248, 0.12)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div 
            style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '14px', 
              background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(56, 189, 248, 0.45)'
            }}
          >
            <Sparkles size={24} color="#041122" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #e0f2fe 0%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Suraksha Voice Assistant
              </h2>
              <span 
                style={{ 
                  fontSize: '0.7rem', 
                  padding: '3px 10px', 
                  borderRadius: '999px', 
                  background: 'rgba(56, 189, 248, 0.18)', 
                  border: '1px solid #38bdf8', 
                  color: '#38bdf8',
                  fontWeight: 600
                }}
              >
                Sarvam AI + Gemini AI
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#93c5fd', margin: 0, marginTop: '2px' }}>
              Speak or type in any Indian language. Empathetic situation triage & audio safety guidance.
            </p>
          </div>
        </div>

        {/* Language Selection & Audio Settings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'rgba(8, 24, 48, 0.9)', 
              padding: '6px 12px', 
              borderRadius: '10px', 
              border: '1px solid rgba(56, 189, 248, 0.4)',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.1)'
            }}
          >
            <Globe size={16} color="#38bdf8" />
            <select
              value={selectedLanguage}
              onChange={e => handleLanguageChange(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#e0f2fe', fontSize: '0.84rem', padding: '2px', cursor: 'pointer', outline: 'none' }}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} style={{ background: '#071529', color: '#e0f2fe' }}>
                  {lang.flag} {lang.native} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setAutoPlayAudio(!autoPlayAudio)}
            style={{ 
              padding: '8px 14px', 
              fontSize: '0.8rem',
              borderRadius: '10px',
              background: autoPlayAudio ? 'rgba(56, 189, 248, 0.22)' : 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: autoPlayAudio ? '#38bdf8' : '#94a3b8',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            title="Toggle automatic audio read-aloud"
          >
            {autoPlayAudio ? <Volume2 size={16} color="#38bdf8" /> : <VolumeX size={16} color="#64748b" />}
            {autoPlayAudio ? 'Voice: ON' : 'Voice: OFF'}
          </button>
        </div>
      </div>

      {/* 4-Layer Architecture Pipeline Bar - Light Blue Styling */}
      <div 
        style={{ 
          background: 'linear-gradient(90deg, rgba(8, 24, 48, 0.9) 0%, rgba(12, 34, 64, 0.85) 100%)', 
          border: '1px solid rgba(56, 189, 248, 0.35)', 
          borderRadius: '14px', 
          padding: '12px 18px', 
          display: 'flex', 
          flexWrap: 'wrap', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '8px', 
          fontSize: '0.78rem',
          boxShadow: '0 4px 20px rgba(56, 189, 248, 0.08)'
        }}
      >
        <span style={{ color: '#93c5fd', fontWeight: 600 }}>AI Safety Pipeline:</span>
        <span style={{ color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }} /> 1. Sarvam AI (Speech)
        </span>
        <span style={{ color: 'rgba(56, 189, 248, 0.4)' }}>➔</span>
        <span style={{ color: '#7dd3fc', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7dd3fc' }} /> 2. Gemini AI (Situation)
        </span>
        <span style={{ color: 'rgba(56, 189, 248, 0.4)' }}>➔</span>
        <span style={{ color: '#bae6fd', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#bae6fd' }} /> 3. Python Safety (Risk)
        </span>
        <span style={{ color: 'rgba(56, 189, 248, 0.4)' }}>➔</span>
        <span style={{ color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }} /> 4. Bulbul Audio Voice
        </span>
      </div>

      {/* Main Chat Conversation Window - Glowing Light Blue Frame */}
      <div 
        style={{ 
          height: '540px', 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(56, 189, 248, 0.12), transparent 75%), rgba(6, 16, 33, 0.92)',
          border: '2px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '20px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 35px rgba(56, 189, 248, 0.15)'
        }}
      >
        
        {/* Messages Scroll Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
                      background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0,
                      boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)'
                    }}
                  >
                    <Shield size={20} color="#041122" />
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  
                  {/* Situation & Risk Diagnostics Chip (Only on Bot Answers) */}
                  {isBot && msg.situation && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                      <span 
                        style={{ 
                          fontSize: '0.68rem', 
                          padding: '2px 8px', 
                          borderRadius: '999px',
                          background: msg.riskLevel === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.18)',
                          border: msg.riskLevel === 'HIGH' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(56, 189, 248, 0.4)',
                          color: msg.riskLevel === 'HIGH' ? '#f87171' : '#38bdf8',
                          fontWeight: 700
                        }}
                      >
                        {msg.riskLevel || 'MEDIUM'} RISK ({msg.riskScore || 60}%)
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#93c5fd', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '2px 8px', borderRadius: '6px' }}>
                        Context: {msg.situation}
                      </span>
                    </div>
                  )}

                  {/* Message Bubble - Light Blue Themed */}
                  <div 
                    style={{ 
                      background: isBot 
                        ? 'rgba(10, 25, 48, 0.88)' 
                        : 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                      color: isBot ? '#f0f9ff' : '#041122',
                      padding: '14px 18px',
                      borderRadius: '18px',
                      borderBottomLeftRadius: isBot ? '4px' : '18px',
                      borderBottomRightRadius: isBot ? '18px' : '4px',
                      fontSize: '0.9rem',
                      lineHeight: 1.55,
                      border: isBot ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid #7dd3fc',
                      boxShadow: isBot 
                        ? '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(56, 189, 248, 0.08)' 
                        : '0 4px 20px rgba(56, 189, 248, 0.3)'
                    }}
                  >
                    <div style={{ whiteSpace: 'pre-line', fontWeight: isBot ? 400 : 600 }}>
                      {msg.text}
                    </div>

                    {/* Bottom Metadata & Voice Playback Button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: isBot ? '1px solid rgba(56, 189, 248, 0.15)' : '1px solid rgba(4, 17, 34, 0.15)' }}>
                      <span style={{ fontSize: '0.7rem', opacity: 0.75, color: isBot ? '#93c5fd' : '#041122' }}>
                        {msg.timestamp}
                      </span>

                      {/* Audio Play Button for Bot Replies */}
                      {isBot && (
                        <button
                          onClick={() => handlePlayAudio(msg)}
                          style={{
                            background: isPlaying ? 'rgba(56, 189, 248, 0.35)' : 'rgba(56, 189, 248, 0.15)',
                            color: '#38bdf8',
                            border: '1px solid rgba(56, 189, 248, 0.45)',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '0.74rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            boxShadow: isPlaying ? '0 0 12px rgba(56, 189, 248, 0.4)' : 'none'
                          }}
                        >
                          {isPlaying ? <VolumeX size={14} /> : <Volume2 size={14} />}
                          <span>{isPlaying ? 'Stop Spoken Audio' : 'Play Voice Audio'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Interactive High-Priority Report Prompt */}
                  {isBot && msg.isHighPriority && (
                    <div style={{ marginTop: '4px' }}>
                      {!registeredCases[msg.id] ? (
                        <div 
                          style={{ 
                            background: 'linear-gradient(135deg, rgba(30, 15, 20, 0.95) 0%, rgba(45, 18, 25, 0.9) 100%)',
                            border: '1px solid rgba(239, 68, 68, 0.5)',
                            borderRadius: '14px',
                            padding: '12px 16px',
                            boxShadow: '0 4px 20px rgba(239, 68, 68, 0.2)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontSize: '0.84rem', fontWeight: 700 }}>
                            <AlertTriangle size={16} color="#ef4444" />
                            <span>High Priority Concern Detected ({msg.riskScore || 85}% Risk)</span>
                          </div>
                          
                          <p style={{ fontSize: '0.78rem', color: '#fca5a5', margin: 0, lineHeight: 1.4 }}>
                            AI Assistant recommendation: Should I officially register and report this case anonymously so verified child welfare advocates can assist you?
                          </p>

                          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                            <button
                              className="btn-danger"
                              style={{ padding: '6px 14px', fontSize: '0.76rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}
                              onClick={() => handleConfirmReport(msg)}
                            >
                              <CheckCircle2 size={14} /> Yes, Report & Register Case
                            </button>
                            <button
                              className="btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '0.76rem', borderRadius: '8px' }}
                              onClick={() => setActiveTab('tracker')}
                            >
                              Check Existing Case
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          style={{ 
                            background: 'rgba(16, 185, 129, 0.12)',
                            border: '1px solid rgba(16, 185, 129, 0.4)',
                            borderRadius: '12px',
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>
                              ✓ CASE REGISTERED IN SUPABASE
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 800 }}>
                              {registeredCases[msg.id].caseCode}
                            </div>
                          </div>

                          <button
                            className="btn-primary"
                            style={{ padding: '6px 12px', fontSize: '0.74rem', borderRadius: '8px' }}
                            onClick={() => setActiveTab('tracker')}
                          >
                            🔍 Track Case Status
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Registered Case Code direct button */}
                  {isBot && msg.registeredCaseCode && (
                    <div style={{ marginTop: '4px' }}>
                      <button
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.78rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
                        onClick={() => setActiveTab('tracker')}
                      >
                        🔍 Open Case {msg.registeredCaseCode} in Report Tracker <ArrowRight size={14} />
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
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #38bdf8, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={20} color="#041122" />
              </div>
              <div style={{ background: 'rgba(10, 25, 48, 0.9)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '12px 16px', borderRadius: '18px', fontSize: '0.84rem', color: '#93c5fd', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <RefreshCw className="animate-spin" size={15} color="#38bdf8" />
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
              background: 'linear-gradient(90deg, rgba(8, 28, 56, 0.95) 0%, rgba(14, 46, 88, 0.95) 100%)', 
              borderTop: '2px solid #38bdf8', 
              padding: '14px 22px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              boxShadow: '0 -4px 25px rgba(56, 189, 248, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 14px #38bdf8', animation: 'pulseGlow 1s infinite' }} />
              <strong style={{ fontSize: '0.9rem', color: '#e0f2fe' }}>
                Listening in {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name}... (00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds})
              </strong>
              <span style={{ fontSize: '0.78rem', color: '#93c5fd' }}>Speak your question or concern now</span>
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
            background: 'rgba(6, 16, 33, 0.95)', 
            borderTop: '1px solid rgba(56, 189, 248, 0.2)', 
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
                background: 'rgba(56, 189, 248, 0.12)',
                color: '#bae6fd',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '0.76rem',
                flexShrink: 0,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.25)';
                e.currentTarget.style.color = '#38bdf8';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)';
                e.currentTarget.style.color = '#bae6fd';
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
            background: 'rgba(5, 14, 30, 0.98)', 
            borderTop: '1px solid rgba(56, 189, 248, 0.25)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px' 
          }}
        >
          {/* Audio Mic Button - Glowing Light Blue */}
          <button
            type="button"
            onClick={isRecording ? handleStopRecord : handleStartRecord}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: isRecording 
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
                : 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(2, 132, 199, 0.3) 100%)',
              border: isRecording ? '2px solid #fff' : '1.5px solid #38bdf8',
              color: isRecording ? '#fff' : '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.35)',
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
              background: 'rgba(8, 22, 44, 0.9)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '12px',
              color: '#f0f9ff'
            }}
          />

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ 
              padding: '12px 18px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
              color: '#041122',
              fontWeight: 700,
              boxShadow: '0 0 18px rgba(56, 189, 248, 0.35)'
            }} 
            disabled={!inputText.trim() || isRecording}
          >
            <Send size={18} />
          </button>
        </form>

      </div>

      {/* Helpline Info Bar - Light Blue Accent */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '16px 22px', 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '12px',
          background: 'linear-gradient(135deg, rgba(8, 24, 48, 0.8) 0%, rgba(14, 38, 72, 0.7) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PhoneCall size={20} color="#38bdf8" />
          <span style={{ fontSize: '0.85rem', color: '#bae6fd' }}>
            Need to speak to a real verified counsellor right now? Call <strong style={{ color: '#38bdf8' }}>Childline 1098</strong> (Toll-Free, 24/7).
          </span>
        </div>
        <button className="btn-danger" style={{ fontSize: '0.78rem', padding: '8px 16px', borderRadius: '8px' }} onClick={() => setActiveTab('report')}>
          File Invisible SOS <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
}
