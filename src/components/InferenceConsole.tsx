import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Check,
  Clock,
  Copy,
  FileText,
  Flame,
  Radio,
  RefreshCw,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { ClinicalVitals, ExecutionMode, TacticalInferenceResult } from '../types/zcore';
import { SCENARIO_PRESETS } from '../data/scenarios';
import { executeTacticalInference, generateAuditHtmlReport } from '../utils/cryptoAudit';
import { useLanguage } from '../context/LanguageContext';

interface InferenceConsoleProps {
  onInferenceCompleted: (result: TacticalInferenceResult) => void;
  onOpenBoost: () => void;
  boostActive: boolean;
  latestResult: TacticalInferenceResult | null;
  onDownloadBinary?: () => void;
  onBuildHtml?: () => void;
}

export const InferenceConsole: React.FC<InferenceConsoleProps> = ({
  onInferenceCompleted,
  onOpenBoost,
  boostActive,
  latestResult,
  onDownloadBinary,
  onBuildHtml,
}) => {
  const { language, t } = useLanguage();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SCENARIO_PRESETS[0].id);
  const [vitals, setVitals] = useState<ClinicalVitals>({ ...SCENARIO_PRESETS[0].vitals });
  const [executionMode, setExecutionMode] = useState<ExecutionMode>('NINJA');
  const [isInferring, setIsInferring] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  const getScenarioTitle = (id: string, defTitle: string) => {
    if (language === 'FR') {
      if (id === 'trauma-blast-shrapnel') return t.scenarios.s1Title;
      if (id === 'neuro-icp-herniation') return t.scenarios.s2Title;
      if (id === 'septic-shock-austere') return t.scenarios.s3Title;
      if (id === 'cbrn-organophosphate') return t.scenarios.s4Title;
      if (id === 'crush-syndrome-collapse') return t.scenarios.s5Title;
    }
    return defTitle;
  };

  const getScenarioDesc = (id: string, defDesc: string) => {
    if (language === 'FR') {
      if (id === 'trauma-blast-shrapnel') return t.scenarios.s1Desc;
      if (id === 'neuro-icp-herniation') return t.scenarios.s2Desc;
      if (id === 'septic-shock-austere') return t.scenarios.s3Desc;
      if (id === 'cbrn-organophosphate') return t.scenarios.s4Desc;
      if (id === 'crush-syndrome-collapse') return t.scenarios.s5Desc;
    }
    return defDesc;
  };

  const handleSelectScenario = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    const preset = SCENARIO_PRESETS.find((s) => s.id === scenarioId);
    if (preset) {
      setVitals({ ...preset.vitals });
    }
  };

  const handleRunInference = async () => {
    setIsInferring(true);
    setTimeout(async () => {
      const res = await executeTacticalInference(vitals, executionMode, false, language);
      onInferenceCompleted(res);
      setIsInferring(false);
    }, 28);
  };

  const handleExportPdf = () => {
    if (!latestResult) return;
    const html = generateAuditHtmlReport(latestResult, vitals, language);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const handleCopyHash = () => {
    if (!latestResult) return;
    navigator.clipboard.writeText(latestResult.hashSha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  // Derived instant calculations
  const shockIndex = vitals.systolicBP > 0 ? (vitals.heartRate / vitals.systolicBP).toFixed(2) : '—';
  const meanArterialPressure = Math.round(vitals.diastolicBP + (vitals.systolicBP - vitals.diastolicBP) / 3);

  return (
    <div className="space-y-6">
      {/* Top Banner / Tactical Metadata Ribbon */}
      <div className="border border-slate-800 bg-slate-900/60 p-4 rounded-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <span className="text-white font-medium">{t.banner.core}</span>
          <span aria-hidden="true">·</span>
          <span>{t.banner.throughput}</span>
          <span aria-hidden="true">·</span>
          <span>{t.banner.modules}</span>
          <span aria-hidden="true">·</span>
          <span>{boostActive ? t.banner.powerBoost : t.banner.powerSovereign}</span>
        </div>

        {/* Segmented Mode Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded">
          <button
            onClick={() => setExecutionMode('NINJA')}
            className={`px-3 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
              executionMode === 'NINJA'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.banner.modeNinja}
          </button>
          <button
            onClick={() => setExecutionMode('CALIBRATED_AUDIT')}
            className={`px-3 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
              executionMode === 'CALIBRATED_AUDIT'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.banner.modeAudit}
          </button>
        </div>
      </div>

      {/* Main Grid: Left Control & Parameters vs Right Inference HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Clinical Parameters & Scenario Injection (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Preset Scenario Selector */}
          <div className="border border-slate-800 bg-slate-900/40 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                {t.scenarios.title}
              </h2>
              <span className="text-xs text-slate-500 font-mono">{t.scenarios.subtitle}</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {SCENARIO_PRESETS.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => handleSelectScenario(scenario.id)}
                  className={`text-left p-2.5 rounded border transition-colors cursor-pointer ${
                    selectedScenarioId === scenario.id
                      ? 'border-cyan-500/60 bg-cyan-950/20 text-white'
                      : 'border-slate-800/80 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-100">
                      {getScenarioTitle(scenario.id, scenario.title)}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-400/90">{scenario.category}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {getScenarioDesc(scenario.id, scenario.summary)}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Vitals Telemetry Editor */}
          <div className="border border-slate-800 bg-slate-900/40 p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                {t.vitals.title}
              </h2>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <span>SI: <strong className="text-cyan-400">{shockIndex}</strong></span>
                <span aria-hidden="true">·</span>
                <span>MAP: <strong className="text-slate-300">{meanArterialPressure}</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Heart Rate */}
              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{t.vitals.hr}</span>
                  <span className="text-slate-500">BPM</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <input
                    type="range"
                    min="30"
                    max="220"
                    value={vitals.heartRate}
                    onChange={(e) => setVitals({ ...vitals, heartRate: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <span className="text-sm font-mono font-semibold text-white w-10 text-right tabular-nums">
                    {vitals.heartRate}
                  </span>
                </div>
              </div>

              {/* Systolic BP */}
              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{t.vitals.sbp}</span>
                  <span className="text-slate-500">mmHg</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <input
                    type="range"
                    min="40"
                    max="240"
                    value={vitals.systolicBP}
                    onChange={(e) => setVitals({ ...vitals, systolicBP: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <span className="text-sm font-mono font-semibold text-white w-10 text-right tabular-nums">
                    {vitals.systolicBP}
                  </span>
                </div>
              </div>

              {/* Diastolic BP */}
              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{t.vitals.dbp}</span>
                  <span className="text-slate-500">mmHg</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <input
                    type="range"
                    min="20"
                    max="140"
                    value={vitals.diastolicBP}
                    onChange={(e) => setVitals({ ...vitals, diastolicBP: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <span className="text-sm font-mono font-semibold text-white w-10 text-right tabular-nums">
                    {vitals.diastolicBP}
                  </span>
                </div>
              </div>

              {/* SpO2 */}
              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{t.vitals.spo2}</span>
                  <span className="text-slate-500">%</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <input
                    type="range"
                    min="60"
                    max="100"
                    value={vitals.oxygenSat}
                    onChange={(e) => setVitals({ ...vitals, oxygenSat: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <span className="text-sm font-mono font-semibold text-white w-10 text-right tabular-nums">
                    {vitals.oxygenSat}
                  </span>
                </div>
              </div>

              {/* Respiratory Rate */}
              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{t.vitals.rr}</span>
                  <span className="text-slate-500">/min</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <input
                    type="range"
                    min="6"
                    max="50"
                    value={vitals.respiratoryRate}
                    onChange={(e) => setVitals({ ...vitals, respiratoryRate: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <span className="text-sm font-mono font-semibold text-white w-10 text-right tabular-nums">
                    {vitals.respiratoryRate}
                  </span>
                </div>
              </div>

              {/* GCS */}
              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{t.vitals.gcs}</span>
                  <span className="text-slate-500">3-15</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <input
                    type="range"
                    min="3"
                    max="15"
                    value={vitals.gcsScore}
                    onChange={(e) => setVitals({ ...vitals, gcsScore: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <span className="text-sm font-mono font-semibold text-white w-10 text-right tabular-nums">
                    {vitals.gcsScore}
                  </span>
                </div>
              </div>

              {/* Blood Lactate */}
              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{t.vitals.lactate}</span>
                  <span className="text-slate-500">mmol/L</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <input
                    type="range"
                    min="0.5"
                    max="15.0"
                    step="0.1"
                    value={vitals.lactateMmol}
                    onChange={(e) => setVitals({ ...vitals, lactateMmol: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <span className="text-sm font-mono font-semibold text-white w-10 text-right tabular-nums">
                    {vitals.lactateMmol}
                  </span>
                </div>
              </div>

              {/* Core Temperature */}
              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{t.vitals.temp}</span>
                  <span className="text-slate-500">°C</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <input
                    type="range"
                    min="32.0"
                    max="41.0"
                    step="0.1"
                    value={vitals.temperatureC}
                    onChange={(e) => setVitals({ ...vitals, temperatureC: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <span className="text-sm font-mono font-semibold text-white w-10 text-right tabular-nums">
                    {vitals.temperatureC}
                  </span>
                </div>
              </div>
            </div>

            {/* Tactical Modifiers (Tourniquet, Active Hemorrhage, CBRN) */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <label className="flex items-center gap-2 p-2 rounded bg-slate-950/60 border border-slate-800 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={vitals.activeHemorrhage}
                  onChange={(e) => setVitals({ ...vitals, activeHemorrhage: e.target.checked })}
                  className="rounded accent-cyan-400"
                />
                <span className="text-slate-300">{t.vitals.activeBleed}</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-slate-950/60 border border-slate-800 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={vitals.tourniquetApplied}
                  onChange={(e) => setVitals({ ...vitals, tourniquetApplied: e.target.checked })}
                  className="rounded accent-cyan-400"
                />
                <span className="text-slate-300">{t.vitals.tourniquet}</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-slate-950/60 border border-slate-800 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={vitals.alteredMentalStatus}
                  onChange={(e) => setVitals({ ...vitals, alteredMentalStatus: e.target.checked })}
                  className="rounded accent-cyan-400"
                />
                <span className="text-slate-300">{t.vitals.alteredState}</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-slate-950/60 border border-slate-800 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={vitals.cbrnExposed}
                  onChange={(e) => setVitals({ ...vitals, cbrnExposed: e.target.checked })}
                  className="rounded accent-rose-500"
                />
                <span className={vitals.cbrnExposed ? 'text-rose-400 font-semibold' : 'text-slate-300'}>
                  {t.vitals.cbrn}
                </span>
              </label>
            </div>

            {/* Execute Trigger: LANCER AI23N */}
            <button
              onClick={handleRunInference}
              disabled={isInferring}
              className="w-full py-2.5 px-4 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs tracking-wider uppercase font-mono rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isInferring ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t.vitals.executing}</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>{t.vitals.runBtn}</span>
                </>
              )}
            </button>

            {/* Quick Action Row: Export BIN & Build HTML */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={onDownloadBinary}
                className="py-2 px-3 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-500/40 text-cyan-300 font-semibold text-xs font-mono rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                title="Exporter le binaire statique 580 bytes"
              >
                <span>{t.actions.exportBin}</span>
              </button>

              <button
                type="button"
                onClick={onBuildHtml}
                className="py-2 px-3 bg-slate-950 hover:bg-slate-900 border border-slate-700 text-slate-300 font-semibold text-xs font-mono rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                title="Générer l'application standalone HTML 100% offline"
              >
                <span>{t.actions.buildHtml}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Tactical Inference Decision Output (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {latestResult ? (
            <div className="border border-slate-800 bg-slate-900/60 rounded-lg p-5 space-y-5">
              {/* Triage Banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    {t.results.triageTitle}
                  </div>
                  <div className="text-2xl font-bold tracking-tight text-white mt-0.5 flex items-center gap-2">
                    <span
                      className={
                        latestResult.triageLevel.includes('RED') || latestResult.triageLevel.includes('ROUGE')
                          ? 'text-rose-400'
                          : latestResult.triageLevel.includes('YELLOW') || latestResult.triageLevel.includes('JAUNE')
                          ? 'text-amber-400'
                          : latestResult.triageLevel.includes('GREEN') || latestResult.triageLevel.includes('VERT')
                          ? 'text-emerald-400'
                          : 'text-slate-400'
                      }
                    >
                      {latestResult.triageLevel}
                    </span>
                  </div>
                </div>

                <div className="text-right text-xs font-mono text-slate-400 space-y-1">
                  <div>
                    {t.results.latency} : <strong className="text-cyan-400 tabular-nums">{latestResult.latencySeconds}s</strong>
                  </div>
                  <div>
                    {t.results.confidence} : <strong className="text-slate-200 tabular-nums">{latestResult.confidenceScore}%</strong>
                  </div>
                  <div>
                    {t.results.execution} : <span className="text-slate-300">{latestResult.executionMode}</span>
                  </div>
                </div>
              </div>

              {/* Primary Key Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded">
                  <div className="text-[10px] uppercase font-mono text-slate-500">{t.results.shockIndex}</div>
                  <div className="text-xl font-bold font-mono text-slate-100 mt-1 tabular-nums">
                    {latestResult.shockIndex}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {latestResult.shockIndex >= 1.4 ? t.results.shockSevere : latestResult.shockIndex >= 1.0 ? t.results.shockElevated : t.results.shockNormal}
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded">
                  <div className="text-[10px] uppercase font-mono text-slate-500">{t.results.mtpBlood}</div>
                  <div className="text-xl font-bold font-mono text-slate-100 mt-1">
                    {latestResult.mtpTriggered ? (
                      <span className="text-rose-400">{t.results.mtpActive}</span>
                    ) : (
                      <span className="text-slate-400">{t.results.mtpHold}</span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {latestResult.mtpTriggered ? (language === 'FR' ? 'Sang Total Prêt' : 'Whole Blood Ready') : (language === 'FR' ? 'Normovolémique' : 'Normovolemic')}
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded">
                  <div className="text-[10px] uppercase font-mono text-slate-500">{t.results.lethalTriad}</div>
                  <div className="text-xl font-bold font-mono text-slate-100 mt-1">
                    <span
                      className={
                        latestResult.lethalTriadRisk === 'CRITICAL'
                          ? 'text-rose-400'
                          : latestResult.lethalTriadRisk === 'ELEVATED'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }
                    >
                      {latestResult.lethalTriadRisk}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Coag / Acid / Hypo
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded">
                  <div className="text-[10px] uppercase font-mono text-slate-500">{t.results.medevacRunway}</div>
                  <div className="text-xl font-bold font-mono text-slate-100 mt-1 tabular-nums">
                    {latestResult.evacWindowMinutes}m
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {t.results.goldenHour}
                  </div>
                </div>
              </div>

              {/* Priority Interventions List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300">
                    {t.results.directivesTitle}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">TCCC / ATLS Standard</span>
                </div>

                <div className="space-y-2">
                  {latestResult.interventions.map((item) => (
                    <div
                      key={item.priority}
                      className="p-3 bg-slate-950/60 border border-slate-800 rounded flex items-start gap-3"
                    >
                      <div className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-800/60 px-1.5 py-0.5 rounded shrink-0">
                        0{item.priority}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="text-sm font-semibold text-slate-100">{item.action}</div>
                        {item.dosage && (
                          <div className="text-xs font-mono text-slate-300 bg-slate-900/60 px-2 py-0.5 rounded inline-block">
                            Dose : {item.dosage}
                          </div>
                        )}
                        {latestResult.executionMode === 'CALIBRATED_AUDIT' && (
                          <div className="text-xs text-slate-400 leading-relaxed pt-1">
                            {item.clinicalRationale}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">
                        {item.protocolStandard}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Airway & Pharmacology Footprint */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
                <div className="bg-slate-950/40 border border-slate-800/80 p-3 rounded space-y-1">
                  <span className="text-slate-400 font-mono text-[10px] uppercase">{t.results.airwayTrauma}</span>
                  <p className="text-slate-200 leading-relaxed font-sans">{latestResult.airwayStrategy}</p>
                </div>

                <div className="bg-slate-950/40 border border-slate-800/80 p-3 rounded space-y-1">
                  <span className="text-slate-400 font-mono text-[10px] uppercase">{t.results.pharmacology}</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {latestResult.pharmacology.length > 0 ? (
                      latestResult.pharmacology.map((drug, i) => (
                        <span key={i} className="text-xs font-mono text-slate-300">
                          {drug}
                          {i < latestResult.pharmacology.length - 1 ? ' · ' : ''}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 font-mono text-xs">
                        {language === 'FR' ? 'Aucun médicament aigu requis' : 'No acute meds required'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Cryptographic Proof SHA-256 */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>{t.results.shaDigest}</span>
                  <button
                    onClick={handleCopyHash}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedHash ? t.results.copied : t.results.copy}</span>
                  </button>
                </div>
                <div className="p-2 bg-slate-950 border border-slate-800 rounded font-mono text-xs text-slate-300 break-all select-all">
                  {latestResult.hashSha256}
                </div>
              </div>

              {/* Action Buttons: Export PDF / 45W Boost */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleExportPdf}
                  className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1.5 cursor-pointer font-mono"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-300" />
                  <span>{t.results.generatePdf}</span>
                </button>

                <button
                  onClick={onOpenBoost}
                  className="px-3.5 py-2 text-xs font-medium text-amber-300 bg-amber-950/30 hover:bg-amber-900/40 border border-amber-800/60 rounded transition-colors flex items-center gap-1.5 cursor-pointer font-mono"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>{boostActive ? t.results.boostReModalBtn : t.results.boostModalBtn}</span>
                </button>
              </div>

              {/* If boosted payload exists, display deep synthesis */}
              {latestResult.boostPayload && (
                <div className="mt-4 p-4 border border-amber-500/30 bg-amber-950/10 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-amber-400 font-semibold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      45W EXASCALE SYNTHESIS ENGINE (GEMINI 3.8 FLASH)
                    </span>
                    <span className="text-xs font-mono text-amber-400/80">
                      {latestResult.boostPayload.latencyMs}ms
                    </span>
                  </div>

                  {latestResult.boostPayload.synthesis.lethalThreats && (
                    <div className="space-y-1">
                      <div className="text-[11px] font-mono text-slate-400 uppercase">
                        {language === 'FR' ? 'Menaces Vitales Imminentes :' : 'Imminent Lethal Threats:'}
                      </div>
                      <ul className="text-xs text-slate-200 list-disc list-inside space-y-0.5">
                        {latestResult.boostPayload.synthesis.lethalThreats.map((tItem: string, idx: number) => (
                          <li key={idx}>{tItem}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {latestResult.boostPayload.synthesis.airwayTraumaAssessment && (
                    <div className="text-xs text-slate-300 pt-1 border-t border-amber-900/40">
                      <strong className="text-amber-300/90 font-mono">
                        {language === 'FR' ? 'Évaluation Voies Aériennes : ' : 'Airway Assessment: '}
                      </strong>
                      {latestResult.boostPayload.synthesis.airwayTraumaAssessment}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="border border-slate-800 bg-slate-900/30 rounded-lg p-12 text-center space-y-3">
              <Activity className="w-8 h-8 text-cyan-400/60 mx-auto" />
              <div className="text-sm font-semibold text-slate-200">
                {t.results.emptyTitle}
              </div>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                {t.results.emptyDesc}
              </p>
              <button
                onClick={handleRunInference}
                className="mt-2 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold text-xs font-mono rounded transition-colors cursor-pointer"
              >
                {t.actions.launch} (0.03s)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
