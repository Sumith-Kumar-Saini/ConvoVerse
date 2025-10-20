import { Router } from "express";

import {
  login,
  logout,
  refresh,
  register,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { loginSchema, registerSchema } from "../schemas";
import { catchAsync } from "../utils/catchAsync";

const router = Router();

router.post("/register", validate(registerSchema), catchAsync(register));
router.post("/login", validate(loginSchema), catchAsync(login));
router.get("/refresh", catchAsync(refresh));
router.get("/logout", catchAsync(logout));

export default router;
