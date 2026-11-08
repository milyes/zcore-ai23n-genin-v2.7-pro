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

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('inference');
  const [faradayActive, setFaradayActive] = useState<boolean>(true);
  const [boostActive, setBoostActive] = useState<boolean>(false);
  const [usbPlugged, setUsbPlugged] = useState<boolean>(false);
  const [isBoostModalOpen, setIsBoostModalOpen] = useState<boolean>(false);
  const [auditHistory, setAuditHistory] = useState<TacticalInferenceResult[]>([]);
  const [latestResult, setLatestResult] = useState<TacticalInferenceResult | null>(null);

  // Initialize with the first scenario inference on load
  useEffect(() => {
    async function initBaseline() {
      const initial = await executeTacticalInference(SCENARIO_PRESETS[0].vitals, 'NINJA');
      setLatestResult(initial);
      setAuditHistory([initial]);
    }
    initBaseline();
  }, []);

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
    }
  };

  const handleDeactivateBoost = () => {
    setBoostActive(false);
  };

  // Called when Z-GHOST auto-wipes RAM enclave after 30s or on PIN 9999
  const handleEnclaveWiped = () => {
    setAuditHistory([]);
    setLatestResult(null);
  };

  // Download binary directly (or decoy if USB is plugged)
  const handleDownloadBinary = () => {
    try {
      const anchor = document.createElement('a');
      anchor.href = usbPlugged ? '/api/binary/download?decoy=true' : '/api/binary/download';
      anchor.download = usbPlugged ? 'zcore-decoy-580.bin' : 'zcore-ai23n-genin-v2.7-pro.bin';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
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
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar (Strict 3-zone contract with v2.7 PRO Navigation) */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBoost={() => setIsBoostModalOpen(true)}
        onDownloadBinary={handleDownloadBinary}
        boostActive={boostActive}
        faradayActive={faradayActive}
        usbPlugged={usbPlugged}
      />

      {/* Main Workspace Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6">
        {activeTab === 'inference' && (
          <InferenceConsole
            onInferenceCompleted={handleInferenceCompleted}
            onOpenBoost={() => setIsBoostModalOpen(true)}
            boostActive={boostActive}
            latestResult={latestResult}
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
          <CompilerStudio onDownloadBinary={handleDownloadBinary} />
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
            <span className="text-slate-400 font-semibold">Z-CORE AI23N GENIN v2.7 PRO</span>
            <span aria-hidden="true">·</span>
            <span>Static Binary 580B</span>
            <span aria-hidden="true">·</span>
            <span>22 Models + INT2 Learn</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-400">127.0.0.1:8443</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span>Modules: Z-GHOST · Z-SYNC · Z-LEARN</span>
            <span aria-hidden="true">·</span>
            <span>Power: {boostActive ? '45W Peak' : '&lt;30W Sovereign'}</span>
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
