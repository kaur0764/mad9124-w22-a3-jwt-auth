import mongoose from "mongoose";

const schema = new mongoose.Schema({
  firstName: { type: String, required: true, maxLength: 64 },
  lastName: { type: String, required: true, maxLength: 64 },
  email: { type: String, required: true, maxLength: 512 },
  password: { type: String, required: true, maxLength: 70 },
  isAdmin: { type: Boolean, required: true, default: false },
});
const Model = mongoose.model("User", schema);

export default Model;
