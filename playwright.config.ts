import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    retries: 0,
    reporter: 'list',
    use: {
        baseURL: 'http://localhost:4321',
        viewport: { width: 1280, height: 800 }
    },
    webServer: {
        command: 'node scripts/static-server.mjs',
        port: 4321,
        reuseExistingServer: !process.env.CI,
        timeout: 30_000
    }
});
