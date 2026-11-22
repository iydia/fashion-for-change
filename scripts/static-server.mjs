import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';

const port = Number(process.env.PORT ?? 4321);
const distDir = new URL('../dist/', import.meta.url);

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.ico': 'image/x-icon'
};

async function resolveFile(pathname) {
    const candidates = pathname.endsWith('/') ? [join(pathname, 'index.html')] : [pathname, join(pathname, 'index.html')];

    for (const candidate of candidates) {
        const fileUrl = new URL('.' + candidate, distDir);
        if (!fileUrl.href.startsWith(distDir.href)) {
            console.log('fileUrl.href', fileUrl.href);
            console.log('distDir.href', distDir.href);
            continue;
        }
        try {
            const stats = await stat(fileUrl);
            if (stats.isFile()) return fileUrl;
        } catch {
            continue;
        }
    }
    return null;
}

const server = createServer(async (req, res) => {
    const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
    const fileUrl = await resolveFile(pathname);

    if (!fileUrl) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
        return;
    }

    const contentType = MIME_TYPES[extname(fileUrl.pathname)] ?? 'application/octet-stream';
    const body = await readFile(fileUrl);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(body);
});

server.listen(port, '127.0.0.1', () => {
    console.log(`Static server serving dist/ at http://127.0.0.1:${port}`);
});
