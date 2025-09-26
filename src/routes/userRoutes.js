import e from "express";
import { register } from "../controllers/usersController/register.js"
// import { registerWithOtp } from "../controllers/usersController/registerWithOtp.js";
import { verifyAccount } from "../controllers/usersController/verifyAccount.js";
import { login } from "../controllers/usersController/login.js";
import { logout } from "../controllers/usersController/logout.js";
import { isAuthenticated } from "../middlewares/authMiddleware/auth.js";
// import { refresh } from "../controllers/usersController/refresh.js";

const router = e.Router();

router.post("/register", register);
router.post("/verify-account", verifyAccount);
router.post("/login", login)
router.post("/logout", isAuthenticated, logout)

export default router;