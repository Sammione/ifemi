import fs from 'fs';
import path from 'path';
import https from 'https';

const images = [
  { name: 'kaftan-1.jpg', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=70&w=600&auto=format&fit=crop' },
  { name: 'kaftan-2.jpg', url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=70&w=600&auto=format&fit=crop' },
  { name: 'kaftan-3.jpg', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=70&w=600&auto=format&fit=crop' },
  { name: 'trouser-1.jpg', url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=70&w=600&auto=format&fit=crop' },
  { name: 'trouser-2.jpg', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=70&w=600&auto=format&fit=crop' },
  { name: 'loungewear-1.jpg', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=70&w=600&auto=format&fit=crop' },
  { name: 'cushion-1.jpg', url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=70&w=600&auto=format&fit=crop' },
  { name: 'cushion-2.jpg', url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=70&w=600&auto=format&fit=crop' },
  { name: 'diffuser-1.jpg', url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=70&w=600&auto=format&fit=crop' },
  { name: 'diffuser-2.jpg', url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=70&w=600&auto=format&fit=crop' },
  { name: 'jewellery-1.jpg', url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=70&w=600&auto=format&fit=crop' },
  { name: 'jewellery-2.jpg', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=70&w=600&auto=format&fit=crop' },
  { name: 'kaftan-black.jpg', url: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=70&w=600&auto=format&fit=crop' },
  { name: 'trouser-blue.jpg', url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=70&w=600&auto=format&fit=crop' }
];

const destDirs = [
  path.resolve('apps/storefront-vite/public/images/products'),
  path.resolve('apps/admin-vite/public/images/products')
];
for (const dir of destDirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000 }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed with status code: ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Downloading product images to local folders...');
  for (const item of images) {
    for (const dir of destDirs) {
      const filePath = path.join(dir, item.name);
      try {
        await downloadFile(item.url, filePath);
        console.log(`✓ Downloaded ${item.name} to ${path.basename(path.dirname(dir))} (${(fs.statSync(filePath).size / 1024).toFixed(1)} KB)`);
      } catch (e) {
        console.error(`✗ Error downloading ${item.name}: ${e.message}`);
      }
    }
  }
  console.log('Done!');
}

run();
