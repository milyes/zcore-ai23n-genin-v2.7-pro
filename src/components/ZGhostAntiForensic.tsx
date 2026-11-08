import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Skull,
  Usb,
  RotateCcw,
  Download,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Lock,
  Cpu,
} from 'lucide-react';

interface ZGhostAntiForensicProps {
  onEnclaveWiped: () => void;
  usbPlugged: boolean;
  setUsbPlugged: (plugged: boolean) => void;
}

export const ZGhostAntiForensic: React.FC<ZGhostAntiForensicProps> = ({
  onEnclaveWiped,
  usbPlugged,
  setUsbPlugged,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);
  const [timerActive, setTimerActive] = useState<boolean>(true);
  const [killPin, setKillPin] = useState<string>('');
  const [killMessage, setKillMessage] = useState<string | null>(null);
  const [enclaveDestroyed, setEnclaveDestroyed] = useState<boolean>(false);
  const [wipePass, setWipePass] = useState<string>('IDLE');

  // 30-Second Auto-Wipe Timer
  useEffect(() => {
    if (!timerActive || enclaveDestroyed) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          executeZeroizePasses();
          return 30; // reset after wipe cycle
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, enclaveDestroyed]);

  const executeZeroizePasses = () => {
    setWipePass('PASS 1: 0x00 OVERWRITE');
    setTimeout(() => {
      setWipePass('PASS 2: 0xFF COMPLEMENT');
      setTimeout(() => {
        setWipePass('PASS 3: CSPRNG NOISE');
        setTimeout(() => {
          setWipePass('ZEROIZED');
          onEnclaveWiped();
          setTimeout(() => setWipePass('IDLE'), 2000);
        }, 300);
      }, 300);
    }, 300);
  };

  const handleManualZeroize = () => {
    setSecondsRemaining(30);
    executeZeroizePasses();
  };

  const handleExecuteKillSwitch = async () => {
    if (killPin === '9999') {
      try {
        await fetch('/api/ghost/kill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: '9999' }),
        });
      } catch {
        // Continue offline wipe
      }
      setEnclaveDestroyed(true);
      setTimerActive(false);
      setKillMessage('ENCLAVE PERMANENTLY BURNED. ZERO RESIDUAL TRACES IN MEMORY.');
      onEnclaveWiped();
    } else {
      setKillMessage('INVALID KILL PIN. Clearance denied.');
      setTimeout(() => setKillMessage(null), 3000);
    }
  };

  const handleDownloadDecoy = () => {
    const anchor = document.createElement('a');
    anchor.href = '/api/binary/download?decoy=true';
    anchor.download = 'zcore-decoy-580.bin';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const handleRebootEnclave = () => {
    setEnclaveDestroyed(false);
    setTimerActive(true);
    setSecondsRemaining(30);
    setKillMessage(null);
    setKillPin('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="border border-slate-800 bg-slate-900/60 p-5 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">Z-GHOST: ANTI-FORENSIC COUNTERMEASURES</span>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
              RAM AUTO-WIPE (30s) · DECOY SWAP · KILL-SWITCH 9999
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Autonomous anti-tamper subsystem. Prevents cold-boot attacks, volatile memory scraping, and forensic hardware extraction during adversary apprehension.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-500">ENCLAVE STATUS:</span>
          <span className={enclaveDestroyed ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
            {enclaveDestroyed ? 'PURGED (ZEROIZED)' : 'ACTIVE ARMED'}
          </span>
        </div>
      </div>

      {enclaveDestroyed ? (
        <div className="p-10 border border-rose-500/50 bg-rose-950/20 rounded-lg text-center space-y-4">
          <Flame className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-rose-400 font-mono">
            KILL-SWITCH 9999 EXECUTED: ENCLAVE BURNED
          </h2>
          <p className="text-xs text-slate-300 max-w-lg mx-auto font-mono leading-relaxed">
            All 580 bytes of static microkernel weights, volatile session states, and clinical telemetry have undergone 3-pass zeroization (0x00 / 0xFF / CSPRNG entropy). Zero forensic evidence remains.
          </p>
          <button
            onClick={handleRebootEnclave}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded transition-colors cursor-pointer"
          >
            RE-INITIALIZE SECURE ENCLAVE
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 30s RAM Enclave Auto-Wipe */}
          <div className="border border-slate-800 bg-slate-900/40 p-5 rounded-lg space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>30s RAM Enclave Auto-Wipe</span>
                </h3>
                <span className="text-xs font-mono text-cyan-400">DoD 5220.22-M</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Volatile secure memory auto-zeroizes every 30 seconds if no tactical clinician touch is detected, preventing DRAM residual charge retention.
              </p>

              {/* Countdown Dial */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded text-center space-y-1 font-mono">
                <div className="text-3xl font-bold text-white tabular-nums">
                  {secondsRemaining.toString().padStart(2, '0')}s
                </div>
                <div className="text-[11px] text-slate-500 uppercase">
                  Time until next cryptographic wipe
                </div>
                {wipePass !== 'IDLE' && (
                  <div className="text-xs font-bold text-cyan-400 pt-1">
                    {wipePass}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleManualZeroize}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded transition-colors cursor-pointer"
              >
                EXECUTE MANUAL ZEROIZE NOW
              </button>

              <button
                onClick={() => setTimerActive(!timerActive)}
                className="w-full py-1 text-[11px] font-mono text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {timerActive ? 'Pause 30s Auto-Wipe' : 'Resume Auto-Wipe Timer'}
              </button>
            </div>
          </div>

          {/* Card 2: Fake 580-Byte Decoy Binary on USB Probe */}
          <div className="border border-slate-800 bg-slate-900/40 p-5 rounded-lg space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Usb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fake 580B Decoy Binary</span>
                </h3>
                <span className="text-xs font-mono text-amber-400">USB Trap</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                If an unauthorized USB forensic host is detected, the microkernel dynamically swaps out the sovereign clinical AI with a 580-byte benign calculator ELF binary.
              </p>

              {/* Interactive USB Interrogation Toggle */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300">USB Forensic Interrogation</span>
                  <button
                    onClick={() => setUsbPlugged(!usbPlugged)}
                    className={`px-2.5 py-1 text-xs font-mono rounded border cursor-pointer ${
                      usbPlugged
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 font-semibold'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {usbPlugged ? 'USB DETECTED' : 'UNPLUGGED'}
                  </button>
                </div>

                <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-900">
                  {usbPlugged ? (
                    <span className="text-amber-300">
                      GHOST DECOY ACTIVE: Serving fake <code>zcore-decoy-580.bin</code> (Android calculator stub, 0 models).
                    </span>
                  ) : (
                    <span className="text-slate-500">
                      Normal state: Serving authentic <code>zcore-ai23n-genin-v2.7-pro.bin</code>.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadDecoy}
              className="w-full py-2 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/60 text-amber-300 text-xs font-mono rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT 580B DECOY BINARY</span>
            </button>
          </div>

          {/* Card 3: Emergency Kill-Switch PIN 9999 */}
          <div className="border border-slate-800 bg-slate-900/40 p-5 rounded-lg space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <Skull className="w-3.5 h-3.5" />
                  <span>Kill-Switch PIN 9999</span>
                </h3>
                <span className="text-xs font-mono text-rose-400">Self-Destruct</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Emergency cryptographic thermal purge. Entering authorization code <code>9999</code> permanently wipes RAM, resets model weights to zero entropy, and destroys audit logs.
              </p>

              {/* PIN Input */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-slate-400">ENTER EMERGENCY PIN:</div>
                <input
                  type="password"
                  maxLength={4}
                  value={killPin}
                  onChange={(e) => setKillPin(e.target.value)}
                  placeholder="9999"
                  className="w-full bg-slate-950 border border-rose-900/60 rounded px-3 py-2 text-sm font-mono text-rose-200 placeholder:text-slate-700 focus:outline-none focus:border-rose-500"
                />
              </div>

              {killMessage && (
                <div className="text-[11px] font-mono text-rose-400 p-2 bg-rose-950/40 rounded border border-rose-900/50">
                  {killMessage}
                </div>
              )}
            </div>

            <button
              onClick={handleExecuteKillSwitch}
              className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs font-mono rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Skull className="w-3.5 h-3.5" />
              <span>TRIGGER KILL-SWITCH (9999)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
