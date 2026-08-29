/*
 * © 2026 MedКарта Казань. Все права защищены.
 *
 * Серверный прокси к LLM.
 *
 * Зачем он нужен: ключ API больше не попадает в браузер. Раньше переменная
 * называлась VITE_OPENROUTER_API_KEY, а всё с префиксом VITE_ Vite подставляет
 * прямо в JS-бандл — то есть ключ читался из исходников сайта любым посетителем.
 * Здесь ключ живёт только в окружении функции и наружу не уходит.
 *
 * Дополнительно функция: ограничивает частоту запросов, режет размер тела и
 * истории, ставит таймаут на обращение к модели, нормализует ответ по белым
 * спискам и никогда не пересылает клиенту текст ошибки апстрима.
 */

import { SYSTEM_PROMPT } from './_shared/prompt.js';
import { LIMITS, sanitizeAiAction, validateChatMessages } from './_shared/sanitize.js';
import { checkRateLimit, getClientIp } from './_shared/rateLimit.js';

const UPSTREAM_URL = process.env.AI_UPSTREAM_URL || 'https://modelhub.my/v1/chat/completions';
const MODEL = process.env.AI_MODEL || 'gpt-5.4-mini';
const UPSTREAM_TIMEOUT_MS = 25_000;

const sendJson = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(payload));
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    // Vercel уже разобрал JSON — используем его.
    if (req.body !== undefined && req.body !== null) {
      resolve(req.body);
      return;
    }

    let size = 0;
    const chunks = [];

    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > LIMITS.MAX_BODY_BYTES) {
        const error = new Error('Тело запроса слишком большое.');
        error.status = 413;
        req.destroy();
        reject(error);
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      if (chunks.length === 0) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        const error = new Error('Некорректный JSON в теле запроса.');
        error.status = 400;
        reject(error);
      }
    });

    req.on('error', reject);
  });

/**
 * Запрос должен приходить с нашей же страницы. Заголовок Origin подделывается
 * только не-браузерным клиентом, поэтому это не «защита», а отсечение
 * тривиального встраивания виджета на чужой сайт за наш счёт.
 */
const isAllowedOrigin = (req) => {
  const origin = req.headers.origin;
  if (!origin) {
    // Same-origin fetch в части браузеров не шлёт Origin — пропускаем.
    return true;
  }

  const allowList = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (allowList.includes(origin)) {
    return true;
  }

  try {
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    return Boolean(host) && new URL(origin).host === host;
  } catch {
    return false;
  }
};

const extractContentText = (content) => {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === 'string' ? part : part?.text || ''))
      .join('\n')
      .trim();
  }
  return content?.text || '';
};

const parseModelJson = (text) => {
  const cleaned = String(text || '')
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  if (!cleaned) {
    throw new Error('empty model response');
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    const first = cleaned.indexOf('{');
    const last = cleaned.lastIndexOf('}');
    if (first !== -1 && last > first) {
      return JSON.parse(cleaned.slice(first, last + 1));
    }
    throw new Error('model response is not JSON');
  }
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Allow', 'POST, OPTIONS');
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    sendJson(res, 405, { error: 'Метод не поддерживается.' });
    return;
  }

  if (!isAllowedOrigin(req)) {
    sendJson(res, 403, { error: 'Запрос отклонён.' });
    return;
  }

  const apiKey = process.env.OPENROUTER_API_KEY || process.env.AI_API_KEY;
  if (!apiKey) {
    // Внутренняя причина остаётся в логах сервера, наружу — общая формулировка.
    console.error('[api/chat] OPENROUTER_API_KEY не задан в окружении.');
    sendJson(res, 503, { error: 'Сервис ИИ временно недоступен.' });
    return;
  }

  const ip = getClientIp(req);
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    res.setHeader('Retry-After', String(limit.retryAfterSeconds));
    sendJson(res, 429, {
      error: 'Слишком много запросов. Попробуйте через минуту.',
      retryAfter: limit.retryAfterSeconds,
    });
    return;
  }

  let messages;
  try {
    const body = await readBody(req);
    messages = validateChatMessages(body?.messages);
  } catch (error) {
    sendJson(res, error.status || 400, { error: error.message || 'Некорректный запрос.' });
    return;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const upstream = await fetch(UPSTREAM_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        response_format: { type: 'json_object' },
        temperature: 0.1,
        max_tokens: 900,
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '');
      console.error(`[api/chat] upstream ${upstream.status}: ${detail.slice(0, 500)}`);
      const status = upstream.status === 429 ? 429 : 502;
      sendJson(res, status, {
        error:
          status === 429
            ? 'Сервис ИИ перегружен. Попробуйте через минуту.'
            : 'Не удалось получить ответ от ИИ.',
      });
      return;
    }

    const data = await upstream.json();
    const action = sanitizeAiAction(parseModelJson(extractContentText(data?.choices?.[0]?.message?.content)));

    res.setHeader('X-RateLimit-Remaining', String(limit.remaining));
    sendJson(res, 200, action);
  } catch (error) {
    if (error?.name === 'AbortError') {
      sendJson(res, 504, { error: 'Превышено время ожидания ответа ИИ.' });
      return;
    }

    console.error('[api/chat]', error);
    sendJson(res, 502, { error: 'Не удалось обработать ответ ИИ.' });
  } finally {
    clearTimeout(timer);
  }
}

// maxDuration и memory заданы в vercel.json; ограничение размера тела
// реализовано внутри readBody, чтобы работать и в dev-режиме Vite.

