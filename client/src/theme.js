import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  shadows: ["none"],
  palette: {
    primary: {
      main: "#4361ee",
    },
  },
  shadows: Array(25).fill('none'),
  typography: {
    button: {
      textTransform: "none",
      fontWeight: 400,
    },
  },
});
