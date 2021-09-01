import { InjectedConnector } from "@web3-react/injected-connector";

export const CHAIN_IDS = [
  4, // Rinkeby
];

if (process.env.NODE_ENV === "development") {
  CHAIN_IDS.push(1337);
}

export const injected = new InjectedConnector({ supportedChainIds: CHAIN_IDS });
