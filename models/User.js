import bcrypt from "bcrypt";
import mongoose from "mongoose";

const saltRounds = 14;

const schema = new mongoose.Schema({
  firstName: { type: String, required: true, maxLength: 64 },
  lastName: { type: String, required: true, maxLength: 64 },
  email: { type: String, required: true, maxLength: 512 },
  password: { type: String, required: true, maxLength: 70 },
  isAdmin: { type: Boolean, required: true, default: false },
});

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

const Model = mongoose.model("User", schema);

export default Model;
