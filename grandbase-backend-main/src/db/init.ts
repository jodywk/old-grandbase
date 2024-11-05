import { Collateral as CTokenInfo, GAsset, LP } from "../common/types";
import Collateral from "../models/collaterals.model";
import Contract from "../models/contracts.model";
import SynAsset from "../models/syn-assets.model";

export let ASSETS: Array<GAsset> = [
   // added 2023.12.24
   {
    name: "gCOIN", // 175.48
    desc: "CoinBase",
    address: "0xea1c96024f011b972239b4688688Ce3e35CE3143",
    type: "EQUITY",
    decimals: 18,
    isAllowed: 0,
  },
  {
    name: "gNVDA", // 488.20
    desc: "NVIDIA Corp.",
    address: "0xB80ac6D09fCD88A3ad8144147cF75d2a488f4f3D",
    type: "EQUITY",
    decimals: 18,
    isAllowed: 0,
  },
  { // feed from eth
    name: "gCSPX",
    desc: "iShares Core S&P 500 UCITS ETF", // 498.51
    address: "0x88df17B262B332F3e3D0c38F2C24EBaB031E48D9",
    type: "EQUITY",
    decimals: 18,
    isAllowed: 0,
  },
  {
    name: "gMSTR",
    desc: "MicroStrategy", //624$
    address: "0x3e72865200bCB3d86d7631fa6556526Be3aA98AB",
    type: "EQUITY",
    decimals: 18,
    isAllowed: 0,
  },
  {
    name: "gGLXY",
    desc: "Galaxy Digital", // 8.6$
    address: "0x46f02b7ECd3a5D43b3214F0629F039F786709A71",
    type: "EQUITY",
    decimals: 18,
    isAllowed: 0,
  },
  // added end
  {
    name: "gAMZN",
    desc: "Amazon",
    address: "0xbB15aaC18375a0338c9474B9CF0C2b9555B1Fe4D",
    type: "EQUITY",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gAMZN.svg",
    decimals: 18,
    isAllowed: 1,
  },
  {
    name: "gAAPL",
    desc: "Apple",
    address: "0xC099F125e84fb3846a587624e08D7E986c74f77d",
    type: "EQUITY",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gAAPL.svg",
    decimals: 18,
    isAllowed: 1,
  },
  {
    name: "gGOOGL",
    desc: "Alphabet",
    address: "0xB89C8B2C3B98CA63E81B7AE7Fd2aADb7c3066B68",
    type: "EQUITY",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gGOOGL.svg",
    decimals: 18,
    isAllowed: 1,
  },
  {
    name: "gMETA",
    desc: "Meta",
    address: "0xd395dA9A9e7790AA2705f16129daf623519D8Bd2",
    type: "EQUITY",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gMETA.svg",
    decimals: 18,
    isAllowed: 1,
  },
  {
    name: "gMSFT",
    desc: "Microsoft",
    address: "0xfdDFB7750BB4Ad89F55891D1bb1d697b610d6b06",
    type: "EQUITY",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gMSFT.svg",
    decimals: 18,
    isAllowed: 1,
  },
  {
    name: "gTSLA",
    desc: "Tesla",
    address: "0xD8B45454E87D25009c23591c3b0E56f3c2C420Fc",
    type: "EQUITY",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gTLSA.svg",
    decimals: 18,
    isAllowed: 0,
  },

  // Frex
  {
    name: "gCNY",
    desc: "Chinese Yuan",
    address: "0x239A578FBb582e3255BA5E6c26EB833DE56Caf86",
    type: "FREX",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gCNY.svg",
    decimals: 18,
    isAllowed: 0,
  },
  {
    name: "gGBP",
    desc: "British Pound Sterling",
    address: "0x4099289ee7f5127cEB38A97E468F57cE9138F1b2",
    type: "FREX",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gGBP.svg",
    decimals: 18,
    isAllowed: 0,
  },
  {
    name: "gEUR",
    desc: "EURO",
    address: "0x895C0B31723D4687Ee6a530DA5DcDFEE07c0b4fb",
    type: "FREX",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gEUR.svg",
    decimals: 18,
    isAllowed: 0,
  },
  {
    name: "gJPY",
    desc: "Japanese Yen",
    address: "0xC0798F53dbf12213e45B415e82D8B512819d9FDD",
    type: "FREX",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gJPY.svg",
    decimals: 18,
    isAllowed: 0,
  },
  {
    name: "gAUD",
    desc: "Australian Dollar",
    address: "0x390866169E905fF1Dd90ff99D45ca07829f8266F",
    type: "FREX",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gAUD.svg",
    decimals: 18,
    isAllowed: 0,
  },
  {
    name: "gCAD",
    desc: "Canadian Dollar",
    address: "0xB598037F66985DBCb8bb3ae4F58B682a6Aac6eD7",
    type: "FREX",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gCAD.svg",
    decimals: 18,
    isAllowed: 0,
  },

  // commodities
  {
    name: "gGOLD",
    desc: "Gold",
    address: "0x285f07c4dD40FF14dc846430E8875f7397E62B16",
    type: "COMMODITY",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gXAU.svg",
    decimals: 18,
    isAllowed: 0,
  },
  {
    name: "gSLVR",
    desc: "Silver",
    address: "0xeC3Cd3c858661C23Cb7ea55839C3c01E97C4836E",
    type: "COMMODITY",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gXAG.svg",
    decimals: 18,
    isAllowed: 0,
  },
  {
    name: "gOil",
    desc: "WTI Crude",
    address: "0x1CA3Ca199A584b43fceF902620D2e7a02758e121",
    type: "COMMODITY",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gOil.svg",
    decimals: 18,
    isAllowed: 0,
  },
];

export let COLLATERALS: Array<CTokenInfo> = [
  {
    name: "USDC",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/USDC.svg",
    address: "0xE6fa5bC7C562B45a9Ac1856Bf15B4E278bce99c1",
    decimals: 6,
  },
  {
    name: "USDT",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/USDT.svg",
    address: "0xaB4219D9A7427B4eDed41aF3dCcebc66672A090c",
    decimals: 6,
  },
  {
    name: "DAI",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/DAI.svg",
    address: "0x1C06b3cD53746230bb58C232Ac1Ec63c733eb60c",
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
    address: "0x84bF55b328CB73caaD506906CE324E0aD19b63bd"
  },
  {
    name: "GrandBase",
    address: "0xd83057B3A5f46AeC89a0AFE85Bc1D4324b904010"
  },
  {
    name: "PotionVault",
    address: "0xE8faECDC4C109e29574853AF3Fb208b09dfB3004"
  },
]



export async function initDB() {
  for (let asset of ASSETS) {
    let o = new SynAsset(asset);
    await o.save();
  }

  for (let coll of COLLATERALS) {
    let o = new Collateral(coll);
    await o.save();
  }

  for (let ctr of ContractAddresses) {
    let o = new Contract(ctr);
    await o.save();
  }
}