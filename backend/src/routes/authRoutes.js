import express from 'express';
import { signupStaff } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup/staff', signupStaff);

export default router;
