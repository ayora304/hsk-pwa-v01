const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n--- CREATING MISSING PWA FILES ---\n');

fs.mkdirSync('public', { recursive: true });

// 1. Create public/sw.js (Service Worker with Fetch Handler)
const swContent = `
const CACHE_NAME = 'hsk-pwa-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
`;

fs.writeFileSync('public/sw.js', swContent.trim(), 'utf8');
console.log('✅ Created public/sw.js');

// 2. Pure Node PNG Generator Helper
function createPng(width, height, r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  const ihdrBuf = Buffer.alloc(13);
  ihdrBuf.writeUInt32BE(width, 0);
  ihdrBuf.writeUInt32BE(height, 4);
  ihdrBuf[8] = 8;  // bit depth
  ihdrBuf[9] = 2;  // RGB
  ihdrBuf[10] = 0; // compression
  ihdrBuf[11] = 0; // filter
  ihdrBuf[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdrBuf);

  const rawLineLen = 1 + width * 3;
  const rawData = Buffer.alloc(height * rawLineLen);
  for (let y = 0; y < height; y++) {
    const lineOffset = y * rawLineLen;
    rawData[lineOffset] = 0;
    for (let x = 0; x < width; x++) {
      const pixelOffset = lineOffset + 1 + x * 3;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const typeAndData = Buffer.concat([typeBuf, data]);
  
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([lenBuf, typeAndData, crcBuf]);
}

const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Write brand-orange (#F07820 -> RGB 240, 120, 32) 192x192 and 512x512 icons
fs.writeFileSync('public/pwa-192x192.png', createPng(192, 192, 240, 120, 32));
console.log('✅ Generated public/pwa-192x192.png');

fs.writeFileSync('public/pwa-512x512.png', createPng(512, 512, 240, 120, 32));
console.log('✅ Generated public/pwa-512x512.png');

// 3. Write Valid Web App Manifest
const manifest = {
  "short_name": "HSK PWA",
  "name": "HSK Learning App",
  "icons": [
    {
      "src": "/pwa-192x192.png",
      "type": "image/png",
      "sizes": "192x192",
      "purpose": "any maskable"
    },
    {
      "src": "/pwa-512x512.png",
      "type": "image/png",
      "sizes": "512x512",
      "purpose": "any maskable"
    }
  ],
  "start_url": "/",
  "scope": "/",
  "background_color": "#ffffff",
  "theme_color": "#F07820",
  "display": "standalone",
  "prefer_related_applications": false
};

fs.writeFileSync('public/manifest.json', JSON.stringify(manifest, null, 2), 'utf8');
console.log('✅ Created public/manifest.json');

console.log('\n--- PUSHING TO GIT ---');
execSync('git add .', { stdio: 'inherit' });
execSync('git commit -m "fix pwa sw and icons"', { stdio: 'inherit' });
execSync('git push', { stdio: 'inherit' });
console.log('\n✅ Pushed fixes! Vercel is now building your updated app.');
