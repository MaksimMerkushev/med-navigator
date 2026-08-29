import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const CHAT_HANDLER_URL = new URL('./api/chat.js', import.meta.url)

/**
 * Dev-режим: `vite dev` не запускает функции из api/, поэтому подключаем тот же
 * обработчик как middleware. Ключ читается из .env через loadEnv БЕЗ префикса
 * VITE_ — то есть он остаётся на стороне dev-сервера и не попадает в бандл.
 *
 * Модуль грузится обычным dynamic import, а не через server.ssrLoadModule:
 * api/chat.js — чистый Node-код без JSX, алиасов и import.meta.env, поэтому
 * конвейер Vite ему не нужен, а код не зависит от версии SSR-API.
 * Query-параметр сбрасывает кеш модулей, чтобы правки подхватывались без
 * перезапуска dev-сервера.
 */
const devApiPlugin = (env) => ({
  name: 'medkarta-dev-api',
  apply: 'serve',
  configureServer(server) {
    for (const key of ['OPENROUTER_API_KEY', 'AI_API_KEY', 'AI_UPSTREAM_URL', 'AI_MODEL', 'ALLOWED_ORIGINS']) {
      if (env[key] && !process.env[key]) {
        process.env[key] = env[key]
      }
    }

    if (!process.env.OPENROUTER_API_KEY && !process.env.AI_API_KEY) {
      server.config.logger.warn(
        '[dev-api] OPENROUTER_API_KEY не найден в .env — AI-помощник вернёт «сервис недоступен». Остальное приложение работает.',
      )
    }

    // Слежение за файлом — удобство, а не необходимость: если API вотчера
    // в этой версии Vite другой, dev-сервер всё равно должен подняться.
    try {
      server.watcher?.add(fileURLToPath(CHAT_HANDLER_URL))
    } catch {
      // не критично
    }

    server.middlewares.use('/api/chat', async (req, res, next) => {
      try {
        const { default: handler } = await import(`${CHAT_HANDLER_URL.href}?t=${Date.now()}`)
        await handler(req, res)
      } catch (error) {
        server.config.logger.error(`[dev-api] ${error?.stack || error?.message || error}`)
        if (!res.writableEnded) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ error: 'Ошибка dev-обработчика /api/chat.' }))
          return
        }
        next(error)
      }
    })
  },
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), devApiPlugin(env)],
    build: {
      // Sourcemap в проде отдаёт читаемый исходник рядом с бандлом.
      sourcemap: false,
      rollupOptions: {
        output: {
          // Крупные статические справочники — отдельным чанком: правка
          // интерфейса больше не инвалидирует полмегабайта данных в кэше.
          manualChunks(id) {
            if (
              id.includes('/src/kazanFacilities.js') ||
              id.includes('/src/verifiedDoctors.js') ||
              id.includes('/src/doctors.js') ||
              id.includes('/src/ClinicsData.js')
            ) {
              return 'facilities-data'
            }
            if (id.includes('node_modules/leaflet') || id.includes('node_modules/react-leaflet')) {
              return 'map'
            }
            return undefined
          },
        },
      },
    },
    // server.host намеренно не задан: по умолчанию Vite и так слушает только
    // локальный интерфейс, а жёсткое '127.0.0.1' ломало бы адрес localhost
    // на системах, где он резолвится в IPv6 (::1).
  }
})
