import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { corsOptions } from "./config/corsOptions.js";
import router from "./routes/index.js";
import { startServer } from "./utils/startServer.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", router);

startServer(app, PORT);
