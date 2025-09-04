import express from "express";
// import { signupStaff } from "../controllers/auth.controller.js";
import { signupStudent, StudentLogin } from "../controllers/auth.controller.js";
import { StaffLogin } from "../controllers/auth.controller.js";
import { logout } from "../controllers/auth.controller.js";
const router = express.Router();

// router.post("/signup/staff", signupStaff);
router.post("/signup", signupStudent);
router.post("/staff/login", StaffLogin);
router.post("/student/login", StudentLogin);
router.post("/logout", logout);
router.post("/admin/login", StaffLogin);

export default router;
