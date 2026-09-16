import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  GitBranch, 
  Server, 
  FileCode2, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Award, 
  Terminal, 
  ExternalLink, 
  Zap, 
  Layers, 
  QrCode, 
  Search, 
  RefreshCw,
  Code2,
  FileCheck,
  Activity,
  ChevronRight
} from 'lucide-react';
import { StudentProject, W3CVerifiableCredential } from '../types';

interface LandingPageProps {
  onNavigate: (tab: 'dashboard' | 'verifier' | 'employer' | 'architecture') => void;
  onOpenSubmitModal: () => void;
  onInspectProject: (project: StudentProject) => void;
  onTestDeployment: (project: StudentProject) => void;
  projects: StudentProject[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onOpenSubmitModal,
  onInspectProject,
  onTestDeployment,
  projects,
}) => {
  const featuredProject = projects[0];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 p-8 sm:p-12 lg:p-16 shadow-2xl backdrop-blur-sm">
        {/* Glow ambient background elements */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>MegniToo AI Incubator • Verifiable Credentialing Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Proof Over Paper: <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Tamper-Proof AI Portfolios
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Traditional certificates and résumés are easily embellished or faked. MegniToo automatically audits student code repositories, stress-tests deployed ML endpoints, and issues cryptographic W3C Verifiable Credentials signed with Ed25519.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              id="hero-btn-dashboard"
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-slate-950" />
              <span>Explore Student Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-btn-submit"
              onClick={onOpenSubmitModal}
              className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-700/90 text-white font-semibold text-sm rounded-xl border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Submit Repo for Audit</span>
            </button>

            <button
              id="hero-btn-employer"
              onClick={() => onNavigate('employer')}
              className="px-5 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-emerald-300 font-semibold text-sm rounded-xl border border-emerald-500/30 hover:border-emerald-500/50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Employer Verification Portal</span>
            </button>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-slate-800/80 text-left">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
              <div className="text-emerald-400 font-bold text-lg">&lt; 5 min</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Automated AST & Test Run</div>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
              <div className="text-teal-400 font-bold text-lg">W3C VC 2.0</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Ed25519 & RFC 8785 (JCS)</div>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
              <div className="text-cyan-400 font-bold text-lg">&lt; 2.0 sec</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Employer Public Verification</div>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
              <div className="text-emerald-400 font-bold text-lg">100% Tamper-Evident</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Merkle Transparency Log</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Spotlight: Authentic Verifiable Credential */}
      {featuredProject && featuredProject.credential && (
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                Cryptographic Artifact
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
                What a MegniToo Credential Looks Like
              </h2>
              <p className="text-sm text-slate-400 max-w-2xl mt-1">
                Every credential links directly to the immutable Git commit SHA, live model health check, and a cryptographic proof signed by MegniToo's Root Authority.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                id="btn-spotlight-inspect"
                onClick={() => onInspectProject(featuredProject)}
                className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Simulate Tamper Detection in Portal</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    W3C VC 2.0 • Ed25519
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    ID: {featuredProject.credential.id}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {featuredProject.title}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Holder DID: {featuredProject.credential.credentialSubject.id}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-3xl font-black text-emerald-400">
                    {featuredProject.scorecard?.overallScore}
                    <span className="text-sm font-normal text-slate-400">/100</span>
                  </div>
                  <div className="text-xs font-bold text-emerald-300">
                    GRADE: {featuredProject.credential.credentialSubject.grade}
                  </div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Credential Attributes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-1">
                <div className="text-slate-400 font-medium flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Audited Git Commit</span>
                </div>
                <div className="font-mono text-white text-xs font-semibold truncate">
                  {featuredProject.credential.credentialSubject.commitHash}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {featuredProject.repoUrl}
                </div>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-1">
                <div className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-teal-400" />
                  <span>Verified Live Deployment</span>
                </div>
                <div className="font-mono text-emerald-300 text-xs font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>200 OK • p95: 242ms</span>
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {featuredProject.deploymentUrl}
                </div>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-1">
                <div className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Cryptographic Proof</span>
                </div>
                <div className="font-mono text-slate-300 text-[11px] truncate">
                  Method: {featuredProject.credential.proof.verificationMethod.slice(0, 28)}...
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Ed25519Signature2020 Valid</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Issuer: MegniToo Root Key Authority (did:key:z6MkuT9qV4eWq...)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onTestDeployment(featuredProject)}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Run Live Stress Test</span>
                </button>
                <span>•</span>
                <button
                  onClick={() => onInspectProject(featuredProject)}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer font-medium text-emerald-400"
                >
                  <span>Verify in Employer Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* The 3 Pillars / How It Works */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/30">
            Automated Pipeline
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            How MegniToo Verifies AI Engineering Competence
          </h2>
          <p className="text-sm text-slate-400">
            Our autonomous evaluation cluster eliminates human bias, take-home test grading delays, and resume inflation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all rounded-2xl p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Code2 className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-emerald-400 font-semibold">STAGE 01</div>
              <h3 className="text-lg font-bold text-white">
                AST & Repository Static Analysis
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Python <code className="text-emerald-300 font-mono">ast.NodeVisitor</code> inspects type annotations, docstrings, function complexity, pytest coverage harnesses, multi-stage Dockerfiles, and GitHub Actions CI/CD workflows.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1 font-mono">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Pydantic & Type Coverage</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Pytest Execution Harnesses</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Multi-stage Dockerfile Audit</span>
              </div>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all rounded-2xl p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center">
                <Server className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-teal-400 font-semibold">STAGE 02</div>
              <h3 className="text-lg font-bold text-white">
                Live Deployment Benchmarking
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Async <code className="text-teal-300 font-mono">httpx</code> test runners fire health probes, contract tests, and a 50-request latency quantile suite. We send distinct prompts to verify model output entropy and prove inference is dynamic.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1 font-mono">
              <div className="flex items-center gap-1.5 text-teal-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>p50 & p95 Latency &lt; 500ms</span>
              </div>
              <div className="flex items-center gap-1.5 text-teal-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>OpenAPI Response Contract Test</span>
              </div>
              <div className="flex items-center gap-1.5 text-teal-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Model Sanity & Variance Check</span>
              </div>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all rounded-2xl p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-cyan-400 font-semibold">STAGE 03</div>
              <h3 className="text-lg font-bold text-white">
                W3C VC 2.0 & Ed25519 Signing
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                If the candidate scores ≥70% overall with no category &lt;50%, the backend canonicalizes the scorecard via RFC 8785 (JCS) and signs it using PyNaCl Ed25519, anchoring the commitment to an immutable transparency log.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1 font-mono">
              <div className="flex items-center gap-1.5 text-cyan-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>RFC 8785 Canonical JSON (JCS)</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Ed25519 Cryptographic Proof</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>StatusList2021 Revocation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 5-Part Evaluation Rubric */}
      <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              Accreditation Standard
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
              The MegniToo 5-Part Scoring Rubric
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              To guarantee high engineering standards, a credential is only issued if the project achieves an overall score ≥ 70/100 and no individual category scores below 50%.
            </p>
          </div>
          <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 shrink-0">
            <span className="text-emerald-400 font-bold">Pass Standard:</span> Overall ≥ 70% &amp; Min(Cat) ≥ 50%
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">Code Quality</span>
              <span className="text-emerald-400 font-mono font-bold">25%</span>
            </div>
            <div className="text-[11px] text-slate-400 leading-normal">
              Type annotations, flake8/ruff linting compliance, function cyclomatic complexity, and pytest harness coverage.
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">ML/AI Artifacts</span>
              <span className="text-emerald-400 font-mono font-bold">30%</span>
            </div>
            <div className="text-[11px] text-slate-400 leading-normal">
              Model training pipeline scripts, evaluation metric tracking (F1/loss/BLEU), data preprocessing, and dataset lineage.
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">DevOps Practices</span>
              <span className="text-emerald-400 font-mono font-bold">20%</span>
            </div>
            <div className="text-[11px] text-slate-400 leading-normal">
              Multi-stage Dockerfiles, slim base images, non-root user execution, and GitHub Actions CI/CD workflows.
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">Documentation</span>
              <span className="text-emerald-400 font-mono font-bold">15%</span>
            </div>
            <div className="text-[11px] text-slate-400 leading-normal">
              Comprehensive README.md, architecture diagrams, environment setup guides, and clear API schema specs.
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">Live Deployment</span>
              <span className="text-emerald-400 font-mono font-bold">10%</span>
            </div>
            <div className="text-[11px] text-slate-400 leading-normal">
              Live HTTP 200 health check, contract schema validation, sub-500ms p95 latency, and model inference sanity.
            </div>
          </div>
        </div>
      </section>

      {/* Dual Value: For Candidates vs. For Employers */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Candidate Card */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">For MegniToo Graduates</h3>
              <p className="text-xs text-slate-400">Turn hours of coding into verifiable hiring currency</p>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Indisputable Proof:</strong> Your credential is cryptographically anchored to your actual Git commit hash and live deployment URL.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Portable W3C Identity:</strong> Own your decentralized ID (<code className="text-emerald-300 font-mono">did:key</code>) and share badges on LinkedIn, your portfolio, or directly in job applications.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Actionable Diagnostic Feedback:</strong> If your project falls below 70%, the automated evaluator provides clear remediation recommendations.</span>
            </li>
          </ul>

          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Open Student Dashboard</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Employer Card */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">For Engineering Leaders &amp; Recruiters</h3>
              <p className="text-xs text-slate-400">Skip trivial take-home tests and hire with confidence</p>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span><strong>Instant Offline Verification:</strong> Verify the candidate's Ed25519 signature in &lt;2 seconds using our open-source verifier or any standard W3C tool.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span><strong>Zero Hallucinated Experience:</strong> Review audited static code metrics, p95 latency percentiles, and live model endpoint responses.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span><strong>Instant Tamper Detection:</strong> If a candidate alters a single character in their scorecard or grade, the cryptographic signature fails immediately.</span>
            </li>
          </ul>

          <button
            onClick={() => onNavigate('employer')}
            className="w-full py-3 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Verify a Graduate Credential</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Cohort Evaluated Repositories Preview */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              Live Showcase
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">
              Sample Accredited AI Projects
            </h2>
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-xs font-medium text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>View All Cohort Projects</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((project) => (
            <div
              key={project.id}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all rounded-2xl p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    {project.category}
                  </span>
                  <div className="text-xs font-bold text-emerald-400 font-mono">
                    Score: {project.scorecard?.overallScore}/100
                  </div>
                </div>

                <h3 className="font-bold text-sm text-white line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-slate-500">
                    Commit: {project.scorecard?.commitHash.slice(0, 8)}...
                  </span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>W3C Verified</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onInspectProject(project)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>Verify VC</span>
                  </button>
                  <button
                    onClick={() => onTestDeployment(project)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Server className="w-3 h-3" />
                    <span>Test API</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Bottom CTA */}
      <section className="bg-gradient-to-r from-emerald-950/50 via-slate-900/80 to-teal-950/50 border border-emerald-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready to Build Your Tamper-Proof Portfolio?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Submit your GitHub or GitLab repository and live model endpoint. Receive your comprehensive evaluation scorecard and signed W3C Verifiable Credential in under five minutes.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenSubmitModal}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Submit Your Repository</span>
          </button>
          <button
            onClick={() => onNavigate('architecture')}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Review System Architecture &amp; DDL</span>
          </button>
        </div>
      </section>
    </div>
  );
};
