import { Router } from 'express';
import multer from 'multer';
import { uploadResume, getResume } from '../controllers/resumeController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Configure multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are supported') as any, false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/', protect, getResume);

export default router;
