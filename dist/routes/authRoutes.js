"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registerController_1 = require("../controllers/registerController");
const loginController_1 = require("../controllers/loginController");
const router = express_1.default.Router();
router.post('/register', registerController_1.register);
router.post('/login', loginController_1.login);
exports.default = router;
