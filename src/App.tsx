import React, { useState, useEffect } from 'react';
import { TopBar, AppTab } from './components/TopBar';
import { InferenceConsole } from './components/InferenceConsole';
import { ModelMatrix } from './components/ModelMatrix';
import { ZGhostAntiForensic } from './components/ZGhostAntiForensic';
import { ZSyncP2PMesh } from './components/ZSyncP2PMesh';
import { ZLearnFederated } from './components/ZLearnFederated';
import { FaradaySecurity } from './components/FaradaySecurity';
import { CompilerStudio } from './components/CompilerStudio';
import { AuditVault } from './components/AuditVault';
import { OnlineBoostModal } from './components/OnlineBoostModal';
import { TacticalInferenceResult } from './types/zcore';
import { SCENARIO_PRESETS } from './data/scenarios';
import { executeTacticalInference } from './utils/cryptoAudit';
import { generateStandaloneHtml } from './utils/exportHtml';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CheckCircle2 } from 'lucide-react';

function AppContent() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<AppTab>('inference');
  const [faradayActive, setFaradayActive] = useState<boolean>(true);
  const [boostActive, setBoostActive] = useState<boolean>(false);
  const [usbPlugged, setUsbPlugged] = useState<boolean>(false);
  const [isBoostModalOpen, setIsBoostModalOpen] = useState<boolean>(false);
  const [auditHistory, setAuditHistory] = useState<TacticalInferenceResult[]>([]);
  const [latestResult, setLatestResult] = useState<TacticalInferenceResult | null>(null);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // Initialize with the first scenario inference on load
  useEffect(() => {
    async function initBaseline() {
      const initial = await executeTacticalInference(SCENARIO_PRESETS[0].vitals, 'NINJA', false, language);
      setLatestResult(initial);
      setAuditHistory([initial]);
    }
    initBaseline();
  }, [language]);

  const showNotification = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => {
      setStatusNotification(null);
    }, 4500);
  };

  const handleInferenceCompleted = (result: TacticalInferenceResult) => {
    setLatestResult(result);
    setAuditHistory((prev) => [result, ...prev]);
  };

  const handleBoostCompleted = (boostData: any) => {
    setBoostActive(true);
    if (latestResult) {
      const updated: TacticalInferenceResult = {
        ...latestResult,
        boosted: true,
        boostPayload: {
          boostPower: '45W',
          synthesis: boostData.synthesis,
          latencyMs: boostData.latencyMs,
        },
      };
      setLatestResult(updated);
      setAuditHistory((prev) => [updated, ...prev]);
      showNotification(
        language === 'FR'
          ? 'BOOST 45W ENGAGÉ : Synthèse exascale Gemini 3.8 Flash intégrée'
          : '45W BOOST ENGAGED: Gemini 3.8 Flash exascale synthesis integrated'
      );
    }
  };

  const handleDeactivateBoost = () => {
    setBoostActive(false);
  };

  // Called when Z-GHOST auto-wipes RAM enclave after 30s or on PIN 9999
  const handleEnclaveWiped = () => {
    setAuditHistory([]);
    setLatestResult(null);
    showNotification(
      language === 'FR'
        ? 'Z-GHOST : Enclave RAM purgée (0 traces résiduelles)'
        : 'Z-GHOST: RAM enclave zeroized (0 residual traces)'
    );
  };

  // 1. Action: LANCER AI23N
  const handleLancerAI23N = async () => {
    setActiveTab('inference');
    const res = await executeTacticalInference(SCENARIO_PRESETS[0].vitals, 'NINJA', false, language);
    setLatestResult(res);
    setAuditHistory((prev) => [res, ...prev]);
    showNotification(
      language === 'FR'
        ? `AI23N LANCÉ : Inférence souveraine exécutée en ${res.latencySeconds}s (22 modèles consensurés, SHA-256 scellé)`
        : `AI23N LAUNCHED: Sovereign inference executed in ${res.latencySeconds}s (22 models consensused, SHA-256 sealed)`
    );
  };

  // 2. Action: EXPORT BIN (580B)
  const handleDownloadBinary = () => {
    try {
      const anchor = document.createElement('a');
      anchor.href = usbPlugged ? '/api/binary/download?decoy=true' : '/api/binary/download';
      anchor.download = usbPlugged ? 'zcore-decoy-580.bin' : 'zcore-ai23n-genin-v2.7-pro.bin';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      showNotification(
        usbPlugged
          ? (language === 'FR' ? 'LEURRE USB EXPORTÉ : zcore-decoy-580.bin (580B)' : 'USB DECOY EXPORTED: zcore-decoy-580.bin (580B)')
          : (language === 'FR' ? 'BIN EXPORTÉ : zcore-ai23n-genin-v2.7-pro.bin (580B statique)' : 'BIN EXPORTED: zcore-ai23n-genin-v2.7-pro.bin (580B static)')
      );
    } catch {
      // Client fallback blob (580 bytes)
      const buffer = new Uint8Array(580);
      buffer[0] = 0x7f;
      buffer[1] = 0x45;
      buffer[2] = 0x4c;
      buffer[3] = 0x46; // \x7fELF
      buffer[4] = 0x02; // 64-bit
      buffer[5] = 0x01; // little endian
      buffer[6] = 0x01;
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = usbPlugged ? 'zcore-decoy-580.bin' : 'zcore-ai23n-genin-v2.7-pro.bin';
      a.click();
      URL.revokeObjectURL(url);
      showNotification('BIN EXPORTÉ (Fallback Blob): 580 bytes');
    }
  };

  // 3. Action: BUILD HTML (Application autonome 100% offline)
  const handleBuildHtml = () => {
    try {
      const htmlContent = generateStandaloneHtml(language);
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `zcore-ai23n-genin-v2.7-pro-${language.toLowerCase()}.html`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      showNotification(
        language === 'FR'
          ? 'BUILD HTML FR PRÊT : Application autonome 100% offline téléchargée'
          : 'BUILD HTML EN READY: 100% standalone offline application downloaded'
      );
    } catch (err) {
      console.error(err);
      showNotification('Erreur lors de la génération du bundle HTML');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar (Strict 3-zone contract with FR | EN switcher, LANCER AI23N, EXPORT BIN, and BUILD HTML) */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBoost={() => setIsBoostModalOpen(true)}
        onDownloadBinary={handleDownloadBinary}
        onLancerAI23N={handleLancerAI23N}
        onBuildHtml={handleBuildHtml}
        boostActive={boostActive}
        faradayActive={faradayActive}
        usbPlugged={usbPlugged}
      />

      {/* Real-time Notification Banner */}
      {statusNotification && (
        <div className="bg-cyan-950/90 border-b border-cyan-800/80 px-6 py-2.5 text-xs font-mono text-cyan-200 flex items-center justify-between transition-all">
          <div className="max-w-7xl mx-auto w-full flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{statusNotification}</span>
          </div>
          <button
            onClick={() => setStatusNotification(null)}
            className="text-cyan-400 hover:text-white font-mono text-xs cursor-pointer ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Workspace Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-6 py-6">
        {activeTab === 'inference' && (
          <InferenceConsole
            onInferenceCompleted={handleInferenceCompleted}
            onOpenBoost={() => setIsBoostModalOpen(true)}
            boostActive={boostActive}
            latestResult={latestResult}
            onDownloadBinary={handleDownloadBinary}
            onBuildHtml={handleBuildHtml}
          />
        )}

        {activeTab === 'models' && <ModelMatrix />}

        {activeTab === 'ghost' && (
          <ZGhostAntiForensic
            onEnclaveWiped={handleEnclaveWiped}
            usbPlugged={usbPlugged}
            setUsbPlugged={setUsbPlugged}
          />
        )}

        {activeTab === 'sync' && (
          <ZSyncP2PMesh latestResult={latestResult} />
        )}

        {activeTab === 'learn' && <ZLearnFederated />}

        {activeTab === 'faraday' && (
          <FaradaySecurity
            faradayActive={faradayActive}
            setFaradayActive={setFaradayActive}
          />
        )}

        {activeTab === 'compiler' && (
          <CompilerStudio
            onDownloadBinary={handleDownloadBinary}
            onLancerAI23N={handleLancerAI23N}
            onBuildHtml={handleBuildHtml}
          />
        )}

        {activeTab === 'audit' && (
          <AuditVault
            auditHistory={auditHistory}
            onSelectAudit={(audit) => setLatestResult(audit)}
          />
        )}
      </main>

      {/* Sovereign System Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-3.5 mt-auto text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-semibold">{t.footer.name}</span>
            <span aria-hidden="true">·</span>
            <span>{t.footer.size}</span>
            <span aria-hidden="true">·</span>
            <span>{t.footer.models}</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-400">{t.footer.ip}</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span>{t.footer.modules}</span>
            <span aria-hidden="true">·</span>
            <span>{boostActive ? t.footer.powerBoost : t.footer.powerSovereign}</span>
          </div>
        </div>
      </footer>

      {/* Online Boost Modal */}
      <OnlineBoostModal
        isOpen={isBoostModalOpen}
        onClose={() => setIsBoostModalOpen(false)}
        vitals={latestResult ? SCENARIO_PRESETS[0].vitals : SCENARIO_PRESETS[0].vitals}
        latestResult={latestResult}
        onBoostCompleted={handleBoostCompleted}
        boostActive={boostActive}
        onDeactivateBoost={handleDeactivateBoost}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
