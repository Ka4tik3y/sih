import express from "express";
import { signupStaff } from "../controllers/auth.controller.js";
import { signupStudent } from "../controllers/auth.controller.js";
import {login} from "../controllers/auth.controller.js";
import {logout} from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/signup/staff", signupStaff);
router.post("/signup/student", signupStudent);
router.post("/login", login);
router.post("/logout", logout);

export default router;
