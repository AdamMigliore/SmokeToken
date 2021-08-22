const SmokeToken = artifacts.require("SmokeToken.sol");

module.exports = function (deployer) {
  deployer.deploy(SmokeToken);
};
