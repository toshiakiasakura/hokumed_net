import { Request, Response, NextFunction } from "express";
export type ExpressFunc = (req: Request, res:Response) => void
export type ExpressMiddleFunc = (
    req: Request,
    res:Response,
    next: NextFunction
  ) => void
