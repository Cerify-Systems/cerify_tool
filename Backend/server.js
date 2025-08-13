const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV === 'production' ? 'prod' : 'dev'}`
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Serve React frontend build
const buildPath = process.env.FRONTEND_BUILD_PATH || '';
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/upload') || req.originalUrl.startsWith('/analyze-url')) return next();
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// File upload setupz
const benchmarkingContractsDir = process.env.BENCHMARK_PATH || '';
if (!fs.existsSync(benchmarkingContractsDir)) fs.mkdirSync(benchmarkingContractsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, benchmarkingContractsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.originalname.endsWith('.sol') || file.originalname.endsWith('.txt')) {
      cb(null, true);
    } else {
      cb(new Error('Only .sol and .txt files are allowed!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Upload and process route
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  //MOCK FOR DEV
  if (process.env.NODE_ENV !== 'production') {
    return res.json({
      success: true,
      result: {
        score: 8,
        total: 10,
        vulnerabilities: 2,
        issues: 3,
        lines: 120,
        status: 'completed',
        contractName: req.file.originalname,
        issuesList: [
          { severity: 'Critical', title: 'Reentrancy', description: 'Reentrancy vulnerability found.' },
          { severity: 'High', title: 'Unchecked Call', description: 'Unchecked external call.' },
          { severity: 'Low', title: 'Timestamp Dependence', description: 'Uses block.timestamp for logic.' }
        ]
      }
    });
  }

  const uploadedFileName = req.file.filename;
  const scriptDir = process.env.KLEE_TOOL_PATH || '';
  const benchmarkingRelativePath = 'benchmarking_contracts/' + uploadedFileName;
  const uploadedFilePath = path.join(benchmarkingContractsDir, uploadedFileName);

  try {
    const py = spawn('python3', ['get_benchmarking.py', benchmarkingRelativePath], {
      cwd: scriptDir,
      env: { ...process.env, PATH: process.env.KLEE_BUILD_AND_LLVM_PATH + process.env.PATH }
    });

    let output = '', errorOutput = '';
    py.stdout.on('data', (data) => output += data.toString());
    py.stderr.on('data', (data) => errorOutput += data.toString());

    py.on('close', (code) => {
      if (code !== 0 || output.includes('klee-last not found')) {
        return res.status(500).json({ error: 'KLEE script failed', details: errorOutput || output });
      }

      let result;
      try {
        result = JSON.parse(output);
      } catch (e) {
        return res.status(500).json({ error: 'Invalid script output', details: output });
      }

      res.json({ success: true, result });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Cerify backend is running!' });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});
