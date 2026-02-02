import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
  {
    name: 'hero-home.webp',
    url: 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/d0f6bfc4-a8db-41e1-87e2-7c7e0b7a1c00/public'
  },
  {
    name: 'hero-service.webp',
    url: 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/763a76aa-aa08-47d4-436f-ca7bea56e900/public'
  },
  {
    name: 'pricing.webp',
    url: 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/ab3815ee-dd67-4351-09f2-f661ee7d1000/public'
  },
  {
    name: 'cta-background.webp',
    url: 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/030b6f5a-54b6-4dd2-66f0-676c7ca84c00/f=webp,q=80'
  },
  {
    name: 'logo.webp',
    url: 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/b9d9d28f-0618-4a93-9210-8d9d18c3d200/public'
  },
  {
    name: 'logo-dark.webp',
    url: 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/e4a88604-ba5d-44a5-5fe8-a0a26c632d00/public'
  },
  {
    name: 'chat-cta.webp',
    url: 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/36b5466f-9dee-4b88-ac69-83859843f900/public'
  }
];

const outputDir = path.join(__dirname, '..', 'public', 'images');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(outputDir, filename);
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        https.get(response.headers.location, (res) => {
          res.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`✅ Downloaded: ${filename}`);
            resolve();
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${filename}`);
          resolve();
        });
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log('📥 Downloading images from Cloudflare...\n');
  
  for (const img of images) {
    try {
      await downloadImage(img.url, img.name);
    } catch (err) {
      console.error(`❌ Failed to download ${img.name}:`, err.message);
    }
  }
  
  console.log('\n✅ Done! Images saved to public/images/');
}

downloadAll();

