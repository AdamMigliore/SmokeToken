import React from "react";
import Card, { CardProps } from "@material-ui/core/Card";
import { useStyles } from "./styles";
import clsx from "clsx";

interface Props extends CardProps {}

const ActionArea: React.FC<Props> = (props) => {
  const classes = useStyles();
  return (
    <Card className={clsx(classes.actionArea, props.className)} {...props}>
      {props.children}
    </Card>
  );
};

export default ActionArea;
