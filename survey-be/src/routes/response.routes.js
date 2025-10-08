import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { submitResponses, getResults } from '../controllers/response.controller.js';

const router = Router();

// POST /surveys/:id/responses  (yêu cầu token)
router.post('/:id/responses', authRequired, submitResponses);

// GET /surveys/:id/results     (yêu cầu token + là chủ survey)
router.get('/:id/results', authRequired, getResults);

export default router;
