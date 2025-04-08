import express from "express"
import dp from './Config/dbConnection.js'
import cors from 'cors'
import bodyParser from "body-parser";
import 'dotenv/config'
import route from "./Route/userRoute.js";

import {createServer} from 'node:http'
import {Server} from 'socket.io';
import { connectToSocket } from "./Controller/socketManger.js";




const app=express();
const server=createServer(app);
const io=connectToSocket(server);
 




const port=process.env.PORT || 4000;
app.use(bodyParser.json());
app.use(cors());
app.use(express.json())// Allow only frontend origin
app.use(cors({
    origin: ['http://localhost:5173', 'https://video-meet-frontend-9573.onrender.com'],
  credentials: true // if you're using cookies/auth headers
}));


app.use('/api/v1/users',route);



app.get('/',(req,res)=>{
    res.send("Server is Started");
})

server.listen(port,(req,res)=>{
    console.log(`Server is Started at port ${process.env.PORT}`);
})