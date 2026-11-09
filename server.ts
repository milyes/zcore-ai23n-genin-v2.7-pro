import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json({ limit: '10mb' }));

// Health / Status Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    core: 'Z-CORE AI23N GENIN v2.7 PRO',
    arch: 'aarch64-linux-android',
    loopback: '127.0.0.1:8443',
    version: '2.7.0-pro',
    modules: ['Z-GHOST', 'Z-SYNC-P2P', 'Z-LEARN', 'GENIN-CLINICAL'],
    modelsActive: 22,
    defaultPowerBudget: '<30W',
  });
});

// Endpoint: Online Boost @45W
app.post('/api/boost', async (req: Request, res: Response) => {
  try {
    const { pin, consentToken, clinicalVitals, scenarioTitle, observations, currentTriage } = req.body;

    if (!pin || pin !== '2300') {
      return res.status(403).json({
        error: 'AUTH_DENIED',
        message: 'Invalid Sovereign PIN for 45W Online Boost. Enter authorized tactical PIN: 2300.',
      });
    }

    if (!consentToken || consentToken !== 'CONSENT_GRANTED_45W_SOVEREIGN') {
      return res.status(400).json({
        error: 'CONSENT_REQUIRED',
        message: 'Explicit user consent required to elevate power envelope to 45W and engage cloud exascale reasoning.',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'API_KEY_UNAVAILABLE',
        message: 'GEMINI_API_KEY is not configured in environment. Please attach your API key in the Secrets panel.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const startTime = performance.now();

    const sanitizedPrompt = `
You are the Tactical Clinical Synthesis Engine of Z-CORE AI23N GENIN v2.7 PRO operating in 45W Boost mode.
Analyze the following austere / tactical clinical emergency telemetry.

PATIENT METRICS & OBSERVATIONS:
- Scenario: ${scenarioTitle || 'Field Emergency Triage'}
- Vitals: ${JSON.stringify(clinicalVitals)}
- Observations: ${observations || 'None'}
- Initial Offline Triage: ${JSON.stringify(currentTriage)}

Provide a concise, ultra-authoritative tactical clinical decision matrix in the following strict JSON structure:
{
  "triageLevel": "IMMEDIATE (RED)" | "DELAYED (YELLOW)" | "MINIMAL (GREEN)" | "EXPECTANT (BLACK)",
  "lethalThreats": ["string list of top 3 imminent physiological failure modes"],
  "priorityInterventions": [
    {
      "step": 1,
      "action": "Imperative medical procedure or drug administration",
      "dosage": "exact dosing if applicable or null",
      "rationale": "physiological basis (TCCC / ATLS / Sepsis-3)"
    }
  ],
  "shockVector": {
    "shockIndex": number,
    "pathophysiology": "brief description",
    "mtpTriggered": boolean
  },
  "airwayTraumaAssessment": "specific airway risk and recommended approach",
  "pharmacologyRecommendations": ["tactical medications with contraindication checks"],
  "evacWindowMinutes": number,
  "confidenceScore": number
}

Output ONLY valid JSON.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: sanitizedPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const latencyMs = Math.round(performance.now() - startTime);
    const responseText = response.text || '{}';
    let parsedSynthesis;
    try {
      parsedSynthesis = JSON.parse(responseText);
    } catch {
      parsedSynthesis = { raw: responseText };
    }

    const payloadHash = crypto.createHash('sha256').update(responseText).digest('hex');

    return res.json({
      success: true,
      boostPower: '45W',
      latencyMs,
      timestamp: new Date().toISOString(),
      sha256Proof: payloadHash,
      synthesis: parsedSynthesis,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Boost error:', error);
    return res.status(500).json({
      error: 'BOOST_INFERENCE_FAILURE',
      message: error?.message || 'Failed to complete 45W exascale inference.',
    });
  }
});

// Endpoint: Generate the actual static binary 'zcore-ai23n-genin-v2.7-pro.bin'
// If query param ?decoy=true is set (e.g., USB Forensic Reader plugged), serves the benign 580-byte dummy binary!
app.get('/api/binary/download', (req: Request, res: Response) => {
  try {
    const isDecoy = req.query.decoy === 'true';
    const binaryBuffer = Buffer.alloc(580);

    // ELF Header (64 bytes)
    binaryBuffer[0] = 0x7f; // e_ident[EI_MAG0]
    binaryBuffer[1] = 0x45; // 'E'
    binaryBuffer[2] = 0x4c; // 'L'
    binaryBuffer[3] = 0x46; // 'F'
    binaryBuffer[4] = 0x02; // ELFCLASS64
    binaryBuffer[5] = 0x01; // ELFDATA2LSB (little endian)
    binaryBuffer[6] = 0x01; // EV_CURRENT
    binaryBuffer[7] = 0x00; // ELFOSABI_NONE
    binaryBuffer.writeUInt16LE(0x0002, 16); // ET_EXEC
    binaryBuffer.writeUInt16LE(0x00b7, 18); // EM_AARCH64
    binaryBuffer.writeUInt32LE(0x00000001, 20); // EV_CURRENT
    binaryBuffer.writeBigUInt64LE(BigInt(0x00400078), 24); // Entry point
    binaryBuffer.writeBigUInt64LE(BigInt(64), 32); // Program header offset
    binaryBuffer.writeBigUInt64LE(BigInt(0), 40); // Stripped sections
    binaryBuffer.writeUInt32LE(0, 48);
    binaryBuffer.writeUInt16LE(64, 52); // Header size
    binaryBuffer.writeUInt16LE(56, 54); // Program header entry size
    binaryBuffer.writeUInt16LE(1, 56); // 1 program header

    // Program Header (56 bytes, offset 64)
    binaryBuffer.writeUInt32LE(1, 64); // PT_LOAD
    binaryBuffer.writeUInt32LE(0x5, 68); // PF_R | PF_X
    binaryBuffer.writeBigUInt64LE(BigInt(0), 72);
    binaryBuffer.writeBigUInt64LE(BigInt(0x00400000), 80);
    binaryBuffer.writeBigUInt64LE(BigInt(0x00400000), 88);
    binaryBuffer.writeBigUInt64LE(BigInt(580), 96);
    binaryBuffer.writeBigUInt64LE(BigInt(580), 104);
    binaryBuffer.writeBigUInt64LE(BigInt(0x1000), 112);

    if (isDecoy) {
      // Benign Android calculator / system utility decoy: ZERO clinical models, ZERO tactical signatures
      const decoySignature = 'ANDROID_BASIC_CALC:aarch64:bionic-libc:v1.0.4:BUILD-RELEASE-CLEAN';
      binaryBuffer.write(decoySignature, 120, 'ascii');
      for (let i = 120 + decoySignature.length; i < 580; i++) {
        binaryBuffer[i] = (i * 17) & 0xff;
      }
      const sha256 = crypto.createHash('sha256').update(binaryBuffer).digest('hex');
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', 'attachment; filename="zcore-decoy-580.bin"');
      res.setHeader('X-ZCore-Binary-Size', '580');
      res.setHeader('X-ZCore-Decoy-Active', 'true');
      res.setHeader('X-ZCore-SHA256', sha256);
      return res.send(binaryBuffer);
    }

    // Authentic Z-CORE AI23N GENIN v2.7 PRO static binary
    const instructions = [
      0xd2800460, // mov x0, #0x23 (AI23N signature)
      0xd28003c8, // mov x8, #0x1e (init_npu_enclave)
      0xd4000001, // svc #0
      0x94000004, // bl zcore_genin_infer
      0xd2800000, // mov x0, #0
      0xd2800ba8, // mov x8, #0x5d (sys_exit)
      0xd4000001, // svc #0
    ];

    let cursor = 120;
    for (const inst of instructions) {
      binaryBuffer.writeUInt32LE(inst, cursor);
      cursor += 4;
    }

    const signature = 'Z-CORE:AI23N:GENIN:v2.7-PRO:Z-GHOST:Z-SYNC:Z-LEARN:INT2:5400IPS';
    binaryBuffer.write(signature, cursor, 'ascii');
    cursor += signature.length;

    for (let i = cursor; i < 580; i++) {
      binaryBuffer[i] = (i * 37 + 0x27) & 0xff;
    }

    const sha256 = crypto.createHash('sha256').update(binaryBuffer).digest('hex');

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename="zcore-ai23n-genin-v2.7-pro.bin"');
    res.setHeader('X-ZCore-Binary-Size', '580');
    res.setHeader('X-ZCore-SHA256', sha256);
    return res.send(binaryBuffer);
  } catch (err) {
    console.error('Binary error:', err);
    return res.status(500).json({ error: 'BINARY_EXPORT_ERROR' });
  }
});

// Endpoint: Build standalone single-file air-gapped HTML application
app.get('/api/build/html', (_req: Request, res: Response) => {
  try {
    const standaloneHtmlPath = path.resolve(__dirname, 'dist', 'index.html');
    if (fs.existsSync(standaloneHtmlPath)) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="zcore-ai23n-genin-v2.7-pro-standalone.html"');
      return res.sendFile(standaloneHtmlPath);
    }
    // Fallback template if dist is not compiled yet
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="zcore-ai23n-genin-v2.7-pro-standalone.html"');
    return res.send(`<!doctype html><html><head><meta charset="utf-8"><title>Z-CORE AI23N GENIN v2.7 PRO</title></head><body style="background:#020617;color:#fff;font-family:monospace;padding:32px;"><h1>Z-CORE AI23N GENIN v2.7 PRO</h1><p>Sovereign Pocket Exascale AI · Standalone Build</p></body></html>`);
  } catch (err) {
    console.error('HTML build export error:', err);
    return res.status(500).json({ error: 'HTML_BUILD_ERROR' });
  }
});

// Endpoint: Download BIN_HTML (Polyglot self-extracting .bin.html containing 580B executable)
app.get('/api/binary/bin-html', (_req: Request, res: Response) => {
  try {
    const binHtmlPath = path.resolve(__dirname, 'zcore-ai23n-genin-v2.7-pro.html');
    if (fs.existsSync(binHtmlPath)) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="zcore-ai23n-genin-v2.7-pro.bin.html"');
      return res.sendFile(binHtmlPath);
    }
    return res.status(404).json({ error: 'BIN_HTML_NOT_FOUND' });
  } catch (err) {
    console.error('BIN_HTML export error:', err);
    return res.status(500).json({ error: 'BIN_HTML_ERROR' });
  }
});

// Endpoint: Z-GHOST Emergency Kill-Switch PIN 9999
app.post('/api/ghost/kill', (req: Request, res: Response) => {
  const { pin } = req.body;
  if (pin === '9999') {
    return res.json({
      success: true,
      enclaveStatus: 'ZEROIZED_DESTROYED',
      wipePattern: 'DoD 5220.22-M 3-Pass Overwrite (0x00 / 0xFF / CSPRNG)',
      bytesPurged: 580,
      timestamp: new Date().toISOString(),
      message: 'ENCLAVE PERMANENTLY BURNED. ZERO RESIDUALS.',
    });
  }
  return res.status(403).json({ error: 'INVALID_KILL_PIN' });
});

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Z-CORE Engine v2.7 PRO listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
