import DollarMinimalisticIcon from "@/assets/icons/dollar-minimalistic.svg";
import RefreshIcon from "@/assets/icons/refresh.svg";
import RenecIcon from "@/assets/icons/renec.svg";
import ReceiverModal from "@/components/receiverModal";
import { useMultisigContext } from "@/components/shared/multisigProvider";
import { IS_MAINNET, TOKEN_PROGRAM_ACCOUNT_ID } from "@/utils/constants";
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  ENV,
  TokenInfo,
  TokenListProvider,
} from "@renec-foundation/rpl-token-registry";
import { useConnection } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  ParsedAccountData,
  PublicKey,
} from "@solana/web3.js";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Assets = ({ safeAddress }: any) => {
  const router = useRouter();
  const [tokenMap, setTokenMap] = useState<Map<string, TokenInfo>>(new Map());
  const [openModal, setOpenModal] = useState(false);
  const [safeSignerAddress, setSafeSignerAddress] = useState("");
  const { safeClient } = useMultisigContext();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(0);
  const [renecRate, setRenecRate] = useState(0);

  useEffect(() => {
    const fetchSafeSigner = async () => {
      if (safeClient && safeAddress) {
        const [safeSigner] = await safeClient.findSafeSignerAddress(
          new PublicKey(safeAddress)
        );

        if (safeSigner) {
          const value = await connection.getBalance(safeSigner);
          setBalance(value / LAMPORTS_PER_SOL);
        }

        setSafeSignerAddress(safeSigner.toString());
      }
    };

    fetchSafeSigner();
  }, [connection, safeAddress, safeClient]);

  useEffect(() => {
    new TokenListProvider().resolve().then((tokens) => {
      const tokenList = tokens
        .filterByChainId(IS_MAINNET ? ENV.MainnetBeta : ENV.Testnet)
        .getList();

      setTokenMap(
        tokenList.reduce((map, item) => {
          map.set(item.address, item);
          return map;
        }, new Map())
      );
    });
  }, []);

  useEffect(() => {
    getTokensBalance(safeSignerAddress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenMap]);

  const getTokensBalance = async (accountAddress: any) => {
    const filters = [
      {
        dataSize: 165,
      },
      {
        memcmp: {
          offset: 32,
          bytes: accountAddress,
        },
      },
    ];

    const programId = new PublicKey(TOKEN_PROGRAM_ACCOUNT_ID);

    const accounts = await connection.getParsedProgramAccounts(programId, {
      filters,
    });

    const formatedAccounts = accounts.reduce(
      (init: { [x: string]: any }, account: { account: { data: any } }) => {
        const parsedAccountInfo = account.account.data as ParsedAccountData;
        const address = parsedAccountInfo?.parsed?.info?.mint;
        init[address] =
          parsedAccountInfo?.parsed?.info?.tokenAmount?.uiAmount || 0;
        return init;
      },
      {}
    );

    return {
      formatedAccounts,
    };
  };

  useEffect(() => {
    const estRenecRateFetcher = async () => {
      try {
        const res = await fetch("/api/quotes");
        const fee = await res.json();
        const rate = fee["RENEC" || 0];
        setRenecRate(rate);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    estRenecRateFetcher();
  }, []);

  return (
    <Box sx={{ p: 5 }}>
      <Stack spacing={3}>
        <Typography fontSize={24} fontWeight={600} color={"white"}>
          Assets
        </Typography>

        <Box
          sx={{
            px: 4,
            py: 3,
            borderRadius: 4,
            border: "1px solid #202231",
            backgroundColor: "#191B29",
            overflow: "auto",
          }}
        >
          <Stack spacing={2}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Image
                  src={DollarMinimalisticIcon}
                  alt="dollar-minimalistic"
                  width={24}
                  height={24}
                />
                <Typography
                  fontSize={20}
                  fontWeight={600}
                  color={"white"}
                  sx={{ ml: 1, mr: 2.5 }}
                >
                  Coin
                </Typography>
                <Image src={RefreshIcon} alt="refresh" width={16} height={16} />
              </Box>
              <Box sx={{ display: "flex" }}>
                <Button
                  variant="outlined"
                  sx={{
                    ml: 1,
                  }}
                  onClick={() => {
                    setOpenModal(true);
                  }}
                >
                  <Typography
                    fontSize={14}
                    fontWeight={400}
                    color={"var(--t-2, #C7C8D3)"}
                  >
                    Receive
                  </Typography>
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    ml: 1,
                  }}
                  onClick={() => {
                    router.push(`/safe/${safeAddress}/transactions/new`);
                  }}
                >
                  <Typography
                    fontSize={14}
                    fontWeight={400}
                    color={"var(--t-2, #C7C8D3)"}
                  >
                    Send
                  </Typography>
                </Button>
              </Box>
            </Box>
            <Stack
              sx={{
                px: 1.5,
                py: 2,
              }}
              flexDirection={"row"}
              justifyContent={"space-between"}
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography
                        fontSize={14}
                        fontWeight={600}
                        color={"white"}
                      >
                        Token
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        fontSize={14}
                        fontWeight={600}
                        color={"white"}
                      >
                        Balance
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        fontSize={14}
                        fontWeight={600}
                        color={"white"}
                      >
                        USD Value
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        fontSize={14}
                        fontWeight={600}
                        color={"white"}
                      >
                        Marketcap
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      <Stack
                        flexDirection={"row"}
                        alignItems={"center"}
                        sx={{ flexGrow: 1 }}
                      >
                        <Image
                          src={RenecIcon}
                          alt="renec-icon"
                          width={16}
                          height={16}
                        />
                        <Typography
                          fontSize={14}
                          fontWeight={400}
                          color={"var(--t-2, #C7C8D3)"}
                          sx={{ ml: 2 }}
                        >
                          Renec
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography
                        fontSize={14}
                        fontWeight={400}
                        color={"var(--t-2, #C7C8D3)"}
                      >
                        {balance}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        fontSize={14}
                        fontWeight={400}
                        color={"var(--t-2, #C7C8D3)"}
                      >
                        ${(balance * renecRate).toFixed(8)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        fontSize={14}
                        fontWeight={400}
                        color={"var(--t-2, #C7C8D3)"}
                      >
                        $12.28 B
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Stack>
          </Stack>
        </Box>
      </Stack>
      <ReceiverModal
        isOpen={openModal}
        setOpenModal={setOpenModal}
        safeSignerAddress={safeSignerAddress}
      />
    </Box>
  );
};

export default Assets;
