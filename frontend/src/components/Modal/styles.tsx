import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  actionArea: {
    background: "#ffff",
    boxShadow: "none",
  },
  gridContainer: {
    width: "100%",
    height: "100%",
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export { useStyles };
