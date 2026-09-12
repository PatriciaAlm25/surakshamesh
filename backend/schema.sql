-- ==============================================================================
-- SURAKSHA MESH: CASES TABLE SCHEMA (INVISIBLE SOS ANONYMOUS REPORTING)
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create the Cases table
CREATE TABLE IF NOT EXISTS cases (
    -- Unique Identifiers & Timestamps
    case_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_code VARCHAR(32) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- Invisible SOS Step 1 & 2: Environment & Problem Category
    environment VARCHAR(30) DEFAULT 'Online',
    category VARCHAR(100) NOT NULL,

    -- Invisible SOS Step 3: Modus Operandi & Tactics
    tactics_observed JSONB DEFAULT '[]'::jsonb,

    -- Invisible SOS Step 4: Platform / Channel
    platform VARCHAR(100) DEFAULT 'Direct',
    platform_surface VARCHAR(100),

    -- Invisible SOS Step 5: Jurisdiction / Region
    region VARCHAR(150),
    city VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100),
    locality VARCHAR(150),

    -- Invisible SOS Step 6: Affected Person Info & Institution
    age_bracket VARCHAR(50) DEFAULT 'UNDER_14',
    affected_role VARCHAR(100),
    school_name VARCHAR(150) DEFAULT 'General / Unspecified',
    perpetrator_relationship VARCHAR(100),

    -- Invisible SOS Step 7: Raw Testimony
    report_text TEXT NOT NULL,
    language VARCHAR(50) DEFAULT 'en',

    -- Invisible SOS Step 8, 9 & 10: Evidence & Threat Signals
    evidence_type VARCHAR(50) DEFAULT 'No',
    timeframe VARCHAR(50) DEFAULT 'In the last few days',
    is_repeated BOOLEAN DEFAULT FALSE,
    immediate_danger VARCHAR(50) DEFAULT 'No',

    -- AI Safety Triage Outputs
    risk_score INTEGER DEFAULT 50 CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level VARCHAR(30) DEFAULT 'MEDIUM',
    urgency_level VARCHAR(50) DEFAULT 'P2 - Moderate Review',
    ai_summary TEXT,
    recommended_actions JSONB DEFAULT '[]'::jsonb,
    assigned_organization VARCHAR(150) DEFAULT 'Childline 1098 & Cyber Cell (1930)',

    -- Workflow Status
    status VARCHAR(50) DEFAULT 'UNDER_REVIEW'
);

-- 3. High-Performance Indexes for Search & Filtering
CREATE INDEX IF NOT EXISTS idx_cases_case_code ON cases(case_code);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_risk_level ON cases(risk_level);
CREATE INDEX IF NOT EXISTS idx_cases_school_name ON cases(school_name);
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- Allow anonymous visitors to insert new Invisible SOS reports
CREATE POLICY "Allow public insert of invisible sos cases" 
    ON cases FOR INSERT 
    WITH CHECK (true);

-- Allow reading cases (for case tracking by case_code and responder dashboard)
CREATE POLICY "Allow public select of cases" 
    ON cases FOR SELECT 
    USING (true);

-- Allow status updates by responders
CREATE POLICY "Allow public update of cases" 
    ON cases FOR UPDATE 
    USING (true)
    WITH CHECK (true);
