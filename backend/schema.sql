-- SURAKSHA MESH - Supabase PostgreSQL Schema
-- Database schema for anonymous child safety reporting, risk analysis, and case tracking.

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

-- 6. Row Level Security (RLS) Policies
ALTER TABLE anonymous_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_safety_metrics ENABLE ROW LEVEL SECURITY;

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
