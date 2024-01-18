How to use Pegoutam Saini 75 project

We have to create our account first means we have to register and the our data is stored in mongoDb and then we login and our token got generated and our now we have to create our wallet when we create wallet to steps process first it check is the user creating wallet has register if not then it will show error and using frontend we can send it to back to register page. If the user have already register than user wallet get created now user wan too do transaction. When user create wallet rupees 10 automatically get in to the wallet. Now user enter the if of both send and receiver and transaction got done and from sender account rupees 5 got deducted assume we have send 5 rupees and it got added into the receiver account both user receive the gmail I am using auth gmail sender here and if now user again try to send the money suppose balance now’s 5 and user try to send 10rs again user fill get error insufficient balance. And now we want to have the history of the user transaction we can easily get it by just entering user id and applying the filer.

How to Register in Pegoutam project

1. Got to - http://localhost:3000/register
2. You have to set it to post
3. In header choose content-type application/json
4. Give common din body like this
{
  "email": "example@email.com",
  "password": “password”,
  "name": “entername”,
}

You account have been created.

How to Login in Pegoutam project

1. Got to - http://localhost:3000/login
2. You have to set it to post
3. In header choose content-type application/json
4. Give common din body like this
{
  "email": "example@email.com",
  "password": “password”,
}

Let’s Create our wallet Now

How to Transfer Money ( For that we have to create wallet first ) 

Steps 

1. Go to - http://localhost:3000/wallet/create
2. Go to header choose Content-Type - application/json
3. Go to body > go to >
Set it POST then "Content-Type: application/json" 
4. Give this type command '{
  "email": “enter gmai lwhen you register,
  "password": “create new password”
}
4. Your wallet is created successfully.

How to Transfer money now

1. Go to - http://localhost:3000/wallet/transfer
2. curl -X POST -H "Content-Type: application/json" 
3. { “senderId": “entersenderid,
  "receiverId": “enter”recieverID,
  "amount": 5
}' 

Keep in mind I have given set 10 rs as in assignment 
And if you send all money then it will show insufficient balance

How to Get History Transaction Details

Go to given link I have used Thunder Client for this process 

DEMO GET http://localhost:3000/wallet/history/<userId>/<filter>

Working- http://localhost:3000/wallet/history/65a7965a3aafaa6606edb22f/week


src Folder

controllers > loginController.ts
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

registerController.ts

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


walletController.ts


import { Request, Response } from 'express';
import WalletModel, { Transaction } from '../models/wallet';
import UserModel from '../models/user';
import sendEmail from '../utils/email';
import bcrypt from 'bcrypt';
import User from '../models/user';

export const createWallet = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const existingWallet = await WalletModel.findOne({ userId: user._id });

    if (existingWallet) {
      return res.status(400).json({ error: 'Wallet already exists for this user' });
    }

    const wallet = new WalletModel({ userId: user._id });
    await wallet.save();

    return res.status(201).json({ message: 'Wallet created successfully', wallet });
  } catch (error) {
    console.error('Error in createWallet:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const transferMoney = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId, amount } = req.body;

    if (!senderId || !receiverId || !amount) {
      return res.status(400).json({ error: 'Invalid request. Make sure senderId, receiverId, and amount are provided.' });
    }

    const senderUser = await User.findById(senderId);
    const receiverUser = await User.findById(receiverId);
    const senderWallet = await WalletModel.findOne({ userId: senderId });
    const receiverWallet = await WalletModel.findOne({ userId: receiverId });

    if (!senderUser || !receiverUser || !senderWallet || !receiverWallet) {
      return res.status(404).json({ error: 'Sender or receiver not found' });
    }

    if (senderWallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    senderWallet.balance -= amount;
    receiverWallet.balance += amount;

    const senderTransaction: Transaction = { amount: -amount, type: 'debit', date: new Date() };
    const receiverTransaction: Transaction = { amount, type: 'credit', date: new Date() };

    senderWallet.transactions.push(senderTransaction);
    receiverWallet.transactions.push(receiverTransaction);

    await senderWallet.save();
    await receiverWallet.save();

    // Notify sender via email
    const senderEmailSubject = 'Money Sent';
    const senderEmailText = `You sent ${amount} units of currency to ${receiverUser.name}.`;

    sendEmail(senderUser.email, senderEmailSubject, senderEmailText);

    // Notify receiver via email
    const receiverEmailSubject = 'You Received Money';
    const receiverEmailText = `You received ${amount} units of currency from ${senderUser.name}.`;

    sendEmail(receiverUser.email, receiverEmailSubject, receiverEmailText);

    return res.status(200).json({
      message: 'Money transferred successfully',
      senderWallet,
      receiverWallet,
      senderTransaction,
      receiverTransaction,
    });
  } catch (error) {
    console.error('Error in transferMoney:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTransactionHistory = async (req: Request, res: Response) => {
  try {
    const { userId, filter } = req.params;

    const userWallet = await WalletModel.findOne({ userId });

    if (!userWallet) {
      return res.status(404).json({ error: 'Wallet not found for this user' });
    }

    let startDate = new Date();

    if (filter === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (filter === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (filter === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const transactions = userWallet.transactions.filter(
      (transaction) => transaction.date && transaction.date >= startDate
    );

    return res.status(200).json({ transactions });
  } catch (error) {
    console.error('Error in getTransactionHistory:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


models > user.ts

import mongoose, { Document, Schema } from 'mongoose';
const validator = require('validator');

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    gender: 'male' | 'female';
    age: number;
    balance: number;
}

const userSchema: Schema<IUser> = new Schema({
    email: { type: String, required: true, unique: true, validate: { validator: validator.isEmail, message: "invalid email format" } },
    password: { type: String, required: true },
    name: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    age: { type: Number, required: true },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;


models > wallet.ts


import mongoose, { Document } from 'mongoose';

export interface Transaction {
  amount: number;
  type: 'debit' | 'credit';
  date?: Date;
}

export interface Wallet extends Document {
  userId: string;
  balance: number;
  transactions: Transaction[];
}

const walletSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 10 },
  transactions: [
    {
      amount: { type: Number, required: true },
      type: { type: String, enum: ['debit', 'credit'], required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

walletSchema.index({ userId: 1 }, { unique: true });

const WalletModel = mongoose.model<Wallet>('Wallet', walletSchema);

export default WalletModel;


routes > authRoutes.ts

import express from 'express';
import {register} from '../controllers/registerController';
import { login } from '../controllers/loginController';

const router= express.Router();

router.post('/register',register);
router.post('/login',login);

export default router;

routes > wallet.ts

import express from 'express';
import { createWallet, transferMoney, getTransactionHistory } from '../controllers/walletController';

const router = express.Router();

router.post('/create', createWallet);
router.post('/transfer', transferMoney);
router.get('/history/:userId/:filter', getTransactionHistory);

export default router;


utils > email.ts

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pegoutam.75way@gmail.com',
    pass: 'qamzmyeupuhkmjse',
  },
});

const sendEmail = (receiverEmail: string, subject: string, text: string) => {
  const mailOptions = {
    from: 'pegoutam.75way@gmail.com',
    to: receiverEmail,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error:any, info:any) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

export default sendEmail;


.env 

PORT=3000
DB_USER=pegoutam75way
DB_PASSWORD=pegoutam75way
SALT_ROUND=10
JWT_SECRET=hello


index.ts


import express, { Express } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './src/routes/authRoutes';
import walletRoutes from './src/routes/walletRoutes';

const app: Express = express();

dotenv.config();
const port = process.env.PORT;

app.use(express.json());

try {
    mongoose.connect(`mongodb://localhost:27017/newwalletapp`);
    console.log('DB connected')
} catch (error) {
    console.log(error);
}

app.use('/wallet', walletRoutes);
app.use('/', authRoutes);

app.listen(port, () => {
    console.log(`Server started at ${port}`);
});

public > login.html












