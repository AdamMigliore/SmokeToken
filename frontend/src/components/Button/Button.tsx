import React from "react";
import MaterialButton, { ButtonProps } from "@material-ui/core/Button";
import { useStyles } from "./styles";
import clsx from "clsx";

interface Props extends ButtonProps {}

const Button: React.FC<Props> = (props) => {
  const classes = useStyles();
  return (
    <MaterialButton
      disableElevation
      className={clsx(classes.button)}
      variant="contained"
      {...props}
    >
      {props.children}
    </MaterialButton>
  );
};

export default Button;
