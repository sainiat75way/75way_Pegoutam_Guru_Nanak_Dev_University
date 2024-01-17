
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
