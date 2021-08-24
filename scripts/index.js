const { setOracle } = require("./scripts/setOracle");
const web3 = require("./config/initWeb3");
const keys = require("./config/keys.json");
const config = require("./config/config.json");
const { abi } = require("./config/SmokeToken.json");

setOracle(
  keys.rinkeby.address,
  keys.rinkeby.address,
  web3,
  abi,
  config.SmokeToken.contractAddress
);
