import { faker } from "@faker-js/faker";
import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { safeDetailStepProps } from "../common";
import * as styles from "./styles";

const StepDetail = ({
  safeName,
  errorSafeName,
  handleChangeSafeName,
}: safeDetailStepProps) => {
  const handleInputSafeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChangeSafeName(event.target.value);
  };

  const handleRandomName = () => {
    handleChangeSafeName(faker.commerce.productName().toLowerCase());
  };

  return (
    <Stack spacing={3}>
      <Typography sx={styles.titleTextBodyStyle}>
        {
          "First, let’s give your wallet a name. This name is only stored locally andwill never be sharedwith Resnow or any third parties. Your safe is created on Mainet"
        }
      </Typography>
      <Divider style={{ backgroundColor: "#FFFFFF3D" }} />
      <Stack direction="column" spacing={2}>
        <Typography sx={styles.titleTextBodyStyle}>
          {"New safe name"}
        </Typography>
        <Stack spacing={1}>
          <Stack direction="row" spacing={2}>
            <TextField
              sx={{ flex: 1 }}
              data-test-id="step-info-input-name"
              placeholder={"Fill safe name"}
              value={safeName}
              onChange={handleInputSafeName}
              InputProps={{ style: styles.fieldNameInputStyle }}
            />
            <Button
              variant="outlined"
              sx={styles.btnRandomStyle}
              onClick={handleRandomName}
            >
              <Typography sx={styles.randomTextStyle}>Random</Typography>
            </Button>
          </Stack>
          {errorSafeName && (
            <Typography sx={styles.errorTextStyle}>
              Safe name is required.
            </Typography>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default StepDetail;
