import Loading from "@/components/shared/loading";
import { useMultisigContext } from "@/components/shared/multisigProvider";
import { getEndpointExplorerUrl } from "@/utils/constants";
import { formatAddressDisplay } from "@/utils/formatHelpers";
import DeleteIcon from "@mui/icons-material/Delete";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { Box, Link, Stack, Typography } from "@mui/material";
import { SafeType } from "@renec-foundation/multisig-sdk";
import { useConnection } from "@renec-foundation/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as styles from "./styles";

type itemSafeProps = {
  nickName: string;
  publicKey: PublicKey | null;
  safeAddress: string;
  handleRemoveSafe: (safeAddress: string) => void;
};

const generateDate = (createdAt: number) => {
  return new Date(createdAt * 1000).toLocaleString();
};

const ItemSafeAddon = ({
  nickName,
  safeAddress,
  publicKey,
  handleRemoveSafe,
}: itemSafeProps) => {
  const router = useRouter();
  const { connection } = useConnection();
  const { safeClient } = useMultisigContext();
  const [safeSignerAddress, setSafeSignerAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [safe, setSafe] = useState<SafeType>();
  const [loadingEnable, setLoadingEnable] = useState(true);

  const handleClickSafe = () => {
    router.push(`/safe/${safeAddress}`);
  };

  useEffect(() => {
    const fetchSafe = async () => {
      if (safeClient) {
        try {
          const safeAddressPK = new PublicKey(safeAddress);
          const safe = await safeClient.fetcher.findSafe(safeAddressPK);
          setSafe(safe);

          const [safeSigner, bump] = await safeClient.findSafeSignerAddress(
            safeAddressPK
          );

          if (safeSigner) {
            const value = await connection.getBalance(safeSigner);
            setBalance(value / LAMPORTS_PER_SOL);
          }

          setSafeSignerAddress(safeSigner.toString());
        } catch (error) {
          console.error(error);
          setLoadingEnable(true);
        } finally {
          setLoadingEnable(false);
        }
      }
    };

    fetchSafe();
  }, [connection, safeAddress, safeClient]);

  return (
    <Stack direction="row" spacing={1}>
      <Box flex={1} sx={styles.boxStyle} onClick={handleClickSafe}>
        {(loadingEnable || !safe) && (
          <Box sx={styles.centerStyle}>
            <Loading />
          </Box>
        )}
        {!loadingEnable && safe && (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <VerifiedUserIcon sx={[styles.iconShieldStyle, { flex: 0.5 }]} />
            <Stack direction="column" spacing={2} flex={1.75}>
              <Typography sx={styles.labelTextStyle}>{nickName}</Typography>
              <Link
                href={getEndpointExplorerUrl(`address/${safeSignerAddress}`)}
                component={NextLink}
                target="_blank"
                onClick={(event) => event.stopPropagation()}
              >
                <Box>
                  <Typography sx={styles.valueTextStyle}>
                    {formatAddressDisplay(safeSignerAddress, 7)}
                  </Typography>
                </Box>
              </Link>
            </Stack>
            <Stack direction="column" spacing={2} flex={0.75}>
              <Typography sx={styles.labelTextStyle}>Role</Typography>
              <Typography sx={styles.valueTextStyle}>
                {publicKey &&
                safe.owners.find((o) => o.toString() === publicKey.toString())
                  ? "Manage"
                  : "View-only"}
              </Typography>
            </Stack>
            <Stack direction="column" spacing={2} flex={1}>
              <Typography sx={styles.labelTextStyle}>Safe Balance</Typography>
              <Typography
                sx={styles.valueTextStyle}
              >{`${balance} RENEC`}</Typography>
            </Stack>
            <Stack direction="column" spacing={2} flex={1}>
              <Typography sx={styles.labelTextStyle}>Created at</Typography>
              <Typography sx={styles.valueTextStyle}>
                {generateDate(safe.createdAt.toNumber())}
              </Typography>
            </Stack>
            <Stack direction="column" spacing={2} flex={0.5}>
              <Typography sx={[styles.labelTextStyle, styles.centerStyle]}>
                Owners
              </Typography>
              <Typography sx={[styles.valueTextStyle, styles.centerStyle]}>
                {safe.owners.length}
              </Typography>
            </Stack>
            <Stack direction="column" spacing={2} flex={0.5}>
              <Typography sx={[styles.labelTextStyle, styles.centerStyle]}>
                Required
              </Typography>
              <Typography sx={[styles.valueTextStyle, styles.centerStyle]}>
                {safe.approvalsRequired}
              </Typography>
            </Stack>
          </Stack>
        )}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <DeleteIcon
          sx={styles.iconRemoveStyle}
          onClick={() => {
            handleRemoveSafe(safeAddress);
          }}
        />
      </Box>
    </Stack>
  );
};

export default ItemSafeAddon;
