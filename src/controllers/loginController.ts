import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from "../models/user";
 
const jwtSecret = process.env.JWT_SECRET || 'kite';
 
export const login = async (req: Request, res: Response) => {
    try {
        const email= req.body.email;
        const password=req.body.password;
        const user = await User.findOne({ email });
 
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Password Mismatch' });
        }
        const token = jwt.sign({ userId: user._id }, jwtSecret, {
            expiresIn: '1d',
        });
        res.status(200).json({ email: user.email, name: user.name, token: token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Login failed' });
    }
}