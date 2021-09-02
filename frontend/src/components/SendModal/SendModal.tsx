import React, { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import Grid from "@material-ui/core/Grid";
import BN from "bn.js";
import clsx from "clsx";
import Web3 from "web3";
import { useStyles as useGlobalStyles } from "../../styles";
import { useStyles } from "./styles";
import TextField from "@material-ui/core/TextField";
import Button from "../Button/Button";

interface Props {
  open: boolean;
  toggleModal: any;
  amount: BN;
  setAmount: any;
  balance: number;
  receivingAddress: string;
  setReceivingAddress: any;
  transfer: any;
  address: string;
}

const SendModal: React.FC<Props> = ({
  open,
  toggleModal,
  setReceivingAddress,
  receivingAddress,
  amount,
  transfer,
  address,
  balance,
  setAmount,
}) => {
  const [smokeLeft, setSmokeLeft] = useState(new BN(balance.toString())); // in Wei
  const globalStyles = useGlobalStyles();
  const classes = useStyles();

  useEffect(() => {
    setSmokeLeft(new BN(balance.toString()).sub(amount));
  }, [balance]);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = new BN(event.target.value.toString()).mul(
      new BN((10 ** 18).toString())
    ); // in Wei
    const balanceBN = new BN(balance.toString()); // in Wei

    if (value.cmp(balanceBN) === 1) {
      value = balanceBN;
    }

    setAmount(value); // in Wei
    setSmokeLeft(balanceBN.sub(value));
  };

  const onClickHandler = async () => {
    try {
      await transfer(receivingAddress, amount, address);
      toggleModal();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal open={open} onClose={toggleModal}>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <span className={clsx(globalStyles.ActionAreaTitle)}>Send some 💨</span>
        <br />

        <TextField
          type="text"
          value={receivingAddress}
          label="Address"
          variant="outlined"
          className={clsx(classes.address)}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setReceivingAddress(event.target.value);
          }}
        />

        <br />
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          spacing={1}
        >
          <Grid item>
            <TextField
              type="number"
              value={Web3.utils.fromWei(amount.toString())}
              label="Transfer Amount"
              variant="outlined"
              onChange={onChangeHandler}
            />
          </Grid>
          <Grid item>
            <span className={clsx(classes.ticker)}>SMKE</span>
          </Grid>
        </Grid>
        <span className={clsx(globalStyles.ActionAreaSubtitle)}>
          {Web3.utils.fromWei(smokeLeft)} SMKE left after transfer.
        </span>
        <br />
        <Button onClick={onClickHandler}>💸</Button>
      </Grid>
    </Modal>
  );
};

export default SendModal;
