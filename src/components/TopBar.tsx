import React from 'react';
import { Download, Zap, Skull, Radio, Cpu } from 'lucide-react';

export type AppTab =
  | 'inference'
  | 'models'
  | 'ghost'
  | 'sync'
  | 'learn'
  | 'faraday'
  | 'compiler'
  | 'audit';

interface TopBarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onOpenBoost: () => void;
  onDownloadBinary: () => void;
  boostActive: boolean;
  faradayActive: boolean;
  usbPlugged: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenBoost,
  onDownloadBinary,
  boostActive,
  faradayActive,
  usbPlugged,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-md sticky top-0 z-40 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('inference')}
            className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 flex items-center gap-1.5"
          >
            <span className="text-base font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors whitespace-nowrap">
              Z-CORE AI23N GENIN
            </span>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 px-1.5 py-0.2 rounded">
              v2.7 PRO
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single-line, clean unboxed typography) */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('inference')}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 ${
              activeTab === 'inference'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Clinical Inference
          </button>

          <button
            onClick={() => setActiveTab('models')}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 ${
              activeTab === 'models'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            22 Models
          </button>

          <button
            onClick={() => setActiveTab('ghost')}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 flex items-center gap-1 ${
              activeTab === 'ghost'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            <span>Z-GHOST</span>
            {usbPlugged && <span className="text-[10px] text-amber-400 font-mono">(DECOY)</span>}
          </button>

          <button
            onClick={() => setActiveTab('sync')}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 ${
              activeTab === 'sync'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Z-SYNC-P2P
          </button>

          <button
            onClick={() => setActiveTab('learn')}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 ${
              activeTab === 'learn'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Z-LEARN (INT2)
          </button>

          <button
            onClick={() => setActiveTab('faraday')}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 ${
              activeTab === 'faraday'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Air-Gap 8443
          </button>

          <button
            onClick={() => setActiveTab('compiler')}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 ${
              activeTab === 'compiler'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Static .bin (580B)
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 ${
              activeTab === 'audit'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Audit Vault
          </button>
        </nav>

        {/* Zone 3: Actions & Mobile Quick Menu */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Responsive tab selector on medium screens */}
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as AppTab)}
            className="xl:hidden bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded px-2 py-1 font-mono cursor-pointer"
          >
            <option value="inference">Clinical Inference</option>
            <option value="models">22 Models</option>
            <option value="ghost">Z-GHOST Anti-Forensic</option>
            <option value="sync">Z-SYNC-P2P Mesh</option>
            <option value="learn">Z-LEARN (INT2)</option>
            <option value="faraday">Faraday Air-Gap</option>
            <option value="compiler">Static .bin (580B)</option>
            <option value="audit">Audit Vault</option>
          </select>

          <button
            onClick={onOpenBoost}
            className={`px-2.5 py-1.5 text-xs font-mono rounded border transition-colors flex items-center gap-1.5 cursor-pointer ${
              boostActive
                ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                : 'border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white bg-slate-900'
            }`}
            title="Online Boost @45W: Requires PIN 2300 + explicit consent"
          >
            <Zap className={`w-3.5 h-3.5 ${boostActive ? 'text-amber-400' : 'text-slate-400'}`} />
            <span className="whitespace-nowrap">{boostActive ? '45W Boost' : 'Boost @45W'}</span>
          </button>

          <button
            onClick={onDownloadBinary}
            className="px-3 py-1.5 text-xs font-medium text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 font-mono cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .bin (580B)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
