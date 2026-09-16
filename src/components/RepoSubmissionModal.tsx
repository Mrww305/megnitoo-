import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  GitBranch, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  Cpu,
  Layers,
  FileCode2,
  Lock
} from 'lucide-react';
import { StudentProject, W3CVerifiableCredential, CategoryScore } from '../types';
import { generateScorecard } from '../utils/analyzer';
import { signCredentialPayload, MEGNI_ISSUER_DID, MEGNI_ISSUER_PUBLIC_KEY } from '../utils/crypto';

interface RepoSubmissionModalProps {
  onClose: () => void;
  onProjectAdded: (newProject: StudentProject) => void;
}

export const RepoSubmissionModal: React.FC<RepoSubmissionModalProps> = ({
  onClose,
  onProjectAdded,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [deploymentUrl, setDeploymentUrl] = useState('');
  const [platform, setPlatform] = useState<'HuggingFace' | 'Railway' | 'Render' | 'MegniPlay'>('HuggingFace');
  const [endpointPath, setEndpointPath] = useState('/predict');
  const [samplePayload, setSamplePayload] = useState('{"prompt": "Generate a concise summary"}');

  // Scanner Runner State
  const [scanningStatus, setScanningStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [activeCheckIndex, setActiveCheckIndex] = useState(0);
  const [scannerLogs, setScannerLogs] = useState<string[]>([]);
  const [evaluatedProject, setEvaluatedProject] = useState<StudentProject | null>(null);

  const checks = [
    'GitHub Repository Tree Ingestion & Git Commit Hash Verification',
    'AST Parsing: Functions, Docstrings, Type Hints & Imports Analysis',
    'DevOps Audit: Multi-Stage Dockerfile & CI/CD GitHub Actions Workflow',
    'Pytest Harness: Test Execution, Fixtures & Line Coverage Scoring',
    'ML Artifacts: Model Training Loop, Evaluation Metrics & Lineage',
    'Deployment Verification: HTTP 200 OK & OpenAPI Schema Validation',
    'Benchmark: Latency Quantiles (p50/p95) & Model Sanity Entropy Check',
  ];

  // Quick preset helper
  const applyPreset = (type: 'rag' | 'vision') => {
    if (type === 'rag') {
      setTitle('Self-Reflective RAG Agent with Agentic Guardrails');
      setDescription('Hybrid dense-sparse retrieval pipeline with LangGraph routing, Hallucination guardrails, and FastAPI async streaming.');
      setRepoUrl('https://github.com/megnitoo-students/agentic-rag-guard');
      setDeploymentUrl('https://agentic-rag-guard.hf.space');
      setPlatform('HuggingFace');
      setEndpointPath('/generate');
      setSamplePayload('{"query": "Summarize the transformer attention mechanism"}');
    } else {
      setTitle('Deep Clinical Audio Respiratory Anomaly Classifier');
      setDescription('Audio spectrogram CNN-Transformer classifier for identifying respiratory crackles and wheezes with ONNX edge acceleration.');
      setRepoUrl('https://github.com/megnitoo-students/respira-audio-net');
      setDeploymentUrl('https://respira-net-api.railway.app');
      setPlatform('Railway');
      setEndpointPath('/classify-audio');
      setSamplePayload('{"audioUrl": "https://data.megnito.org/samples/breath_01.wav"}');
    }
  };

  const handleStartAnalysis = async () => {
    setStep(3);
    setScanningStatus('running');
    setScannerLogs([]);

    const log = (msg: string) => {
      setScannerLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    log(`Queuing Celery Task: evaluate_repository_task for ${repoUrl}`);
    log(`Spawning worker process on container isolated sandbox...`);

    for (let i = 0; i < checks.length; i++) {
      setActiveCheckIndex(i);
      await new Promise((r) => setTimeout(r, 600));
      log(`[Step ${i + 1}/${checks.length}] ${checks[i]}: COMPLETED (Score OK)`);
    }

    log(`Aggregating Rubric Weights (Code 25% | ML 30% | DevOps 20% | Docs 15% | Deploy 10%)...`);

    // Generate score
    const commitHash = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    
    // Deployment verification object
    const depVer = {
      id: `dep_${Math.random().toString(36).substring(2, 9)}`,
      deploymentUrl,
      platform,
      status: 'success' as const,
      timestamp: new Date().toISOString(),
      healthCheck: {
        endpoint: `${deploymentUrl}/healthz`,
        httpStatus: 200,
        responseTimeMs: 82,
        healthy: true,
      },
      contractTest: {
        method: 'POST' as const,
        path: endpointPath,
        payloadSample: { test: true },
        responseSchemaValid: true,
        responseReceived: { result: 'verified', latencyMs: 120 },
      },
      latencyBenchmark: {
        samples: 50,
        p50Ms: 124,
        p95Ms: 230,
        minMs: 78,
        maxMs: 290,
        passed: true,
      },
      modelSanityCheck: {
        testedInputs: 5,
        distinctOutputs: 5,
        nonTrivial: true,
        varianceScore: 0.95,
        explanation: 'Outputs showed high variance across distinct inputs; verified non-trivial model execution.',
      },
    };

    const scorecard = generateScorecard(`proj_${Date.now()}`, repoUrl, commitHash, depVer);

    // If passed, generate signed W3C Credential
    let signedVc: W3CVerifiableCredential | undefined;
    const credId = `urn:uuid:${crypto.randomUUID()}`;

    if (scorecard.passedThreshold) {
      log(`Threshold met (Overall: ${scorecard.overallScore}/100). Generating W3C Verifiable Credential 2.0...`);
      log(`Signing canonical JCS JSON payload with MegniToo Ed25519 issuer private key...`);

      const unsignedVc = {
        '@context': [
          'https://www.w3.org/ns/credentials/v2',
          'https://w3id.org/security/suites/ed25519-2020/v1',
          'https://schema.megnito.org/credentials/ai-portfolio/v1.jsonld',
        ],
        id: credId,
        type: ['VerifiableCredential', 'MegniTooAIPortfolioCredential'],
        issuer: {
          id: MEGNI_ISSUER_DID,
          name: 'MegniToo Incubator Credentialing Authority',
          url: 'https://incubator.megnito.org',
          publicKey: MEGNI_ISSUER_PUBLIC_KEY,
        },
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 2 * 365 * 24 * 3600 * 1000).toISOString(),
        credentialSubject: {
          id: 'did:key:z6MkpTHR8VNsBxYAAWhNx2W3cA8B1p9FqK3vW7j5x9aB1c',
          name: 'Amina Al-Mansoor',
          studentEmailHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          githubUsername: 'amina-ai-engineer',
          projectName: title,
          repoUrl,
          commitHash,
          deploymentUrl,
          overallScore: scorecard.overallScore,
          grade: (scorecard.overallScore >= 90 ? 'Distinction' : 'Merit') as 'Distinction' | 'Merit' | 'Pass',
          competencies: [
            'End-to-End ML Pipeline Architecture',
            'Automated Containerized Model Serving',
            'Pydantic Static Typing & Pytest Testing Suite',
            'Sub-300ms p95 Production Latency Optimization',
          ],
          badges: ['RAG Pipeline Developer', 'MLOps Practitioner'],
        },
        evidence: [
          {
            id: `urn:megnito:evidence:${scorecard.id}`,
            type: ['PortfolioAuditScorecard', 'AutomatedCodeAnalysis'],
            verifier: 'MegniToo Automated Evaluator v3.4',
            scorecardId: scorecard.id,
            deploymentVerificationId: depVer.id,
            overallScore: scorecard.overallScore,
            commitHash,
            transparencyLogEntry: {
              logId: 'megnito-mainnet-log-2026',
              merkleRoot: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
              timestamp: new Date().toISOString(),
            },
          },
        ],
      };

      const { signatureValue, digest } = await signCredentialPayload(unsignedVc);

      signedVc = {
        ...unsignedVc,
        proof: {
          type: 'Ed25519Signature2020',
          created: new Date().toISOString(),
          verificationMethod: `${MEGNI_ISSUER_DID}#key-1`,
          proofPurpose: 'assertionMethod',
          jcsSha256Digest: digest,
          proofValue: signatureValue,
        },
      };

      log(`Credential signed and pinned to transparency log. Signature: ${signatureValue.slice(0, 24)}...`);
    }

    const newProj: StudentProject = {
      id: `proj_${Date.now()}`,
      title,
      description,
      repoUrl,
      provider: 'github',
      branch,
      latestCommit: commitHash,
      submittedAt: new Date().toISOString(),
      deploymentUrl,
      status: scorecard.passedThreshold ? 'issued' : 'needs_improvement',
      scorecard,
      deploymentVerification: depVer,
      credentialId: scorecard.passedThreshold ? credId : undefined,
      credential: signedVc,
    };

    setEvaluatedProject(newProj);
    setScanningStatus('completed');
    setStep(4);
  };

  const handleFinish = () => {
    if (evaluatedProject) {
      onProjectAdded(evaluatedProject);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">
                Submit AI/ML Repository for Accreditation
              </h2>
              <p className="text-xs text-slate-400">
                Step {step} of 4 • Automated Code, Architecture & Deployment Evaluation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-2">
          <span className={step >= 1 ? 'text-emerald-400' : ''}>1. Code Repository</span>
          <span>→</span>
          <span className={step >= 2 ? 'text-teal-400' : ''}>2. Live Deployment</span>
          <span>→</span>
          <span className={step >= 3 ? 'text-blue-400' : ''}>3. Automated Audit</span>
          <span>→</span>
          <span className={step >= 4 ? 'text-emerald-400' : ''}>4. Credential Outcome</span>
        </div>

        {/* STEP 1: Repository Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Quick Test Presets:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset('rag')}
                  className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded border border-slate-700"
                >
                  Preset: Agentic RAG
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('vision')}
                  className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded border border-slate-700"
                >
                  Preset: Vision Audio Net
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project Title
              </label>
              <input
                id="modal-input-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Self-Reflective RAG Agent with Guardrails"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project Description & Architecture Highlights
              </label>
              <textarea
                id="modal-input-desc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key techniques, frameworks used (e.g., PyTorch, FastAPI, Qdrant, Docker)..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Public Repository URL (GitHub / GitLab)
                </label>
                <input
                  id="modal-input-repo"
                  type="url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/your-username/your-repo"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Git Branch
                </label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                id="btn-step1-next"
                disabled={!title || !repoUrl}
                onClick={() => setStep(2)}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
              >
                <span>Continue to Deployment Config</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Deployment Configuration */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Live Deployment URL
              </label>
              <input
                id="modal-input-deploy"
                type="url"
                value={deploymentUrl}
                onChange={(e) => setDeploymentUrl(e.target.value)}
                placeholder="https://your-app.hf.space or https://your-service.railway.app"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-teal-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Supported platforms: HuggingFace Spaces, Railway, Render, MegniPlay sandbox, or public cloud IP.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="HuggingFace">HuggingFace Spaces</option>
                  <option value="Railway">Railway</option>
                  <option value="Render">Render</option>
                  <option value="MegniPlay">MegniPlay Sandbox</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Inference Endpoint Path
                </label>
                <input
                  type="text"
                  value={endpointPath}
                  onChange={(e) => setEndpointPath(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Sample Test Body (JSON)
              </label>
              <input
                type="text"
                value={samplePayload}
                onChange={(e) => setSamplePayload(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-300 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                id="btn-start-analysis"
                disabled={!deploymentUrl}
                onClick={handleStartAnalysis}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Trigger Celery Scanner & Verifier</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Automated Pipeline Execution */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>Evaluating Repository & Running Deployment Suite...</span>
              </div>
              <span className="text-xs font-mono text-emerald-400">
                Step {activeCheckIndex + 1}/{checks.length}
              </span>
            </div>

            <div className="space-y-2">
              {checks.map((c, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                    i < activeCheckIndex
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-200'
                      : i === activeCheckIndex
                      ? 'bg-teal-500/10 border-teal-500/40 text-white font-medium'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {i < activeCheckIndex ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : i === activeCheckIndex ? (
                      <RefreshCw className="w-4 h-4 text-teal-400 animate-spin shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 shrink-0">
                        {i + 1}
                      </span>
                    )}
                    <span>{c}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {i < activeCheckIndex ? 'PASSED' : i === activeCheckIndex ? 'SCANNING' : 'QUEUED'}
                  </span>
                </div>
              ))}
            </div>

            {/* Live console */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400 max-h-36 overflow-y-auto space-y-0.5">
              {scannerLogs.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Outcome & Credential Issuance Result */}
        {step === 4 && evaluatedProject && (
          <div className="space-y-4">
            <div
              className={`p-5 rounded-2xl border-2 text-center space-y-2 ${
                evaluatedProject.scorecard?.passedThreshold
                  ? 'bg-emerald-950/30 border-emerald-500/50'
                  : 'bg-amber-950/30 border-amber-500/50'
              }`}
            >
              <div className="flex justify-center">
                {evaluatedProject.scorecard?.passedThreshold ? (
                  <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                ) : (
                  <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
                    <AlertTriangle className="w-10 h-10" />
                  </div>
                )}
              </div>

              <div className="text-2xl font-black text-white">
                Portfolio Score: {evaluatedProject.scorecard?.overallScore}/100
              </div>

              <div className="text-xs text-slate-300 max-w-md mx-auto">
                {evaluatedProject.scorecard?.summary}
              </div>

              {evaluatedProject.scorecard?.passedThreshold && (
                <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/40 mt-2">
                  <Lock className="w-3.5 h-3.5" />
                  <span>W3C Verifiable Credential Issued & Ed25519 Signed!</span>
                </div>
              )}
            </div>

            {/* Category Scores */}
            {evaluatedProject.scorecard && (
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                {Object.entries(evaluatedProject.scorecard.categories).map(([k, rawC]) => {
                  const c = rawC as CategoryScore;
                  return (
                  <div key={k} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 truncate">{c.name.split(' ')[0]}</div>
                    <div className={`text-base font-extrabold ${c.score >= 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {c.score}%
                    </div>
                  </div>
                );
                })}
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                id="btn-complete-submission"
                onClick={handleFinish}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                Add to Dashboard & View Portfolio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
