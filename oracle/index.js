const Web3 = require("web3");
const Provider = require("@truffle/hdwallet-provider");
const keys = require("../config/keys.json");
const config = require("../config/config.json");
const { abi } = require("../config/SmokeToken.json");
const { isDevelopment } = require("./utils/utils");

let web3;
let oracleAddress = keys.rinkeby.address;

if (isDevelopment()) {
  const url = `${config.localBlockchain.url}:${config.localBlockchain.port}`;
  const provider = new Provider(config.localBlockchain.privateKey, url);
  web3 = new Web3(provider);
  oracleAddress = config.localBlockchain.address;
} else if (!isDevelopment()) {
  const url = `https://rinkeby.infura.io/v3/${keys.infura.projectId}`;
  const provider = new Provider(keys.rinkeby.privateKey, url);
  web3 = new Web3(provider);
}

const smokeToken = new web3.eth.Contract(abi, config.SmokeToken.address);

async function wooWednesday() {
  const today = new Date();

  if (today.getDay() === 3) {
    try {
      const receipt = await smokeToken.methods
        .wooWednesday()
        .send({ from: oracleAddress });

      console.log(
        `Woo wednesday has been initiated by ${oracleAddress} @ ${today.toLocaleString()}\n${JSON.stringify(
          receipt
        )}`
      );
      process.exit(0);
    } catch (error) {
      console.log(`Error: error information...\n${error}`);
      process.exit(2);
    }
  } else {
    console.log(
      "Error: woo wednesday was not initiated because it is not wednesday."
    );
    process.exit(1);
  }
}

wooWednesday();
