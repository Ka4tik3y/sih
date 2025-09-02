import jwt from "jsonwebtoken";
import Staff from "../model/staff.model.js";

export const staffAuthMiddleware = async (req, res, next) => {
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

    const staff = await Staff.findById(decoded.userId).select("-password");

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    req.staff = staff;

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid or expired token" });
  }
};
