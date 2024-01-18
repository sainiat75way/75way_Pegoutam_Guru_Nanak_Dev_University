"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionHistory = exports.transferMoney = exports.createWallet = void 0;
const wallet_1 = __importDefault(require("../models/wallet"));
const user_1 = __importDefault(require("../models/user"));
const email_1 = __importDefault(require("../utils/email"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_2 = __importDefault(require("../models/user"));
const createWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }
        const existingWallet = yield wallet_1.default.findOne({ userId: user._id });
        if (existingWallet) {
            return res.status(400).json({ error: 'Wallet already exists for this user' });
        }
        const wallet = new wallet_1.default({ userId: user._id });
        yield wallet.save();
        return res.status(201).json({ message: 'Wallet created successfully', wallet });
    }
    catch (error) {
        console.error('Error in createWallet:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createWallet = createWallet;
const transferMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { senderId, receiverId, amount } = req.body;
        if (!senderId || !receiverId || !amount) {
            return res.status(400).json({ error: 'Invalid request. Make sure senderId, receiverId, and amount are provided.' });
        }
        const senderUser = yield user_2.default.findById(senderId);
        const receiverUser = yield user_2.default.findById(receiverId);
        const senderWallet = yield wallet_1.default.findOne({ userId: senderId });
        const receiverWallet = yield wallet_1.default.findOne({ userId: receiverId });
        if (!senderUser || !receiverUser || !senderWallet || !receiverWallet) {
            return res.status(404).json({ error: 'Sender or receiver not found' });
        }
        if (senderWallet.balance < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }
        senderWallet.balance -= amount;
        receiverWallet.balance += amount;
        const senderTransaction = { amount: -amount, type: 'debit', date: new Date() };
        const receiverTransaction = { amount, type: 'credit', date: new Date() };
        senderWallet.transactions.push(senderTransaction);
        receiverWallet.transactions.push(receiverTransaction);
        yield senderWallet.save();
        yield receiverWallet.save();
        // Notify sender via email
        const senderEmailSubject = 'Money Sent';
        const senderEmailText = `You sent ${amount} units of currency to ${receiverUser.name}.`;
        (0, email_1.default)(senderUser.email, senderEmailSubject, senderEmailText);
        // Notify receiver via email
        const receiverEmailSubject = 'You Received Money';
        const receiverEmailText = `You received ${amount} units of currency from ${senderUser.name}.`;
        (0, email_1.default)(receiverUser.email, receiverEmailSubject, receiverEmailText);
        return res.status(200).json({
            message: 'Money transferred successfully',
            senderWallet,
            receiverWallet,
            senderTransaction,
            receiverTransaction,
        });
    }
    catch (error) {
        console.error('Error in transferMoney:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.transferMoney = transferMoney;
const getTransactionHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, filter } = req.params;
        const userWallet = yield wallet_1.default.findOne({ userId });
        if (!userWallet) {
            return res.status(404).json({ error: 'Wallet not found for this user' });
        }
        let startDate = new Date();
        if (filter === 'week') {
            startDate.setDate(startDate.getDate() - 7);
        }
        else if (filter === 'month') {
            startDate.setMonth(startDate.getMonth() - 1);
        }
        else if (filter === 'year') {
            startDate.setFullYear(startDate.getFullYear() - 1);
        }
        const transactions = userWallet.transactions.filter((transaction) => transaction.date && transaction.date >= startDate);
        return res.status(200).json({ transactions });
    }
    catch (error) {
        console.error('Error in getTransactionHistory:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getTransactionHistory = getTransactionHistory;
