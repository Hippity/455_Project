import React from "react";
import { AppBar, Toolbar, Typography} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import LoginButton from "./LoginButton";

const Header = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <SecurityIcon sx={{ marginRight: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Public Key Cryptography - RSA
        </Typography>

        <LoginButton />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
