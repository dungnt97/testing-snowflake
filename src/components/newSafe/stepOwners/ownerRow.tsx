import ClearIcon from "@mui/icons-material/Clear";
import { IconButton, Stack, TextField, Typography } from "@mui/material";
import { ownerRowProps } from "../common";
import * as styles from "./styles";

const OwnerRow = ({
  index,
  currentOwner,
  setCurrentOwner,
  handleRemove,
}: ownerRowProps) => {
  const handleInputOwnerName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentOwner(index, { ...currentOwner, ownerName: event.target.value });
  };

  const handleInputOwnerAddress = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentOwner(index, {
      ...currentOwner,
      ownerAddress: event.target.value,
    });
  };

  return (
    <Stack direction="row" spacing={2}>
      <TextField
        sx={{ flex: index === 0 ? 0.9 : 1 }}
        data-test-id="step-info-input-name"
        placeholder={"Fill owner name"}
        value={currentOwner.ownerName}
        onChange={handleInputOwnerName}
        InputProps={{ style: styles.fieldInputStyle }}
      />
      <Stack direction="column" spacing={1} sx={{ flex: index === 0 ? 3 : 3 }}>
        <TextField
          data-test-id="step-info-input-name"
          placeholder={"Fill owner address"}
          value={currentOwner.ownerAddress}
          onChange={handleInputOwnerAddress}
          InputProps={{ style: styles.fieldInputStyle }}
          error={Boolean(!currentOwner.ownerAddress)}
        />
        {!currentOwner.ownerAddress && (
          <Typography sx={styles.errorTextStyle}>
            Safe name is required.
          </Typography>
        )}
      </Stack>
      {index !== 0 && (
        <IconButton onClick={handleRemove}>
          <ClearIcon sx={styles.iconAddStyle} />
        </IconButton>
      )}
    </Stack>
  );
};

export default OwnerRow;
