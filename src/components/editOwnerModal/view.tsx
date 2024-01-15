import CloseIcon from "@/assets/icons/close.svg";
import useLocalStorage from "@/hooks/useLocalStorage";
import { KEY_LIST_OWNER_SAFE } from "@/utils/constants";
import { faker } from "@faker-js/faker";
import { Stack, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useState } from "react";

const EditOwnerModal = ({
  isOpen,
  setOpenModal,
  ownerAddressTarget,
}: {
  isOpen: boolean;
  setOpenModal: (stt: boolean) => void;
  ownerAddressTarget: string;
}) => {
  const [cacheListOwnerSafe, setCacheListOwnerSafe] = useLocalStorage(
    KEY_LIST_OWNER_SAFE,
    {} as any
  );
  const [newName, setNewName] = useState("");

  const handleClose = () => setOpenModal(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const handleRandomName = () => {
    setNewName(faker.commerce.productName().toLowerCase());
  };

  const handleSave = () => {
    setCacheListOwnerSafe((prevCacheListContactSafe: any) => ({
      ...prevCacheListContactSafe,
      [ownerAddressTarget]: newName,
    }));
    handleClose();
  };

  return (
    <Box>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: 680,
            width: "100%",
            backgroundColor: "#202231",
            border: "2px solid #000",
            boxShadow: 24,
            borderRadius: 4,
          }}
        >
          <Box
            sx={{
              px: 3,
              py: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <Typography fontSize={20} fontWeight={700}>
                Edit owner
              </Typography>
            </Box>
            <Button
              onClick={() => {
                handleClose();
              }}
            >
              <Image src={CloseIcon} alt={"close"} />
            </Button>
          </Box>
          <Stack spacing={3} sx={{ p: 3, backgroundColor: "#252835" }}>
            <Stack spacing={1}>
              <Typography>Owner name</Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-input": {
                      px: 1.5,
                      py: 1,
                    },
                  }}
                  value={newName || cacheListOwnerSafe[ownerAddressTarget]}
                  onChange={handleNameChange}
                />
                <Button
                  variant="outlined"
                  sx={{
                    ml: 1,
                  }}
                  onClick={handleRandomName}
                >
                  Random
                </Button>
              </Box>
            </Stack>
            <Stack spacing={1}>
              <Typography>Owner address</Typography>
              <TextField
                id="outlined-basic"
                variant="outlined"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-input": {
                    px: 1.5,
                    py: 1,
                  },
                }}
                disabled
                value={ownerAddressTarget}
              />
            </Stack>
          </Stack>
          <Box
            sx={{
              px: 3,
              py: 2,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                handleClose();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handleSave();
              }}
              sx={{ ml: 2 }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default EditOwnerModal;
