const Web3 = require("web3");
const Provider = require("@truffle/hdwallet-provider");
const config = require("./config.json");
const keys = require("./keys.json");
let url = `https://rinkeby.infura.io/v3/${keys.infura.projectId}`;
let privateKey = keys.rinkeby.privateKey;
if (process.env.ENVIRONMENT === "DEVELOPMENT") {
  url = `${config.localBlockchain.url}:${config.localBlockchain.port}`;
  privateKey = config.localBlockchain.privateKey;
}

const provider = new Provider(privateKey, url);
const web3 = new Web3(provider);

module.exports = web3;
