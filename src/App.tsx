import React, { useState } from 'react';
import { Navbar, NavTabType } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentDashboard';
import { DeploymentVerifier } from './components/DeploymentVerifier';
import { EmployerPortal } from './components/EmployerPortal';
import { ArchitectureDocs } from './components/ArchitectureDocs';
import { CredentialModal } from './components/CredentialModal';
import { RepoSubmissionModal } from './components/RepoSubmissionModal';
import { SAMPLE_STUDENT, SAMPLE_PROJECTS, SAMPLE_BADGES } from './data/sampleData';
import { StudentProject, W3CVerifiableCredential } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabType>('landing');
  const [projects, setProjects] = useState<StudentProject[]>(SAMPLE_PROJECTS);
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<StudentProject | null>(null);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState<boolean>(false);

  // When user clicks "Test Deployment" on a project card in dashboard:
  const [verifierTargetUrl, setVerifierTargetUrl] = useState<string>('https://enterprise-rag-megnito.hf.space');
  const [employerTargetProject, setEmployerTargetProject] = useState<StudentProject>(projects[0]);

  const handleTestDeploymentFromProject = (project: StudentProject) => {
    setVerifierTargetUrl(project.deploymentUrl);
    setActiveTab('verifier');
  };

  const handleInspectCredentialFromProject = (project: StudentProject) => {
    setEmployerTargetProject(project);
    setActiveTab('employer');
  };

  const handleNewProjectAdded = (newProject: StudentProject) => {
    setProjects((prev) => [newProject, ...prev]);
    if (newProject.credential) {
      setEmployerTargetProject(newProject);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        setActiveTab={setActiveTab}
        user={SAMPLE_STUDENT}
        onSubmitProjectClick={() => setIsSubmissionModalOpen(true)}
        onOpenSubmitModal={() => setIsSubmissionModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'landing' && (
          <LandingPage
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenSubmitModal={() => setIsSubmissionModalOpen(true)}
            onInspectProject={handleInspectCredentialFromProject}
            onTestDeployment={handleTestDeploymentFromProject}
            projects={projects}
          />
        )}

        {activeTab === 'dashboard' && (
          <StudentDashboard
            student={SAMPLE_STUDENT}
            projects={projects}
            badges={SAMPLE_BADGES}
            onOpenCredentialModal={(proj) => setSelectedProjectForModal(proj)}
            onOpenSubmitModal={() => setIsSubmissionModalOpen(true)}
            onTestDeployment={handleTestDeploymentFromProject}
            onInspectCredential={handleInspectCredentialFromProject}
          />
        )}

        {activeTab === 'verifier' && (
          <DeploymentVerifier initialUrl={verifierTargetUrl} />
        )}

        {activeTab === 'employer' && (
          <EmployerPortal
            initialProject={employerTargetProject}
            allProjects={projects}
            onSelectProject={(p) => setEmployerTargetProject(p)}
          />
        )}

        {activeTab === 'architecture' && <ArchitectureDocs />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>MegniToo Incubator Credentialing System v2.0 • W3C VC 2.0 & Ed25519 Verified</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>FastAPI Backend</span>
            <span>•</span>
            <span>PostgreSQL Schema</span>
            <span>•</span>
            <span>PyNaCl RFC 8785 (JCS)</span>
            <span>•</span>
            <span>Celery AST Scanner</span>
          </div>
        </div>
      </footer>

      {/* Modal: W3C Credential View & QR Code */}
      {selectedProjectForModal && (
        <CredentialModal
          project={selectedProjectForModal}
          onClose={() => setSelectedProjectForModal(null)}
        />
      )}

      {/* Modal: Repository Submission Multi-Step Flow */}
      {isSubmissionModalOpen && (
        <RepoSubmissionModal
          onClose={() => setIsSubmissionModalOpen(false)}
          onProjectAdded={handleNewProjectAdded}
        />
      )}
    </div>
  );
}
