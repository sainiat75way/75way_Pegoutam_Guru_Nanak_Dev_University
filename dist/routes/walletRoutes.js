"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const walletController_1 = require("../controllers/walletController");
const router = express_1.default.Router();
router.post('/create', walletController_1.createWallet);
router.post('/transfer', walletController_1.transferMoney);
router.get('/history/:userId/:filter', walletController_1.getTransactionHistory);
exports.default = router;
