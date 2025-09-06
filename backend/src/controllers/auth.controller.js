import Staff from "../model/staff.model.js";
import Student from "../model/student.model.js";
import jwt from "jsonwebtoken";

export const signupStudent = async (req, res) => {
  const {
    email,
    password,
    fullName,
    userName,
    phonenumber,
    education,
    institution,
    location,
  } = req.body;

  try {
    if (
      !email ||
      !userName ||
      !phonenumber ||
      !password ||
      !fullName ||
      !education ||
      !institution ||
      !location
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newStudent = await Student.create({
      email,
      password,
      fullName,
      role: "student",
      userName,
      phonenumber,
      education,
      institution,
      location,
    });

    const token = jwt.sign(
      { userId: newStudent._id, role: "student", institution },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      user: newStudent,
    });
  } catch (error) {
    console.error("Error in student signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const StudentLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Student.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email does not match" });
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { userId: user._id, role: "student", institution: user.institution },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Error in student login:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const StaffLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Staff.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email does not match" });

    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role, institution: user.institution },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Error in staff login:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error in logout:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const isloggedin = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({
      success: true,
      message: "Authenticated",
      user: decoded, // contains userId, role, institution
    });
  } catch (error) {
    console.error("Error in isloggedin:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
