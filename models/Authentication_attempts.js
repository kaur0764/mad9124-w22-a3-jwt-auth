import mongoose from "mongoose";

const schema = new mongoose.Schema({
  username: { type: String, required: true, maxlength: 64 },
  ipAddress: { type: String, required: true, maxlength: 64 },
  didSucceed: { type: Boolean, required: true },
  createdAt: { type: String, required: true },
});
const Model = mongoose.model("Authentication_attempts", schema);

export default Model;
