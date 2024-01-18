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
