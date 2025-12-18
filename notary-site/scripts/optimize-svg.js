import { optimize } from 'svgo';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgDir = path.join(__dirname, '..', 'public', 'images');

const svgFiles = [
  'hero-home.svg',
  'hero-service.svg',
  'pricing.svg',
  'logo.svg',
  'logo-dark.svg'
];

console.log('🔧 Optimizing SVG files...\n');

for (const file of svgFiles) {
  const filePath = path.join(svgDir, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${file} not found, skipping`);
    continue;
  }
  
  const svg = fs.readFileSync(filePath, 'utf8');
  const sizeBefore = Buffer.byteLength(svg, 'utf8');
  
  const result = optimize(svg, {
    multipass: true,
    plugins: [
      'preset-default',
      'removeDimensions',
      {
        name: 'removeAttrs',
        params: {
          attrs: ['data-name']
        }
      }
    ]
  });
  
  const sizeAfter = Buffer.byteLength(result.data, 'utf8');
  const savings = ((sizeBefore - sizeAfter) / sizeBefore * 100).toFixed(1);
  
  fs.writeFileSync(filePath, result.data);
  console.log(`✅ ${file}: ${sizeBefore} → ${sizeAfter} bytes (${savings}% smaller)`);
}

console.log('\n✅ SVG optimization complete!');

