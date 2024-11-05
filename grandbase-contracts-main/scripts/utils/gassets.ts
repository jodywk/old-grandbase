
type TokenInfo = {
  symbol: string,
  name: string
}
export const gTokenInfos: Array<TokenInfo> = [
  {
    symbol: "gCOIN",
    name: "CoinBase",
  },
  {
    symbol: "gNVDA",
    name: "NVIDIA Corp.",
  },
  {
    symbol: "gCSPX",
    name: "iShares Core S&P 500 UCITS ETF",
  },
  {
    symbol: "gMSTR",
    name: "MicroStrategy",
  },
  {
    symbol: "gGLXY",
    name: "Galaxy Digital",
  },
  {
    symbol: "gAMZN",
    name: "Grandbase Amazon",
  },
  {
    symbol: "gAAPL",
    name: "Grandbase Apple",
  },
  {
    symbol: "gGOOGL",
    name: "Grandbase Alphabet",
  },
  {
    symbol: "gMETA",
    name: "Grandbase Meta",
  },
  {
    symbol: "gMSFT",
    name: "Grandbase Microsoft",
  },
  {
    symbol: "gTSLA",
    name: "Grandbase Tesla",
  },

  // Frex
  {
    symbol: "gCNY",
    name: "Grandbase Chinese Yuan",
  },
  {
    symbol: "gGBP",
    name: "Grandbase British Pound Sterling",
  },
  {
    symbol: "gEUR",
    name: "Grandbase EURO",
  },
  {
    symbol: "gJPY",
    name: "Grandbase Japanese Yen",
  },
  {
    symbol: "gAUD",
    name: "Grandbase Australian Dollar",
  },
  {
    symbol: "gCAD",
    name: "Grandbase Canadian Dollar",
  },

  // commodities
  {
    symbol: "gGOLD",
    name: "Grandbase Gold",
  },
  {
    symbol: "gSLVR",
    name: "Grandbase Silver",
  },
  {
    symbol: "gOil",
    name: "Grandbase WTI Crude",
  },
];

export const TestLPs: Array<[String, number]> = [
  ["gCOIN-USDC", 175.48],
  ["gNVDA-USDC", 488.20],
  ["gCSPX-USDC", 498.51],
  ["gMSTR-USDC", 624],
  ["gGLXY-USDC", 8.6],
  ["gAMZN-USDC", 145.11],
  ["gAMZN-USDT", 145.11],
  ["gAAPL-USDT", 193.11],
  ["gGOOGL-USDC", 129.15],
  ["gGOOGL-DAI", 129.20],
  ["gMETA-USDC", 319.58],
  ["gMSFT-USDC", 367.96],
  ["gTSLA-USDT", 257],
  ["gEUR-USDT", 0.101],
  ["gAUD-USDC", 0.68],
  ["gCAD-USDC", 0.75],
  ["gGOLD-USDC", 2030.36],
  ["gSLVR-USDC", 24.52],
  ["gCNY-USDC", 0.14],
  ["gGBP-USDC", 1.26]
];