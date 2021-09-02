async function setOracle(newOracleAddress, address, smokeToken) {
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
    console.log(`Error: ${err}`);
    process.exit(1);
  }
}

exports.setOracle = setOracle;
