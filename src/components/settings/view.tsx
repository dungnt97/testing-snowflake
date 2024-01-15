import AvatarIcon from "@/assets/icons/avatar.svg";
import InfoCircleIcon from "@/assets/icons/info-circle.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import PolicyIcon from "@/assets/icons/policy.svg";
import SaveIcon from "@/assets/icons/save.svg";
import UserGroupIcon from "@/assets/icons/user-group.svg";
import AddNewOwnerModal from "@/components/addNewOwnerModal";
import ChangePolicyModal from "@/components/changePolicyModal";
import EditOwnerModal from "@/components/editOwnerModal";
import { useMultisigContext } from "@/components/shared/multisigProvider";
import useLocalStorage from "@/hooks/useLocalStorage";
import { KEY_LIST_OWNER_SAFE, KEY_LIST_SAFE } from "@/utils/constants";
import { faker } from "@faker-js/faker";
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { SafeType } from "@renec-foundation/multisig-sdk";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import Image from "next/image";
import { SetStateAction, useEffect, useState } from "react";

const Settings = ({ safeAddress }: { safeAddress: string }) => {
  const [cacheListSafe, setCacheListSafe] = useLocalStorage(
    KEY_LIST_SAFE,
    {} as any
  );
  const [cacheListOwnerSafe] = useLocalStorage(KEY_LIST_OWNER_SAFE, {} as any);
  const [isOpenNewOwnerModal, setOpenNewOwnerModal] = useState<boolean>(false);
  const [isOpenEditOwnerModal, setOpenEditOwnerModal] =
    useState<boolean>(false);
  const [isOpenChangePolicyModal, setOpenChangePolicyModal] =
    useState<boolean>(false);
  const [ownerAddressTarget, setOwnerAddressTarget] = useState<string>("");
  const { connection } = useConnection();
  const { safeClient } = useMultisigContext();
  const [safe, setSafe] = useState<SafeType>();

  const handleTextChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setCacheListSafe({
      ...cacheListSafe,
      [safeAddress]: e.target.value,
    });
  };

  const handleRandomName = () => {
    setCacheListSafe({
      ...cacheListSafe,
      [safeAddress]: faker.commerce.productName().toLowerCase(),
    });
  };

  useEffect(() => {
    const fetchSafe = async () => {
      if (safeClient) {
        try {
          const safeAddressPK = new PublicKey(safeAddress);
          const safe = await safeClient.fetcher.findSafe(safeAddressPK);
          setSafe(safe);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchSafe();
  }, [connection, safeAddress, safeClient]);

  return (
    <Box sx={{ p: 5 }}>
      <Stack spacing={3}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography fontSize={24} fontWeight={600} color={"white"}>
            Settings
          </Typography>
          <Image src={SaveIcon} alt="save" width={40} height={40} />
        </Box>

        <Stack spacing={3}>
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
                }}
              >
                <Image
                  src={InfoCircleIcon}
                  alt="save-circle"
                  width={24}
                  height={24}
                />
                <Typography
                  fontSize={20}
                  fontWeight={600}
                  color={"white"}
                  sx={{ ml: 1, mr: 2.5 }}
                >
                  Modify safe name
                </Typography>
              </Box>
              <Typography
                fontSize={14}
                fontWeight={400}
                color={"var(--t-2, #C7C8D3)"}
              >
                Safe name is only stored locally and never sharedwith Resnow or
                any third parties
              </Typography>
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
                    maxWidth: 320,
                    "& .MuiOutlinedInput-input": {
                      px: 1.5,
                      py: 1,
                    },
                  }}
                  value={cacheListSafe[safeAddress]}
                  onChange={handleTextChange}
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
          </Box>
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
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Image
                    src={UserGroupIcon}
                    alt="user-group"
                    width={24}
                    height={24}
                  />
                  <Typography
                    fontSize={20}
                    fontWeight={600}
                    color={"white"}
                    sx={{ ml: 1, mr: 2.5 }}
                  >
                    Owners
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  sx={{
                    ml: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={() => {
                      setOpenNewOwnerModal(true);
                    }}
                  >
                    <Image src={PlusIcon} alt="plus" width={20} height={20} />
                    <Typography
                      fontSize={14}
                      fontWeight={400}
                      color={"var(--t-2, #C7C8D3)"}
                      sx={{
                        ml: 1,
                      }}
                    >
                      Add new owner
                    </Typography>
                  </Box>
                </Button>
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
                          Avatar
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          fontSize={14}
                          fontWeight={600}
                          color={"white"}
                        >
                          Name
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          fontSize={14}
                          fontWeight={600}
                          color={"white"}
                        >
                          Type
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          fontSize={14}
                          fontWeight={600}
                          color={"white"}
                        >
                          Address
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          fontSize={14}
                          fontWeight={600}
                          color={"white"}
                        >
                          Actions
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {safe?.owners.map((o, index) => {
                      return (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell>
                            <Stack flexDirection={"row"} alignItems={"center"}>
                              <Image
                                src={AvatarIcon}
                                alt="avatar-icon"
                                width={16}
                                height={16}
                              />
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Typography
                              fontSize={14}
                              fontWeight={400}
                              color={"var(--t-2, #C7C8D3)"}
                            >
                              {cacheListOwnerSafe[o.toString()]}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              fontSize={14}
                              fontWeight={400}
                              color={"var(--t-2, #C7C8D3)"}
                            >
                              Owner
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              fontSize={14}
                              fontWeight={400}
                              color={"var(--t-2, #C7C8D3)"}
                            >
                              {o.toString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Button
                              component="a"
                              onClick={() => {
                                setOwnerAddressTarget(o.toString());
                                setOpenEditOwnerModal(true);
                              }}
                            >
                              <Typography
                                fontSize={14}
                                fontWeight={400}
                                color={"var(--t-2, #C7C8D3)"}
                              >
                                Edit
                              </Typography>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Stack>
            </Stack>
          </Box>
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
                }}
              >
                <Image
                  src={PolicyIcon}
                  alt="policy-icon"
                  width={24}
                  height={24}
                />
                <Typography
                  fontSize={20}
                  fontWeight={600}
                  color={"white"}
                  sx={{ ml: 1, mr: 2.5 }}
                >
                  Policy
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  fontSize={14}
                  fontWeight={400}
                  color={"var(--t-2, #C7C8D3)"}
                >
                  Any transaction qrequires the confirmation of{" "}
                  {safe?.approvalsRequired} out of {safe?.owners.length} owners.
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    ml: 1,
                  }}
                  onClick={() => {
                    setOpenChangePolicyModal(true);
                  }}
                >
                  Change
                </Button>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Stack>
      <AddNewOwnerModal
        safeAddress={safeAddress}
        isOpen={isOpenNewOwnerModal}
        setOpenModal={setOpenNewOwnerModal}
      />
      <EditOwnerModal
        isOpen={isOpenEditOwnerModal}
        setOpenModal={setOpenEditOwnerModal}
        ownerAddressTarget={ownerAddressTarget}
      />
      <ChangePolicyModal
        safeAddress={safeAddress}
        isOpen={isOpenChangePolicyModal}
        setOpenModal={setOpenChangePolicyModal}
      />
    </Box>
  );
};

export default Settings;
