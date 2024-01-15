import CloseIcon from "@/assets/icons/close.svg";
import CopyIcon from "@/assets/icons/copy.svg";
import CopyToClipboard from "@/components/base/copyToClipboard";
import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useQRCode } from "next-qrcode";
import Image from "next/image";

const ReceiverModal = ({
  isOpen,
  setOpenModal,
  safeSignerAddress,
}: {
  isOpen: boolean;
  setOpenModal: (stt: boolean) => void;
  safeSignerAddress: string;
}) => {
  const handleClose = () => setOpenModal(false);
  const { Canvas } = useQRCode();

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
            maxWidth: 400,
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
                Receive Assets
              </Typography>
              <Box
                sx={{
                  borderRadius: 8,
                  backgroundColor: "var(--Black-400, #3A3F5D)",
                  px: 1,
                  py: 0.5,
                  ml: 1,
                }}
              >
                <Typography fontSize={14} fontWeight={600}>
                  Main-beta
                </Typography>
              </Box>
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
            <Typography>
              This is the address of your vault. Deposit funds by scanning the
              QR code or copy the address below. Make sure the selected network
              matches the network you are connected to.
            </Typography>
            <Stack
              justifyContent="center"
              flexDirection={"column"}
              alignItems={"center"}
              spacing={2}
            >
              <Canvas
                text={"C2fk898NBemfgi4iSjwp64UVk8PvQpMnGQFDBf1RPhwN"}
                options={{
                  scale: 4,
                  width: 220,
                  color: {
                    dark: "#12193D",
                    light: "#FFFFFF",
                  },
                }}
              />
              <Typography
                fontSize={14}
                sx={{
                  width: 220,
                  overflowWrap: "break-word",
                  textAlign: "center",
                }}
              >
                {safeSignerAddress}
              </Typography>
              <CopyToClipboard text={safeSignerAddress}>
                <Box sx={{ display: "flex" }}>
                  <Image src={CopyIcon} alt={"copy"} />
                  <Typography sx={{ ml: 1 }}>Copy</Typography>
                </Box>
              </CopyToClipboard>
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
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ReceiverModal;
