const { accounts, contract } = require("@openzeppelin/test-environment");
const { expect } = require("chai");
const { BN, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");

const SmokeToken = contract.fromArtifact("SmokeToken");

describe("SmokeToken", () => {
  const [owner, member1, member2] = accounts;

  const decimals = new BN("18");
  const scalingFactor = new BN("10").pow(decimals);
  const mintAmount = new BN("1092").mul(scalingFactor);

  beforeEach(async () => {
    this.smokeToken = await SmokeToken.new({ from: owner });
  });

  it("can generate some smoke tokens for a new member.", async () => {
    await this.smokeToken.generateSmoke({ from: owner });

    const balance = await this.smokeToken.balanceOf(owner);

    expect(balance).to.be.bignumber.equal(mintAmount);
  });

  it("generateSmoke emits an event", async () => {
    const receipt = await this.smokeToken.generateSmoke({ from: owner });

    expectEvent(receipt, "NewMember", { address_: owner });
  });

  it("cannot generate some smoke tokens for an existing member.", async () => {
    await this.smokeToken.generateSmoke({ from: owner });
    await expectRevert(
      this.smokeToken.generateSmoke({ from: owner }),
      "Error: This address has already generated smoke."
    );
  });

  it("can woo some amount of tokens.", async () => {
    await this.smokeToken.generateSmoke({ from: owner });
    await this.smokeToken.generateSmoke({ from: member1 });
    await this.smokeToken.generateSmoke({ from: member2 });

    const tokenAmount = new BN("15").mul(scalingFactor);
    const individualTokenAmount = tokenAmount.div(new BN("3"));
    await this.smokeToken.woo(tokenAmount, { from: owner });

    const ownerBalance = await this.smokeToken.balanceOf(owner);
    const member1Balance = await this.smokeToken.balanceOf(member1);
    const member2Balance = await this.smokeToken.balanceOf(member2);

    expect(ownerBalance).to.be.bignumber.equal(
      mintAmount.sub(tokenAmount).add(individualTokenAmount)
    );
    expect(member1Balance).to.be.bignumber.equal(
      mintAmount.add(individualTokenAmount)
    );
    expect(member2Balance).to.be.bignumber.equal(
      mintAmount.add(individualTokenAmount)
    );
  });

  it("woo emits an event.", async () => {
    await this.smokeToken.generateSmoke({ from: owner });
    await this.smokeToken.generateSmoke({ from: member1 });

    const tokenAmount = new BN("15").mul(scalingFactor);
    const receipt = await this.smokeToken.woo(tokenAmount, { from: owner });
    expectEvent(receipt, "Wooed", { address_: owner, amount: tokenAmount });
  });

  it("cannot woo more than the tokens owned.", async () => {
    await this.smokeToken.generateSmoke({ from: owner });
    await this.smokeToken.generateSmoke({ from: member1 });

    const tokenAmount = mintAmount.add(new BN("1"));
    await expectRevert(
      this.smokeToken.woo(tokenAmount, { from: owner }),
      "ERC20: Transfer amount exceeds balance"
    );
  });

  it("can woo wednesday.", async () => {
    //  Setup
    await this.smokeToken.setOracle(member1, { from: owner });
    await this.smokeToken.generateSmoke({ from: owner });
    await this.smokeToken.generateSmoke({ from: member1 });

    //  Action
    await this.smokeToken.wooWednesday({ from: member1 });

    const individualBalance = mintAmount.div(new BN("2")).add(mintAmount);

    expect(await this.smokeToken.balanceOf(owner)).to.be.bignumber.equal(
      individualBalance
    );
    expect(await this.smokeToken.balanceOf(member1)).to.be.bignumber.equal(
      individualBalance
    );
  });

  it("woo wednesday emits an event.", async () => {
    //  Setup
    await this.smokeToken.setOracle(member1, { from: owner });

    //  Action
    const receipt = await this.smokeToken.wooWednesday({ from: member1 });

    expectEvent(receipt, "WooWednesday", { individualAmount: mintAmount });
  });

  it("cannot call woo wednesday unless you are an oracle.", async () => {
    await expectRevert(
      this.smokeToken.wooWednesday({ from: member1 }),
      "Error: Only an oracle can call a woo wednesday."
    );
  });

  it("can set the mint amount.", async () => {
    const mintAmount = new BN("1");

    await this.smokeToken.setMintAmount(mintAmount, { from: owner });

    expect(await this.smokeToken.getMintAmount()).to.be.bignumber.equal(
      mintAmount
    );
  });

  it("can set the mint amount only by the owner.", async () => {
    const mintAmount = new BN("1");

    await expectRevert(
      this.smokeToken.setMintAmount(mintAmount, { from: member1 }),
      "Error: Only the owner can set the mint amount."
    );
  });
});
