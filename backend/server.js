import express from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config();
const port = process.env.PORT;

app.get("/api/check", (req,res) => {
    res.send("just checking");    
})

app.listen(port,()=>{
    console.log(`the app is running on port ${port}`);
})