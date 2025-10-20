import { Request, Response, Router } from "express";
import { authorize } from "../middlewares/auth.middleware";
import { logger } from "../utils/logger";

const router = Router();

router.post("/", authorize, (req: Request, res: Response) => {
  const { title = "Untitled" } = (req.body || {}) as { title?: string };

  const user = (req as any).user;

  res.status(200).json({ message: "token is working" });
  logger.info(JSON.stringify(user, null, 2));
});

export default router;
