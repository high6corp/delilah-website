import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../uploads/temp');

await fs.mkdir(outDir, { recursive: true });

const width = 800;
const height = 600;

function createSvg(title, bgGradient, elements) {
  const svgElements = elements.map(el => {
    if (el.type === 'text') {
      return `<text x="${el.x}" y="${el.y}" font-family="Arial, sans-serif" font-size="${el.size}" font-weight="bold" fill="${el.color}" text-anchor="middle">${el.text}</text>`;
    }
    if (el.type === 'circle') {
      return `<circle cx="${el.x}" cy="${el.y}" r="${el.r}" fill="${el.color}" />`;
    }
    if (el.type === 'ellipse') {
      return `<ellipse cx="${el.x}" cy="${el.y}" rx="${el.rx}" ry="${el.ry}" fill="${el.color}" />`;
    }
    if (el.type === 'rect') {
      return `<rect x="${el.x}" y="${el.y}" width="${el.w}" height="${el.h}" rx="${el.rx || 0}" fill="${el.color}" />`;
    }
    if (el.type === 'polygon') {
      return `<polygon points="${el.points}" fill="${el.color}" />`;
    }
    return '';
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:${bgGradient[0]};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${bgGradient[1]};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)" />
    ${svgElements}
  </svg>`;
}

const images = [
  {
    name: 'butterfly.jpg',
    title: 'Butterfly Garden',
    gradient: ['#E0F7FA', '#B2EBF2'],
    elements: [
      { type: 'circle', x: 400, y: 280, r: 80, color: '#FF9800' },
      { type: 'circle', x: 360, y: 260, r: 60, color: '#FFB74D' },
      { type: 'circle', x: 440, y: 260, r: 60, color: '#FFB74D' },
      { type: 'circle', x: 400, y: 240, r: 30, color: '#795548' },
      { type: 'rect', x: 385, y: 300, w: 30, h: 100, rx: 15, color: '#795548' },
      { type: 'text', x: 400, y: 500, size: 42, color: '#006064', text: 'Butterfly Garden' },
    ],
  },
  {
    name: 'sunny-park.jpg',
    title: 'Sunny Park Day',
    gradient: ['#FFF8E1', '#FFECB3'],
    elements: [
      { type: 'circle', x: 120, y: 100, r: 60, color: '#FFD54F' },
      { type: 'rect', x: 320, y: 350, w: 160, h: 120, rx: 10, color: '#8D6E63' },
      { type: 'circle', x: 400, y: 310, r: 60, color: '#AED581' },
      { type: 'rect', x: 390, y: 350, w: 20, h: 60, color: '#795548' },
      { type: 'rect', x: 0, y: 470, w: 800, h: 130, color: '#C5E1A5' },
      { type: 'text', x: 400, y: 560, size: 42, color: '#33691E', text: 'Sunny Park Day' },
    ],
  },
  {
    name: 'bird-nest.jpg',
    title: 'Little Bird Nest',
    gradient: ['#F3E5F5', '#E1BEE7'],
    elements: [
      { type: 'circle', x: 400, y: 180, r: 50, color: '#CE93D8' },
      { type: 'circle', x: 380, y: 170, r: 8, color: '#333' },
      { type: 'circle', x: 420, y: 170, r: 8, color: '#333' },
      { type: 'ellipse', x: 400, y: 320, rx: 120, ry: 60, color: '#8D6E63' },
      { type: 'circle', x: 370, y: 310, r: 15, color: '#FFF9C4' },
      { type: 'circle', x: 400, y: 305, r: 15, color: '#FFF9C4' },
      { type: 'circle', x: 430, y: 310, r: 15, color: '#FFF9C4' },
      { type: 'rect', x: 350, y: 380, w: 100, h: 120, color: '#5D4037' },
      { type: 'text', x: 400, y: 550, size: 42, color: '#4A148C', text: 'Little Bird Nest' },
    ],
  },
];

for (const img of images) {
  const svg = createSvg(img.title, img.gradient, img.elements);
  const buffer = await sharp(Buffer.from(svg))
    .jpeg({ quality: 90 })
    .toBuffer();
  await fs.writeFile(path.join(outDir, img.name), buffer);
  console.log('Created', img.name, buffer.length, 'bytes');
}

console.log('Images created in', outDir);
