import { Router } from 'express';
import { startInterview, submitAnswer, getInterviewDetails } from '../controllers/interviewController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/start', protect, startInterview);
router.get('/:id', protect, getInterviewDetails);
router.post('/:id/answer', protect, submitAnswer);

export default router;
