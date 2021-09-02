import React from "react";
import MaterialModal, { ModalProps } from "@material-ui/core/Modal";
import ActionArea from "../ActionArea/ActionArea";
import clsx from "clsx";
import { useStyles } from "./styles";
import Grid from "@material-ui/core/Grid";

interface Props extends ModalProps {}

const Modal: React.FC<Props> = ({ children, onClose, className, ...rest }) => {
  const classes = useStyles();
  return (
    <MaterialModal
      onClose={onClose}
      className={clsx(classes.center, className)}
      {...rest}
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <ActionArea className={clsx(classes.actionArea)}>{children}</ActionArea>
      </Grid>
    </MaterialModal>
  );
};

export default Modal;
