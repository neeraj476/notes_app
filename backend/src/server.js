import express from "express"
import dotenv from "dotenv";
import cors from 'cors'
dotenv.config();
import cookieParser from "cookie-parser"

import {connectDB} from './db/db.js'    
import userRoute from './router/user.route.js'
import noteRouter from './router/notes.router.js'
connectDB();



const app = express();
const port = process.env.PORT || 3000

app.use(
    cors({
        origin: 'http://localhost:5173', // Frontend URL
        credentials: true, // Allow cookies
    })
);


app.use(cookieParser());
app.use(express.json());
app.use("/api/users" , userRoute);
app.use("/api/" , noteRouter);
app.listen(port ,()=>{
    console.log("server is live at port " , port );
})

 