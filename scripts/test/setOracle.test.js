const { setOracle } = require("../scripts/setOracle");
const web3 = require("../config/initWeb3");
const config = require("../config/config.json");
const { abi } = require("../config/SmokeToken.json");

setOracle(
  config.localBlockchain.address,
  config.localBlockchain.address,
  web3,
  abi,
  config.SmokeToken.contractAddress
);
