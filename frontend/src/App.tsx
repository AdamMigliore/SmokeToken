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
import { injected } from "./config/connector";
import { AbiItem } from "web3-utils";
import { useQuery, useQueryClient } from "react-query";
import { Contract } from "web3-eth-contract";
import WooModal from "./components/WooModal/WooModal";
import BN from "bn.js";
import SendModal from "./components/SendModal/SendModal";
import { toast, ToastOptions } from "react-toastify";
import {
  CONTRACT_ADDRESS,
  ABI,
  CHAIN_ID,
  SMOKE_TOKEN_METADATA,
} from "./config/config";

const toastOptions: ToastOptions = {
  position: "top-center",
  theme: "colored",
};

declare let window: any;

function App() {
  // * State
  const [isRinkeby, setIsRinkeby] = useState(false);
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const [isMetaMask, setIsMetaMask] = useState(false);
  const [hasGeneratedSmoke, setHasGeneratedSmoke] = useState(false);
  const [sendModal, setSendModal] = useState(false);
  const [sendAmount, setSendAmount] = useState(new BN("0"));
  const [receivingAddress, setReceivingAddress] = useState("");
  const [wooModal, setWooModal] = useState(false);
  const [wooAmount, setWooAmount] = useState(new BN("0"));
  const [addressToolTipMessage, setAddressToolTipMessage] =
    useState("Click to copy!");

  // * Styles
  const classes = useStyles();

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
      const token = new instance!.eth.Contract(
        ABI as AbiItem[],
        CONTRACT_ADDRESS
      );
      setSmokeTokenInstance(token);
      setWeb3Instance(instance);
    });
  }, [connector]);

  useEffect(() => {
    if (web3 === null) {
      return;
    }
    (web3 as Web3).eth.getAccounts((err, accounts: string[]) => {
      if (err) {
        toast.error(
          "There was an error while loading web3... 😭",
          toastOptions
        );
      } else {
        setAccount(accounts[0]);
      }
    });
  }, [web3]);

  useEffect(() => {
    setIsRinkeby(chainId === CHAIN_ID);
  }, [chainId]);

  useEffect(() => {
    setIsMetaMaskConnected(active);
  }, [active]);

  useEffect(() => {
    getHasGeneratedSmoke(account);
  }, [account]);

  useEffect(() => {
    setIsMetaMask(window.ethereum.isMetaMask);
  }, []);

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
    setWooModal(!wooModal);
  };

  const enableMetaMask = async () => {
    try {
      await activate(injected);
    } catch (err) {
      toast.error(
        "There was an error while enabling MetaMask... 🙃",
        toastOptions
      );
    }
  };

  const addSmokeTokenToMetaMask = async () => {
    try {
      await web3?.givenProvider.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            ...SMOKE_TOKEN_METADATA,
          },
        },
      });
    } catch (error) {}
  };

  const onGenerateSmokeClick = async () => {
    try {
      await generateSmoke();
      await addSmokeTokenToMetaMask();
      await getHasGeneratedSmoke(account);
      toast.success("Successfully generated some smoke 💨💨💨", toastOptions);
    } catch (err) {
      toast.error(
        "There was an error while generating smoke... 🙃",
        toastOptions
      );
    }
  };

  //  SmokeToken Methods
  const generateSmoke = async () => {
    try {
      await SmokeTokenInstance?.methods.generateSmoke().send({ from: account });
      queryClient.invalidateQueries("BALANCE");
    } catch (err) {
      console.log(err);
    }
  };

  const getBalance = async (address: string) => {
    try {
      const res = await SmokeTokenInstance?.methods.balanceOf(address).call();
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  const getHasGeneratedSmoke = async (address: string) => {
    try {
      const res = await SmokeTokenInstance?.methods
        .hasGeneratedSmoke(address)
        .call();
      setHasGeneratedSmoke(res);
    } catch (err) {
      toast.error("I mean, I really tried to figure it out 😔", toastOptions);
    }
  };

  const woo = async (amount: number, address: string) => {
    try {
      await SmokeTokenInstance?.methods.woo(amount).send({ from: address });
      await getBalance(address);
      toast.success("Respect for spreading the love 😤😤🤩", toastOptions);
    } catch (err) {
      toast.error(
        "Ooops... you wooed too hard and broke something... 😭",
        toastOptions
      );
    }
  };

  const transfer = async (
    receivingAddress: string,
    amount: number,
    fromAddress: string
  ) => {
    try {
      await SmokeTokenInstance?.methods
        .transfer(receivingAddress, amount)
        .send({ from: fromAddress });
      await getBalance(fromAddress);
      toast.success(
        `You made ${receivingAddress} a very happy person 😋🥰`,
        toastOptions
      );
    } catch (err) {
      toast.error(
        "Ah man... let me take a look at what went wrong during the transfer 🥵",
        toastOptions
      );
    }
  };

  // * React-Query
  const queryClient = useQueryClient();
  const { data: balance } = useQuery("BALANCE", () => getBalance(account), {
    placeholderData: 0,
    refetchInterval: 500,
    enabled: isRinkeby && isMetaMaskConnected,
  });

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
                {balance && Web3.utils.fromWei(balance.toString())} SMKE
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
                {hasGeneratedSmoke && (
                  <>
                    <Button
                      onClick={toggleSendModal}
                      className={clsx(classes.buttonWidth)}
                    >
                      <span className={clsx(classes.buttonText)}>Send 💸</span>
                    </Button>
                    <br />
                    <Button
                      onClick={toggleWooModal}
                      className={clsx(classes.buttonWidth)}
                    >
                      <span className={clsx(classes.buttonText)}>
                        💢 Woo 💰
                      </span>
                    </Button>
                  </>
                )}
                {!hasGeneratedSmoke && (
                  <Button
                    onClick={onGenerateSmokeClick}
                    className={clsx(classes.buttonWidth)}
                  >
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

      <WooModal
        open={wooModal}
        balance={balance || 0}
        amount={wooAmount}
        setWooAmount={setWooAmount}
        woo={woo}
        toggleModal={toggleWooModal}
        address={account}
        children={<></>}
      />

      <SendModal
        open={sendModal}
        balance={balance || 0}
        amount={sendAmount}
        setAmount={setSendAmount}
        transfer={transfer}
        toggleModal={toggleSendModal}
        receivingAddress={receivingAddress}
        setReceivingAddress={setReceivingAddress}
        address={account}
        children={<></>}
      />
    </>
  );
}

export default App;
