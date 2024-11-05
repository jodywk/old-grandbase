import jwt from 'jsonwebtoken';
import BigNumber from 'bignumber.js';

const SECRET_KEY = "SECRET_KEY";

export const isNotIncluded = (keyList: string[], obj: any): boolean => {
  if (obj === undefined) return false
  for (const key of keyList) {
    if (!(key in obj)) return true
  }
  return false
}

export function generateToken(publicAddress: string) {
  return jwt.sign({ data: publicAddress }, SECRET_KEY as string, { expiresIn: '24h' });
}

export const cvt2UiAmount = (amount: number | string, decimals: number) => {
  return new BigNumber(amount).dividedBy(new BigNumber(Math.pow(10, decimals))).toFixed(4)
}
