import jwt from "jsonwebtoken";
import Staff from "../model/staff.model.js";
import Student from "../model/student.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    let user = null;

    if (decoded.role === "student") {
      user = await Student.findById(decoded.userId).select("-password");
    } else {
      user = await Staff.findById(decoded.userId).select("-password");
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    req.role = decoded.role;
    console.log("Decoded role:", decoded.role);


    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid or expired token" });
  }
};
