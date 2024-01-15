import { useMultisigContext } from "@/components/shared/multisigProvider";
import { addressValid } from "@/utils/verifyCoreChange";
import { faker } from "@faker-js/faker";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { PublicKey } from "@solana/web3.js";
import { useState } from "react";
import { addSafeProps } from "./common";
import * as styles from "./styles";
import { KEY_LIST_SAFE } from "@/utils/constants";
import useLocalStorage from "@/hooks/useLocalStorage";

const AddExitsSafe = ({
  openModalAddSafe,
  handleCloseModal,
  handleAddonSafeExits,
}: addSafeProps) => {
  const [safeName, setSafeName] = useState("");
  const [safeAddress, setSafeAddress] = useState("");
  const [errorSafeName, setErrorSafeName] = useState<boolean>(false);
  const [errorSafeAddress, setErrorSafeAddress] = useState<string>("");
  const [cacheListSafe, setCacheListSafe] = useLocalStorage(
    KEY_LIST_SAFE,
    {} as any
  );

  const { safeClient } = useMultisigContext();

  const handleInputSafeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setSafeName(name);
    setErrorSafeName(name === "");
  };

  const handleInputSafeAddress = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const address = event.target.value;
    if (!address) {
      setErrorSafeAddress("Safe address must exist");
    } else if (!addressValid(address)) {
      setErrorSafeAddress("Safe address invalid");
    } else {
      setErrorSafeAddress("");
    }
    setSafeAddress(address);
  };

  const handleRandomName = () => {
    setSafeName(faker.commerce.productName().toLowerCase());
  };

  const handleAddExitsSafe = async () => {
    try {
      if (safeClient) {
        const safe = await safeClient.fetcher.findSafe(
          new PublicKey(safeAddress)
        );

        handleAddonSafeExits(safe.safeAddress.toString());
        setCacheListSafe(
          Object.assign({}, { [safeAddress]: safeName }, cacheListSafe)
        );
        setSafeName("");
        setSafeAddress("");
        handleCloseModal();
      }
    } catch (error) {
      setErrorSafeAddress("Safe address not exits");
      console.error(error);
    }
  };

  return (
    <Modal open={openModalAddSafe} onClose={handleCloseModal}>
      <Box sx={styles.modalStyle}>
        <Box sx={styles.headerModalStyle}>
          <Typography sx={styles.textTitleStyle}>
            {"Create a new safe"}
          </Typography>
          <IconButton sx={styles.textTitleStyle} onClick={handleCloseModal}>
            <CloseIcon fontSize="large" />
          </IconButton>
        </Box>
        <Box sx={styles.bodyModalStyle}>
          <Stack spacing={3}>
            <Typography sx={styles.titleTextBodyStyle}>
              {
                "First, let’s give your wallet a name. This name is only stored locally and will never be shared with Resnow or any third parties. Your safe is created on Mainet"
              }
            </Typography>
            <Divider style={{ backgroundColor: "#FFFFFF3D" }} />
            <Stack direction="column" spacing={1}>
              <Typography sx={styles.titleTextBodyStyle}>
                {"Safe name"}
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" spacing={2}>
                  <TextField
                    sx={{ flex: 1 }}
                    data-test-id="step-info-input-name"
                    placeholder={"Fill safe name"}
                    value={safeName}
                    onChange={handleInputSafeName}
                    InputProps={{ style: styles.fieldNameInputStyle }}
                  />
                  <Button
                    variant="outlined"
                    sx={styles.btnRandomStyle}
                    onClick={handleRandomName}
                  >
                    <Typography sx={styles.randomTextStyle}>Random</Typography>
                  </Button>
                </Stack>
                {errorSafeName && (
                  <Typography sx={styles.errorTextStyle}>
                    Safe name is required.
                  </Typography>
                )}
              </Stack>
            </Stack>

            <Stack direction="column" spacing={1}>
              <Typography sx={styles.titleTextBodyStyle}>
                {"Safe address"}
              </Typography>
              <TextField
                data-test-id="step-info-input-name"
                placeholder={"Fill safe name"}
                value={safeAddress}
                onChange={handleInputSafeAddress}
                InputProps={{ style: styles.fieldNameInputStyle }}
              />
              {errorSafeAddress && (
                <Typography sx={styles.errorTextStyle}>
                  {errorSafeAddress}
                </Typography>
              )}
            </Stack>
          </Stack>
        </Box>
        <Box sx={styles.footerModalStyle}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              sx={styles.btnCancelStyle}
              onClick={handleCloseModal}
            >
              <Typography sx={styles.cancelTextStyle}>Cancel</Typography>
            </Button>
            <Button
              variant="contained"
              sx={styles.btnStyle}
              onClick={handleAddExitsSafe}
              disabled={!(!!safeName && !!safeAddress)}
            >
              <Typography sx={styles.textBtnStyle}>Add</Typography>
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddExitsSafe;
