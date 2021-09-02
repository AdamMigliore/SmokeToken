const { hasRole } = require("../functions/hasRole");
const web3 = require("../config/initWeb3");
const keys = require("../../config/keys.json");
const config = require("../../config/config.json");
const { abi } = require("../../config/SmokeToken.json");

const smokeToken = new web3.eth.Contract(abi, config.SmokeToken.address);

hasRole("0x00", keys.rinkeby.address, keys.rinkeby.address, smokeToken);
