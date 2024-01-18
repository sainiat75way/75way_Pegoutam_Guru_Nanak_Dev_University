import express from 'express';
import { createWallet, transferMoney, getTransactionHistory } from '../controllers/walletController';
import { adminController} from '../controllers/adminController';
import { checkRole } from '../middleware/checkRole';

const router = express.Router();

router.post('/create',  createWallet);
router.post('/transfer',  transferMoney);
router.get('/history/:userId/:filter', getTransactionHistory);

export default router;