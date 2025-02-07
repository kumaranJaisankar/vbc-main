import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "Capitalize"
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "Capitalize"
        }
      }
    }
  }
});

export default theme;