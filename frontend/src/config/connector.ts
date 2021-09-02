import { InjectedConnector } from "@web3-react/injected-connector";
import { CHAIN_ID } from "./config";

export const CHAIN_IDS = [
  CHAIN_ID, // Rinkeby
];

export const injected = new InjectedConnector({ supportedChainIds: CHAIN_IDS });
