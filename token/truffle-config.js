const HDWalletProvider = require("@truffle/hdwallet-provider");
const keys = require("../config/keys.json");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          [keys.rinkeby.privateKey],
          `https://rinkeby.infura.io/v3/${keys.infura.projectId}`
        ),
      network_id: 4,
      gas: 4500000,
      gasPrice: 45000000000,
    },
    develop: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*",
      defaultEtherBalance: 500,
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.7",
    },
  },
};
