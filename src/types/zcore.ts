export type TriageLevel = 'IMMEDIATE (RED)' | 'DELAYED (YELLOW)' | 'MINIMAL (GREEN)' | 'EXPECTANT (BLACK)';

export type ExecutionMode = 'NINJA' | 'CALIBRATED_AUDIT';

export interface ClinicalVitals {
  heartRate: number; // bpm (e.g. 138)
  systolicBP: number; // mmHg (e.g. 78)
  diastolicBP: number; // mmHg (e.g. 42)
  respiratoryRate: number; // /min (e.g. 32)
  oxygenSat: number; // % (e.g. 88)
  gcsScore: number; // 3-15 (e.g. 8)
  temperatureC: number; // C (e.g. 35.1)
  lactateMmol: number; // mmol/L (e.g. 4.6)
  baseDeficit: number; // mEq/L (e.g. -8.5)
  mechanism: string; // e.g., 'Penetrating Blast / Shrapnel'
  tourniquetApplied: boolean;
  activeHemorrhage: boolean;
  alteredMentalStatus: boolean;
  cbrnExposed: boolean;
}

export interface TacticalIntervention {
  priority: number;
  action: string;
  dosage: string | null;
  clinicalRationale: string;
  protocolStandard: 'TCCC' | 'ATLS' | 'SEPSIS-3' | 'BTF-4' | 'CBRN-TACTICAL';
}

export interface TacticalInferenceResult {
  id: string;
  timestamp: string;
  executionMode: ExecutionMode;
  latencySeconds: number; // e.g. 0.028s
  triageLevel: TriageLevel;
  shockIndex: number;
  meanArterialPressure: number;
  calculatedGCS: number;
  mtpTriggered: boolean;
  lethalTriadRisk: 'CRITICAL' | 'ELEVATED' | 'NOMINAL';
  hypoxiaRisk: 'IMMINENT' | 'MONITOR' | 'LOW';
  cbrnRisk: 'SLUDGEM_ACTIVE' | 'NONE';
  interventions: TacticalIntervention[];
  pharmacology: string[];
  airwayStrategy: string;
  evacPriorityCategory: string;
  evacWindowMinutes: number;
  confidenceScore: number;
  hashSha256: string;
  modelsInvoked: number;
  silentExecution: boolean;
  boosted: boolean;
  boostPayload?: {
    boostPower: string;
    synthesis: any;
    latencyMs: number;
  };
}

export interface ClinicalModelSpec {
  id: string;
  code: string;
  name: string;
  domain: string;
  latencyMs: number;
  parametersK: number;
  precision: 'INT4' | 'INT2' | 'INT8' | 'FP16';
  prunePercent: number;
  macsPerSec: string;
  standard: string;
  status: 'ACTIVE' | 'STANDBY';
  description: string;
  isAdapted?: boolean;
}

export interface PeerMeshNode {
  id: string;
  callsign: string;
  role: string;
  rssi: number;
  sha256Handshake: string;
  status: 'PAIRED' | 'DISCOVERED' | 'SYNCING';
  lastSeen: string;
}

export interface FederatedTrainingSession {
  targetModelId: string;
  domain: string;
  epochs: number;
  lossHistory: number[];
  int2CompressionRatio: string;
  cloudEgressBytes: 0;
  completed: boolean;
  sha256Delta: string;
}

export interface ScenarioPreset {
  id: string;
  title: string;
  category: 'TRAUMA' | 'SEPSIS' | 'NEURO' | 'CBRN' | 'CRUSH';
  summary: string;
  vitals: ClinicalVitals;
}
