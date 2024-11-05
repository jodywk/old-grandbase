import { type Request, type Response, type NextFunction } from 'express'
import { generateToken } from '../common/utils'
import UserProfile from '../models/user-profile.model';

export async function getAdmin(
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<any> {
  
}