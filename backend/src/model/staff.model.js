import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const staffSchema = new mongoose.Schema({
  
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 8 },
  role: { type: String, enum: ["staff"], default: "staff" },
  institution: { type: String, required: true }, 
});

staffSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next(); 
  } catch (error) {
    return next(error);
  }
});
staffSchema.methods.matchPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
const Staff = mongoose.model("Staff", staffSchema);
export default Staff;
