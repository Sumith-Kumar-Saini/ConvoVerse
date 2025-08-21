import { Router } from "express";

import { login, refresh, register } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { loginSchema, registerSchema } from "../schemas";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/refresh", refresh);

export default router;
