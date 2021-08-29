import React from "react";
import MaterialModal, { ModalProps } from "@material-ui/core/Modal";
import ActionArea from "../ActionArea/ActionArea";
import clsx from "clsx";
import { useStyles } from "./styles";
import Grid from "@material-ui/core/Grid";

interface Props extends ModalProps {}

const Modal: React.FC<Props> = (props) => {
  const classes = useStyles();
  return (
    <MaterialModal {...props}>
      <Grid
        container
        className={clsx(classes.gridContainer)}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <ActionArea className={clsx(classes.actionArea)}>
          {props.children}
        </ActionArea>
      </Grid>
    </MaterialModal>
  );
};

export default Modal;
