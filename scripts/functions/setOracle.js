async function setOracle(
  newOracleAddress,
  address,
  web3,
  abi,
  contractAddress
) {
  const smokeToken = new web3.eth.Contract(abi, contractAddress);

  try {
    const receipt = await smokeToken.methods
      .setOracle(newOracleAddress)
      .send({ from: address });
    console.log(
      `Success: address ${newOracleAddress} is now an Oracle for SmokeToken. \n ${JSON.stringify(
        receipt
      )}`
    );
    process.exit(0);
  } catch (err) {
    console.log(`Error: ${error}`);
    process.exit(1);
  }
}

exports.setOracle = setOracle;
