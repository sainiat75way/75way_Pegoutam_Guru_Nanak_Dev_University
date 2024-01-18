import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';

export const checkRole = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    let role = 'user';

    if (user.email === 'careapplepolice@gmail.com') {
      role = 'owner';
    } else if (user.email === 'harshpreet.75way@gmail.com') {
      role = 'director';
    } else if (user.email === 'princesaini9154@gmail.com') {
      role = 'manager';
    }

    req.user = { _id: user._id, role };
    next();
  } catch (error) {
    console.error('Error in checkUserRole:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
