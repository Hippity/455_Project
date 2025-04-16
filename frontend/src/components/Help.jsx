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
        <AccordionDetails sx={{display: "flex", flexDirection: 'column', gap: 1}}>
          <Typography variant="h6" gutterBottom>
            1. Generate Key Pair
          </Typography>
          <Typography>
            - You can either <strong>paste an existing private or public key</strong> (in PKCS8 format) or choose to <strong>generate a new key pair</strong> with your specified settings.
          </Typography>
          <Typography>
            - Select between 1024-bit or 2048-bit key sizes. Note: In this app, 2048-bit is considered more secure than 1024-bit.
          </Typography>
          <Typography>
            - Click "Generate Key Pair" to create your new public and private keys, both formatted in PKCS8.
          </Typography>
          <Typography>
            - Once generated or pasted, copy and save your keys securely as they are essential for your data’s security.
          </Typography>

          <Typography variant="h6" gutterBottom>
            2. Encrypt/Decrypt Messages
          </Typography>
          <Typography>
            - Select either Encrypt or Decrypt mode.
          </Typography>
          <Typography>
            - For encryption: Enter your plaintext message and use the public key.
          </Typography>
          <Typography>
            - For decryption: Enter your ciphertext in base64 format and use the private key.
          </Typography>
          <Typography>
            - You can work with messages of any length and include special characters.
          </Typography>
          <Typography>
            - Additionally, you have the option to attach or extract text from various files (Docs, PDFs, and TXT files) for encryption and decryption.
          </Typography>
          <Typography>
            - The process utilizes OAEP padding with SHA-256 to securely handle data.
          </Typography>

          <Typography variant="h6" gutterBottom>
            3. Manage Saved Ciphertexts
          </Typography>
          <Typography>
            - View and manage all your saved encrypted messages in one convenient location.
          </Typography>
          <Typography>
            - Easily decrypt saved messages using your private key.
          </Typography>
          <Typography>
            - Delete messages that are no longer needed.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Help; 