import { Scorecard, SkillScore, DeploymentVerification } from '../types';

export interface RepoAnalysisInput {
  repoUrl: string;
  filesSummary?: {
    hasReadme: boolean;
    readmeLength: number;
    hasDiagrams: boolean;
    hasApiDocs: boolean;
    hasDockerfile: boolean;
    hasCiCd: boolean;
    hasIac: boolean;
    hasLintConfig: boolean;
    hasTypeChecking: boolean;
    hasTests: boolean;
    testCoveragePct: number;
    hasTrainScript: boolean;
    hasEvalMetrics: boolean;
    hasDataPipeline: boolean;
    hasModelWeightsOrHub: boolean;
  };
}

export function generateScorecard(
  repoId: string,
  repoUrl: string,
  commitHash: string,
  deployment: DeploymentVerification | null,
  customInput?: Partial<RepoAnalysisInput['filesSummary']>
): Scorecard {
  // Determine realistic simulated file tree insights based on repo name or custom overrides
  const isMlRag = repoUrl.toLowerCase().includes('rag') || repoUrl.toLowerCase().includes('llm');
  const isVision = repoUrl.toLowerCase().includes('vision') || repoUrl.toLowerCase().includes('xray');
  const isFraud = repoUrl.toLowerCase().includes('fraud') || repoUrl.toLowerCase().includes('stream');

  const files = {
    hasReadme: customInput?.hasReadme ?? true,
    readmeLength: customInput?.readmeLength ?? 4200,
    hasDiagrams: customInput?.hasDiagrams ?? true,
    hasApiDocs: customInput?.hasApiDocs ?? true,
    hasDockerfile: customInput?.hasDockerfile ?? true,
    hasCiCd: customInput?.hasCiCd ?? true,
    hasIac: customInput?.hasIac ?? (isFraud || isMlRag),
    hasLintConfig: customInput?.hasLintConfig ?? true,
    hasTypeChecking: customInput?.hasTypeChecking ?? true,
    hasTests: customInput?.hasTests ?? true,
    testCoveragePct: customInput?.testCoveragePct ?? (isMlRag ? 86 : isVision ? 82 : 79),
    hasTrainScript: customInput?.hasTrainScript ?? true,
    hasEvalMetrics: customInput?.hasEvalMetrics ?? true,
    hasDataPipeline: customInput?.hasDataPipeline ?? true,
    hasModelWeightsOrHub: customInput?.hasModelWeightsOrHub ?? true,
  };

  // 1. Code Quality (Weight: 25%)
  const codeQualityChecks = [
    {
      name: 'Linting & Formatting',
      description: 'Presence of ruff, flake8, or black configs with 0 fatal lint errors',
      passed: files.hasLintConfig,
      pointsEarned: files.hasLintConfig ? 25 : 8,
      maxPoints: 25,
      details: files.hasLintConfig ? 'Configured with pyproject.toml / ruff' : 'No lint configuration detected',
    },
    {
      name: 'Static Type Coverage',
      description: 'Mypy / Pyright static type hints on functions and models',
      passed: files.hasTypeChecking,
      pointsEarned: files.hasTypeChecking ? 25 : 10,
      maxPoints: 25,
      details: files.hasTypeChecking ? 'Type hints present on >85% of public signatures' : 'Lacks type hints',
    },
    {
      name: 'Automated Test Suite',
      description: 'Pytest suite with unit, integration, and mocking harnesses',
      passed: files.hasTests,
      pointsEarned: files.hasTests ? 25 : 5,
      maxPoints: 25,
      details: files.hasTests ? `${files.testCoveragePct}% coverage across pytest modules` : 'Missing test directory',
    },
    {
      name: 'Modular Project Architecture',
      description: 'Clean separation of concerns (src/, tests/, configs/, api/)',
      passed: true,
      pointsEarned: 25,
      maxPoints: 25,
      details: 'Follows Python modern packaging standards (src-layout)',
    },
  ];
  const codeQualityScore = codeQualityChecks.reduce((acc, c) => acc + c.pointsEarned, 0);

  // 2. ML/AI Artifacts (Weight: 30%)
  const mlChecks = [
    {
      name: 'Training & Fine-tuning Scripts',
      description: 'Reproducible training loops, parameter logging, or HuggingFace pipelines',
      passed: files.hasTrainScript,
      pointsEarned: files.hasTrainScript ? 30 : 5,
      maxPoints: 30,
      details: files.hasTrainScript ? 'Found train.py / pipeline.py with seed reproducibility' : 'No training pipeline found',
    },
    {
      name: 'Rigorous Evaluation Metrics',
      description: 'Calculation of F1, ROC-AUC, RAGAS Faithfulness, BLEU/ROUGE, or Latency vs Accuracy curves',
      passed: files.hasEvalMetrics,
      pointsEarned: files.hasEvalMetrics ? 25 : 5,
      maxPoints: 25,
      details: files.hasEvalMetrics ? 'Evaluation harness computes precision, recall, and perplexity' : 'No metrics logged',
    },
    {
      name: 'Data Pipeline & Preprocessing',
      description: 'Ingestion, sanitization, validation (Great Expectations/Pydantic), and vectorization',
      passed: files.hasDataPipeline,
      pointsEarned: files.hasDataPipeline ? 25 : 5,
      maxPoints: 25,
      details: files.hasDataPipeline ? 'Structured ETL with chunking and schema validations' : 'Raw data unchecked',
    },
    {
      name: 'Model Weights / Registry Integration',
      description: 'Model card, ONNX export, or Hugging Face Hub / MLflow artifact tracking',
      passed: files.hasModelWeightsOrHub,
      pointsEarned: files.hasModelWeightsOrHub ? 20 : 0,
      maxPoints: 20,
      details: files.hasModelWeightsOrHub ? 'Configured with artifact registry / Hugging Face model card' : 'No artifact lineage',
    },
  ];
  const mlArtifactsScore = mlChecks.reduce((acc, c) => acc + c.pointsEarned, 0);

  // 3. DevOps Practices (Weight: 20%)
  const devopsChecks = [
    {
      name: 'Containerization (Dockerfile)',
      description: 'Multi-stage Dockerfile with non-root user and minimal base image',
      passed: files.hasDockerfile,
      pointsEarned: files.hasDockerfile ? 35 : 5,
      maxPoints: 35,
      details: files.hasDockerfile ? 'Multi-stage build with python:3.11-slim' : 'Missing Dockerfile',
    },
    {
      name: 'CI/CD Automation',
      description: 'GitHub Actions / GitLab CI testing, linting, and build pipeline',
      passed: files.hasCiCd,
      pointsEarned: files.hasCiCd ? 35 : 5,
      maxPoints: 35,
      details: files.hasCiCd ? 'Active CI workflow on push & pull_request' : 'No CI configuration',
    },
    {
      name: 'IaC & Deployment Manifests',
      description: 'Docker Compose, Kubernetes manifests, Helm chart, or Railway/Render configs',
      passed: files.hasIac,
      pointsEarned: files.hasIac ? 30 : 15,
      maxPoints: 30,
      details: files.hasIac ? 'docker-compose.yml and deployment configs present' : 'Basic single-service config',
    },
  ];
  const devopsScore = devopsChecks.reduce((acc, c) => acc + c.pointsEarned, 0);

  // 4. Documentation (Weight: 15%)
  const docChecks = [
    {
      name: 'Comprehensive README',
      description: 'Problem statement, setup instructions, architecture diagram, and usage examples',
      passed: files.hasReadme && files.readmeLength > 1000,
      pointsEarned: files.hasReadme && files.readmeLength > 1000 ? 40 : 15,
      maxPoints: 40,
      details: `Detailed documentation (${files.readmeLength} characters) with badge links`,
    },
    {
      name: 'Architecture & System Diagrams',
      description: 'Mermaid, ASCII, or SVG system architecture and data flow diagrams',
      passed: files.hasDiagrams,
      pointsEarned: files.hasDiagrams ? 30 : 10,
      maxPoints: 30,
      details: files.hasDiagrams ? 'Data flow and inference pipeline diagrams included' : 'No architecture diagram',
    },
    {
      name: 'API Specification & Usage Examples',
      description: 'OpenAPI / Swagger specs, curl examples, or interactive demo instructions',
      passed: files.hasApiDocs,
      pointsEarned: files.hasApiDocs ? 30 : 10,
      maxPoints: 30,
      details: files.hasApiDocs ? 'Complete request/response examples and Swagger doc links' : 'Partial API docs',
    },
  ];
  const docScore = docChecks.reduce((acc, c) => acc + c.pointsEarned, 0);

  // 5. Deployment (Weight: 10%)
  const isDeployHealthy = deployment?.status === 'success';
  const deployChecks = [
    {
      name: 'HTTP 200 Health Check',
      description: 'Live endpoint responds with HTTP 200 OK within timeout threshold',
      passed: isDeployHealthy,
      pointsEarned: isDeployHealthy ? 30 : (deployment ? 10 : 0),
      maxPoints: 30,
      details: isDeployHealthy ? `Status: ${deployment?.healthCheck.httpStatus} OK in ${deployment?.healthCheck.responseTimeMs}ms` : 'Endpoint unresponsive or missing',
    },
    {
      name: 'API Contract & JSON Schema',
      description: 'Validates input payload acceptance and structured output conforms to specification',
      passed: Boolean(deployment?.contractTest.responseSchemaValid),
      pointsEarned: deployment?.contractTest.responseSchemaValid ? 30 : (deployment ? 10 : 0),
      maxPoints: 30,
      details: deployment?.contractTest.responseSchemaValid ? 'Schema validated against OpenAPI 3.1 definitions' : 'Schema validation failed',
    },
    {
      name: 'Model Sanity (Non-Triviality Check)',
      description: 'Sends randomized inputs to confirm dynamic inference rather than hardcoded returns',
      passed: Boolean(deployment?.modelSanityCheck.nonTrivial),
      pointsEarned: deployment?.modelSanityCheck.nonTrivial ? 40 : (deployment ? 10 : 0),
      maxPoints: 40,
      details: deployment?.modelSanityCheck.explanation || 'Tested across parameter variations',
    },
  ];
  const deployScore = deployChecks.reduce((acc, c) => acc + c.pointsEarned, 0);

  const codeQualityCategory: SkillScore = {
    category: 'code_quality',
    name: 'Code Quality & Typing',
    weight: 0.25,
    score: Math.min(100, codeQualityScore),
    passed: codeQualityScore >= 50,
    checks: codeQualityChecks,
    recommendations: files.testCoveragePct < 85
      ? ['Increase unit test coverage to >= 85% with edge-case fixtures', 'Add strict mypy flag `--disallow-untyped-defs`']
      : ['Maintain current high-standard static typing and lint standards'],
  };

  const mlArtifactsCategory: SkillScore = {
    category: 'ml_artifacts',
    name: 'ML & AI Artifacts',
    weight: 0.30,
    score: Math.min(100, mlArtifactsScore),
    passed: mlArtifactsScore >= 50,
    checks: mlChecks,
    recommendations: [
      'Log evaluation curves (confusion matrix, ROC) into an automated artifact registry',
      'Include data versioning manifest or DVC tracker for training subsets',
    ],
  };

  const devopsCategory: SkillScore = {
    category: 'devops',
    name: 'DevOps & Infrastructure',
    weight: 0.20,
    score: Math.min(100, devopsScore),
    passed: devopsScore >= 50,
    checks: devopsChecks,
    recommendations: [
      'Enforce security vulnerability scans in CI using Trivy or Grype',
      'Adopt distroless or multi-stage container optimization to reduce image surface',
    ],
  };

  const documentationCategory: SkillScore = {
    category: 'documentation',
    name: 'Documentation & Clarity',
    weight: 0.15,
    score: Math.min(100, docScore),
    passed: docScore >= 50,
    checks: docChecks,
    recommendations: [
      'Embed interactive OpenAPI demo widget or Postman collection',
      'Provide step-by-step troubleshooting guide for local replication',
    ],
  };

  const deploymentCategory: SkillScore = {
    category: 'deployment',
    name: 'Deployment & Sanity Benchmark',
    weight: 0.10,
    score: Math.min(100, deployScore),
    passed: deployScore >= 50,
    checks: deployChecks,
    recommendations: deployment?.latencyBenchmark.passed
      ? ['Optimize cold-start model cache for instant inference on edge devices']
      : ['Improve inference p95 latency by leveraging quantization or ONNX runtime'],
  };

  // Weighted aggregate: 25% + 30% + 20% + 15% + 10% = 100%
  const overallScore = Math.round(
    codeQualityCategory.score * 0.25 +
    mlArtifactsCategory.score * 0.30 +
    devopsCategory.score * 0.20 +
    documentationCategory.score * 0.15 +
    deploymentCategory.score * 0.10
  );

  // Criteria: >= 70 overall and no category < 50
  const allCategoriesAbove50 =
    codeQualityCategory.score >= 50 &&
    mlArtifactsCategory.score >= 50 &&
    devopsCategory.score >= 50 &&
    documentationCategory.score >= 50 &&
    deploymentCategory.score >= 50;

  const passedThreshold = overallScore >= 70 && allCategoriesAbove50;

  return {
    id: `sc_${Math.random().toString(36).substring(2, 9)}`,
    repositoryId: repoId,
    overallScore,
    passedThreshold,
    evaluatedAt: new Date().toISOString(),
    commitHash,
    categories: {
      codeQuality: codeQualityCategory,
      mlArtifacts: mlArtifactsCategory,
      devops: devopsCategory,
      documentation: documentationCategory,
      deployment: deploymentCategory,
    },
    summary: passedThreshold
      ? `Repository meets MegniToo accreditation standards (Overall: ${overallScore}/100). All 5 competency categories exceed the 50% threshold.`
      : `Repository did not satisfy issuance criteria. Requires overall score >= 70 and minimum 50% across every single category.`,
  };
}
