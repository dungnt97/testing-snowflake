import AvatarIcon from "@/assets/icons/avatar.svg";
import HashtagChatIcon from "@/assets/icons/hashtag-chat.svg";
import SaveIcon from "@/assets/icons/save.svg";
import AddNewContactModal from "@/components/addNewContactModal";
import useLocalStorage from "@/hooks/useLocalStorage";
import { KEY_LIST_CONTACT_SAFE } from "@/utils/constants";
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
import Image from "next/image";
import { useState } from "react";

const AddressBook = () => {
  const [isOpenNewContactModal, setOpenNewContactModal] =
    useState<boolean>(false);
  const [cacheListContactSafe, setCacheListContactSafe] = useLocalStorage(
    KEY_LIST_CONTACT_SAFE,
    {} as any
  );
  const [contactTarget, setContactTarget] = useState<string>("");

  const removeContactAddress = (address: string) => {
    const updatedData = Object.fromEntries(
      Object.entries(cacheListContactSafe).filter(([key]) => key !== address)
    );

    setCacheListContactSafe(updatedData);
  };

  return (
    <Box sx={{ p: 5 }}>
      <Stack spacing={3}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography fontSize={24} fontWeight={600} color={"white"}>
            Address Book
          </Typography>
          <Image
            src={SaveIcon}
            alt="save"
            width={40}
            height={40}
            onClick={() => {
              setContactTarget("");
              setOpenNewContactModal(true);
            }}
          />
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
                src={HashtagChatIcon}
                alt="hashtag-chat"
                width={24}
                height={24}
              />
              <Typography
                fontSize={20}
                fontWeight={600}
                color={"white"}
                sx={{ ml: 1, mr: 2.5 }}
              >
                Contacts
              </Typography>
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
                  {Object.entries(cacheListContactSafe).map(([key, value]) => (
                    <TableRow
                      key={key}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
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
                          {value?.toString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          fontSize={14}
                          fontWeight={400}
                          color={"var(--t-2, #C7C8D3)"}
                        >
                          {""}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          fontSize={14}
                          fontWeight={400}
                          color={"var(--t-2, #C7C8D3)"}
                        >
                          {key}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          component="a"
                          onClick={() => {
                            setContactTarget(key);
                            setOpenNewContactModal(true);
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
                        <Button
                          component="a"
                          onClick={() => {
                            removeContactAddress(key);
                          }}
                        >
                          <Typography
                            fontSize={14}
                            fontWeight={400}
                            color={"var(--t-2, #C7C8D3)"}
                          >
                            Remove
                          </Typography>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Stack>
          </Stack>
        </Box>
      </Stack>
      <AddNewContactModal
        contactAddress={contactTarget}
        isOpen={isOpenNewContactModal}
        setOpenModal={setOpenNewContactModal}
      />
    </Box>
  );
};

export default AddressBook;
