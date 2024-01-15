import LayoutFrameImage from "@/assets/images/layout-frame.png";
import breakpoints from "@/constants/breakpoints";
import useWindowSize from "@/hooks/useWindowSize";
import { Box } from "@mui/material";
import Image from "next/image";
import * as styles from "./styles";

const View = () => {
  const { width } = useWindowSize();

  return (
    <>
      <Box
        sx={{
          width: 540 * (width > breakpoints.sm ? 1 : 0.6),
          height: 373 * (width > breakpoints.sm ? 1 : 0.6),
          ...styles.rightFrameImageStyle,
        }}
      >
        <Image
          src={LayoutFrameImage}
          alt="frame-image"
          width={540 * (width > breakpoints.sm ? 1 : 0.6)}
          height={373 * (width > breakpoints.sm ? 1 : 0.6)}
        />
      </Box>
      <Box sx={styles.rightEllipseStyle} />
      <Box sx={styles.leftEllipseStyle} />
    </>
  );
};

export default View;
