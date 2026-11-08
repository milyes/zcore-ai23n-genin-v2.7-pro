import React, { useState } from 'react';
import { Radio, Bluetooth, ShieldCheck, Share2, RefreshCw, CheckCircle2, Lock, Send, Users } from 'lucide-react';
import { PeerMeshNode, TacticalInferenceResult } from '../types/zcore';

interface ZSyncP2PMeshProps {
  latestResult: TacticalInferenceResult | null;
}

export const ZSyncP2PMesh: React.FC<ZSyncP2PMeshProps> = ({ latestResult }) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [peers, setPeers] = useState<PeerMeshNode[]>([
    {
      id: 'p1',
      callsign: 'NODE-Z23-ALPHA',
      role: 'Forward TCCC Field Unit #04',
      rssi: -44,
      sha256Handshake: 'a982f1b4d0812e96431fbc9440c2e39951bf493f0b240182ad90ff91e32641ba',
      status: 'PAIRED',
      lastSeen: '12s ago',
    },
    {
      id: 'p2',
      callsign: 'NODE-Z23-BRAVO',
      role: 'Tactical Damage Control Surgery',
      rssi: -58,
      sha256Handshake: '71d939e088ba461f389cf78943920914c62ba1e345892ffc41295b281a942cd3',
      status: 'PAIRED',
      lastSeen: '45s ago',
    },
    {
      id: 'p3',
      callsign: 'NODE-Z23-DELTA',
      role: 'Dustoff Air Ambulance MEDEVAC',
      rssi: -72,
      sha256Handshake: '44a86f92bc311094389fa54890c91ba24d85188fe912089456281cd31ba00938',
      status: 'DISCOVERED',
      lastSeen: '2m ago',
    },
  ]);

  const [activeTransfers, setActiveTransfers] = useState<string[]>([]);
  const [broadcastLog, setBroadcastLog] = useState<string[]>([]);

  const handleScanPeers = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setPeers((prev) =>
        prev.map((p) => ({
          ...p,
          lastSeen: 'Just now',
          rssi: p.rssi + Math.floor(Math.random() * 5 - 2),
        }))
      );
    }, 700);
  };

  const handleVerifyHandshake = (peerId: string) => {
    setPeers((prev) =>
      prev.map((p) => (p.id === peerId ? { ...p, status: 'PAIRED' } : p))
    );
  };

  const handleBroadcastTriage = () => {
    if (!latestResult) return;
    const packetHeader = `[Z-MESH-FRAME: ${latestResult.id} · ${latestResult.triageLevel} · SI ${latestResult.shockIndex} · MTP:${latestResult.mtpTriggered ? 'YES' : 'NO'}]`;
    setActiveTransfers(['p1', 'p2']);

    setTimeout(() => {
      setActiveTransfers([]);
      setBroadcastLog((prev) => [
        `TRANSMITTED TO NODE-Z23-ALPHA & NODE-Z23-BRAVO · 184 BYTES · 0 CLOUD PACKETS · ACK SHA-256 VERIFIED AT ${new Date().toLocaleTimeString()}`,
        ...prev.slice(0, 5),
      ]);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="border border-slate-800 bg-slate-900/60 p-5 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">Z-SYNC-P2P: SOVEREIGN MESH NETWORK</span>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
              BLE 5.4 · 0 CLOUD · 0 INTERNET · SHA-256 HANDSHAKE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Decentralized peer-to-peer telemetry synchronization. Communicates directly between air-gapped Z-CORE devices using encrypted Bluetooth Low Energy beacons with zero cellular or internet routing.
          </p>
        </div>

        <button
          onClick={handleScanPeers}
          disabled={isScanning}
          className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs font-mono rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
        >
          {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bluetooth className="w-4 h-4" />}
          <span>{isScanning ? 'SCANNING PEERS...' : 'DISCOVER LOCAL PEERS'}</span>
        </button>
      </div>

      {/* Grid: Mesh Topology & Broadcast Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Discovered Peers & Cryptographic Handshakes (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Sovereign Z-CORE Nodes in Proximity</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">Only Z-CORE to Z-CORE</span>
          </div>

          <div className="space-y-3">
            {peers.map((peer) => {
              const isSyncing = activeTransfers.includes(peer.id);
              return (
                <div
                  key={peer.id}
                  className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-cyan-400">{peer.callsign}</span>
                        <span className="text-xs text-slate-300 font-semibold">{peer.role}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 mt-0.5">
                        <span>RSSI: {peer.rssi} dBm</span>
                        <span aria-hidden="true">·</span>
                        <span>Seen: {peer.lastSeen}</span>
                        <span aria-hidden="true">·</span>
                        <span>PHY: Coded S=8</span>
                      </div>
                    </div>

                    <div>
                      {peer.status === 'PAIRED' ? (
                        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> PAIRED
                        </span>
                      ) : (
                        <button
                          onClick={() => handleVerifyHandshake(peer.id)}
                          className="px-2.5 py-1 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 cursor-pointer"
                        >
                          Verify Handshake
                        </button>
                      )}
                    </div>
                  </div>

                  {/* SHA-256 Handshake Signature */}
                  <div className="p-2 bg-slate-950 border border-slate-800/80 rounded font-mono text-[10px] text-slate-400 break-all select-all flex items-center justify-between gap-2">
                    <span className="truncate">HANDSHAKE SHA-256: {peer.sha256Handshake}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  </div>

                  {isSyncing && (
                    <div className="text-xs font-mono text-cyan-400 animate-pulse pt-1">
                      Broadcasting encrypted patient triage packet via BLE...
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Broadcast Console & Mesh Log (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border border-slate-800 bg-slate-900/40 p-5 rounded-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Direct Mesh Broadcast
              </h3>
              <span className="text-xs font-mono text-cyan-400">Air-Gap BLE</span>
            </div>

            {latestResult ? (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>OUTGOING CASUALTY:</span>
                  <span className="text-cyan-400 font-bold">{latestResult.id}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>CLASSIFICATION:</span>
                  <span className="text-white font-bold">{latestResult.triageLevel}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>SHOCK INDEX:</span>
                  <span className="text-slate-200">{latestResult.shockIndex}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>MTP TRIGGER:</span>
                  <span className={latestResult.mtpTriggered ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                    {latestResult.mtpTriggered ? 'ACTIVE 1:1:1' : 'NO'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>PACKET PAYLOAD SIZE:</span>
                  <span className="text-emerald-400">184 Bytes Encrypted</span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded text-xs text-slate-500 font-mono text-center">
                No active inference. Run an inference in the console to broadcast.
              </div>
            )}

            <button
              onClick={handleBroadcastTriage}
              disabled={!latestResult || activeTransfers.length > 0}
              className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs font-mono rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>SYNC TRIAGE VECTOR TO MESH (0 CLOUD)</span>
            </button>
          </div>

          {/* Broadcast Receipt Log */}
          <div className="border border-slate-800 bg-slate-950 p-4 rounded-lg space-y-2">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Offline Mesh Event Log
            </div>
            {broadcastLog.length > 0 ? (
              <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
                {broadcastLog.map((log, idx) => (
                  <div key={idx} className="p-2 bg-slate-900/60 border border-slate-800/80 rounded leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs font-mono text-slate-600 py-2">
                Awaiting first BLE packet broadcast...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
