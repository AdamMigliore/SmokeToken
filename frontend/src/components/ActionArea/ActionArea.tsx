import React from "react";
import Card, { CardProps } from "@material-ui/core/Card";
import { useStyles } from "./styles";
import clsx from "clsx";

interface Props extends CardProps {}

const ActionArea: React.FC<Props> = ({ className, children, ...rest }) => {
  const classes = useStyles();
  return (
    <Card className={clsx(classes.actionArea, className)} {...rest}>
      {children}
    </Card>
  );
};

export default ActionArea;
