import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import GenerateKeyPair from "./GenerateKeyPair";
import EncryptDecrypt from "./EncryptDecrypt";
import SavedCiphertexts from "./SavedCiphertexts";
import HelpIcon from "@mui/icons-material/Help";
import Help from "./Help";

/**
 * Tabs component for key generation, encryption, and decryption
 */
const AppTabs = () => {
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
    <Box sx={{ mx: "auto", p: 3 }}>
      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        sx={{ marginBottom: 3}}
      >
        <Tab icon={<VpnKeyIcon />} label="Generate Key Pair" />
        <Tab icon={<LockIcon />} label="Encryption and Decryption" />
        <Tab icon={<TextSnippetIcon />} label="Saved Ciphertexts" />
        <Tab icon={<HelpIcon />} label="Help" />
      </Tabs>

      {/* Key Management Tab */}
      {tabValue === 0 && (
        <GenerateKeyPair setKeyPair={setKeyPair} keyPair={keyPair} />
      )}

      {/* Encryption/Decryption Tab */}
      {tabValue === 1 && <EncryptDecrypt keyPair={keyPair} />}

      {/* Saved Ciphertexts Tab */}
      {tabValue === 2 && <SavedCiphertexts />}

      {/* Help Tab */}
      {tabValue === 3 && <Help />}
    </Box>
  );
};

export default AppTabs;
