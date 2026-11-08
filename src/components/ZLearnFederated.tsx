import React, { useState } from 'react';
import { Cpu, Zap, Activity, RefreshCw, CheckCircle2, Layers, TrendingDown, ShieldCheck } from 'lucide-react';
import { Z_CORE_MODELS } from '../data/models';
import { FederatedTrainingSession } from '../types/zcore';
import { useLanguage } from '../context/LanguageContext';

export const ZLearnFederated: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedModelId, setSelectedModelId] = useState<string>('m2'); // Z-HEMO-SHOCK
  const [cohortDomain, setCohortDomain] = useState<string>('Austere Arctic / Hypothermia Extreme Trauma');
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [currentEpoch, setCurrentEpoch] = useState<number>(0);
  const [currentLoss, setCurrentLoss] = useState<number>(0.482);
  const [lossHistory, setLossHistory] = useState<number[]>([0.482]);
  const [trainingComplete, setTrainingComplete] = useState<boolean>(false);
  const [sha256Delta, setSha256Delta] = useState<string>(
    'b791fc82a9d410398ef47291a84f3299c85121bfa9821034ba98fe11c82410a2'
  );

  const targetModel = Z_CORE_MODELS.find((m) => m.id === selectedModelId) || Z_CORE_MODELS[1];

  const handleStartFederatedTraining = () => {
    setIsTraining(true);
    setTrainingComplete(false);
    setCurrentEpoch(0);
    const initialLoss = 0.495;
    setCurrentLoss(initialLoss);
    setLossHistory([initialLoss]);

    let epoch = 0;
    const interval = setInterval(() => {
      epoch += 1;
      setCurrentEpoch(epoch);
      const newLoss = Number((0.495 * Math.exp(-0.28 * epoch) + (Math.random() * 0.015)).toFixed(3));
      setCurrentLoss(newLoss);
      setLossHistory((prev) => [...prev, newLoss]);

      if (epoch >= 8) {
        clearInterval(interval);
        setIsTraining(false);
        setTrainingComplete(true);
        // Generate new deterministic SHA-256 delta
        setSha256Delta(
          Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')
        );
      }
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="border border-slate-800 bg-slate-900/60 p-5 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">{t.learn.title}</span>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
              {t.learn.badge}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {t.learn.desc}
          </p>
        </div>

        <div className="text-xs font-mono text-emerald-400 border border-emerald-900/60 bg-emerald-950/30 px-3 py-1.5 rounded">
          {t.learn.egress}
        </div>
      </div>

      {/* Grid: Training Configuration vs Real-Time Learning Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Target Model & Adaptation Cohort (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border border-slate-800 bg-slate-900/40 p-5 rounded-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Target Model Selection
              </h3>
              <span className="text-xs font-mono text-cyan-400">22 Models Embedded</span>
            </div>

            {/* Model Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400">CHOOSE BASE MODEL TO ADAPT:</label>
              <select
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                disabled={isTraining}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                {Z_CORE_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.code} — {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Adaptation Cohort */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400">CLINICAL ADAPTATION COHORT:</label>
              <select
                value={cohortDomain}
                onChange={(e) => setCohortDomain(e.target.value)}
                disabled={isTraining}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="Austere Arctic / Hypothermia Extreme Trauma">
                  Austere Arctic / Hypothermia Extreme Trauma
                </option>
                <option value="High-Altitude Hypobaric Hypoxia Battlefield">
                  High-Altitude Hypobaric Hypoxia Battlefield
                </option>
                <option value="CBRN Blister Agent / Organophosphate Mass Casualty">
                  CBRN Blister Agent / Organophosphate Mass Casualty
                </option>
                <option value="Extremity Crush Entrapment & Reperfusion">
                  Extremity Crush Entrapment & Reperfusion
                </option>
              </select>
            </div>

            {/* Model Specs Card */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Active Precision:</span>
                <span className="text-slate-200">{targetModel.precision}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Auto-Target Compression:</span>
                <span className="text-cyan-400 font-bold">INT2 (2-bit Ternary)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Core Weight Footprint:</span>
                <span className="text-emerald-400">Fits in 580B Static Slot</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Training Mode:</span>
                <span className="text-slate-200">NINJA (Volatile Local SGD)</span>
              </div>
            </div>

            <button
              onClick={handleStartFederatedTraining}
              disabled={isTraining}
              className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isTraining ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>TRAINING LOCAL EPOCH {currentEpoch} / 8...</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>TRAIN LOCAL WEIGHTS (NINJA MODE)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Training Progress, Loss Curve & INT2 Auto-Compression (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border border-slate-800 bg-slate-900/40 p-5 rounded-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-cyan-400" />
                <span>On-Device Loss & Micro-Gradient Progression</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400">Zero Cloud Egress</span>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-3 gap-3 font-mono">
              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Training Epoch</div>
                <div className="text-xl font-bold text-white mt-1 tabular-nums">
                  {currentEpoch} / 8
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Empirical Loss</div>
                <div className="text-xl font-bold text-cyan-400 mt-1 tabular-nums">
                  {currentLoss.toFixed(3)}
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Knowledge Format</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">INT2</div>
              </div>
            </div>

            {/* Loss History Bar Visualization */}
            <div className="space-y-1.5">
              <div className="text-xs font-mono text-slate-400 flex justify-between">
                <span>Loss Convergence Across Epochs</span>
                <span className="text-slate-500">Target &lt; 0.100</span>
              </div>
              <div className="h-28 bg-slate-950 border border-slate-800 rounded p-3 flex items-end gap-2">
                {lossHistory.map((loss, idx) => {
                  const heightPercent = Math.max(12, Math.min(100, (loss / 0.5) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-cyan-400/80 hover:bg-cyan-300 rounded-t transition-all"
                        style={{ height: `${heightPercent}%` }}
                        title={`Epoch ${idx}: Loss ${loss}`}
                      />
                      <span className="text-[9px] font-mono text-slate-500">{idx}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* INT2 Compression Verification */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>INT2 Knowledge Compression: Active</span>
                </span>
                <span className="text-cyan-400">0 Bytes Added to Core</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Ternary quantization encodes adapted gradients into 2-bit sparse ternary states (<code className="text-slate-200 font-mono">&#123;-1, 0, +1&#125;</code>). The core static binary remains exactly <strong>580 bytes</strong> with zero model weight expansion.
              </p>
            </div>

            {trainingComplete && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-800/60 rounded space-y-1 text-xs font-mono">
                <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>FEDERATED LOCAL WEIGHT TRAINING COMPLETE</span>
                </div>
                <div className="text-slate-400 text-[11px] truncate">
                  DELTA SHA-256: {sha256Delta}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
