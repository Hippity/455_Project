import React from "react";
import {
  Button,
  Avatar,
  CircularProgress,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../contexts/AuthContext";

const LoginButton = () => {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return <CircularProgress size={24} color="white" />;
  }

  // Show avatar and logout button when user is authenticated
  if (user) {
    // Extract name and picture from user's claims
    let name = "User";
    let pictureUrl = null;

    const nameClaim = user.find((claim) => claim.typ === "name");
    if (nameClaim) {
      name = nameClaim.val.split(" ")[0];
    }

    const pictureClaim = user.find((claim) => claim.typ === "picture");
    if (pictureClaim) {
      pictureUrl = pictureClaim.val;
    }

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Tooltip title={`Hi ${name}!`}>
          <Avatar
            src={pictureUrl}
            alt={name}
            sx={{ width: 32, height: 32, bgcolor: "primary.dark" }}
          />
        </Tooltip>
        <IconButton size="small" sx={{ color: "white" }} onClick={logout}>
          <LogoutIcon />
        </IconButton>
      </Box>
    );
  }

  // Show simple login button when not authenticated
  return (
    <IconButton size="small" sx={{ color: "white" }} onClick={login}>
      <LoginIcon />
    </IconButton>
  );
};

export default LoginButton;
