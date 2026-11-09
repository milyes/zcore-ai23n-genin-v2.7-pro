import React from 'react';
import { Download, Zap, Play, FileCode, Code2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
  onDownloadBinHtml?: () => void;
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
  onDownloadBinHtml,
  boostActive,
  faradayActive,
  usbPlugged,
}) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-md sticky top-0 z-40 px-3 md:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 md:gap-5">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('inference')}
            className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 flex items-center gap-1.5"
          >
            <span className="text-sm md:text-base font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors whitespace-nowrap">
              {t.brand}
            </span>
            <span className="text-[10px] md:text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 px-1.5 py-0.5 rounded">
              {t.version}
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
            {t.nav.inference}
          </button>

          <button
            onClick={() => setActiveTab('models')}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 ${
              activeTab === 'models'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            {t.nav.models}
          </button>

          <button
            onClick={() => setActiveTab('ghost')}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 flex items-center gap-1 ${
              activeTab === 'ghost'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            <span>{t.nav.ghost}</span>
            {usbPlugged && (
              <span className="text-[10px] text-amber-400 font-mono">({t.actions.decoy})</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('sync')}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 ${
              activeTab === 'sync'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            {t.nav.sync}
          </button>

          <button
            onClick={() => setActiveTab('learn')}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 ${
              activeTab === 'learn'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            {t.nav.learn}
          </button>

          <button
            onClick={() => setActiveTab('faraday')}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 ${
              activeTab === 'faraday'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            {t.nav.faraday}
          </button>

          <button
            onClick={() => setActiveTab('compiler')}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 ${
              activeTab === 'compiler'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            {t.nav.compiler}
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 ${
              activeTab === 'audit'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            {t.nav.audit}
          </button>
        </nav>

        {/* Zone 3: Direct Action Buttons + FR/EN Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Responsive tab selector on small/medium screens */}
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as AppTab)}
            className="2xl:hidden bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded px-2 py-1 font-mono cursor-pointer"
          >
            <option value="inference">{t.nav.inference}</option>
            <option value="models">{t.nav.models}</option>
            <option value="ghost">{t.nav.ghost}</option>
            <option value="sync">{t.nav.sync}</option>
            <option value="learn">{t.nav.learn}</option>
            <option value="faraday">{t.nav.faraday}</option>
            <option value="compiler">{t.nav.compiler}</option>
            <option value="audit">{t.nav.audit}</option>
          </select>

          {/* Language Switcher: FR | EN */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded p-0.5 text-xs font-mono">
            <button
              onClick={() => setLanguage('FR')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                language === 'FR'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Passer en version Française"
            >
              FR
            </button>
            <button
              onClick={() => setLanguage('EN')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                language === 'EN'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Switch to English"
            >
              EN
            </button>
          </div>

          {/* Bouton 1: LANCER AI23N */}
          <button
            onClick={onLancerAI23N}
            className="px-2.5 md:px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 font-mono cursor-pointer shadow-sm"
            title="Lancer l'inférence tactique IA23N en 0.03s"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">{t.actions.launch}</span>
            <span className="sm:hidden">AI23N</span>
          </button>

          {/* Bouton 2: EXPORT BIN */}
          <button
            onClick={onDownloadBinary}
            className="px-2.5 md:px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 font-mono cursor-pointer shadow-sm"
            title="Exporter le binaire statique zcore-ai23n-genin-v2.7-pro.bin (580B)"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.actions.exportBin}</span>
            <span className="sm:hidden">.BIN</span>
          </button>

          {/* Bouton 3: BUILD HTML */}
          <button
            onClick={onBuildHtml}
            className="px-2.5 md:px-3 py-1.5 text-xs font-mono font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            title="Générer et télécharger l'application HTML autonome 100% offline"
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{t.actions.buildHtml}</span>
            <span className="sm:hidden">HTML</span>
          </button>

          {/* Bouton 4: BIN_HTML (Polyglot self-extracting .bin.html) */}
          {onDownloadBinHtml && (
            <button
              onClick={onDownloadBinHtml}
              className="px-2.5 md:px-3 py-1.5 text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-600/70 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Télécharger le fichier polyglote BIN_HTML (binaire 580B + interface autonome)"
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.actions.binHtml}</span>
            </button>
          )}

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
