import { Check } from "@mui/icons-material";
import { Box } from "@mui/material";
import { iconStepProps } from "../common";
import * as styles from "./styles";

const IconStep = ({ activeStep, index }: iconStepProps) => {
  if (activeStep === index) {
    return <Box sx={styles.iconStepActiveStyle}>{index + 1}</Box>;
  }

  if (activeStep > index) {
    return (
      <Box sx={styles.iconStepActiveStyle}>
        <Check />
      </Box>
    );
  }

  return <Box sx={styles.iconStepNormalStyle}>{index + 1}</Box>;
};

export default IconStep;
