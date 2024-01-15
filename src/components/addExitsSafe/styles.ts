export const modalStyle = {
  position: "absolute" as const,
  top: "30%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", md: 600, lg: 800 },
  borderRadius: 7,
  backgroundColor: "#FFFFFF",
};

export const headerModalStyle = {
  p: 4,
  height: 80,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  backgroundColor: "#202231",
};

export const footerModalStyle = {
  p: 4,
  height: 80,
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  borderBottomLeftRadius: 24,
  borderBottomRightRadius: 24,
  backgroundColor: "#202231",
};

export const bodyModalStyle = {
  p: 4,
  overflow: "auto",
  maxHeight: 600,
  backgroundColor: "#252835",
};

export const textTitleStyle = {
  fontSize: 20,
  fontWeight: 700,
  color: "#fff",
};

export const btnStyle = {
  borderRadius: 2,
  height: 40,
  px: 4,
  py: 2,
  "&:disabled": {
    backgroundColor: "#B0B2BE",
  },
};

export const btnCancelStyle = {
  ...btnStyle,
  borderColor: "#C1C5E1",
};

export const textBtnStyle = {
  fontWeight: 700,
  fontSize: 16,
};

export const cancelTextStyle = {
  ...textBtnStyle,
  color: "#C1C5E1",
};

export const titleTextBodyStyle = {
  fontSize: 16,
  fontWeight: 400,
  color: "#8C8FA3",
};

export const fieldNameInputStyle = {
  color: "#FFFFFF",
  borderRadius: 10,
  border: "1px solid #B0B2BE",
};

export const btnRandomStyle = {
  borderRadius: 4,
  border: "1px solid #B0B2BE",
};

export const randomTextStyle = {
  fontWeight: 700,
  fontSize: 16,
  color: "#C1C5E1",
};

export const errorTextStyle = {
  pl: 1,
  fontWeight: 300,
  fontSize: 13,
  color: "red",
};
