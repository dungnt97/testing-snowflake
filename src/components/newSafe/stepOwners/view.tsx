import AddIcon from "@mui/icons-material/Add";
import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { safeOwnersStepProps } from "../common";
import OwnerRow from "./ownerRow";
import * as styles from "./styles";

const StepOwners = ({
  currentOwners,
  currentNumberRequireApprove,
  handleAddMoreAccount,
  handleChangeOwnersData,
  handleRemoveOwner,
  handleChangeNumberRequireApprove,
  errorNumberRequire,
}: safeOwnersStepProps) => {
  const handleRemove = (index: number) => {
    if (index !== 0) {
      handleRemoveOwner(index);
    }
  };

  const handleChangeNumberApprove = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleChangeNumberRequireApprove(Number(event.target.value));
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
        <Stack direction="row" spacing={2}>
          <Typography sx={[styles.titleLabelTextBodyStyle, { flex: 1.75 }]}>
            {"Owner name"}
          </Typography>
          <Typography sx={[styles.titleLabelTextBodyStyle, { flex: 3 }]}>
            {"Owner address"}
          </Typography>
        </Stack>
        {currentOwners.map((owner, index) => (
          <OwnerRow
            key={index}
            index={index}
            currentOwner={owner}
            handleRemove={() => handleRemove(index)}
            setCurrentOwner={handleChangeOwnersData}
          />
        ))}
        <Button
          variant="outlined"
          sx={styles.btnCancelStyle}
          onClick={handleAddMoreAccount}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <AddIcon sx={styles.iconAddStyle} />
            <Typography sx={styles.btnTextStyle}>More Account</Typography>
          </Stack>
        </Button>
        <Stack direction="column" spacing={1}>
          <Typography sx={styles.countApproveTextStyle}>
            Number of required approvals
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              data-test-id="detail-input-locking"
              placeholder=""
              value={currentNumberRequireApprove || ""}
              onChange={handleChangeNumberApprove}
              type="number"
              sx={[{ width: "80px" }, styles.numberInputStyle]}
              InputProps={{ style: styles.fieldInputStyle }}
            />
            <Typography sx={styles.btnTextStyle}>
              Out of {currentOwners.length || 1} owners
            </Typography>
          </Stack>
          {errorNumberRequire && (
            <Typography sx={styles.errorTextStyle}>
              {`Number must be between 1 and ${currentOwners.length} inclusive`}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default StepOwners;
