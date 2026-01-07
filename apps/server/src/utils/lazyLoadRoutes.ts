import { Request, Response, NextFunction, Router } from 'express';

type RouterModule = { default: Router };

function lazyRouter(importFn: () => Promise<RouterModule>) {
  let cachedRouter: Router | null = null;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!cachedRouter) {
        const module = await importFn();
        cachedRouter = module.default;
      }
      return cachedRouter(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

export default lazyRouter;
