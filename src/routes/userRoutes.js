import e from "express";
import { register } from "../controllers/usersController/register.js"

const router = e.Router();

router.post("/register", register)

export default router;