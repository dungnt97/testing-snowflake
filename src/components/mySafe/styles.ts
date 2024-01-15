export const titleTextStyle = {
  color: "white",
  fontWeight: 700,
  fontSize: 24,
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

export const addSafeTextStyle = {
  ...textBtnStyle,
  color: "#C1C5E1",
};

export const boxStyle = {
  height: "150px",
  backgroundColor: "#191A24",
  borderRadius: 6,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
