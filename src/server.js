import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import cors from "cors";
const server = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
server.use(cors());
server.set("view engine", "ejs");
server.use(express.static(path.join(__dirname, 'public')));
server.set("views", path.join(__dirname, "views"));
server.set("port", process.env.PORT || 3100);

server.use("/", routes)

export default server;