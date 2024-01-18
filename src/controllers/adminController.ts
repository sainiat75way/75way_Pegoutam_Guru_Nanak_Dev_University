import { Request, Response } from 'express';
import WalletModel from '../models/wallet';
import User from '../models/user';

export const adminController = async (req: any, res: Response) => {
  try {
    const { role } = req.user;
    let selectedFields: string;
    if (role === 'owner') {
      selectedFields = 'email password name gender age';
    } else if (role === 'director') {
      selectedFields = 'email name gender age';
    } else if (role === 'manager') {
      selectedFields = 'name email';
    } else {
      selectedFields = 'email name';
    }
    const users = await User.find({}, selectedFields);
    const usersWithWallets = await Promise.all(users.map(async (user) => {
      const wallet = await WalletModel.findOne({ userId: user._id });
      const userObject = { ...user.toObject(), balance: role === 'owner' ? wallet?.balance : undefined };
      return userObject;
    }));

    res.status(200).json({ users: usersWithWallets });
  } catch (error) {
    console.error('Error in adminController:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
