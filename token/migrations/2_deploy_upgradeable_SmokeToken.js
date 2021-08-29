const { deployProxy } = require("@openzeppelin/truffle-upgrades");
const keys = require("../../config/keys.json");

const SmokeTokenUpgradeable = artifacts.require("SmokeTokenUpgradeable.sol");

module.exports = async function (deployer) {
  await deployProxy(SmokeTokenUpgradeable, [], {
    deployer,
    initializer: "initialize",
  });
};
