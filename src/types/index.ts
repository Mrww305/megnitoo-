export interface SkillScore {
  category: 'code_quality' | 'ml_artifacts' | 'devops' | 'documentation' | 'deployment';
  name: string;
  weight: number; // e.g. 0.25
  score: number; // 0 - 100
  passed: boolean; // score >= 50
  checks: {
    name: string;
    description: string;
    passed: boolean;
    pointsEarned: number;
    maxPoints: number;
    details?: string;
  }[];
  recommendations: string[];
}

export type CategoryScore = SkillScore;

export interface Scorecard {
  id: string;
  repositoryId: string;
  overallScore: number; // 0 - 100
  passedThreshold: boolean; // overall >= 70 && all category >= 50
  evaluatedAt: string;
  commitHash: string;
  categories: {
    codeQuality: SkillScore;
    mlArtifacts: SkillScore;
    devops: SkillScore;
    documentation: SkillScore;
    deployment: SkillScore;
  };
  summary: string;
}

export interface DeploymentVerification {
  id: string;
  deploymentUrl: string;
  platform: 'HuggingFace' | 'Railway' | 'Render' | 'MegniPlay' | 'Custom';
  status: 'pending' | 'success' | 'failed';
  timestamp: string;
  healthCheck: {
    endpoint: string;
    httpStatus: number;
    responseTimeMs: number;
    healthy: boolean;
  };
  contractTest: {
    method: 'POST';
    path: string;
    payloadSample: Record<string, unknown>;
    responseSchemaValid: boolean;
    responseReceived: Record<string, unknown>;
  };
  latencyBenchmark: {
    samples: number;
    p50Ms: number;
    p95Ms: number;
    minMs: number;
    maxMs: number;
    passed: boolean; // p95 < 800ms
  };
  modelSanityCheck: {
    testedInputs: number;
    distinctOutputs: number;
    nonTrivial: boolean; // verified not hardcoded
    varianceScore: number;
    explanation: string;
  };
}

export interface W3CCredentialSubject {
  id: string; // e.g., did:key:z6MkuT... or urn:megnito:student:hash
  name: string;
  studentEmailHash: string;
  githubUsername: string;
  projectName: string;
  repoUrl: string;
  commitHash: string;
  deploymentUrl: string;
  overallScore: number;
  grade: 'Distinction' | 'Merit' | 'Pass';
  competencies: string[];
  badges: string[];
}

export interface W3CVerifiableCredential {
  '@context': string[];
  id: string; // urn:uuid:...
  type: string[];
  issuer: {
    id: string;
    name: string;
    url: string;
    publicKey: string;
  };
  validFrom: string;
  validUntil: string;
  credentialSubject: W3CCredentialSubject;
  evidence: {
    id: string;
    type: string[];
    verifier: string;
    scorecardId: string;
    deploymentVerificationId: string;
    overallScore: number;
    commitHash: string;
    transparencyLogEntry: {
      logId: string;
      merkleRoot: string;
      timestamp: string;
    };
  }[];
  proof: {
    type: 'Ed25519Signature2020';
    created: string;
    verificationMethod: string;
    proofPurpose: 'assertionMethod';
    proofValue: string; // Base58 or Base64 Ed25519 signature
    jcsSha256Digest: string;
  };
  revocationStatus?: {
    revoked: boolean;
    reason?: string;
    revokedAt?: string;
  };
}

export interface StudentProject {
  id: string;
  title: string;
  description: string;
  repoUrl: string;
  provider: 'github' | 'gitlab';
  branch: string;
  latestCommit: string;
  submittedAt: string;
  deploymentUrl: string;
  status: 'analyzing' | 'scored' | 'issued' | 'needs_improvement';
  scorecard?: Scorecard;
  deploymentVerification?: DeploymentVerification;
  credentialId?: string;
  credential?: W3CVerifiableCredential;
}

export interface Badge {
  id: string;
  slug: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  criteria: string;
  unlockedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  githubUsername: string;
  did: string;
  joinedAt: string;
  cohort: string;
  badgesEarned: Badge[];
}
