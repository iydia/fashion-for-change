import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    // No server-side state in Phase 1; skip the adapter's default Blobs-backed session driver.
    session: false,
    vite: {
        plugins: [tailwindcss()]
    },
    adapter: netlify({
        // Generate static images at build time so local preview and production agree.
        imageCDN: false,
        devFeatures: {
            environmentVariables: true,
            edgeFunctions: false
        }
    })
});
