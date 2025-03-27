import React from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Container,
  Box,
} from "@mui/material";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RSAForm from "./components/RSAForm";
import { SnackbarProvider } from "./contexts/SnackbarContext";

// Create a theme
const theme = createTheme({});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline  />
      <SnackbarProvider>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Header />
          <Box sx={{ flexGrow: 1 }}>
            <RSAForm />
          </Box>
          <Footer />
        </Box>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
