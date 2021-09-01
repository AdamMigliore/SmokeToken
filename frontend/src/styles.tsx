import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  ActionAreaTitle: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  ActionAreaSubtitle: {
    fontSize: "14px",
    fontWeight: "lighter",
  },
  Title: {
    fontSize: "64px",
    fontWeight: "bold",
  },
  mainContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: "#E0E5EC",
  },
  hover: {
    cursor: "pointer",
    "&:hover": {
      color: "rgba(145,43,233,1)",
    },
  },
  vSpacing: {
    height: "15%",
  },
  TextPrimaryGradient: {
    background:
      "linear-gradient(41deg, rgba(145,43,233,1) 0%, rgba(121,151,255,1) 100%)",
    "-webkit-background-clip": "text",
    "-webkit-text-fill-color": "transparent",
    backgroundSize: "400%",
    animation: "$TextPrimaryAnimation 5s infinite alternate",
  },
  "@keyframes TextPrimaryAnimation": {
    "0%": {
      backgroundPosition: "left",
    },
    "100%": {
      backgroundPosition: "right",
    },
  },
  buttonText: {
    fontSize: "16px",
    fontWeight: "bold",
    textTransform: "none",
    color: "#FFFF",
  },
  buttonContainer: {
    width: "35% !important",
  },
  buttonWidth: {
    width: "100%",
  },
  actionAreaSpacing: {
    height: "50px",
  },
});

export { useStyles };
