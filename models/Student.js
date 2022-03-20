import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  firstName: { type: String, required: true, maxLength: 64 },
  lastName: { type: String, required: true, maxLength: 64 },
  nickName: { type: String, required: false, maxLength: 64 },
  email: { type: String, required: true, maxLength: 512 },
});
const Model = mongoose.model("Student", schema)

export default Model
