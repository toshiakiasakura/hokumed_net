import { Request, Response, NextFunction } from "express";
export type ExpressFunc = (req: Request, res:Response) => void
