import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import RSAKeyManagementForm from "./RSAKeyManagementForm";
import RSAEncryptDecrypt from "./RSAEncyptDecrypt";

/**
 * RSA Form component for key generation, encryption, and decryption
 */
const RSAForm = () => {
  // State for tabs
  const [tabValue, setTabValue] = useState(0);

  // State for key pair
  const [keyPair, setKeyPair] = useState({
    publicKey: "",
    privateKey: "",
    keySize: 2048,
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", p: 3 }}>
      {/* Tabs */}
      <Tabs
        width={"100%"}
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        sx={{ marginBottom: 3 }}
      >
        <Tab icon={<VpnKeyIcon />} label="Key Management" />
        <Tab icon={<LockIcon />} label="Encryption/Decryption" />
      </Tabs>

      {/* Key Management Tab */}
      {tabValue === 0 && (
        <RSAKeyManagementForm setKeyPair={setKeyPair} keyPair={keyPair} />
      )}

      {/* Encryption/Decryption Tab */}
      {tabValue === 1 && <RSAEncryptDecrypt keyPair={keyPair} />}
    </Box>
  );
};

export default RSAForm;
