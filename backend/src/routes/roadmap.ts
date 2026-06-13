import { Router } from 'express';
import { getRoadmap, selectCareer, toggleTopic } from '../controllers/roadmapController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, getRoadmap);
router.post('/select', protect, selectCareer);
router.post('/toggle-topic', protect, toggleTopic);

export default router;
