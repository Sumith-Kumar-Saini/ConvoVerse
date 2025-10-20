import { Request, Response, Router } from "express";
import { authorize } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authorize, (req: Request, res: Response) => {
  const { title = "Untitled" } = req.body as { title?: string };

  const user = (req as any).user;

  console.log(user);
});

export default router;
