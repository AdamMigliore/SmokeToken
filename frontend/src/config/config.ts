import dotenv from "dotenv";
import config from "./config.json";
import { abi } from "./SmokeToken.json";
dotenv.config();

const { INFURA_PROJECT_ID, RINKEBY_PRIVATE_KEY, NODE_ENV } = process.env;

const SMOKE_TOKEN_METADATA = { ...config.SmokeToken };

const CONTRACT_ADDRESS =
  NODE_ENV === "development"
    ? config.localBlockchain.contractAddress
    : config.SmokeToken.address;

SMOKE_TOKEN_METADATA.address = CONTRACT_ADDRESS;

const PRIVATE_KEY =
  NODE_ENV === "development"
    ? config.localBlockchain.privateKey
    : RINKEBY_PRIVATE_KEY;

const CHAIN_ID = NODE_ENV === "development" ? 1337 : 4;

export {
  INFURA_PROJECT_ID,
  PRIVATE_KEY,
  abi as ABI,
  CONTRACT_ADDRESS,
  CHAIN_ID,
  SMOKE_TOKEN_METADATA,
};
