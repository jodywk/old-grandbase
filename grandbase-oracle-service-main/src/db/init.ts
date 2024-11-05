import UserProfile from "../models/user-profile.model";

const users = [{
  name: "Nft-Ninja",
  wallet: "4uCQCK8eYmQWKKv68nyT672qguRxSfDQPEozTi7KXXWw"
}];

const collections = [
  {
    name: "Azuki",
    symbol: "AZK",
    image: "https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&dpr=1&w=3840"
  },
  {
    name: "DeGods",
    symbol: "DeGods",
    image: "https://i.seadn.io/gcs/files/c6cb0b1d6f2ab61c0efacf00e62e2230.jpg?auto=format&dpr=1&w=3840"
  },
  {
    name: "Mutant Ape Yacht Club",
    symbol: "APE",
    image: "https://i.seadn.io/gae/lHexKRMpw-aoSyB1WdFBff5yfANLReFxHzt1DOj_sg7mS14yARpuvYcUtsyyx-Nkpk6WTcUPFoG53VnLJezYi8hAs0OxNZwlw6Y-dmI?auto=format&dpr=1&w=3840"
  },
];

const activities = [
  {
    collection_id: '1',
    activityType: 'BUY',
    price: '30'
  },
  {
    collection_id: '1',
    activityType: 'BUY',
    price: '32'
  },
  {
    collection_id: '1',
    activityType: 'LIST',
    price: '100'
  },
  {
    collection_id: '2',
    activityType: 'LIST',
    price: '30'
  },
  {
    collection_id: '2',
    activityType: 'LIST',
    price: '32'
  },
  {
    collection_id: '2',
    activityType: 'LIST',
    price: '100'
  },
]
export async function initDB() {
  for (let user of users) {
    let newUser = new UserProfile(user);
    await newUser.save();
  }
}