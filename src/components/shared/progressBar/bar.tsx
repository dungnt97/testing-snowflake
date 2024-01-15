import { Box } from "@mui/material";

export const Bar = ({
  animationDuration,
  progress,
}: {
  animationDuration: any;
  progress: any;
}) => {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(0,212,255,1) 50%, rgba(33,217,105,1) 100%)",
        height: 4,
        width: "100%",
        left: 0,
        top: 0,
        zIndex: 10000,
        position: "fixed",
        marginLeft: `${(-1 + progress) * 100}%`,
        transition: `margin-left ${animationDuration}ms liner`,
      }}
    />
  );
};
