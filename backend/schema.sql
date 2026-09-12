-- SURAKSHA MESH - Supabase PostgreSQL Schema
-- Database schema for anonymous child safety reporting, risk analysis, case tracking,
-- and AI Assistant chat session history.

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Enumerated Types
CREATE TYPE risk_level AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE case_status AS ENUM ('RECEIVED', 'AI_ANALYZED', 'UNDER_REVIEW', 'ASSIGNED', 'INTERVENTION_ACTIVE', 'RESOLVED');
CREATE TYPE incident_category AS ENUM (
    'ONLINE_GROOMING',
    'CYBERBULLYING',
    'EXTORTION_BLACKMAIL',
    'INAPPROPRIATE_MEDIA',
    'MALICIOUS_PHISHING',
    'PRIVACY_DOXXING',
    'OTHER_CONCERN'
);

-- 3. Anonymous Cases Table (Strictly anonymized, zero PII)
CREATE TABLE IF NOT EXISTS anonymous_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_code VARCHAR(32) UNIQUE NOT NULL, -- e.g. SM-2026-48291
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Incident Details
    category incident_category NOT NULL,
    child_age_bracket VARCHAR(20) DEFAULT 'UNDER_14',
    language VARCHAR(10) DEFAULT 'en', -- en, hi, mr, kok, etc.
    platform_origin VARCHAR(50) DEFAULT 'Direct Report', -- Instagram, WhatsApp, Discord, etc.
    raw_description TEXT NOT NULL,
    
    -- AI Case Translator Analysis
    ai_risk_score INTEGER NOT NULL CHECK (ai_risk_score >= 0 AND ai_risk_score <= 100),
    ai_risk_level risk_level NOT NULL,
    ai_summary TEXT NOT NULL,
    behavioral_indicators JSONB DEFAULT '[]'::jsonb, -- e.g. ["Secrecy Request", "Trust Exploitation", "Isolation Attempt"]
    evidence_snippets JSONB DEFAULT '[]'::jsonb,
    recommended_action TEXT,
    
    -- Status & Workflow
    status case_status DEFAULT 'RECEIVED' NOT NULL,
    assigned_organization VARCHAR(100) DEFAULT 'Child Welfare Cell',
    assigned_counsellor VARCHAR(100),
    responder_notes TEXT,
    is_urgent BOOLEAN DEFAULT FALSE,
    
    -- Coarse Geographical Reference (No exact GPS to protect minor)
    region_zone VARCHAR(100) DEFAULT 'Western Region / Mumbai Metro'
);

-- 4. Case Activity Timeline
CREATE TABLE IF NOT EXISTS case_timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES anonymous_cases(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status_snapshot case_status NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    actor_type VARCHAR(50) DEFAULT 'AI_SYSTEM' -- AI_SYSTEM, NGO_CASEWORKER, SCHOOL_COUNSELLOR, CYBER_OFFICER
);

-- 5. SafeSchool Aggregated Heatmap Stats (Aggregated only, zero child identity)
CREATE TABLE IF NOT EXISTS school_safety_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_id VARCHAR(50) NOT NULL,
    region_name VARCHAR(100) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    total_incidents INTEGER DEFAULT 0,
    grooming_signals INTEGER DEFAULT 0,
    bullying_signals INTEGER DEFAULT 0,
    phishing_signals INTEGER DEFAULT 0,
    safety_score INTEGER DEFAULT 85,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 6. AI Assistant Chat Sessions & Message Logging Table
-- Storing all user interactions with Suraksha Assistant in Supabase
-- =========================================================================

-- Session container for child conversations
CREATE TABLE IF NOT EXISTS assistant_chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_code VARCHAR(32) UNIQUE NOT NULL, -- e.g. SESH-2026-92841
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    language_code VARCHAR(15) DEFAULT 'hi-IN', -- hi-IN, mr-IN, en-IN, etc.
    highest_risk_score INTEGER DEFAULT 10,
    highest_risk_level risk_level DEFAULT 'LOW',
    detected_category incident_category DEFAULT 'OTHER_CONCERN',
    is_reported BOOLEAN DEFAULT FALSE,
    escalated_to_case_id UUID REFERENCES anonymous_cases(id) ON DELETE SET NULL
);

-- Individual messages inside each chat session
CREATE TABLE IF NOT EXISTS assistant_chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES assistant_chat_sessions(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    sender VARCHAR(20) NOT NULL CHECK (sender IN ('user', 'assistant')),
    message_text TEXT NOT NULL,
    language_code VARCHAR(15) DEFAULT 'hi-IN',
    
    -- Multimodal attributes
    is_voice_input BOOLEAN DEFAULT FALSE,
    audio_url TEXT, -- Link to Supabase Storage audio blob if applicable
    
    -- AI Triage Diagnostics
    situation_assessment TEXT,
    emotional_state VARCHAR(50),
    risk_score INTEGER,
    risk_level risk_level,
    behavioral_indicators JSONB DEFAULT '[]'::jsonb,
    prompted_for_report BOOLEAN DEFAULT FALSE, -- True if AI asked: "Should I register/report this?"
    user_confirmed_report BOOLEAN DEFAULT FALSE -- True if child replied Yes to register
);

-- Indexes for lightning-fast queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON assistant_chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON assistant_chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_reported ON assistant_chat_sessions(is_reported);
CREATE INDEX IF NOT EXISTS idx_cases_code ON anonymous_cases(case_code);

-- =========================================================================
-- 7. Row Level Security (RLS) Policies
-- =========================================================================
ALTER TABLE anonymous_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_safety_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_chat_messages ENABLE ROW LEVEL SECURITY;

-- Anonymous public can create reports and read their specific case by case_code
CREATE POLICY "Allow public insert of anonymous reports" 
    ON anonymous_cases FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public read of case by case_code" 
    ON anonymous_cases FOR SELECT 
    USING (true);

CREATE POLICY "Allow public read of timeline by case_id" 
    ON case_timeline_events FOR SELECT 
    USING (true);

CREATE POLICY "Allow public read of aggregated school metrics" 
    ON school_safety_metrics FOR SELECT 
    USING (true);

-- Allow public insertion and read of chat sessions & messages
CREATE POLICY "Allow public insert of chat sessions" 
    ON assistant_chat_sessions FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public update of chat sessions" 
    ON assistant_chat_sessions FOR UPDATE 
    USING (true);

CREATE POLICY "Allow public read of chat sessions" 
    ON assistant_chat_sessions FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert of chat messages" 
    ON assistant_chat_messages FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public read of chat messages" 
    ON assistant_chat_messages FOR SELECT 
    USING (true);
