-- ====================================================================
-- MEGNI-TOO INCUBATOR: AI PORTFOLIO BUILDER & CREDENTIALING SCHEMA
-- Target Database: PostgreSQL 15+
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. USERS TABLE (Students & Administrators)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    email_hash VARCHAR(64) NOT NULL, -- SHA-256 for privacy-preserving DID claims
    full_name VARCHAR(150) NOT NULL,
    avatar_url TEXT,
    github_id VARCHAR(100) UNIQUE,
    github_username VARCHAR(100) NOT NULL,
    github_access_token TEXT, -- Encrypted at rest via pgcrypto
    did VARCHAR(120) UNIQUE NOT NULL, -- W3C DID (e.g., did:key:z6Mkp...)
    cohort VARCHAR(100) NOT NULL DEFAULT 'Batch 04 - 2026',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_github ON users(github_username);
CREATE INDEX idx_users_email_hash ON users(email_hash);
CREATE INDEX idx_users_did ON users(did);

-- 2. REPOSITORIES TABLE (Student Submitted ML Projects)
CREATE TABLE repositories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    repo_url TEXT NOT NULL,
    provider VARCHAR(20) NOT NULL DEFAULT 'github' CHECK (provider IN ('github', 'gitlab')),
    default_branch VARCHAR(100) NOT NULL DEFAULT 'main',
    commit_hash VARCHAR(40) NOT NULL, -- Exact Git commit SHA evaluated
    deployment_url TEXT NOT NULL,
    deployment_platform VARCHAR(50) NOT NULL DEFAULT 'HuggingFace',
    status VARCHAR(30) NOT NULL DEFAULT 'queued' 
        CHECK (status IN ('queued', 'analyzing', 'scored', 'issued', 'needs_improvement', 'failed')),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_repositories_user ON repositories(user_id);
CREATE INDEX idx_repositories_status ON repositories(status);

-- 3. VERIFICATIONS TABLE (Runtime & Deployment Benchmark Records)
CREATE TABLE verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    repository_id UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    deployment_url TEXT NOT NULL,
    health_endpoint VARCHAR(255) NOT NULL DEFAULT '/healthz',
    http_status INT NOT NULL,
    health_response_time_ms INT NOT NULL,
    is_healthy BOOLEAN NOT NULL DEFAULT FALSE,
    contract_method VARCHAR(10) NOT NULL DEFAULT 'POST',
    contract_path VARCHAR(255) NOT NULL DEFAULT '/predict',
    contract_request_sample JSONB NOT NULL,
    contract_response_sample JSONB NOT NULL,
    contract_schema_valid BOOLEAN NOT NULL DEFAULT FALSE,
    latency_samples_count INT NOT NULL DEFAULT 50,
    latency_p50_ms INT NOT NULL,
    latency_p95_ms INT NOT NULL,
    latency_passed BOOLEAN NOT NULL DEFAULT FALSE,
    model_tested_inputs INT NOT NULL DEFAULT 5,
    model_distinct_outputs INT NOT NULL DEFAULT 5,
    model_non_trivial BOOLEAN NOT NULL DEFAULT FALSE,
    model_variance_score NUMERIC(5, 4) NOT NULL,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_verifications_repo ON verifications(repository_id);

-- 4. SKILL SCORES & SCORECARDS TABLE
CREATE TABLE scorecards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    repository_id UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    verification_id UUID REFERENCES verifications(id),
    commit_hash VARCHAR(40) NOT NULL,
    overall_score NUMERIC(5, 2) NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    passed_threshold BOOLEAN NOT NULL DEFAULT FALSE,
    code_quality_score NUMERIC(5, 2) NOT NULL,
    ml_artifacts_score NUMERIC(5, 2) NOT NULL,
    devops_score NUMERIC(5, 2) NOT NULL,
    documentation_score NUMERIC(5, 2) NOT NULL,
    deployment_score NUMERIC(5, 2) NOT NULL,
    breakdown_json JSONB NOT NULL,
    recommendations TEXT[] DEFAULT ARRAY[]::TEXT[],
    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_scorecards_repo ON scorecards(repository_id);
CREATE INDEX idx_scorecards_threshold ON scorecards(passed_threshold);

-- 5. CREDENTIALS TABLE (W3C Verifiable Credentials)
CREATE TABLE credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    credential_urn VARCHAR(255) UNIQUE NOT NULL, -- urn:uuid:...
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    repository_id UUID NOT NULL REFERENCES repositories(id) ON DELETE RESTRICT,
    scorecard_id UUID NOT NULL REFERENCES scorecards(id) ON DELETE RESTRICT,
    issuer_did VARCHAR(120) NOT NULL,
    subject_did VARCHAR(120) NOT NULL,
    overall_score NUMERIC(5, 2) NOT NULL,
    grade VARCHAR(50) NOT NULL CHECK (grade IN ('Distinction', 'Merit', 'Pass')),
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ NOT NULL,
    jcs_sha256_digest VARCHAR(64) NOT NULL,
    ed25519_signature TEXT NOT NULL, -- PyNaCl Ed25519 signature
    signed_vc_json JSONB NOT NULL, -- Complete canonical W3C VC 2.0 payload
    transparency_log_id VARCHAR(100) NOT NULL,
    transparency_merkle_root VARCHAR(66) NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    revocation_reason TEXT,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_credentials_urn ON credentials(credential_urn);
CREATE INDEX idx_credentials_user ON credentials(user_id);
CREATE INDEX idx_credentials_revoked ON credentials(revoked);

-- 6. BADGES TABLE (Master Catalog & Earned Records)
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    criteria TEXT NOT NULL
);

CREATE TABLE user_badges (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    credential_id UUID REFERENCES credentials(id) ON DELETE SET NULL,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, badge_id)
);
