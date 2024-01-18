import express from 'express';
import {register} from '../controllers/registerController';
import { login } from '../controllers/loginController';
import { adminController } from '../controllers/adminController';
import { checkRole } from '../middleware/checkRole';

const router= express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/admin', checkRole, adminController);


export default router;