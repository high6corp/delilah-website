import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../uploads/temp');

await fs.mkdir(outDir, { recursive: true });

const width = 800;
const height = 600;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#E8F5E9;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#C8E6C9;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)" />
  <!-- Sun -->
  <circle cx="120" cy="100" r="55" fill="#FFD54F" />
  <!-- Tree -->
  <rect x="360" y="280" width="40" height="220" fill="#8D6E63" />
  <circle cx="380" cy="250" r="90" fill="#66BB6A" />
  <circle cx="330" cy="220" r="55" fill="#81C784" />
  <circle cx="430" cy="220" r="55" fill="#81C784" />
  <!-- Swing -->
  <line x1="420" y1="320" x2="420" y2="420" stroke="#5D4037" stroke-width="4" />
  <line x1="460" y1="320" x2="460" y2="420" stroke="#5D4037" stroke-width="4" />
  <rect x="410" y="420" width="60" height="15" rx="5" fill="#795548" />
  <!-- Bench -->
  <rect x="180" y="430" width="130" height="20" rx="4" fill="#A1887F" />
  <rect x="190" y="450" width="10" height="40" fill="#5D4037" />
  <rect x="290" y="450" width="10" height="40" fill="#5D4037" />
  <!-- Flowers -->
  <circle cx="100" cy="520" r="10" fill="#F48FB1" />
  <circle cx="140" cy="510" r="10" fill="#CE93D8" />
  <circle cx="650" cy="520" r="10" fill="#90CAF9" />
  <circle cx="700" cy="505" r="10" fill="#F48FB1" />
  <!-- Clouds -->
  <circle cx="550" cy="90" r="25" fill="white" opacity="0.8" />
  <circle cx="580" cy="80" r="30" fill="white" opacity="0.8" />
  <circle cx="610" cy="90" r="25" fill="white" opacity="0.8" />
  <!-- Text -->
  <text x="400" y="560" font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="#1B5E20" text-anchor="middle">My First Visit to the Park</text>
</svg>`;

const buffer = await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toBuffer();
const filePath = path.join(outDir, 'park-replacement.jpg');
await fs.writeFile(filePath, buffer);
console.log('Created replacement image:', filePath, buffer.length, 'bytes');
