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

interface InferenceConsoleProps {
  onInferenceCompleted: (result: TacticalInferenceResult) => void;
  onOpenBoost: () => void;
  boostActive: boolean;
  latestResult: TacticalInferenceResult | null;
}

export const InferenceConsole: React.FC<InferenceConsoleProps> = ({
  onInferenceCompleted,
  onOpenBoost,
  boostActive,
  latestResult,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SCENARIO_PRESETS[0].id);
  const [vitals, setVitals] = useState<ClinicalVitals>({ ...SCENARIO_PRESETS[0].vitals });
  const [executionMode, setExecutionMode] = useState<ExecutionMode>('NINJA');
  const [isInferring, setIsInferring] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  const handleSelectScenario = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    const preset = SCENARIO_PRESETS.find((s) => s.id === scenarioId);
    if (preset) {
      setVitals({ ...preset.vitals });
    }
  };

  const handleRunInference = async () => {
    setIsInferring(true);
    // Allow minimal render cycle to show indicator, then execute in ~0.030s
    setTimeout(async () => {
      const res = await executeTacticalInference(vitals, executionMode);
      onInferenceCompleted(res);
      setIsInferring(false);
    }, 28);
  };

  const handleExportPdf = () => {
    if (!latestResult) return;
    const html = generateAuditHtmlReport(latestResult, vitals);
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
          <span className="text-white font-medium">SOVEREIGN CORE: 580 BYTES (v2.7 PRO)</span>
          <span aria-hidden="true">·</span>
          <span>22 MODELS @ 5,400 INF/SEC</span>
          <span aria-hidden="true">·</span>
          <span>Z-GHOST · Z-SYNC · Z-LEARN (INT2)</span>
          <span aria-hidden="true">·</span>
          <span>POWER: {boostActive ? '45W (BOOST)' : '<30W (SOVEREIGN)'}</span>
        </div>

        {/* Segmented Mode Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded">
          <button
            onClick={() => setExecutionMode('NINJA')}
            className={`px-3 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
              executionMode === 'NINJA'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            NINJA MODE (0.03s · Silent)
          </button>
          <button
            onClick={() => setExecutionMode('CALIBRATED_AUDIT')}
            className={`px-3 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
              executionMode === 'CALIBRATED_AUDIT'
                ? 'bg-slate-800 text-slate-100 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CALIBRATED AUDIT (Full Evidence)
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
                Tactical Scenario Preset
              </h2>
              <span className="text-xs text-slate-500 font-mono">Triage Presets</span>
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
                    <span className="text-xs font-semibold text-slate-100">{scenario.title}</span>
                    <span className="text-[11px] font-mono text-cyan-400/90">{scenario.category}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {scenario.summary}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Vitals Telemetry Editor */}
          <div className="border border-slate-800 bg-slate-900/40 p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Physiological Vitals Matrix
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
                  <span>Heart Rate</span>
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
                  <span>Systolic BP</span>
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
                  <span>Diastolic BP</span>
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
                  <span>Oxygen Saturation</span>
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
                  <span>Respiration Rate</span>
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
                  <span>Glasgow Coma Scale</span>
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
                  <span>Blood Lactate</span>
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
                  <span>Core Temperature</span>
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
                <span className="text-slate-300">Active Arterial Bleed</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-slate-950/60 border border-slate-800 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={vitals.tourniquetApplied}
                  onChange={(e) => setVitals({ ...vitals, tourniquetApplied: e.target.checked })}
                  className="rounded accent-cyan-400"
                />
                <span className="text-slate-300">Tourniquet Applied</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-slate-950/60 border border-slate-800 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={vitals.alteredMentalStatus}
                  onChange={(e) => setVitals({ ...vitals, alteredMentalStatus: e.target.checked })}
                  className="rounded accent-cyan-400"
                />
                <span className="text-slate-300">Altered Sensorium</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-slate-950/60 border border-slate-800 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={vitals.cbrnExposed}
                  onChange={(e) => setVitals({ ...vitals, cbrnExposed: e.target.checked })}
                  className="rounded accent-rose-500"
                />
                <span className={vitals.cbrnExposed ? 'text-rose-400 font-semibold' : 'text-slate-300'}>
                  CBRN / Toxin Vector
                </span>
              </label>
            </div>

            {/* Execute Trigger */}
            <button
              onClick={handleRunInference}
              disabled={isInferring}
              className="w-full py-2.5 px-4 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs tracking-wider uppercase font-mono rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isInferring ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>EXECUTING 22 MODELS...</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>RUN TACTICAL INFERENCE (0.03s)</span>
                </>
              )}
            </button>
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
                    Consensus Clinical Triage
                  </div>
                  <div className="text-2xl font-bold tracking-tight text-white mt-0.5 flex items-center gap-2">
                    <span
                      className={
                        latestResult.triageLevel.includes('RED')
                          ? 'text-rose-400'
                          : latestResult.triageLevel.includes('YELLOW')
                          ? 'text-amber-400'
                          : latestResult.triageLevel.includes('GREEN')
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
                    LATENCY: <strong className="text-cyan-400 tabular-nums">{latestResult.latencySeconds}s</strong>
                  </div>
                  <div>
                    CONFIDENCE: <strong className="text-slate-200 tabular-nums">{latestResult.confidenceScore}%</strong>
                  </div>
                  <div>
                    EXECUTION: <span className="text-slate-300">{latestResult.executionMode}</span>
                  </div>
                </div>
              </div>

              {/* Primary Key Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded">
                  <div className="text-[10px] uppercase font-mono text-slate-500">Shock Index</div>
                  <div className="text-xl font-bold font-mono text-slate-100 mt-1 tabular-nums">
                    {latestResult.shockIndex}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {latestResult.shockIndex >= 1.4 ? 'Profound Shock' : latestResult.shockIndex >= 1.0 ? 'Elevated SI' : 'Normal (<0.9)'}
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded">
                  <div className="text-[10px] uppercase font-mono text-slate-500">MTP Blood Trigger</div>
                  <div className="text-xl font-bold font-mono text-slate-100 mt-1">
                    {latestResult.mtpTriggered ? (
                      <span className="text-rose-400">ACTIVE 1:1:1</span>
                    ) : (
                      <span className="text-slate-400">HOLD</span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {latestResult.mtpTriggered ? 'Whole Blood Ready' : 'Normovolemic'}
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded">
                  <div className="text-[10px] uppercase font-mono text-slate-500">Lethal Triad Risk</div>
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
                  <div className="text-[10px] uppercase font-mono text-slate-500">MEDEVAC Runway</div>
                  <div className="text-xl font-bold font-mono text-slate-100 mt-1 tabular-nums">
                    {latestResult.evacWindowMinutes}m
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Golden Hour Window
                  </div>
                </div>
              </div>

              {/* Priority Interventions List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300">
                    Tactical Intervention Directives (Ordered Priority)
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
                            Dose: {item.dosage}
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
                  <span className="text-slate-400 font-mono text-[10px] uppercase">Airway Trajectory</span>
                  <p className="text-slate-200 leading-relaxed font-sans">{latestResult.airwayStrategy}</p>
                </div>

                <div className="bg-slate-950/40 border border-slate-800/80 p-3 rounded space-y-1">
                  <span className="text-slate-400 font-mono text-[10px] uppercase">Tactical Pharmacology</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {latestResult.pharmacology.length > 0 ? (
                      latestResult.pharmacology.map((drug, i) => (
                        <span key={i} className="text-xs font-mono text-slate-300">
                          {drug}
                          {i < latestResult.pharmacology.length - 1 ? ' · ' : ''}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 font-mono text-xs">No acute meds required</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Cryptographic Proof SHA-256 */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>SHA-256 AUDIT DIGEST</span>
                  <button
                    onClick={handleCopyHash}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
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
                  <span>Generate Audit PDF</span>
                </button>

                <button
                  onClick={onOpenBoost}
                  className="px-3.5 py-2 text-xs font-medium text-amber-300 bg-amber-950/30 hover:bg-amber-900/40 border border-amber-800/60 rounded transition-colors flex items-center gap-1.5 cursor-pointer font-mono"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>{boostActive ? 'Re-synthesize with 45W Boost' : 'Engage 45W Boost (PIN 2300)'}</span>
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
                      <div className="text-[11px] font-mono text-slate-400 uppercase">Imminent Lethal Threats:</div>
                      <ul className="text-xs text-slate-200 list-disc list-inside space-y-0.5">
                        {latestResult.boostPayload.synthesis.lethalThreats.map((t: string, idx: number) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {latestResult.boostPayload.synthesis.airwayTraumaAssessment && (
                    <div className="text-xs text-slate-300 pt-1 border-t border-amber-900/40">
                      <strong className="text-amber-300/90 font-mono">Airway Assessment: </strong>
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
                Ready for Tactical Clinical Inference
              </div>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Select a battlefield/disaster triage preset or modify the physiological vitals matrix on the left, then trigger sovereign inference to activate the 22 embedded neural models.
              </p>
              <button
                onClick={handleRunInference}
                className="mt-2 px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs font-mono rounded transition-colors cursor-pointer"
              >
                EXECUTE NOW (0.03s)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
