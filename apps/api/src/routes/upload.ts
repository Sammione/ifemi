import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

const router = Router();

// Configure Cloudinary with live credentials
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'wugtledv';
const apiKey = process.env.CLOUDINARY_API_KEY || '912873885738932';
const apiSecret = process.env.CLOUDINARY_API_SECRET || 'wDLZJGhkXH7027Mb5Q5EyU0zKNU';

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true
});

// Fallback local upload directories
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

router.post('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const { base64, filename } = req.body;

    if (!base64) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // 1. Try uploading to Cloudinary first if configured
    if (process.env.CLOUDINARY_URL || (apiKey && apiSecret)) {
      try {
        const uploadResult = await cloudinary.uploader.upload(base64, {
          folder: 'ifemi-lifestyle',
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }]
        });

        return res.status(201).json({
          url: uploadResult.secure_url,
          filename: uploadResult.public_id
        });
      } catch (cloudErr) {
        console.warn('Cloudinary upload encountered an error, falling back to local storage:', cloudErr);
      }
    }

    // 2. Local disk fallback
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
    return res.status(201).json({ url: publicUrl, filename: cleanFilename });
  } catch (error) {
    console.error('Failed to upload image:', error);
    return res.status(500).json({ error: 'Image upload failed' });
  }
});

export default router;
