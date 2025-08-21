import { Router } from "express";

import { register } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { registerSchema } from "../schemas";

const router = Router();

router.post("/register", validate(registerSchema), register);

export default router;
