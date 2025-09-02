import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile {
  _id?: string;
  name: string;
  age?: number;
  conditions: string[];
  lifestyle?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser extends Document {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  profiles: IProfile[];
  scannedCodes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: false,
    min: 0,
    max: 120,
  },
  conditions: [{
    type: String,
    required: false,
  }],
  lifestyle: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

const UserSchema = new Schema<IUser>({
  googleId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: false,
  },
  profiles: [ProfileSchema],
  scannedCodes: [{
    type: String,
    required: false,
  }],
}, {
  timestamps: true,
});

// Create compound index for efficient queries
UserSchema.index({ googleId: 1, email: 1 });

export const User = mongoose.model<IUser>('User', UserSchema, 'user');

// Log the collection name
console.log('🔍 User model collection name:', User.collection.name);
