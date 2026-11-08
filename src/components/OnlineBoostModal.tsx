import React, { useState } from 'react';
import { X, Zap, Lock, AlertTriangle, ShieldCheck, RefreshCw, KeyRound } from 'lucide-react';
import { ClinicalVitals, TacticalInferenceResult } from '../types/zcore';

interface OnlineBoostModalProps {
  isOpen: boolean;
  onClose: () => void;
  vitals: ClinicalVitals;
  latestResult: TacticalInferenceResult | null;
  onBoostCompleted: (boostData: any) => void;
  boostActive: boolean;
  onDeactivateBoost: () => void;
}

export const OnlineBoostModal: React.FC<OnlineBoostModalProps> = ({
  isOpen,
  onClose,
  vitals,
  latestResult,
  onBoostCompleted,
  boostActive,
  onDeactivateBoost,
}) => {
  const [pin, setPin] = useState<string>('2300');
  const [consentChecked, setConsentChecked] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExecuteBoost = async () => {
    if (pin !== '2300') {
      setErrorMessage('Invalid Sovereign PIN. Enter tactical clearance code: 2300');
      return;
    }
    if (!consentChecked) {
      setErrorMessage('Explicit user consent required to elevate power envelope to 45W.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/boost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin,
          consentToken: 'CONSENT_GRANTED_45W_SOVEREIGN',
          clinicalVitals: vitals,
          scenarioTitle: vitals.mechanism || 'Austere Casualty Triage',
          observations: `HeartRate: ${vitals.heartRate}, BP: ${vitals.systolicBP}/${vitals.diastolicBP}, SpO2: ${vitals.oxygenSat}%, GCS: ${vitals.gcsScore}, Lactate: ${vitals.lactateMmol} mmol/L, Tourniquet: ${vitals.tourniquetApplied}, Bleed: ${vitals.activeHemorrhage}`,
          currentTriage: latestResult ? latestResult.triageLevel : 'PENDING',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete 45W exascale boost inference.');
      }

      onBoostCompleted(data);
      onClose();
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || 'Connection or inference error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-amber-500/40 rounded-lg max-w-lg w-full p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              ONLINE BOOST @45W (HYBRID EXASCALE)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Power State */}
        <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded text-xs space-y-1">
          <div className="font-mono text-amber-300 font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>THERMAL & POWER ENVELOPE ESCALATION: 45W PEAK</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            By default, Z-CORE runs 100% offline at &lt;30W. Engaging Online Boost elevates the NPU/SoC power envelope to 45W and connects via sovereign tunnel to Gemini 3.8 Flash for deep multimodal clinical synthesis.
          </p>
        </div>

        {boostActive ? (
          <div className="space-y-4">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded text-xs font-mono text-slate-300">
              <span className="text-emerald-400 font-bold">STATUS: 45W BOOST ACTIVE</span>
              <p className="text-slate-400 mt-1">
                The exascale synthesis engine is currently armed. You can de-escalate back to &lt;30W Sovereign Offline Mode at any time.
              </p>
            </div>

            <button
              onClick={() => {
                onDeactivateBoost();
                onClose();
              }}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold rounded transition-colors cursor-pointer"
            >
              DE-ESCALATE TO &lt;30W SOVEREIGN OFFLINE
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* PIN Entry */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sovereign Security PIN</span>
                </span>
                <span className="text-slate-500">Authorized: 2300</span>
              </div>
              <input
                type="password"
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN (2300)"
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Consent Checkbox */}
            <label className="flex items-start gap-3 p-3 bg-slate-950/70 border border-slate-800 rounded cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-0.5 accent-amber-400 rounded"
              />
              <span className="text-slate-300 leading-relaxed">
                I hereby grant <strong>explicit clinical consent</strong> to escalate the compute envelope to 45W and invoke server-side exascale synthesis. All patient data is strictly sanitized of PII.
              </span>
            </label>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-2.5 bg-rose-950/40 border border-rose-800/80 rounded text-xs text-rose-300 font-mono">
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleExecuteBoost}
              disabled={isSubmitting || !consentChecked}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>SYNTHESIZING VIA GEMINI 3.8 FLASH...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>AUTHENTICATE & ENGAGE 45W BOOST</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
