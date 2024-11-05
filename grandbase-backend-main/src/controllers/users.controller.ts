import { type Request, type Response, type NextFunction } from 'express'
import { generateToken } from '../common/utils'
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { generateNonce, SiweMessage } from 'siwe';
import UserProfile from '../models/user-profile.model';

export async function sendAuthToken(
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<any> {

}

export async function updateNonce(
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<any> {
  
  let publicAddress = req.body?.publicAddress;
  // TODO: verify jwtToken
  let jwtToken = req.body?.jwtToken;
  
  const updatedCnt = await UserProfile.update({
    nonce: generateNonce()
  }, {
    where: {
      wallet: publicAddress
    }
  });
  if (updatedCnt[0] > 0) {
    res.status(200).send({ success: true });
  } else {
    res.status(401).send({ success: false });
  }
}

export async function getNonce(
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<any> {
  // TODO: 
  // - fetch nonce from database
  // - update nonce in database
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(generateNonce());
}

export async function validateSignature(
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<any> {
  const WL_ADDRESSES = [
    '0x2cA62Cf3F7D24A31D7125962b55809A61e05560a',
    '0xf235710D1A70272a274DA1c3146F16302219C6d3'
  ]
  console.log("req.nbody =", req.body);
  const { message, signature } = req.body;
  const siweMessage = new SiweMessage(message);
  try {
    const verifyRes = await siweMessage.verify({ signature });
    const _address = verifyRes.data.address;
    const _index = WL_ADDRESSES.indexOf(_address);
    if(_index != -1)
      res.status(200).send({success: true});
    else
      res.status(401).send({success: false});
  } catch {
    res.status(401).send({success: false});
  }
  // let publicAddress = req.body?.publicAddress;
  // let signature = req.body?.signature;
  // if (!publicAddress || !signature) {
  //   return res.status(401).send({
  //       error: 'Invalid Arguments',
  //     });
  // }

  // // TODO: should get nonce from db
  // const nonce = 'NONCE';
  // const challenge = `Sign this message for authenticating with your wallet. Nonce: ${nonce}.`;

  // const messageBytes = new TextEncoder().encode(challenge);

  // const publicKeyBytes = bs58.decode(publicAddress);
  // const signatureBytes = bs58.decode(signature);

  // const result = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);

  // // The signature verification is successful if the address found with
  // if (result === false) {
  //   return res.status(401).send({
  //     success: false,
  //     error: 'Signature verification failed',
  //   });
  // }

  // // Generate jwt token
  // const token = generateToken(publicAddress);
  // res.status(200).send({
  //   success: true,
  //   token,
  //   user_profile: {
  //     name: "Anan",
  //     profile_img: "",
  //     twitter: "",
  //   }
  // });
}

export async function logout(
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<any> {
  res.send(true);
}