import Mongoose from 'mongoose';

const signupSchema = new Mongoose.Schema({
  currentApp: { type: String, required: true },
  version: { type: String, required: true },
  ipAddress: { type: String, required: true },
  identifier: { type: String },
  visitCount: { type: Number, default: 0 },
  data: { type: String },
  createdAt: { type: Date },
});

export default Mongoose.model('Signup', signupSchema, 'Signups');
