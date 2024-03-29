import { Request, Response } from 'express';
import WalletModel, { Transaction } from '../models/wallet';
import UserModel from '../models/user';
import sendEmail from '../utils/email';
import bcrypt from 'bcrypt';

export const createWallet = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

// Find the user based on the provided email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

// Check if the provided password matches the user's password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

// Now, you have authenticated the user, and you can proceed to create the wallet
    const existingWallet = await WalletModel.findOne({ userId: user._id });

    if (existingWallet) {
      return res.status(400).json({ error: 'Wallet already exists for this user' });
    }

    const wallet = new WalletModel({ userId: user._id });
    await wallet.save();

    return res.status(201).json({ message: 'Wallet created successfully', wallet });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const transferMoney = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId, amount } = req.body;

 // Validate that senderId, receiverId, and amount are present in the request body
    if (!senderId || !receiverId || !amount) {
      return res.status(400).json({ error: 'Invalid request. Make sure senderId, receiverId, and amount are provided.' });
    }

    const senderWallet = await WalletModel.findOne({ userId: senderId });
    const receiverWallet = await WalletModel.findOne({ userId: receiverId });

    if (!senderWallet || !receiverWallet) {
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

    // Notify receiver via email
    const emailSubject = 'You received money!';
    const emailText = `You received ${amount} units of currency from ${senderId}.`;

    sendEmail(receiverWallet.userId, emailSubject, emailText);

    return res.status(200).json({
      message: 'Money transferred successfully',
      senderWallet,
      receiverWallet,
      senderTransaction,
      receiverTransaction,
    });
  } catch (error) {
    console.error(error);
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

// Filter out transactions with undefined date property
    const transactions = userWallet.transactions.filter(
      (transaction) => transaction.date && transaction.date >= startDate
    );

    return res.status(200).json({ transactions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

