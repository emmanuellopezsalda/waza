import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';

const server = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
server.set("view engine", "ejs");
server.use(express.static(path.join(__dirname, 'public')));
server.set("views", path.join(__dirname, "views"));
server.set("port", process.env.PORT || 3000);

server.use("/", routes)

export default server;