import { appThemeStateSelector } from "@/selectors/appThemeSelector";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Box, Collapse, Divider, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { DarkStyles, LightStyles } from "./styles";

const Tooltip = ({
  title,
  description,
  descriptionCustom,
}: {
  title: string;
  description?: any;
  descriptionCustom?: any;
}) => {
  const [opened, setOpened] = useState(false);
  const theme = useRecoilValue(appThemeStateSelector);
  const styles = theme === "light" ? LightStyles : DarkStyles;

  return (
    <Stack direction="column" spacing={2}>
      <Stack
        direction="row"
        sx={styles.titleStyle}
        onClick={() => {
          setOpened(!opened);
        }}
      >
        <Typography sx={styles.listItemTextStyle}>{title}</Typography>
        {opened ? <RemoveCircleOutlineIcon /> : <AddCircleOutlineIcon />}
      </Stack>
      <Collapse in={opened}>
        {descriptionCustom && descriptionCustom}
        {description && !descriptionCustom && (
          <Box sx={styles.descriptionStyle}>
            <Typography dangerouslySetInnerHTML={{ __html: description }} />
          </Box>
        )}
      </Collapse>
      <Divider />
    </Stack>
  );
};

export default Tooltip;
