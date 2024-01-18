import mongoose, { Document, Schema } from 'mongoose';
const validator = require('validator');

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    gender: 'male' | 'female';
    age: number;
    balance: number;
    role: 'user' | 'owner' | 'director' | 'manager';
}

const userSchema: Schema<IUser> = new Schema({
    email: { type: String, required: true, unique: true, validate: { validator: validator.isEmail, message: "invalid email format" } },
    password: { type: String, required: true },
    name: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    age: { type: Number, required: true },
    role:{type: String, enum: ['user' , 'owner' , 'director' , 'manager'], required:true}
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
