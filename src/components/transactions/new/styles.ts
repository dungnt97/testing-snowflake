export const main = {
  p: 8,
  color: "#fff",
  maxWidth: 1600,
};

export const titleLabelStyle = {
  fontSize: 24,
  fontWeight: 600,
  color: "#fff",
};

export const titleContentStyle = {
  fontSize: 20,
  fontWeight: 600,
  color: "#fff",
};

export const contentTextStyle = {
  fontSize: 16,
  fontWeight: 700,
  color: "#D0D1D8",
};

export const contentSmallTextStyle = {
  fontSize: 13,
  fontWeight: 400,
  color: "#8C8FA3",
};

export const fieldNameInputStyle = {
  color: "#FFFFFF",
  borderRadius: 10,
  border: "1px solid #B0B2BE",
};

export const boxStyle = {
  backgroundColor: "#191B29",
  borderRadius: 6,
  p: 5,
};

export const elementBorderStyle = {
  color: "#FFF",
  borderRadius: 4,
  border: "1px solid #B0B2BE",
  ".MuiOutlinedInput-notchedOutline": {
    borderColor: "#B0B2BE",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#B0B2BE",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#B0B2BE",
  },
  ".MuiSvgIcon-root ": {
    fill: "#FFF !important",
  },
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

export const numberInputStyle = {
  borderRadius: 3,
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
  "& input[type=number]::-webkit-outer-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
  "& input[type=number]::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
  pr: 0,
};

export const fieldInputStyle = {
  color: "#FFFFFF",
  borderRadius: 10,
  border: "1px solid #B0B2BE",
};

export const errorTextStyle = {
  pl: 1,
  fontWeight: 300,
  fontSize: 13,
  color: "red",
};

export const contentMaxTextStyle = {
  ...contentSmallTextStyle,
  cursor: "pointer",
};

export const btnMaxAmountStyle = {
  width: "100px",
};

export const btnAddContactStyle = {
  borderRadius: 2,
  px: 4,
  py: 2,
  "&:disabled": {
    backgroundColor: "#B0B2BE",
  },
  borderColor: "#C1C5E1",
};
