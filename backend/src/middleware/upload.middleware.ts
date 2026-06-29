import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { ApiError } from '../utils/ApiError';

/**
 * Image upload middleware.
 *
 * Stores files on local disk under `/uploads` by default. The structure is
 * Cloudinary-ready: swap `diskStorage` for a Cloudinary storage engine (or
 * upload `req.file.buffer` in the controller) without touching routes.
 */
const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

export const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.includes(file.mimetype)) {
      return cb(ApiError.badRequest('Only JPEG, PNG, WEBP or HEIC images are allowed'));
    }
    cb(null, true);
  },
});

/** Build a public URL for a stored file (local disk fallback). */
export function fileToUrl(req: { protocol: string; get: (h: string) => string | undefined }, filename: string) {
  const host = req.get('host');
  return `${req.protocol}://${host}/uploads/${filename}`;
}

export default upload;
