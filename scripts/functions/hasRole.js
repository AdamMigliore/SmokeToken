async function hasRole(role, address, senderAddress, smokeToken) {
  try {
    const receipt = await smokeToken.methods.hasRole(role, address).call();
    console.log(`Role ${role} for address ${address} is ${receipt}.`);
    process.exit(0);
  } catch (err) {
    console.log(`Error: ${err}`);
    process.exit(1);
  }
}

exports.hasRole = hasRole;
