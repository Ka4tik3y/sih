import Staff from "../model/staff.model.js";
import jwt from "jsonwebtoken";
import Student from "../model/student.model.js";

export const signupStaff = async (req, res) => {
  const {
    email,
    password,
    fullName,
    role,
    userName,
    phonenumber,
    education,
    institution,
  } = req.body;

  try {
    if (
      !email ||
      !userName ||
      !phonenumber ||
      !password ||
      !fullName ||
      !role ||
      !education ||
      !institution
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

    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (!["admin", "staff"].includes(role)) {
      return res
        .status(403)
        .json({ message: "Invalid role. Only staff or admin allowed." });
    }

    const newStaff = await Staff.create({
      email,
      password,
      fullName,
      role,
      userName,
      phonenumber,
      education,
      institution,
    });

    const token = jwt.sign(
      { userId: newStaff._id, role: newStaff.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Staff created successfully",
      user: newStaff,
    });
  } catch (error) {
    console.error("Error in staff signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const signupStudent = async (req, res) => {
  const {
    email,
    password,
    fullName,
    role,
    userName,
    phonenumber,
    education,
    institution,
  } = req.body;

  try {
    if (
      !email ||
      !userName ||
      !phonenumber ||
      !password ||
      !fullName ||
      !role ||
      !education ||
      !institution
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

    if (!["student"].includes(role)) {
      return res
        .status(403)
        .json({ message: "Invalid role. Only student allowed." });
    }

    const newStudent = await Student.create({
      email,
      password,
      fullName,
      role,
      userName,
      phonenumber,
      education,
      institution,
    });

    const token = jwt.sign(
      { userId: newStudent._id, role: newStudent.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
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

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    let user = await Staff.findOne({ email });
    let role = "staff";
    if (!user) {
      user = await Student.findOne({ email });
      role = "student";
    }
    if (!user) {
      return res.status(404).json({ message: "Email does not match" });
    }
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ userId: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
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
      token,
    });
  } catch (error) {
    console.error("Error in login:", error.message);
    return res.status(500).json({ message: "Internal(L) server error" });
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
    return res.status(500).json({ message: "Internal(L) server error" });
  }
};
