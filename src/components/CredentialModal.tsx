import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  FileJson, 
  ExternalLink,
  Lock,
  Sparkles
} from 'lucide-react';
import QRCode from 'qrcode';
import { StudentProject, W3CVerifiableCredential } from '../types';

interface CredentialModalProps {
  project: StudentProject;
  onClose: () => void;
}

export const CredentialModal: React.FC<CredentialModalProps> = ({
  project,
  onClose,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [viewJson, setViewJson] = useState(false);

  const vc = project.credential;
  const verificationUrl = `https://verify.megnito.org/check/${vc?.id || project.credentialId}`;

  useEffect(() => {
    if (verificationUrl) {
      QRCode.toDataURL(verificationUrl, {
        width: 260,
        margin: 1.5,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url: string) => setQrCodeUrl(url))
        .catch((err: unknown) => console.error('Failed to generate QR code', err));
    }
  }, [verificationUrl]);

  if (!vc) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(vc, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(vc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `megnitoo-credential-${project.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  W3C Verifiable Credential 2.0
                </span>
                <span className="text-xs font-mono text-slate-400">Ed25519 Signed</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                {vc.credentialSubject.projectName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Display Card */}
        <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-emerald-500/40 rounded-2xl p-6 sm:p-8 shadow-xl overflow-hidden">
          {/* Subtle watermark */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div>
                <div className="text-xs text-slate-400 uppercase font-mono tracking-wider">
                  Accredited Graduate
                </div>
                <div className="text-2xl font-black text-white mt-0.5">
                  {vc.credentialSubject.name}
                </div>
                <div className="text-xs font-mono text-slate-400 mt-0.5">
                  GitHub: @{vc.credentialSubject.githubUsername} • {vc.credentialSubject.id}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-mono">Scorecard Grade</div>
                  <div className="text-xl font-black text-emerald-400 mt-0.5">
                    {vc.credentialSubject.overallScore}% ({vc.credentialSubject.grade})
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-mono">Verified Commit</div>
                  <div className="text-xs font-mono text-slate-200 mt-1 truncate">
                    {vc.credentialSubject.commitHash.slice(0, 10)}...
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[11px] text-slate-400 uppercase font-mono mb-1">
                  Verified Competencies
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {vc.credentialSubject.competencies.map((c, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center bg-white p-3.5 rounded-2xl shadow-xl shrink-0">
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="Credential QR Code"
                  className="w-40 h-40 object-contain rounded-lg"
                />
              ) : (
                <div className="w-40 h-40 bg-slate-200 animate-pulse rounded-lg" />
              )}
              <div className="text-[10px] font-mono font-bold text-slate-800 mt-2 text-center uppercase tracking-wider">
                Scan to Verify Online
              </div>
            </div>
          </div>

          {/* Cryptographic Proof Strip */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400 font-mono">
                Ed25519 Proof: {vc.proof.proofValue.slice(0, 20)}...
              </span>
            </div>
            <div className="text-slate-400 font-mono text-[11px]">
              Transparency Log: {vc.evidence[0]?.transparencyLogEntry.logId}
            </div>
          </div>
        </div>

        {/* Verification Link URL */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
          <div className="text-xs font-mono text-slate-300 truncate">
            {verificationUrl}
          </div>
          <a
            href={verificationUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold shrink-0"
          >
            <span>Open Link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            id="btn-toggle-raw-json"
            onClick={() => setViewJson(!viewJson)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <FileJson className="w-4 h-4 text-teal-400" />
            <span>{viewJson ? 'Hide W3C JSON-LD' : 'Inspect W3C JSON-LD'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              id="btn-copy-json"
              onClick={handleCopyJson}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>

            <button
              id="btn-download-json"
              onClick={handleDownloadJson}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Download Signed VC</span>
            </button>
          </div>
        </div>

        {/* Raw JSON viewer */}
        {viewJson && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-teal-300 max-h-64 overflow-y-auto">
            <pre>{JSON.stringify(vc, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
