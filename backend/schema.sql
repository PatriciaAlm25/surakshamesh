-- SURAKSHA MESH - Supabase PostgreSQL Schema
-- Custom main table for anonymous safety reports

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Main Cases Table
CREATE TABLE IF NOT EXISTS cases (
    case_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_text TEXT NOT NULL,
    platform VARCHAR(100) DEFAULT 'Direct',
    region VARCHAR(100) DEFAULT 'General',
    school_name VARCHAR(150) DEFAULT 'General / Unspecified',
    language VARCHAR(50) DEFAULT 'en',
    age_bracket VARCHAR(50) DEFAULT 'UNDER_14',
    risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    status VARCHAR(50) DEFAULT 'UNDER_REVIEW',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Row Level Security (RLS) Policies
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- Allow public insert of anonymous reports
CREATE POLICY "Allow public insert of safety reports" 
    ON cases FOR INSERT 
    WITH CHECK (true);

-- Allow public select of safety reports
CREATE POLICY "Allow public read of cases" 
    ON cases FOR SELECT 
    USING (true);

