import InfoCircleIcon from "@/assets/icons/info_circle.svg";
import MinimizeIcon from "@/assets/icons/minimize.svg";
import { useMultisigContext } from "@/components/shared/multisigProvider";
import { LIST_ACTIONS, LIST_TOKENS } from "@/utils/constants";
import { addressValid } from "@/utils/verifyCoreChange";
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  useConnection,
  useWallet,
} from "@renec-foundation/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "../../shared/loading";
import * as styles from "./styles";

interface transactionsProps {
  safeAddress: string;
}

const TransactionNew = ({ safeAddress }: transactionsProps) => {
  const { connection } = useConnection();
  const { safeClient } = useMultisigContext();
  const { publicKey } = useWallet();

  const [transactionName, setTransactionName] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [addressReceiver, setAddressReceiver] = useState<string>("");
  const [action, setAction] = useState(LIST_ACTIONS[0]);
  const [token, setToken] = useState(LIST_TOKENS[0]);
  const [balance, setBalance] = useState(0);
  const [signer, setSigner] = useState<string>("");
  const [loadingEnable, setLoadingEnable] = useState(true);
  const [submit, setSubmit] = useState(false);

  const [errorName, setErrorName] = useState("");
  const [errorAmount, setErrorAmount] = useState("");
  const [errorAddress, setErrorAddress] = useState("");
  const [showBtnAddContact, setShowBtnAddContact] = useState(false);
  const [canManage, setCanManage] = useState(false);

  const router = useRouter();

  const handleSelectActionChain = (event: SelectChangeEvent) => {
    const actionSelected =
      LIST_ACTIONS.find(
        (action) => action.actionName === (event.target.value as string)
      ) || LIST_ACTIONS[0];

    setAction(actionSelected);
  };

  const handleSelectTokenChain = (event: SelectChangeEvent) => {
    const tokenSelected =
      LIST_TOKENS.find(
        (token) => token.tokenName === (event.target.value as string)
      ) || LIST_TOKENS[0];

    setToken(tokenSelected);
  };

  const handleInputTransactionName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newName = event.target.value as string;
    if (newName) {
      setErrorName("");
    } else {
      setErrorName("Transaction name must exist");
    }

    setTransactionName(newName);
  };

  const handleInputAddressReceiver = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newAddress = event.target.value;
    if (!newAddress) {
      setErrorAddress("Address receiver name must exist");
      setShowBtnAddContact(false);
    } else if (!addressValid(newAddress)) {
      setErrorAddress("Address receiver invalid");
      setShowBtnAddContact(false);
    } else {
      setErrorAddress("");
      setShowBtnAddContact(true);
    }

    setAddressReceiver(newAddress);
  };

  const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = Number(event.target.value);
    if (newNumber > 0 && newNumber < balance) {
      setErrorAmount("");
    } else {
      setErrorAmount(
        `Amount needs to be greater than 0 and less than ${balance}`
      );
    }

    setAmount(Number(newNumber));
  };

  const handleMaxAmount = () => {
    setErrorAmount("");
    setAmount(balance);
  };

  const verifyDataInfo = () => {
    const checkTransactionName = transactionName;
    const checkAmount = amount;
    const checkAddressReceiver = addressValid(addressReceiver);

    if (!checkTransactionName) {
      setErrorName("Transaction name must exist");
    }

    if (!checkAmount) {
      setErrorAmount("Amount needs to be greater than 0 and less than 999");
    }

    if (!checkAddressReceiver) {
      setErrorAddress("Address receiver invalid");
    }

    return checkTransactionName && checkAmount && checkAddressReceiver;
  };

  const handleCancel = () => {
    router.push(`/safe/${safeAddress}/transactions`);
  };

  const handleSubmit = async () => {
    if (verifyDataInfo() && safeClient) {
      try {
        setSubmit(true);
        const transferIx = SystemProgram.transfer({
          fromPubkey: new PublicKey(signer),
          toPubkey: new PublicKey(addressReceiver),
          lamports: amount * LAMPORTS_PER_SOL,
        });

        const [proposalAddress, transaction] = await safeClient.createProposal(
          new PublicKey(safeAddress),
          transactionName,
          [transferIx]
        );
        await transaction.buildAndExecute();

        router.push(
          `/safe/${safeAddress}/transactions/${proposalAddress.toString()}`
        );
      } catch (error) {
        setSubmit(false);
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const fetchSafeSigner = async () => {
      if (safeClient && publicKey) {
        const safe = await safeClient.fetcher.findSafe(
          new PublicKey(safeAddress)
        );

        const [safeSigner] = await safeClient.findSafeSignerAddress(
          new PublicKey(safeAddress)
        );

        if (safeSigner) {
          const value = await connection.getBalance(safeSigner);
          setSigner(safeSigner.toString());
          setBalance(value / LAMPORTS_PER_SOL);
        }

        setCanManage(
          !!safe.owners.find((o) => o.toString() === publicKey.toString())
        );

        setLoadingEnable(false);
      }
    };

    fetchSafeSigner();
  }, [connection, publicKey, safeAddress, safeClient]);

  return (
    <Box sx={styles.main}>
      <Stack direction="column" spacing={5}>
        <Typography sx={styles.titleLabelStyle}>New Transaction</Typography>
        <Stack direction="column" spacing={2} sx={styles.boxStyle}>
          <Stack direction="row" spacing={2}>
            <Image
              src={InfoCircleIcon}
              alt="info-icon"
              width={32}
              height={32}
            />
            <Typography sx={styles.titleContentStyle}>Info</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography flex={1} sx={[styles.contentTextStyle, { pt: 1 }]}>
              Name:
            </Typography>
            <Stack direction="column" spacing={1} flex={7}>
              <TextField
                data-test-id="step-info-input-name"
                placeholder={"Fill safe name"}
                value={transactionName}
                onChange={handleInputTransactionName}
                InputProps={{ style: styles.fieldNameInputStyle }}
                autoComplete="off"
                error={Boolean(errorName)}
              />
              {Boolean(errorName) && (
                <Typography sx={styles.errorTextStyle}>{errorName}</Typography>
              )}
              <Typography sx={styles.contentSmallTextStyle}>
                Transaction name is stored on-chain. Please choose a generic
                name
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="column" spacing={2} sx={styles.boxStyle}>
          <Stack direction="row" spacing={2}>
            <Image
              src={MinimizeIcon}
              alt="minimize-icon"
              width={32}
              height={32}
            />
            <Typography sx={styles.titleContentStyle}>Action</Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography flex={1} sx={[styles.contentTextStyle, { pt: 1 }]}>
              Action Type:
            </Typography>
            <Select
              value={action.actionName}
              onChange={handleSelectActionChain}
              sx={[styles.elementBorderStyle, { flex: 7 }]}
              MenuProps={{
                PaperProps: {
                  style: {
                    backgroundColor: "#e6e6e6",
                  },
                },
              }}
            >
              {LIST_ACTIONS.map((action, index) => {
                return (
                  <MenuItem key={index} value={action.actionName}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Image
                        src={action.icon}
                        alt="minimize-icon"
                        width={32}
                        height={32}
                      />
                      <Typography sx={{ color: "#888C9E" }}>
                        {action.actionName}
                      </Typography>
                    </Stack>
                  </MenuItem>
                );
              })}
            </Select>
          </Stack>
          <Box sx={{ py: 5 }}>
            <Divider style={{ backgroundColor: "#FFFFFF3D" }} />
          </Box>
          <Stack direction="column" spacing={4}>
            <Stack direction="row" justifyContent="space-between">
              <Typography flex={1} sx={[styles.contentTextStyle, { pt: 2 }]}>
                Amount:
              </Typography>
              <Box flex={7}>
                <Stack direction="column" spacing={1}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                  >
                    <TextField
                      data-test-id="detail-input-locking"
                      placeholder="Fill amount"
                      value={amount || ""}
                      onChange={handleChangeAmount}
                      type="number"
                      sx={[styles.numberInputStyle, { flex: 3 }]}
                      InputProps={{ style: styles.fieldInputStyle }}
                      autoComplete="off"
                      error={Boolean(errorAmount)}
                    />
                    <Select
                      value={token.tokenName}
                      onChange={handleSelectTokenChain}
                      sx={[styles.elementBorderStyle, { flex: 1 }]}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            backgroundColor: "#e6e6e6",
                          },
                        },
                      }}
                    >
                      {LIST_TOKENS.map((token, index) => {
                        return (
                          <MenuItem key={index} value={token.tokenName}>
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <Image
                                src={token.icon}
                                alt="minimize-icon"
                                width={24}
                                height={24}
                              />
                              <Typography sx={{ color: "#888C9E" }}>
                                {token.tokenName}
                              </Typography>
                            </Stack>
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </Stack>
                  {Boolean(errorAmount) && (
                    <Typography sx={styles.errorTextStyle}>
                      {errorAmount}
                    </Typography>
                  )}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                  >
                    <Typography
                      onClick={handleMaxAmount}
                      sx={[styles.contentMaxTextStyle, { flex: 3 }]}
                    >
                      Max Amount
                    </Typography>
                    <Typography
                      sx={[styles.contentSmallTextStyle, { flex: 1 }]}
                    >
                      {loadingEnable && <Loading />}
                      {!loadingEnable && `Safe balance: ${balance}`}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography flex={1} sx={[styles.contentTextStyle, { pt: 1 }]}>
                Send to:
              </Typography>
              <Stack direction="column" spacing={1} flex={7}>
                <Stack direction="row" spacing={3}>
                  <TextField
                    data-test-id="step-info-input-name"
                    sx={{ flex: 1 }}
                    placeholder={"Enter address"}
                    value={addressReceiver}
                    onChange={handleInputAddressReceiver}
                    InputProps={{ style: styles.fieldNameInputStyle }}
                    autoComplete="off"
                    error={Boolean(errorAddress)}
                  />
                  {showBtnAddContact && (
                    <Button
                      variant="outlined"
                      sx={styles.btnAddContactStyle}
                      onClick={undefined}
                    >
                      <Typography sx={styles.cancelTextStyle}>
                        Add contact
                      </Typography>
                    </Button>
                  )}
                </Stack>
                {Boolean(errorAddress) && (
                  <Typography sx={styles.errorTextStyle}>
                    {errorAddress}
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        {canManage && (
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              sx={styles.btnCancelStyle}
              onClick={handleCancel}
              disabled={submit}
            >
              <Typography sx={styles.cancelTextStyle}>Cancel</Typography>
            </Button>
            <Button
              variant="contained"
              sx={styles.btnStyle}
              onClick={handleSubmit}
              disabled={submit}
            >
              {submit && <Loading />}
              {!submit && (
                <Typography sx={styles.textBtnStyle}>Submit</Typography>
              )}
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default TransactionNew;
