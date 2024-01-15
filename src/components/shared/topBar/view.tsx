import BellIcon from "@/assets/icons/bell-bing.svg";
import DocumentIcon from "@/assets/icons/document.svg";
import FeatureIcon from "@/assets/icons/fire-square.svg";
import LogoShortIcon from "@/assets/icons/logo-short.svg";
import SafeIcon from "@/assets/icons/safe-circle.svg";
import ResnowLogo from "@/assets/images/logo.png";
import useWindowSize from "@/root/src/hooks/useWindowSize";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import Image from "next/image";
import * as styles from "./styles";
import { WalletMultiButton as DemonWalletConnect } from "@renec-foundation/wallet-adapter-react";
import { useRouter } from "next/router";

const Topbar = () => {
  const { width } = useWindowSize();
  const router = useRouter();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={2}
      sx={{ backgroundColor: "#202231" }}
    >
      <Box sx={styles.containerBoxStyle}>
        <Box>
          <Image
            src={width >= 600 ? ResnowLogo : LogoShortIcon}
            alt="logo"
            width={width >= 600 ? 152 : 36}
            height={36}
          />
        </Box>
        {width >= 800 ? (
          <Box>
            <IconButton>
              <Box
                sx={styles.headerLinkStyle}
                onClick={() => {
                  router.push("/");
                }}
              >
                <Image src={SafeIcon} alt="safes" width={24} height={24} />
                <Typography sx={styles.headerLinkTextStyle}>Safes</Typography>
              </Box>
            </IconButton>
            <IconButton
              sx={{
                mx: 6,
              }}
            >
              <Box sx={styles.headerLinkStyle}>
                <Image
                  src={FeatureIcon}
                  alt="features"
                  width={24}
                  height={24}
                />
                <Typography sx={styles.headerLinkTextStyle}>
                  Features
                </Typography>
              </Box>
            </IconButton>
            <IconButton>
              <Box sx={styles.headerLinkStyle}>
                <Image src={DocumentIcon} alt="docs" width={24} height={24} />
                <Typography sx={styles.headerLinkTextStyle}>Docs</Typography>
              </Box>
            </IconButton>
          </Box>
        ) : null}
        <Stack direction="row" spacing={2} alignItems="center">
          <DemonWalletConnect />
          <Image src={BellIcon} alt="logo" width={24} height={24} />
        </Stack>
      </Box>
    </Box>
  );
};

export default Topbar;
