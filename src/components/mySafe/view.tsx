import NewSafe from "@/components/newSafe";
import { useMultisigContext } from "@/components/shared/multisigProvider";
import useLocalStorage from "@/hooks/useLocalStorage";
import { KEY_LIST_SAFE_ADDON, KEY_LIST_SAFE_REMOVED } from "@/utils/constants";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { SafeType } from "@renec-foundation/multisig-sdk";
import { useConnectWallet } from "@renec-foundation/wallet-adapter-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import AddExitsSafe from "../addExitsSafe";
import Loading from "../shared/loading";
import ListSafe from "./listSafe";
import * as styles from "./styles";

const MySafe = () => {
  const { publicKey } = useWallet();
  const { connectWallet } = useConnectWallet();
  const { safeClient } = useMultisigContext();
  const [loadingEnable, setLoadingEnable] = useState(true);
  const [showHiddenSafe, setShowHiddenSafe] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [openModalNewSafe, setOpenModalNewSafe] = useState(false);
  const [openModalAddExistsSafe, setOpenModalAddExistsSafe] = useState(false);
  const [safes, setSafes] = useState<SafeType[]>([]);
  const [cacheListSafeRemoved, setCacheListSafeRemoved] = useLocalStorage(
    KEY_LIST_SAFE_REMOVED,
    [] as string[]
  );
  const [listSafeAddon, setListSafeAddon] = useLocalStorage(
    KEY_LIST_SAFE_ADDON,
    [] as string[]
  );

  const handleOpenModalNewSafe = () => {
    if (publicKey) {
      setOpenModalNewSafe(true);
    } else {
      connectWallet();
    }
  };

  const handleCloseModalNewSafe = () => {
    setOpenModalNewSafe(false);
  };

  const handleIncrementRefreshCount = () => {
    setRefreshCount(refreshCount + 1);
  };

  const handleOpenModalAddExitsSafe = () => {
    if (publicKey) {
      setOpenModalAddExistsSafe(true);
    } else {
      connectWallet();
    }
  };

  const handleCloseModalAddExitsSafe = () => {
    setOpenModalAddExistsSafe(false);
  };

  const handleRemoveSafe = (safeAddress: string) => {
    const result = confirm(
      `Do you want to hide safe ${safeAddress} on this browser?`
    );

    if (result) {
      setShowHiddenSafe(true);
      setCacheListSafeRemoved([...cacheListSafeRemoved, safeAddress]);
    }
  };

  const handleRemoveAddonSafe = (safeAddress: string) => {
    const result = confirm(
      `Do you want to hide safe ${safeAddress} on this browser?`
    );

    if (result) {
      setLoadingEnable(true);
      setListSafeAddon(
        listSafeAddon.filter((address) => address !== safeAddress)
      );
    }
  };

  const handleClearRemoveSafe = () => {
    const result = confirm(
      `Do you want to show all safes hidden on this browser?`
    );

    if (result) {
      setRefreshCount(refreshCount + 1);
      setLoadingEnable(true);
      setCacheListSafeRemoved([]);
      setShowHiddenSafe(false);
    }
  };

  const handleAddonSafeExits = (safeAddress: string) => {
    setListSafeAddon([...listSafeAddon, safeAddress]);
  };

  useEffect(() => {
    const fetchSafes = async () => {
      if (publicKey && safeClient) {
        const allSafes = await safeClient.fetchOwnedSafes(publicKey);
        const newSafes = allSafes.filter(
          (safe) => !cacheListSafeRemoved.includes(safe.safeAddress.toString())
        );
        setSafes(newSafes);
        setShowHiddenSafe(safes.length > newSafes.length);
        setLoadingEnable(false);
      }
    };

    if (publicKey && safeClient) {
      fetchSafes();
    } else {
      setSafes([]);
      setLoadingEnable(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, refreshCount]);

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 5, md: 10 } }}>
      <Stack direction="column" spacing={4}>
        <Stack direction="row" justifyContent="space-between">
          <Typography sx={styles.titleTextStyle}>Your safes</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            {showHiddenSafe && (
              <Tooltip title="Show hidden safes">
                <IconButton
                  sx={{ color: "white" }}
                  onClick={handleClearRemoveSafe}
                >
                  <VisibilityIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            )}
            <Button
              variant="outlined"
              sx={styles.btnCancelStyle}
              onClick={handleOpenModalAddExitsSafe}
            >
              <Typography sx={styles.addSafeTextStyle}>
                Add existing safe
              </Typography>
            </Button>
            <Button
              variant="contained"
              sx={styles.btnStyle}
              onClick={handleOpenModalNewSafe}
            >
              <Typography sx={styles.textBtnStyle}>Create new safe</Typography>
            </Button>
          </Stack>
        </Stack>
        {loadingEnable && (
          <Box sx={styles.boxStyle}>
            <Loading />
          </Box>
        )}
        {!loadingEnable && (
          <ListSafe
            safes={safes}
            listSafeAddon={listSafeAddon}
            publicKey={publicKey}
            handleRemoveSafe={handleRemoveSafe}
            handleRemoveAddonSafe={handleRemoveAddonSafe}
          />
        )}
      </Stack>
      <AddExitsSafe
        openModalAddSafe={openModalAddExistsSafe}
        handleCloseModal={handleCloseModalAddExitsSafe}
        handleAddonSafeExits={handleAddonSafeExits}
      />
      <NewSafe
        openModalNewSafe={openModalNewSafe}
        handleCloseModal={handleCloseModalNewSafe}
        handleIncrementRefreshCount={handleIncrementRefreshCount}
      />
    </Container>
  );
};

export default MySafe;
