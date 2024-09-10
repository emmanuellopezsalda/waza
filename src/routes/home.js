import { Router } from "express";
import { inicio } from "../controllers/home.controllers.js";

const home = Router();

home.get("/", inicio);


export default home;