import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  button: {
    borderRadius: 12,
    backgroundColor: "#912be9",
    "&:hover": {
      backgroundColor: "#7c00ff",
    },
  },
});

export { useStyles };
