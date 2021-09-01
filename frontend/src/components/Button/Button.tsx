import React from "react";
import MaterialButton, { ButtonProps } from "@material-ui/core/Button";
import { useStyles } from "./styles";
import clsx from "clsx";

interface Props extends ButtonProps {}

const Button: React.FC<Props> = ({ className, children, ...rest }) => {
  const classes = useStyles();
  return (
    <MaterialButton
      disableElevation
      className={clsx(classes.button, className)}
      variant="contained"
      {...rest}
    >
      {children}
    </MaterialButton>
  );
};

export default Button;
