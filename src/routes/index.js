import { Router } from "express";
import home from "./home.js";

const routes = Router();

routes.use("/", home);

export default routes;