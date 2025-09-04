import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
const studentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    education: {
        type: String,
        required: true,
    },
    institution: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: false,

    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phonenumber: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
        minLength: 8
    },
    role: {
        type: String,
        enum: ["student"],
        default: "student",
        required
: false,
    },
    location: {
      type: String,
      default: "",
      required: true,
    }
}, {
    timestamps: true
})
studentSchema.pre("save", async function (next) {
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
studentSchema.methods.matchPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
const Student = mongoose.model("Student", studentSchema);
export default Student;
