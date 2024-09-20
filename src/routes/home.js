import { Router } from "express";
import { inicio, login } from "../controllers/home.controllers.js";

const home = Router();

home.get("/", inicio);
home.get("/login", login)

export default home;