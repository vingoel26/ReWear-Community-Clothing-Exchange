import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './Routes/authRoute.js';
import userRoutes from './Routes/userRoute.js';
import connectDB from './db/index.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


connectDB()

.then(() => {
    app.on("error" , (error) => {
        console.log("err:",error);
        throw error
        
    })

    app.listen(process.env.PORT || 8000 , () => {
        console.log(`server is running at ${process.env.PORT}`);
    })
})

.catch ((error) => {
   console.log("MONGODB CONNECTION FAILER ! ! !",error);
})



app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
