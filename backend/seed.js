import mongoose from "mongoose";
import dotenv from "dotenv";
import Staff from "./src/model/staff.model.js";

dotenv.config();
const seedStaff = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    try {
      await mongoose.connection.db
        .collection("staffs")
        .dropIndex("phoneNumber_1");
      console.log("Dropped old phoneNumber index");
    } catch (err) {
      if (err.codeName === "IndexNotFound") {
        console.log("No old phoneNumber index found");
      } else {
        throw err;
      }
    }
    const email = "admin@disasterready.com";
    const password = "Admin@123";
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      console.log("Staff already exists");
      process.exit(0);
    }
    const staff = new Staff({ email, password, role: "admin" });
    await staff.save();
    console.log("Staff seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed", err.message);
    process.exit(1);
  }
};

seedStaff();
