import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const saltRounds = 14;
const jwtSecretKey = "superSecretKey";

const schema = new mongoose.Schema({
  firstName: { type: String, required: true, maxLength: 64 },
  lastName: { type: String, required: true, maxLength: 64 },
  email: { type: String, required: true, maxLength: 512 },
  password: { type: String, required: true, maxLength: 70 },
  isAdmin: { type: Boolean, required: true, default: false },
});

schema.methods.generateAuthToken = function () {
  const payload = { user: { _id: this._id } };
  return jwt.sign(payload, jwtSecretKey);
};

schema.statics.authenticate = async function (email, password) {
  const user = await this.findOne({ email: email });

  const badHash = `$2b$${saltRounds}$invalidusernameaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`;
  const hashedPassword = user ? user.password : badHash;
  const passwordDidMatch = await bcrypt.compare(password, hashedPassword);

  return passwordDidMatch ? user : null;
};

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

const Model = mongoose.model("User", schema);

export default Model;
