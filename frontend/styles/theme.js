// styles/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#007bff",
    },
    secondary: {
      main: "#28a745",
    },
  },
  typography: {
    // np. domyślna rodzina czcionek
    fontFamily: "Roboto, Arial, sans-serif",
  },
  // Możesz dodać kolejne opcje: breakpoints, shape, itd.
});

export default theme;
