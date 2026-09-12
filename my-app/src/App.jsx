import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomeHub from './components/home/HomeHub';
import ChatSimulator from './components/simulator/ChatSimulator';
import ScreenshotAnalyzer from './components/ocr/ScreenshotAnalyzer';
import AnonymousReportWizard from './components/reporting/AnonymousReportWizard';
import CaseTracker from './components/reporting/CaseTracker';
import SurakshaAssistant from './components/assistant/SurakshaAssistant';
import ResponderDashboard from './components/responder/ResponderDashboard';
import SafetyGraph from './components/graph/SafetyGraph';
import SafeSchoolDashboard from './components/safeschool/SafeSchoolDashboard';
import ConversationSafety from './components/safety/ConversationSafety';
import { AlertCircle, Shield } from 'lucide-react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [userAge, setUserAge] = useState(13); // Default < 14 protected mode

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="app-container">
      {/* Top Sticky Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userAge={userAge} 
        setUserAge={setUserAge} 
      />

      {/* Main Dynamic View Content */}
      <main className="main-content">
        {activeTab === 'home' && (
          <HomeHub 
            setActiveTab={setActiveTab} 
            userAge={userAge} 
            setUserAge={setUserAge} 
          />
        )}

        {activeTab === 'simulator' && (
          <ChatSimulator 
            userAge={userAge} 
            setUserAge={setUserAge} 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'ocr' && (
          <ScreenshotAnalyzer 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'report' && (
          <AnonymousReportWizard 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'tracker' && (
          <CaseTracker 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'assistant' && (
          <SurakshaAssistant 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'responder' && (
          <ResponderDashboard 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'graph' && (
          <SafetyGraph 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'safeschool' && (
          <SafeSchoolDashboard 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'safety' && (
          <ConversationSafety 
            setActiveTab={setActiveTab} 
          />
        )}
      </main>

      {/* Floating Emergency SOS Pill Button */}
      {activeTab !== 'report' && (
        <button
          className="btn-danger emergency-sos-floating"
          onClick={() => setActiveTab('report')}
          title="Trigger Emergency Anonymous SOS Report"
        >
          <AlertCircle size={18} />
          <span>Emergency SOS 1098</span>
        </button>
      )}

      {/* Comprehensive Footer */}
      <Footer />
    </div>
  );
}
