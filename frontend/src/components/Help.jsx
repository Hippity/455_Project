import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LockIcon from "@mui/icons-material/Lock";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import HelpIcon from "@mui/icons-material/Help";

const Help = () => {
  return (
    <Box sx={{ mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <HelpIcon sx={{ verticalAlign: "middle", mr: 1 }} />
        RSA Cryptography App Help
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">What is this app?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            This is a web application that demonstrates RSA (Rivest-Shamir-Adleman) 
            public-key cryptography. It allows you to:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <VpnKeyIcon />
              </ListItemIcon>
              <ListItemText primary="Generate RSA key pairs" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LockIcon />
              </ListItemIcon>
              <ListItemText primary="Encrypt and decrypt messages" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <TextSnippetIcon />
              </ListItemIcon>
              <ListItemText primary="Save and manage encrypted messages" />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">How to use the app</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6" gutterBottom>
            1. Generate Key Pair
          </Typography>
          <Typography paragraph>
            - Choose between 1024-bit or 2048-bit key sizes
            - Click "Generate Key Pair" to create your public and private keys
            - Copy and save your keys securely
          </Typography>

          <Typography variant="h6" gutterBottom>
            2. Encrypt/Decrypt Messages
          </Typography>
          <Typography paragraph>
            - Select either Encrypt or Decrypt mode
            - For encryption: Enter plaintext and use the public key
            - For decryption: Enter ciphertext and use the private key
            - You can upload text files for encryption/decryption
          </Typography>

          <Typography variant="h6" gutterBottom>
            3. Manage Saved Ciphertexts
          </Typography>
          <Typography paragraph>
            - View all your saved encrypted messages
            - Decrypt saved messages using your private key
            - Delete messages you no longer need
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Security Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            - Always keep your private key secure and never share it
            - Use 2048-bit keys for stronger security
            - The app uses OAEP padding with SHA-256 for secure encryption
            - All cryptographic operations are performed in your browser
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Help; 