import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', '.vercel', 'scratch']),

  // Клиентский код: окружение браузера.
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
      // Ключи в клиентском коде — то, с чего начался этот аудит.
      // Правило ловит обращения вида import.meta.env.VITE_..._API_KEY.
      'no-restricted-syntax': [
        'error',
        {
          selector: 'MemberExpression[property.name=/API_KEY|SECRET_KEY|ACCESS_TOKEN|PASSWORD/i]',
          message: 'Секреты не должны попадать в клиентский бандл — обращайтесь через серверную функцию api/chat.js.',
        },
      ],
      'no-alert': 'error',
      eqeqeq: ['error', 'smart'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // Серверные функции, скрипты и конфиги: окружение Node.
  {
    files: [
      'api/**/*.js',
      'scripts/**/*.{js,mjs}',
      'vite.config.js',
      'eslint.config.js',
      'postcss.config.js',
      'tailwind.config.js',
    ],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.node,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      eqeqeq: ['error', 'smart'],
    },
  },
])
