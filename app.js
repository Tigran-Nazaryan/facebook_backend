import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { corsOptions } from "./config/corsOptions.js";
import router from "./routes/index.js";
import { initSocket } from "./utils/socket.js";
import { setupSocketHandlers } from "./utils/socketHandler.js";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import {startServer} from "./utils/startServer.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", router);

const server = http.createServer(app);
const io = initSocket(server);
setupSocketHandlers(io);

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
        socket.join(userId.toString());
        console.log(`User ${userId} joined room ${userId}`);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

startServer(app, PORT);
