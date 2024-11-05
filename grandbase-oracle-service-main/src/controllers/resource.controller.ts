import { type Request, type Response, type NextFunction } from 'express'
import { PRICE_STORAGE } from "../service/oracle";

export async function getPrices(
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<any> {
  res.status(200).send({ 
    success: true, 
    data: PRICE_STORAGE
  });
}