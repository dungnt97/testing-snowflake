import TickIcon from "@/assets/icons/tick.svg";
import breakpoints from "@/constants/breakpoints";
import useWindowSize from "@/hooks/useWindowSize";
import { appThemeStateSelector } from "@/selectors/appThemeSelector";
import { Box, Button, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useRecoilValue } from "recoil";
import { DarkStyles, LightStyles } from "./styles";

const View = ({
  disabled,
  icon,
  text,
  onClick,
}: {
  disabled?: boolean;
  icon: any;
  text: string;
  onClick: any;
}) => {
  const { width } = useWindowSize();
  const theme = useRecoilValue(appThemeStateSelector);
  const styles = theme === "light" ? LightStyles : DarkStyles;

  return (
    <Button
      variant={disabled ? "contained" : "outlined"}
      sx={{
        borderRadius: 3,
        backgroundColor: disabled
          ? theme === "light"
            ? "lightPrimary"
            : "grayDark"
          : "transparent",
        boxShadow: "none",
        mb: 1,
        mr: 1,
      }}
      onClick={onClick}
    >
      <Stack
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        sx={{ ...styles.destinationButtonStyle, zIndex: 2 }}
      >
        <Image src={icon} width={20} height={20} alt="icon" />
        &nbsp;
        <Typography sx={styles.heavyTextStyle}>{text}</Typography>
      </Stack>
      {!disabled && (
        <Box sx={styles.tickBoxStyle}>
          <Image
            src={TickIcon}
            alt="tick-icon"
            width={10}
            height={10}
            style={{
              ...styles.tickImageStyle,
              position: "absolute",
              top: width > breakpoints.sm ? 5 : 3,
              left: width > breakpoints.sm ? 15 : 8,
            }}
          />
        </Box>
      )}
    </Button>
  );
};

export default View;
