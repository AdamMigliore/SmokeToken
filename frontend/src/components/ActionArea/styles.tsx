import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  actionArea: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 25,
    background: "#E0E5EC",
    boxShadow:
      "9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px  rgba(255,255,255, 0.5)",
    padding: "50px",
  },
});

export { useStyles };
