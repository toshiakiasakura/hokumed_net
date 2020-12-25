/** This module is for reducing the total typing amount.
 * This usage of declaration is called contextual typing. 
 */
import { Request, Response, NextFunction } from "express";
export type ExpressFunc = (req: Request, res:Response) => void
export type ExpressMiddleFunc = (
    req: Request,
    res:Response,
    next: NextFunction
  ) => void
