import React, { useState } from 'react';
import { 
  Award, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Cpu, 
  GitBranch, 
  Server, 
  FileCode2, 
  ShieldCheck, 
  QrCode, 
  ChevronRight,
  Sparkles,
  Info,
  ArrowUpRight
} from 'lucide-react';
import { StudentProject, UserProfile, Scorecard, CategoryScore, Badge } from '../types';

interface StudentDashboardProps {
  user?: UserProfile;
  student?: UserProfile;
  projects: StudentProject[];
  badges?: Badge[];
  onOpenSubmitModal: () => void;
  onViewCredential?: (project: StudentProject) => void;
  onOpenCredentialModal?: (project: StudentProject) => void;
  onTestDeployment: (project: StudentProject) => void;
  onInspectCredential?: (project: StudentProject) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  student,
  projects,
  badges,
  onOpenSubmitModal,
  onViewCredential,
  onOpenCredentialModal,
  onTestDeployment,
  onInspectCredential,
}) => {
  const currentUser = student || user || {
    id: 'usr_default',
    name: 'Student Developer',
    email: 'student@megnito.org',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    githubUsername: 'student',
    did: 'did:key:z6MkpTHR8VNsBxYAAWhNx2W3cA8B1p9FqK3vW7j5x9aB1c',
    joinedAt: '2026-02-01T09:00:00Z',
    cohort: 'Batch 04',
    badgesEarned: [],
  };

  const handleOpenCredential = (p: StudentProject) => {
    if (onOpenCredentialModal) onOpenCredentialModal(p);
    else if (onViewCredential) onViewCredential(p);
  };
  const [selectedScorecard, setSelectedScorecard] = useState<{ project: StudentProject; scorecard: Scorecard } | null>(null);

  const issuedCount = projects.filter((p) => p.status === 'issued').length;
  const avgScore = Math.round(
    projects.reduce((acc, p) => acc + (p.scorecard?.overallScore || 0), 0) / (projects.length || 1)
  );

  const earnedBadges = badges || currentUser.badgesEarned || [];

  return (
    <div className="space-y-8 pb-16">
      {/* Student Overview Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-emerald-500/40 object-cover shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {currentUser.name}
                </h1>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold px-2.5 py-1 rounded-full">
                  {currentUser.cohort}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                <span className="font-mono text-xs text-slate-400">
                  DID: {currentUser.did.slice(0, 24)}...{currentUser.did.slice(-6)}
                </span>
                <span>•</span>
                <a
                  href={`https://github.com/${currentUser.githubUsername}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  @{currentUser.githubUsername}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3">
            <button
              id="dashboard-submit-btn"
              onClick={onOpenSubmitModal}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit New Repository</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-medium text-slate-400">Issued W3C Credentials</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 flex items-baseline gap-1.5">
              <span>{issuedCount}</span>
              <span className="text-xs font-normal text-slate-400">/ {projects.length} repos</span>
            </div>
          </div>

          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-medium text-slate-400">Average Portfolio Score</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1 flex items-baseline gap-1">
              <span>{avgScore}</span>
              <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
          </div>

          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-medium text-slate-400">Skill Badges Earned</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-400 mt-1">
              {earnedBadges.length}
            </div>
          </div>

          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-medium text-slate-400">Verification Engine</div>
            <div className="text-xs font-semibold text-emerald-300 mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Ed25519 W3C VC 2.0
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Automated Rubric v3.4</div>
          </div>
        </div>
      </div>

      {/* Rubric Info Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900/50 to-teal-950/30 border border-emerald-500/20 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                MegniToo Evaluation Rubric & Credentialing Threshold
                <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                  Pass Mark: ≥ 70% Overall
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluates Code Quality (25%), ML/AI Artifacts (30%), DevOps (20%), Documentation (15%), and Deployment (10%). No category may fall below 50%.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300 font-mono bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <span>Threshold: Overall ≥ 70 & min(categories) ≥ 50</span>
          </div>
        </div>
      </div>

      {/* Verified Skill Badges */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Earned Skill Badges</span>
          </h2>
          <span className="text-xs text-slate-400">
            Backed by immutable code evidence & runtime test traces
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {earnedBadges.map((badge) => (
            <div
              key={badge.id}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Verified
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-white mt-3">{badge.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{badge.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between">
                <span>{badge.category}</span>
                <span className="text-emerald-400 font-mono">100%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submitted Projects List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span>Evaluated ML Project Repositories</span>
            </h2>
            <p className="text-xs text-slate-400">
              Each project is scanned via AST parsing, linters, Docker analysis, and live endpoint benchmarks.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {projects.map((project) => {
            const score = project.scorecard?.overallScore || 0;
            const passed = project.scorecard?.passedThreshold ?? false;

            return (
              <div
                key={project.id}
                id={`project-card-${project.id}`}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all rounded-2xl p-5 sm:p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left: Project info */}
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                          project.status === 'issued'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : project.status === 'needs_improvement'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        }`}
                      >
                        {project.status === 'issued' && <CheckCircle2 className="w-3 h-3" />}
                        {project.status === 'needs_improvement' && <AlertTriangle className="w-3 h-3" />}
                        {project.status === 'issued' ? 'W3C Credential Issued' : project.status === 'needs_improvement' ? 'Needs Improvement' : 'Scored'}
                      </span>

                      <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        commit: {project.latestCommit.slice(0, 7)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white hover:text-emerald-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                      >
                        <FileCode2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Source Code</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>

                      <a
                        href={project.deploymentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-teal-400 flex items-center gap-1 transition-colors"
                      >
                        <Server className="w-3.5 h-3.5 text-slate-400" />
                        <span>Live Deployment</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Right: Score Breakdown & Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-800">
                    <div className="flex items-center gap-4">
                      {/* Category mini-meters */}
                      {project.scorecard && (
                        <div className="hidden md:flex flex-col gap-1 text-[11px] font-mono text-slate-400 w-36">
                          <div className="flex justify-between">
                            <span>Code (25%)</span>
                            <span className={project.scorecard.categories.codeQuality.score >= 50 ? 'text-emerald-400' : 'text-rose-400'}>
                              {project.scorecard.categories.codeQuality.score}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1">
                            <div
                              className={`h-1 rounded-full ${project.scorecard.categories.codeQuality.score >= 50 ? 'bg-emerald-400' : 'bg-rose-400'}`}
                              style={{ width: `${project.scorecard.categories.codeQuality.score}%` }}
                            />
                          </div>

                          <div className="flex justify-between">
                            <span>ML (30%)</span>
                            <span className={project.scorecard.categories.mlArtifacts.score >= 50 ? 'text-emerald-400' : 'text-rose-400'}>
                              {project.scorecard.categories.mlArtifacts.score}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1">
                            <div
                              className={`h-1 rounded-full ${project.scorecard.categories.mlArtifacts.score >= 50 ? 'bg-emerald-400' : 'bg-rose-400'}`}
                              style={{ width: `${project.scorecard.categories.mlArtifacts.score}%` }}
                            />
                          </div>

                          <div className="flex justify-between">
                            <span>DevOps (20%)</span>
                            <span className={project.scorecard.categories.devops.score >= 50 ? 'text-emerald-400' : 'text-rose-400'}>
                              {project.scorecard.categories.devops.score}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1">
                            <div
                              className={`h-1 rounded-full ${project.scorecard.categories.devops.score >= 50 ? 'bg-emerald-400' : 'bg-rose-400'}`}
                              style={{ width: `${project.scorecard.categories.devops.score}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Overall Score Badge */}
                      <div className="text-center p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                        <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                          Scorecard
                        </div>
                        <div
                          className={`text-2xl font-black ${
                            passed ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {score}
                          <span className="text-xs font-normal text-slate-400">/100</span>
                        </div>
                        <div className="text-[10px] font-semibold text-slate-400">
                          {passed ? 'PASSED' : 'DEFICIT'}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      {project.scorecard && (
                        <button
                          id={`btn-scorecard-${project.id}`}
                          onClick={() => setSelectedScorecard({ project, scorecard: project.scorecard! })}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700"
                        >
                          Scorecard Details
                        </button>
                      )}

                      <button
                        id={`btn-verify-deploy-${project.id}`}
                        onClick={() => onTestDeployment(project)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-medium rounded-lg transition-colors border border-slate-700 flex items-center gap-1"
                      >
                        <Server className="w-3.5 h-3.5" />
                        <span>Re-Test</span>
                      </button>

                      {project.status === 'issued' && (
                        <button
                          id={`btn-view-vc-${project.id}`}
                          onClick={() => handleOpenCredential(project)}
                          className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-lg transition-colors border border-emerald-500/40 flex items-center gap-1"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>View VC & QR</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scorecard Detailed Modal */}
      {selectedScorecard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Automated Audit Scorecard
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedScorecard.project.title}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Commit: {selectedScorecard.scorecard.commitHash} • Evaluated: {new Date(selectedScorecard.scorecard.evaluatedAt).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <div className="text-3xl font-black text-emerald-400">
                  {selectedScorecard.scorecard.overallScore}
                  <span className="text-sm font-normal text-slate-400">/100</span>
                </div>
                <div
                  className={`text-xs font-bold ${
                    selectedScorecard.scorecard.passedThreshold ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {selectedScorecard.scorecard.passedThreshold ? 'ACCREDITED (≥70)' : 'NEEDS REVISION'}
                </div>
              </div>
            </div>

            {/* Rubric Categories Breakdown */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Category Score Breakdown (Weights: 25% | 30% | 20% | 15% | 10%)
              </h4>

              {Object.entries(selectedScorecard.scorecard.categories).map(([key, rawCat]) => {
                const cat = rawCat as CategoryScore;
                return (
                <div key={key} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-sm text-white">{cat.name}</span>
                      <span className="text-xs text-slate-400 ml-2">Weight: {cat.weight * 100}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${cat.score >= 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {cat.score} / 100
                      </span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${cat.score >= 50 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
                        {cat.score >= 50 ? 'PASS' : 'FAIL'}
                      </span>
                    </div>
                  </div>

                  {/* Individual checks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {cat.checks.map((chk, i) => (
                      <div key={i} className="flex items-start gap-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                        {chk.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="font-medium text-slate-200">{chk.name}</div>
                          <div className="text-[11px] text-slate-400">{chk.details || chk.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recommendations */}
                  {cat.recommendations.length > 0 && (
                    <div className="text-[11px] text-slate-400 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60 flex items-start gap-2">
                      <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-teal-300">Improvement Actions: </span>
                        {cat.recommendations.join(' • ')}
                      </div>
                    </div>
                  )}
                </div>
              );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedScorecard(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Close Scorecard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
