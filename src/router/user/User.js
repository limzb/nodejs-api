import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    email: { type: String, unique: false },
    password: String,
  },
  { collection: 'user' },
);

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
