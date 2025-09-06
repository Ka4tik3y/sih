import mongoose from "mongoose";
import dotenv from "dotenv";
import Staff from "./src/model/staff.model.js";

dotenv.config();
const seedStaff = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = "admin@iitd.ac.in";
    const password = "Admin@123";
    const institution = "USAR";
    const role = "staff";
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      console.log("Staff already exists");
      process.exit(0);
    }
   const staff = new Staff({
  email,
  password,
  role,
  institution,
});
    await staff.save();
    console.log("Staff seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed", err.message);
    process.exit(1);
  }
};

seedStaff();
