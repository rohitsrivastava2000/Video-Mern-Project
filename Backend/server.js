import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import 'dotenv/config';
import route from "./Route/userRoute.js";
import { createServer } from 'node:http';
import { connectToSocket } from "./Controller/socketManger.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

const port = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());
app.use(express.json());

app.use(cors({
  origin: ['https://video-meet-frontend-22.onrender.com', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight
app.options('*', cors());

// Routes
app.use('/api/v1/users', route);

app.get('/', (req, res) => {
  res.send("Server is Started");
});

server.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
