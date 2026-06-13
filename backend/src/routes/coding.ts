import { Router } from 'express';
import { runCode, reviewCode } from '../controllers/codingController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/execute', protect, runCode);
router.post('/review', protect, reviewCode);

export default router;
