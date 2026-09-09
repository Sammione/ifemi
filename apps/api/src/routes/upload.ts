import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

// Ensure upload directories exist
const apiUploadsDir = path.join(__dirname, '..', '..', 'public', 'uploads');
const storefrontUploadsDir = path.join(__dirname, '..', '..', '..', 'storefront-vite', 'public', 'uploads');

[apiUploadsDir, storefrontUploadsDir].forEach(dir => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (e) {
    // Directory check fallback
  }
});

router.post('/', (req: Request, res: Response): any => {
  try {
    const { base64, filename } = req.body;

    if (!base64) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Match data:[<mediatype>];base64,<data>
    const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer: Buffer;
    let ext = 'jpg';

    if (matches && matches.length === 3) {
      const mime = matches[1];
      if (mime.includes('png')) ext = 'png';
      else if (mime.includes('webp')) ext = 'webp';
      else if (mime.includes('svg')) ext = 'svg';
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(base64, 'base64');
    }

    const cleanFilename = filename ? `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}` : `product-${Date.now()}.${ext}`;

    const filePath = path.join(apiUploadsDir, cleanFilename);
    fs.writeFileSync(filePath, buffer);

    // Also mirror to storefront public directory if it exists
    try {
      if (fs.existsSync(storefrontUploadsDir)) {
        fs.writeFileSync(path.join(storefrontUploadsDir, cleanFilename), buffer);
      }
    } catch (mirrorErr) {
      // Mirroring is non-fatal
    }

    const publicUrl = `/uploads/${cleanFilename}`;
    res.status(201).json({ url: publicUrl, filename: cleanFilename });
  } catch (error) {
    console.error('Failed to upload image:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

export default router;
