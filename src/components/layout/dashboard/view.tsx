import { LayoutProps } from "@/components/layout/common";
import SnowFlakeSidebar from "@/components/shared/sideBar";
import Topbar from "@/components/shared/topBar";
import { Box } from "@mui/material";
import * as styles from "./styles";

const DashboardLayout = ({
  children,
  withSideBar,
  sideName,
  safeAddress,
}: LayoutProps) => {
  return (
    <>
      <Box
        sx={{
          borderBottom: "1px solid #383B54",
        }}
      >
        <Topbar />
      </Box>
      <Box sx={styles.layoutContainerStyle}>
        {withSideBar && (
          <SnowFlakeSidebar sideName={sideName} safeAddress={safeAddress} />
        )}
        <Box
          sx={{
            height: "100%",
            width: "100%",
          }}
        >
          <Box sx={styles.mainLayoutStyle}>
            <Box>{children}</Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default DashboardLayout;
