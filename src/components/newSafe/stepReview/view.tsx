import AccountCircle from "@mui/icons-material/AccountCircle";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { safeReviewStepProps } from "../common";
import * as styles from "./styles";

const StepReview = ({ data }: safeReviewStepProps) => {
  return (
    <Stack spacing={3}>
      <Divider style={{ backgroundColor: "#FFFFFF3D" }} />
      <Stack direction="column" spacing={1}>
        <Stack direction="row" spacing={2}>
          <Typography sx={[styles.titleLabelTextBodyStyle, { flex: 1 }]}>
            {"Safe name"}
          </Typography>
          <Typography sx={[styles.titleLabelTextBodyStyle, { flex: 1 }]}>
            {"Approval required"}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Box sx={[styles.flexCenterStyle, styles.boxShowInfoStyle]}>
            <Typography sx={styles.titleLabelTextBodyStyle}>
              {data.name}
            </Typography>
          </Box>
          <Box sx={[styles.flexCenterStyle, styles.boxShowInfoStyle]}>
            <Typography sx={styles.titleLabelTextBodyStyle}>
              {data.numberRequireApprove}
            </Typography>
          </Box>
        </Stack>
      </Stack>
      <Stack direction="column" spacing={1}>
        <Typography sx={styles.titleLabelTextBodyStyle}>
          {"Safe owners"}
        </Typography>
        <Stack direction="column" spacing={1}>
          {data.owners.map((owner, index) => (
            <Box key={index} sx={[styles.boxShowInfoStyle, { py: 1.5 }]}>
              <Stack direction="row" alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                  <AccountCircle />
                  <Typography sx={styles.titleLabelTextBodyStyle}>
                    {owner.ownerName}
                  </Typography>
                </Stack>
                <Typography sx={styles.titleLabelTextBodyStyle} flex={2}>
                  {owner.ownerAddress}
                </Typography>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default StepReview;
