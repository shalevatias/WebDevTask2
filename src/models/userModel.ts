import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    refreshTokens: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
