import React, { useState, useEffect } from "react";
import { useStyles } from "./styles";
import ActionArea from "./components/ActionArea/ActionArea";
import Grid from "@material-ui/core/Grid";
import clsx from "clsx";
import "@fontsource/roboto";
import Button from "./components/Button/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { SmokeToken } from "../../config/config.json";
import { abi } from "../../config/SmokeToken.json";
import { injected } from "./config/connector";
import { AbiItem } from "web3-utils";
import { useQuery, useQueryClient } from "react-query";
import { Contract } from "web3-eth-contract";

declare let window: any;

function App() {
  //  * Web3
  const { chainId, active, activate, connector } = useWeb3React<Web3>();
  const [web3, setWeb3Instance] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string>("");
  const [SmokeTokenInstance, setSmokeTokenInstance] = useState<Contract | null>(
    null
  );

  useEffect(() => {
    connector?.getProvider().then((provider) => {
      // Instantiate web3.js
      const instance = new Web3(provider);
      setWeb3Instance(instance);
      const token = new instance!.eth.Contract(
        abi as AbiItem[],
        SmokeToken.address
      );
      setSmokeTokenInstance(token);
    });
  }, [active, connector]);

  useEffect(() => {
    if (web3 === null) {
      return;
    }
    (web3 as Web3).eth.getAccounts((err, accounts: string[]) => {
      if (err) {
        console.error(err);
      } else {
        setAccount(accounts[0]);
      }
    });
  }, [web3]);

  useEffect(() => {
    setIsRinkeby(chainId === 4);
  }, [chainId]);

  useEffect(() => {
    setIsMetaMaskConnected(active);
  }, [active]);

  useEffect(() => {
    setIsMetaMask(window.ethereum.isMetaMask);
  }, []);

  // * State
  const [isRinkeby, setIsRinkeby] = useState(false);
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const [isMetaMask, setIsMetaMask] = useState(false);
  const [canGenerateSmoke, setCanGenerateSmoke] = useState(false);
  const [sendModal, setSendModal] = useState(false);
  const [wooModal, setWooModal] = useState(false);
  const [addressToolTipMessage, setAddressToolTipMessage] =
    useState("Click to copy!");

  // * Styles
  const classes = useStyles();

  // * React-Query
  const queryClient = useQueryClient();
  const { data: balance } = useQuery(
    "BALANCE",
    async () => {
      const res = await SmokeTokenInstance!.methods.balanceOf(account).call();
      console.log(res);
      return res;
    },
    {
      placeholderData: 0,
      refetchInterval: 2000,
      enabled: isRinkeby && isMetaMaskConnected,
    }
  );

  //  * Functions
  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(account);
    setAddressToolTipMessage("Copied!");
    setTimeout(() => {
      setAddressToolTipMessage("Click to copy!");
    }, 1500);
  };

  const toggleSendModal = () => {
    setSendModal((value) => !value);
  };

  const toggleWooModal = () => {
    setWooModal((value) => !value);
  };

  const enableMetaMask = async () => {
    try {
      await activate(injected);
    } catch (err) {
      console.log(err);
    }
  };

  const addSmokeTokenToMetaMask = async () => {
    try {
      await web3?.givenProvider.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: { ...SmokeToken },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const generateSmoke = async () => {
    try {
      await SmokeTokenInstance!.methods.generateSmoke().send({ from: account });
      queryClient.invalidateQueries("BALANCE");
    } catch (err) {
      console.log(err);
    }
  };

  const onGenerateSmokeClick = async () => {
    await generateSmoke();
    await addSmokeTokenToMetaMask();
  };

  // TODO: Generate Smoke
  // TODO: Send Smoke
  // TODO: Woo Smoke
  // TODO: Get balance

  return (
    <>
      {!isMetaMaskConnected && (
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          className={classes.mainContainer}
        >
          {isMetaMask && (
            <Button onClick={enableMetaMask}>
              <span className={clsx(classes.buttonText)}>
                Allow access to MetaMask 🦊
              </span>
            </Button>
          )}
          {!isMetaMask && (
            <span>
              Smoke token's dashboard uses MetaMask to work...{" "}
              <a href="https://metamask.io/">
                Please set up your MetaMask extension.
              </a>
            </span>
          )}
        </Grid>
      )}
      {isMetaMaskConnected && !isRinkeby && (
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          className={classes.mainContainer}
        >
          <span>
            Please switch to the rinkeby Test Network to use the dApp.
          </span>
        </Grid>
      )}
      {isMetaMaskConnected && isRinkeby && (
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          className={classes.mainContainer}
        >
          <span className={clsx(classes.Title, classes.TextPrimaryGradient)}>
            Smoke Token Dashboard
          </span>
          <div className={clsx(classes.vSpacing)}></div>
          <ActionArea>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Tooltip id="address" title={addressToolTipMessage}>
                <span
                  className={clsx(classes.ActionAreaTitle, classes.hover)}
                  onClick={() => copyAddressToClipboard()}
                >
                  {account}
                </span>
              </Tooltip>

              <span className={clsx(classes.ActionAreaSubtitle)}>
                {balance} SMKE
              </span>
              <div className={clsx(classes.actionAreaSpacing)}></div>
              <Grid
                container
                item
                direction="column"
                alignItems="center"
                justifyContent="center"
                className={clsx(classes.buttonContainer)}
              >
                {canGenerateSmoke && (
                  <>
                    <Button onClick={toggleSendModal}>
                      <span className={clsx(classes.buttonText)}>Send 💸</span>
                    </Button>
                    <br />
                    <Button onClick={toggleWooModal}>
                      <span className={clsx(classes.buttonText)}>
                        💢 Woo 💰
                      </span>
                    </Button>
                  </>
                )}
                {!canGenerateSmoke && (
                  <Button onClick={onGenerateSmokeClick}>
                    <span className={clsx(classes.buttonText)}>
                      Generate some Smoke 🔥
                    </span>
                  </Button>
                )}
              </Grid>
            </Grid>
          </ActionArea>
        </Grid>
      )}
    </>
  );
}

export default App;
