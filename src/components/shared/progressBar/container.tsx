import { Box } from "@mui/material";

export const Container = ({
  animationDuration,
  children,
  isFinished,
}: {
  animationDuration: any;
  children: any;
  isFinished: any;
}) => {
  return (
    <Box
      sx={{
        opacity: isFinished ? 0 : 1,
        transition: `margin-left ${animationDuration}ms liner`,
      }}
    >
      {children}
    </Box>
  );
};
