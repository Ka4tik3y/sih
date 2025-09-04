import express from "express";
import { getStudentsByInstitution } from "../controllers/admin.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/students", authMiddleware, getStudentsByInstitution);

export default router;
 
