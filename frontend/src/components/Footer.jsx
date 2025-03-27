import React from "react";
import { Box, Typography} from "@mui/material";

const Footer = () => {
  return (
    <Box
      width={"100%"}
      sx={{
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Typography variant="body1" align="center">
        RSA Cryptography!!
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        1024-bit
        {" and "}
        2048-bit
        {" key sizes."}
      </Typography>
    </Box>
  );
};

export default Footer;
