import AddressBookActiveIcon from "@/assets/icons/address-book-active.svg";
import AddressBookInactiveIcon from "@/assets/icons/address-book-inactive.svg";
import AssetsActiveIcon from "@/assets/icons/assets-active.svg";
import AssetsInactiveIcon from "@/assets/icons/assets-inactive.svg";
import ReceiveIcon from "@/assets/icons/receive.svg";
import SettingsActive from "@/assets/icons/settings-active.svg";
import SettingsInactive from "@/assets/icons/settings-inactive.svg";
import TransactionActiveIcon from "@/assets/icons/transactions-active.svg";
import TransactionInactiveIcon from "@/assets/icons/transactions-inactive.svg";
import ReceiverModal from "@/components/receiverModal";
import Loading from "@/components/shared/loading";
import { useMultisigContext } from "@/components/shared/multisigProvider";
import useLocalStorage from "@/hooks/useLocalStorage";
import useWindowSize from "@/root/src/hooks/useWindowSize";
import { KEY_LIST_SAFE } from "@/utils/constants";
import { formatAddressDisplay } from "@/utils/formatHelpers";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { Box, Button, Divider, Typography } from "@mui/material";
import {
  useConnectWallet,
  useConnection,
  useWallet,
} from "@renec-foundation/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Menu, MenuItem, ProSidebar } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import * as styles from "./styles";

type SideBarProps = {
  sideName?: string;
  safeAddress?: string;
};

const Item = ({
  title,
  to,
  activeIcon,
  inactiveIcon,
  selected,
  setSelected,
}: any) => {
  const active = selected === title;
  return (
    <MenuItem
      active={active}
      onClick={() => setSelected(title)}
      icon={active ? activeIcon : inactiveIcon}
      style={{
        backgroundColor: active ? "#383B54" : "transparent",
        borderLeft: active ? "4px solid #21D969" : "none",
        marginTop: 24,
      }}
    >
      <Typography
        sx={{
          color: active ? "#FFFFFF" : "#C1C5E1",
        }}
      >
        {title}
      </Typography>
      <Link href={to} />
    </MenuItem>
  );
};

const Sidebar = ({ sideName, safeAddress }: SideBarProps) => {
  const router = useRouter();
  const { publicKey } = useWallet();
  const { connectWallet } = useConnectWallet();
  const { width } = useWindowSize();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState(sideName || "Assets");
  const [safeSignerAddress, setSafeSignerAddress] = useState("");
  const { connection } = useConnection();
  const { safeClient } = useMultisigContext();
  const [balance, setBalance] = useState(0);
  const [loadingEnable, setLoadingEnable] = useState(true);
  const [cacheListSafe] = useLocalStorage(KEY_LIST_SAFE, {} as any);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setIsCollapsed(width < 600);
  }, [width]);

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
      setLoadingEnable(false);
    };

    fetchSafeSigner();
  }, [connection, safeAddress, safeClient]);

  const handleClickNewTransaction = () => {
    if (publicKey) {
      router.push(`/safe/${safeAddress}/transactions/new`);
    } else {
      connectWallet();
    }
  };

  return (
    <Box sx={styles.containerBoxStyle}>
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                flexDirection={"column"}
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography sx={styles.assetsNameTextStyle}>
                  {cacheListSafe[safeAddress || ""]}
                </Typography>
                {loadingEnable && <Loading />}
                {!loadingEnable && (
                  <>
                    <Typography sx={styles.assetsAddressTextStyle}>
                      {formatAddressDisplay(safeSignerAddress, 6) ||
                        "Address not found"}
                    </Typography>
                    <Typography
                      sx={styles.balanceTextStyle}
                    >{`${balance} RENEC`}</Typography>
                  </>
                )}
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                <Image src={ReceiveIcon} alt="receive" width={32} height={32} />
                <Typography sx={styles.featureTextStyle}>Receive</Typography>
              </Box>
              <Box sx={styles.buttonNewTransactionsStyle}>
                <Button
                  variant="contained"
                  sx={{ borderRadius: 2 }}
                  onClick={handleClickNewTransaction}
                >
                  New transaction
                </Button>
              </Box>

              <Divider sx={{ width: "100%", borderColor: "#383B54" }} />
            </>
          )}

          <Box>
            <Item
              title="Assets"
              to={`/safe/${safeAddress}/assets`}
              activeIcon={
                <Image
                  src={AssetsActiveIcon}
                  alt="assets-active"
                  width={24}
                  height={24}
                />
              }
              inactiveIcon={
                <Image
                  src={AssetsInactiveIcon}
                  alt="assets-inactive"
                  width={24}
                  height={24}
                />
              }
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Transactions"
              to={`/safe/${safeAddress}/transactions`}
              activeIcon={
                <Image
                  src={TransactionActiveIcon}
                  alt="transactions-active"
                  width={24}
                  height={24}
                />
              }
              inactiveIcon={
                <Image
                  src={TransactionInactiveIcon}
                  alt="transactions-inactive"
                  width={24}
                  height={24}
                />
              }
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Address book"
              to={`/safe/${safeAddress}/address-book`}
              activeIcon={
                <Image
                  src={AddressBookActiveIcon}
                  alt="address-book-active"
                  width={24}
                  height={24}
                />
              }
              inactiveIcon={
                <Image
                  src={AddressBookInactiveIcon}
                  alt="address-book-inactive"
                  width={24}
                  height={24}
                />
              }
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Settings"
              to={`/safe/${safeAddress}/settings`}
              activeIcon={
                <Image
                  src={SettingsActive}
                  alt="settings-active"
                  width={24}
                  height={24}
                />
              }
              inactiveIcon={
                <Image
                  src={SettingsInactive}
                  alt="settings-inactive"
                  width={24}
                  height={24}
                />
              }
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
      <ReceiverModal
        isOpen={openModal}
        setOpenModal={setOpenModal}
        safeSignerAddress={safeSignerAddress}
      />
    </Box>
  );
};

export default Sidebar;
