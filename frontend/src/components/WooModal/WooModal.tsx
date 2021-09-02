import React, { useState } from "react";
import { ModalProps } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { useStyles as useGlobalStyles } from "../../styles";
import { useStyles } from "./styles";
import Modal from "../Modal/Modal";
import clsx from "clsx";
import Web3 from "web3";
import BN from "bn.js";
import { useEffect } from "react";
import Button from "../Button/Button";

interface Props extends ModalProps {
  open: boolean;
  amount: BN;
  woo: any;
  setWooAmount: any;
  balance: number;
  toggleModal: any;
  address: string;
}

const WooModal: React.FC<Props> = ({
  open,
  toggleModal,
  balance,
  amount,
  setWooAmount,
  woo,
  address,
}) => {
  const [smokeLeft, setSmokeLeft] = useState(new BN(balance.toString())); // in Wei

  const classes = useStyles();
  const globalStyles = useGlobalStyles();

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

    setWooAmount(value); // in Wei
    setSmokeLeft(balanceBN.sub(value));
  };

  const onClickHandler = async () => {
    try {
      await woo(amount, address);
      toggleModal();
    } catch (err) {
      console.log(err);
    }
  };

  const handleModalClose = () => {
    toggleModal();
  };

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <span className={clsx(globalStyles.ActionAreaTitle)}>💢Woooo💢</span>
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
              label="Woo Amount"
              variant="outlined"
              onChange={onChangeHandler}
            />
          </Grid>
          <Grid item>
            <span className={clsx(classes.ticker)}>SMKE</span>
          </Grid>
        </Grid>
        <span className={clsx(globalStyles.ActionAreaSubtitle)}>
          {Web3.utils.fromWei(smokeLeft)} SMKE left after Wooing.
        </span>
        <br />
        <Button onClick={onClickHandler}>💸</Button>
      </Grid>
    </Modal>
  );
};

export default WooModal;
