import Staff from "../model/staff.model.js";
import jwt from "jsonwebtoken";

export const signupStaff = async (req, res) => {
  const {
    email,
    password,
    fullName,
    role,
    userName,
    phoneNumber,
    education,
    institution,
  } = req.body;

  try {
    if (
      !email ||
      !userName ||
      !phoneNumber ||
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
      phoneNumber,
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
