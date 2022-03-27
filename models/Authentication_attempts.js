import mongoose from "mongoose";

const schema = new mongoose.Schema({
  username: { type: String, required: true, maxlength: 64 },
  ipAddress: { type: String, required: true, maxlength: 64 },
  didSucceed: { type: Boolean, required: true },
  createdAt: { type: Date, required: true },
});

schema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const Model = mongoose.model("Authentication_attempts", schema);

export default Model;
