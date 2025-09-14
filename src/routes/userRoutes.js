import e from "express";
import { register } from "../controllers/usersController/register.js"
// import { registerWithOtp } from "../controllers/usersController/registerWithOtp.js";
import { verifyAccount } from "../controllers/usersController/verifyAccount.js";

const router = e.Router();

router.post("/register", register);
// router.post("/register-with-otp", registerWithOtp);
router.post("/verify-account", verifyAccount);

export default router;