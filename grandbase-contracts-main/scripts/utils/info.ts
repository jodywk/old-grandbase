import fs from 'fs';

const networkInfo = {
  network: '',
  gasUsed: 0,
}

export const setNetwork = (_network: string) => {
  networkInfo.network = _network
  networkInfo.gasUsed = 0
}

export const addGasUsed = (gas: string) => {
  networkInfo.gasUsed += parseInt(gas)
}

export const getGasUsed = () => {
  return networkInfo.gasUsed
}

export const getNetwork = () => {
  return networkInfo.network
}

export const getDeployInfo = () => {
  try {
  return JSON.parse(fs.readFileSync(`scripts/data/deploy-${networkInfo.network}.json`).toString());
  } catch (err) {
      // console.log(err)
      return []
  }
}

export const getDeployFilteredInfo = (name: string) => {
  try {
  const tr = JSON.parse(fs.readFileSync(`scripts/data/deploy-${networkInfo.network}.json`).toString());
  return tr.find((t: { name: string }) => t.name === name)
  } catch (err) {
      // console.log(err)
      return []
  }
}

export const syncDeployInfo = (_name: string, _info: any) => {
  let _total = getDeployInfo()
  _total = [..._total.filter((t: any) => t.name !== _name), _info];
  fs.writeFileSync(`scripts/data/deploy-${networkInfo.network}.json`, JSON.stringify(_total));
  return _total;
}

export const saveDeployAddress = (name: string, address: string) => {
  console.log(`${name} is deployed to`, address);
  return syncDeployInfo(name, {
    name,
    address
  });
}

export const filterTokensByName = (filter: string) => {
  let _total = getDeployInfo();
  _total = [..._total.filter((t: any) => t.name.includes(filter))];
  return _total;
}