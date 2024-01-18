"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const walletSchema = new mongoose_1.default.Schema({
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
const WalletModel = mongoose_1.default.model('Wallet', walletSchema);
exports.default = WalletModel;
