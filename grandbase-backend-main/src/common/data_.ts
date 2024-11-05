import { Collateral, GAsset, LP } from "./types";


export let ASSETS: Array<GAsset> = [
   // added 2023.12.24
   {
    name: "gCOIN", // 175.48
    desc: "CoinBase",
    address: "0xea1c96024f011b972239b4688688Ce3e35CE3143",
    type: "EQUITY",
    decimals: 18,
  },
  {
    name: "gNVDA", // 488.20
    desc: "NVIDIA Corp.",
    address: "0xB80ac6D09fCD88A3ad8144147cF75d2a488f4f3D",
    type: "EQUITY",
    decimals: 18,
  },
  { // feed from eth
    name: "gCSPX",
    desc: "iShares Core S&P 500 UCITS ETF", // 498.51
    address: "0x88df17B262B332F3e3D0c38F2C24EBaB031E48D9",
    type: "EQUITY",
    decimals: 18,
  },
  {
    name: "gMSTR",
    desc: "MicroStrategy", //624$
    address: "0x3e72865200bCB3d86d7631fa6556526Be3aA98AB",
    type: "EQUITY",
    decimals: 18,
  },
  {
    name: "gGLXY",
    desc: "Galaxy Digital", // 8.6$
    address: "0x46f02b7ECd3a5D43b3214F0629F039F786709A71",
    type: "EQUITY",
    decimals: 18,
  },
  // added end
  {
    name: "gAMZN",
    desc: "Amazon",
    address: "0xedd88D441474388dc636194681510AA40e766aA9",
    type: "EQUITY",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gAMZN.svg",
    decimals: 18,
  },
  {
    name: "gAAPL",
    desc: "Apple",
    address: "0x5F928e1307b770F4FF3Acd17C3d6eae725DdcE8a",
    type: "EQUITY",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gAAPL.svg",
    decimals: 18,
  },
  {
    name: "gGOOGL",
    desc: "Alphabet",
    address: "0x4e84Adaa440e6A97F04328152cC0eF8e5d4202fC",
    type: "EQUITY",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gGOOGL.svg",
    decimals: 18,
  },
  {
    name: "gMETA",
    desc: "Meta",
    address: "0x9d2C5Cc0EA18dcacB2CDDcc1F938431c172c23F6",
    type: "EQUITY",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gMETA.svg",
    decimals: 18,
  },
  {
    name: "gMSFT",
    desc: "Microsoft",
    address: "0xD21c392A4633f8A6F3AE350a6035D86694B3103f",
    type: "EQUITY",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gMSFT.svg",
    decimals: 18,
  },
  {
    name: "gTSLA",
    desc: "Tesla",
    address: "0xD8B45454E87D25009c23591c3b0E56f3c2C420Fc",
    type: "EQUITY",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gTLSA.svg",
    decimals: 18,
  },

  // Frex
  {
    name: "gCNY",
    desc: "Chinese Yuan",
    address: "0x239A578FBb582e3255BA5E6c26EB833DE56Caf86",
    type: "FREX",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gCNY.svg",
    decimals: 18,
  },
  {
    name: "gGBP",
    desc: "British Pound Sterling",
    address: "0x4099289ee7f5127cEB38A97E468F57cE9138F1b2",
    type: "FREX",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gGBP.svg",
    decimals: 18,
  },
  {
    name: "gEUR",
    desc: "EURO",
    address: "0x895C0B31723D4687Ee6a530DA5DcDFEE07c0b4fb",
    type: "FREX",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gEUR.svg",
    decimals: 18,
  },
  {
    name: "gJPY",
    desc: "Japanese Yen",
    address: "0xC0798F53dbf12213e45B415e82D8B512819d9FDD",
    type: "FREX",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gJPY.svg",
    decimals: 18,
  },
  {
    name: "gAUD",
    desc: "Australian Dollar",
    address: "0x390866169E905fF1Dd90ff99D45ca07829f8266F",
    type: "FREX",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gAUD.svg",
    decimals: 18,
  },
  {
    name: "gCAD",
    desc: "Canadian Dollar",
    address: "0xB598037F66985DBCb8bb3ae4F58B682a6Aac6eD7",
    type: "FREX",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gCAD.svg",
    decimals: 18,
  },

  // commodities
  {
    name: "gGOLD",
    desc: "Gold",
    address: "0x285f07c4dD40FF14dc846430E8875f7397E62B16",
    type: "COMMODITY",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gXAU.svg",
    decimals: 18,
  },
  {
    name: "gSLVR",
    desc: "Silver",
    address: "0xeC3Cd3c858661C23Cb7ea55839C3c01E97C4836E",
    type: "COMMODITY",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gXAG.svg",
    decimals: 18,
  },
  {
    name: "gOil",
    desc: "WTI Crude",
    address: "0x1CA3Ca199A584b43fceF902620D2e7a02758e121",
    type: "COMMODITY",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gOil.svg",
    decimals: 18,
  },
];

export let COLLATERALS: Array<Collateral> = [
  {
    name: "USDC",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/USDC.svg",
    address: "0xF733dC50FD4D0117a7d3EA0982F896E4921ae226",
    decimals: 6,
  },
  {
    name: "USDT",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/USDT.svg",
    address: "0x39E4a478bfA7fa87b3a85A108d4e6f51AABC8a78",
    decimals: 6,
  },
  {
    name: "DAI",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/DAI.svg",
    address: "0x472e36dC88AdA19B0d796b89034Db8B3CEd85D70",
    decimals: 18,
  },
];

export let LPS: Array<LP> = [
  {
    id: 0,
    name: "gAMZN-USDC",
    address: "0x2cF9f447802C87e8D0F8f066783780fD6404cA91",
    decimals: 18,
  },
  {
    id: 1,
    name: "gGOOGL-USDC",
    address: "0x219146EcEe17dB444b53eAb34741C8bc18a5422C",
    decimals: 18,
  },
  {
    id: 2,
    name: "gGOOGL-DAI",
    address: "0xFEb1eC3C112E4b4044D46326a027A689a9BCd82A",
    decimals: 18,
  },
  {
    id: 3,
    name: "gMETA-USDC",
    address: "0x2FAa0a11205B62865CB1d9b1ac88443d1e1Fc7a1",
    decimals: 18
  },
  {
    id: 4,
    name: "gGOLD-USDC",
    address: "0x35B62Eb5f4Ff0888817AFC95DA5969721D044E35",
    decimals: 18
  },
  {
    id: 5,
    name: "gGBP-USDC",
    address: "0xBa82f8296d8B6aAD17cfe280b267A59d5083809F",
    decimals: 18
  },
  {
    id: 6,
    name: "gCOIN-USDC",
    address: "0xA13FE2aEaEfcC240b1Aad93B5e6A631DeCdE3b06",
    decimals: 18
  },
  {
    id: 7,
    name: "gCSPX-USDC",
    address: "0xAbF6df3d72e13059A91DD399975376c81F17A006",
    decimals: 18
  },
  {
    id: 8,
    name: "gMSTR-USDC",
    address: "0xd674849850a8C57C8eB1fF1d1FCdc364FF819E54",
    decimals: 18
  },
  {
    id: 9,
    name: "gAAPL-USDT",
    address: "0x747dfC5EFA0afEA4347783EBb95dca8898A1AA81",
    decimals: 18
  },
  {
    id: 10,
    name: "gEUR-USDT",
    address: "0x4D5Bd0A6704790Cd9A00a0A6f7fD70E9AA8F6A4b",
    decimals: 18
  },
  {
    id: 11,
    name: "gAUD-USDC",
    address: "0xfA93677F6739de61f66144a79a138Ea2f314C057",
    decimals: 18
  }
];

export let ContractAddresses: Array<{
  name: string,
  address: string
}> = [
  {
    name: "Faucet",
    address: "0x7CfebD9a60Fe54e0553F7036565CE3AbbBd1d38F"
  },
  {
    "name": "Grand",
    "address": "0x129388f0645276623f17f867a13Ec10cb348D2F4"
  },
  {
    "name": "xGrand",
    "address": "0xD8875030111b3A9Ab5EEA42b0256d12D5F58576d"
  },
  {
    "name": "MasterGrand",
    "address": "0x313a01F28CDD70dDA97274EBDAD478F87b0760be"
  },
  {
    "name": "GrandOracle",
    "address": "0xaCEd6e747495663Cb15EB091D2d2BDbC5851fed9"
  },
  {
    "name": "PotionVault",
    "address": "0xeeC926446D0943Cdaccba9eE85d27f9F46409557"
  },
]


// export const Prices: Record<string, number> = {};
// Prices["gAMZN"] = 147.03;
// Prices["gAAPL"] = 191.24;
// Prices["gGOOGL"] = 131.86;
// Prices["gMETA"] = 324.82;
// Prices["gMSFT"] = 374.51;
// Prices["gTSLA"] = 238.83;
// Prices["gCNY"] = 0.14;
// Prices["gGBP"] = 1.34;
// Prices["gEUR"] = 1.06;
// Prices["gJPY"] = 0.08;
// Prices["gAUD"] = 0.67;
// Prices["gCAD"] = 1.23;
// Prices["gGOLD"] = 2137.80;
// Prices["gSLVR"] = 28.18;
// Prices["gOil"] = 2.98;
// Prices["USDC"] = 0.9999;
// Prices["USDT"] = 1.0001;
// Prices["DAI"] = 0.9998;
// Prices["ETH"] = 2203.2;

