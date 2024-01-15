import CloseIcon from "@/assets/icons/close.svg";
import { Stack, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { PublicKey } from "@solana/web3.js";
import Image from "next/image";
import { useState } from "react";
import { useMultisigContext } from "../shared/multisigProvider";

const AddNewOwnerModal = ({
  isOpen,
  setOpenModal,
  safeAddress,
}: {
  isOpen: boolean;
  setOpenModal: (stt: boolean) => void;
  safeAddress: string;
}) => {
  const { safeClient } = useMultisigContext();
  const [value, setValue] = useState<any>(1);
  const [newOwner, setNewOwner] = useState<string>("");

  const handleClose = () => setOpenModal(false);

  const handleSubmit = async () => {
    if (safeAddress && safeClient) {
      try {
        const [, transaction] = await safeClient.addOwnerProposal(
          new PublicKey(safeAddress),
          [new PublicKey(newOwner)],
          value
        );
        await transaction.buildAndExecute();
        handleClose();
      } catch (error) {
        console.error(error);
      } finally {
        handleClose();
      }
    }
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
                Add New Owner
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
            <Box
              sx={{
                px: 2,
                py: 1.5,
                border: "1px solid #92806B",
                borderRadius: 2,
                backgroundColor: "#584E3F",
              }}
            >
              <Typography>
                Add new owner mark transactions in queue as deprecated
              </Typography>
            </Box>
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
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
              />
            </Stack>
            <Stack spacing={1}>
              <Typography>
                Any transaction requires the confirmation of
              </Typography>
              <TextField
                id="outlined-basic"
                variant="outlined"
                sx={{
                  maxWidth: 74,
                  "& .MuiOutlinedInput-input": {
                    px: 1.5,
                    py: 1,
                  },
                }}
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
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
                handleSubmit();
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

export default AddNewOwnerModal;
