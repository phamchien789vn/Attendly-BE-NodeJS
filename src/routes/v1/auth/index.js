import express from 'express';
import { register, login, logout } from '../../../controllers/auth.controller.js';
import validate from '../../../middlewares/validate.js'
import { registerSchema, loginSchema } from '../../../validations/auth.validation.js';
import { authenticateToken } from '../../../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', authenticateToken, logout);

export default router;
