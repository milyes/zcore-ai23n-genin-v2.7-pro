import React, { useState } from 'react';
import { Cpu, Search, Layers, Zap, CheckCircle2 } from 'lucide-react';
import { Z_CORE_MODELS } from '../data/models';
import { ClinicalModelSpec } from '../types/zcore';

export const ModelMatrix: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [activeModel, setActiveModel] = useState<ClinicalModelSpec>(Z_CORE_MODELS[0]);

  const domains = ['ALL', 'Hemodynamics', 'Neurotrauma', 'Airway', 'CBRN', 'Hematology', 'Triage'];

  const filteredModels = Z_CORE_MODELS.filter((m) => {
    const matchesSearch =
      m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.domain.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDomain =
      selectedDomain === 'ALL' || m.domain.toLowerCase().includes(selectedDomain.toLowerCase());

    return matchesSearch && matchesDomain;
  });

  return (
    <div className="space-y-6">
      {/* Top Aggregate Telemetry Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg">
          <div className="text-[11px] font-mono uppercase text-slate-400">Total Models Embedded</div>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">22 / 22</div>
          <div className="text-xs text-slate-400 mt-0.5">Sovereign microkernel matrix</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg">
          <div className="text-[11px] font-mono uppercase text-slate-400">Inference Throughput</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">5,400 inf/s</div>
          <div className="text-xs text-slate-400 mt-0.5">Vectorized SIMD NEON</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg">
          <div className="text-[11px] font-mono uppercase text-slate-400">Power Envelope</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">&lt; 30 W</div>
          <div className="text-xs text-slate-400 mt-0.5">Mobile aarch64 SoC</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg">
          <div className="text-[11px] font-mono uppercase text-slate-400">Optimization Compression</div>
          <div className="text-2xl font-bold font-mono text-slate-100 mt-1 tabular-nums">INT4 · 80% Pruned</div>
          <div className="text-xs text-slate-400 mt-0.5">580-byte tiny core loader</div>
        </div>
      </div>

      {/* Filter and Search Ribbon */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800 bg-slate-900/40 p-3 rounded-lg">
        {/* Domain Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 bg-slate-950 rounded">
          {domains.map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap cursor-pointer ${
                selectedDomain === domain
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search 22 models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Model Grid and Model Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Model Cards Grid (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[680px] overflow-y-auto pr-1">
          {filteredModels.map((model) => {
            const isSelected = activeModel.id === model.id;
            return (
              <button
                key={model.id}
                onClick={() => setActiveModel(model)}
                className={`text-left p-3.5 rounded border transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-cyan-500/70 bg-cyan-950/20 text-white'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-cyan-400">{model.code}</span>
                  <span className="text-slate-500">{model.latencyMs}ms</span>
                </div>
                <div className="text-sm font-semibold text-slate-100 mt-1 line-clamp-1">
                  {model.name}
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mt-2">
                  <span>{model.precision}</span>
                  <span aria-hidden="true">·</span>
                  <span>{model.prunePercent}% Pruned</span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{model.domain}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Model Detail Panel (5 cols) */}
        <div className="lg:col-span-5 border border-slate-800 bg-slate-900/60 p-5 rounded-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold">{activeModel.code}</span>
              <h3 className="text-base font-bold text-white mt-0.5">{activeModel.name}</h3>
            </div>
            <div className="text-right text-xs font-mono text-emerald-400">
              ACTIVE
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {activeModel.description}
          </p>

          <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Clinical Domain:</span>
              <span className="text-slate-200">{activeModel.domain}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Standard / Protocol:</span>
              <span className="text-cyan-300">{activeModel.standard}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Inference Latency:</span>
              <span className="text-slate-100 tabular-nums">{activeModel.latencyMs} ms</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Quantization Format:</span>
              <span className="text-slate-100">{activeModel.precision} (Symmetric 4-bit)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Sparsity Prune Ratio:</span>
              <span className="text-slate-100">{activeModel.prunePercent}% structured</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Compute Density:</span>
              <span className="text-slate-100">{activeModel.macsPerSec} MACs/sec</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Parameter Count:</span>
              <span className="text-slate-100">{activeModel.parametersK}K parameters</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded text-xs space-y-1">
            <div className="font-mono text-[11px] text-slate-400 uppercase">Hardware Binding</div>
            <div className="text-slate-300 font-mono text-[11px]">
              aarch64 NEON vector intrinsics · Direct L1 cache pinned memory buffer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
