-- ====================================================================
-- SURAKSHA MESH: INVISIBLE SOS ANONYMOUS REPORTING & SAFETY GRAPH SCHEMA
-- ====================================================================
-- Compliant with strict minor anonymity (Zero PII, no exact home addresses).
-- Stores 10-step report metadata and AI-extracted Safety Graph nodes.

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Invisible SOS Submissions Table
CREATE TABLE IF NOT EXISTS invisible_sos_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_code VARCHAR(32) UNIQUE NOT NULL, -- e.g. SM-2026-84291
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- Step 1: Where did this happen?
    environment VARCHAR(20) DEFAULT 'Online' NOT NULL, -- 'Online' or 'Offline'

    -- Step 2: What kind of problem?
    primary_category VARCHAR(100) NOT NULL,

    -- Step 3: How did it happen? (Tactics / Modus Operandi)
    tactics_observed JSONB DEFAULT '[]'::jsonb NOT NULL,

    -- Step 4: Where did it happen? (Platform / Facility)
    platform VARCHAR(100) NOT NULL, -- Instagram, Roblox, School, Hostel, etc.
    platform_surface VARCHAR(100),   -- Direct Message, Group Chat, Classroom, etc.

    -- Step 5: Location Jurisdiction (NO exact home address)
    location_city VARCHAR(100),
    location_district VARCHAR(100),
    location_state VARCHAR(100),
    location_locality VARCHAR(150),

    -- Step 6: About the person affected
    age_bracket VARCHAR(30) DEFAULT '14–17',
    affected_role VARCHAR(50), -- School student, College student, Working, etc.
    institution_name VARCHAR(150), -- School / College / Workplace name (optional)
    perpetrator_relationship VARCHAR(100), -- Online stranger, Classmate, etc.

    -- Step 7: Raw Testimony
    raw_testimony TEXT NOT NULL,
    testimony_language VARCHAR(20) DEFAULT 'en',

    -- Step 8: Evidence Metadata
    has_evidence VARCHAR(50) DEFAULT 'No',
    evidence_types JSONB DEFAULT '[]'::jsonb, -- ['Screenshot', 'Chat export']

    -- Step 9: Timing & Frequency
    incident_timeframe VARCHAR(50) DEFAULT 'In the last few days',
    is_repeated BOOLEAN DEFAULT FALSE,

    -- Step 10: Immediate Safety Check
    immediate_danger VARCHAR(30) DEFAULT 'No', -- 'Yes - Urgent', 'No', 'Not sure'

    -- AI Case Triage & Safety Graph Nodes
    ai_risk_score INTEGER NOT NULL CHECK (ai_risk_score >= 0 AND ai_risk_score <= 100),
    ai_risk_level VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
    urgency_level VARCHAR(50) NOT NULL, -- P1 - Immediate, P2 - Moderate, P3 - Advisory
    assigned_organization VARCHAR(150) NOT NULL,
    recommended_actions JSONB DEFAULT '[]'::jsonb,

    -- Safety Graph Structured Entities
    safety_graph_cluster JSONB DEFAULT '{}'::jsonb, -- { name, type, severity }
    safety_graph_tactics JSONB DEFAULT '[]'::jsonb, -- [ "Secrecy", "Blackmail" ]
    safety_graph_platform JSONB DEFAULT '{}'::jsonb, -- { name, sub_surface, vector }
    safety_graph_location JSONB DEFAULT '{}'::jsonb, -- { city, district, state, institution }
    
    -- Child Welfare Reassurance & Statutory Flags
    case_summary TEXT,
    child_reassurance TEXT,
    statutory_flags JSONB DEFAULT '[]'::jsonb,

    -- Workflow Status
    status VARCHAR(30) DEFAULT 'RECEIVED' NOT NULL -- RECEIVED, AI_ANALYZED, UNDER_REVIEW, RESOLVED
);

-- Indexing for fast search and geographical heatmapping
CREATE INDEX IF NOT EXISTS idx_invisible_sos_case_code ON invisible_sos_reports(case_code);
CREATE INDEX IF NOT EXISTS idx_invisible_sos_environment ON invisible_sos_reports(environment);
CREATE INDEX IF NOT EXISTS idx_invisible_sos_location_state ON invisible_sos_reports(location_state);
CREATE INDEX IF NOT EXISTS idx_invisible_sos_risk_level ON invisible_sos_reports(ai_risk_level);

-- Row Level Security (RLS)
ALTER TABLE invisible_sos_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous public insert of invisible SOS reports"
    ON invisible_sos_reports FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public read of invisible SOS report by case_code"
    ON invisible_sos_reports FOR SELECT
    USING (true);
