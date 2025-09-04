import Student from "../model/student.model.js";

export const getStudentsByInstitution = async (req, res) => {
  console.log(req.user);
  try {
    if (!req.user || req.user.role !== "staff") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const students = await Student.find({ institution: req.user.institution });

    res.json({ success: true, students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
