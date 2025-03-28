import React from "react";
import {
  Button,
  Avatar,
  CircularProgress,
  Box,
  Typography,
  IconButton,
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
    // Create initials from user details if available
    const initials = user.userDetails
      ? user.userDetails
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)
      : "?";

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.dark" }}>
          {initials}
        </Avatar>

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
