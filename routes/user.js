import express from "express"
import { login, register } from "../controllers/user.js";

const router = express.Router();

// router.route("/login").get(login)

// All Routes
router.post("/login",login);

router.post("/register",register);

export default router;