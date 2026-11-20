import { defineConfig } from '@playwright/test'

const port = 4173
const baseURL = `http://127.0.0.1:${port}/AITI/`
const channel = process.env.AITI_BROWSER_CHANNEL

export default defineConfig({
  testDir: 'tests/browser',
  timeout: 30_000,
  fullyParallel: true,
  workers: 3,
  use: {
    baseURL,
    browserName: process.env.AITI_BROWSER_ENGINE === 'webkit' ? 'webkit' : 'chromium',
    channel,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `npm run build && npm run preview -- --host 127.0.0.1 --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
})
