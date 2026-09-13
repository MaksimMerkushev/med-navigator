import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import handler from './api/chat.js';

// Автозагрузка .env для автономной работы на VPS
if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile();
  } catch {
    // .env может отсутствовать, если переменные заданы в окружении
  }
} else {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach((line) => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
          if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
          if (!process.env[key]) process.env[key] = value.trim();
        }
      });
    }
  } catch {
    // fallback
  }
}

const PORT = Number(process.env.PORT) || 3001;

const server = http.createServer(async (req, res) => {
  if (req.url?.startsWith('/api/chat')) {
    try {
      await handler(req, res);
    } catch (err) {
      console.error('[server error]', err);
      if (!res.writableEnded) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    }
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[med-navigator] API proxy running on http://127.0.0.1:${PORT}`);
});
