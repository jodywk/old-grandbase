
export enum ASSET_TYPE {
  EQUITY,
  COMMODITY,
  FREX
}

export type GAsset = {
  name: string,
  desc: string,
  address?: string,
  type: string,
  image?: string,
  decimals: number,
  isAllowed?: number,
}

export type Collateral = {
  name: string,
  address: string,
  image: string,
  decimals: number
}

export type LP = {
  id: number,
  name: string,
  address?: string,
  decimals: number,
}