import React from 'react';
import { Download, Zap, Play, FileCode } from 'lucide-react';

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
  onLancerAI23N: () => void;
  onBuildHtml: () => void;
  boostActive: boolean;
  faradayActive: boolean;
  usbPlugged: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenBoost,
  onDownloadBinary,
  onLancerAI23N,
  onBuildHtml,
  boostActive,
  faradayActive,
  usbPlugged,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('inference')}
            className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 flex items-center gap-1.5"
          >
            <span className="text-sm md:text-base font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors whitespace-nowrap">
              Z-CORE AI23N GENIN
            </span>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 px-1.5 py-0.5 rounded">
              v2.7 PRO
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single-line, clean unboxed typography) */}
        <nav className="hidden 2xl:flex items-center gap-4 text-xs font-medium text-slate-400">
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

        {/* Zone 3: Direct Action Buttons (LANCER AI23N, EXPORT BIN, BUILD HTML) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Responsive tab selector on small/medium screens */}
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as AppTab)}
            className="2xl:hidden bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded px-2 py-1 font-mono cursor-pointer"
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

          {/* Bouton 1: LANCER AI23N */}
          <button
            onClick={onLancerAI23N}
            className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 font-mono cursor-pointer shadow-sm"
            title="Lancer l'inférence tactique IA23N en 0.03s"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>LANCER AI23N</span>
          </button>

          {/* Bouton 2: EXPORT BIN */}
          <button
            onClick={onDownloadBinary}
            className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 font-mono cursor-pointer shadow-sm"
            title="Exporter le binaire statique zcore-ai23n-genin-v2.7-pro.bin (580B)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT BIN (580B)</span>
          </button>

          {/* Bouton 3: BUILD HTML */}
          <button
            onClick={onBuildHtml}
            className="px-3 py-1.5 text-xs font-mono font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            title="Générer et télécharger l'application HTML autonome 100% offline"
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">BUILD HTML</span>
            <span className="sm:hidden">HTML</span>
          </button>

          {/* Boost 45W button */}
          <button
            onClick={onOpenBoost}
            className={`px-2 py-1.5 text-xs font-mono rounded border transition-colors flex items-center gap-1 cursor-pointer ${
              boostActive
                ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                : 'border-slate-800 text-slate-400 hover:text-white bg-slate-900/60'
            }`}
            title="Online Boost @45W: Requiert PIN 2300"
          >
            <Zap className={`w-3.5 h-3.5 ${boostActive ? 'text-amber-400' : 'text-slate-400'}`} />
            <span className="hidden md:inline">{boostActive ? '45W' : 'Boost'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
