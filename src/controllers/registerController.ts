import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import User, { IUser } from "../models/user";
 
export const register = async (req: Request, res: Response) => {
    try {
        const user: IUser = new User({
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            name: req.body.name,
            gender: req.body.gender,
            age: req.body.age
        });
        const savedUser = await user.save();
        console.log('User Saved:', savedUser);
        res.status(201).json({ message: 'User registered successfully',user:savedUser });
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ error: 'Registration failed' });
    }
}