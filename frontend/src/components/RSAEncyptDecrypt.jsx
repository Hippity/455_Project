import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { rsaAPI } from "../services/api";
import { useSnackbar } from "../contexts/SnackbarContext";

const RSAEncryptDecrypt = ({ keyPair }) => {
  const { showSnackbar } = useSnackbar();

  // State for encryption/decryption
  const [operation, setOperation] = useState("encrypt");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Copy text to clipboard
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(
      () => {
        showSnackbar(`${label} copied to clipboard`, "success");
      },
      (err) => {
        showSnackbar(`Could not copy: ${err}`, "error");
      }
    );
  };

  // Process encryption or decryption
  const processOperation = async () => {
    if (!inputText) {
      showSnackbar("Please enter text to process", "warning");
      return;
    }

    try {
      setIsProcessing(true);

      if (operation === "encrypt") {
        // Encrypt Check Public Key Exists
        if (!keyPair.publicKey) {
          showSnackbar("Please generate or load a public key first", "warning");
          setIsProcessing(false);
          return;
        }

        const response = await rsaAPI.encryptMessage({
          plaintext: inputText,
          publicKey: keyPair.publicKey,
        });
        const data = response.data.data;
        setOutputText(data.ciphertext);

      } else {
        // Encrypt Check Private Key Exists
        if (!keyPair.privateKey) {
          showSnackbar(
            "Please generate or load a private key first",
            "warning"
          );
          setIsProcessing(false);
          return;
        }

        const response = await rsaAPI.decryptMessage({
          ciphertext: inputText,
          privateKey: keyPair.privateKey,
        });
        const data = response.data.data;
        setOutputText(data.plaintext);
      }

      showSnackbar(
        `Successfully ${
          operation === "encrypt" ? "encrypted" : "decrypted"
        } the message`,
        "success"
      );
    } catch (error) {
      showSnackbar(`Error: ${error.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box width={"100%"} >
      <Typography variant="h6" gutterBottom>
        RSA Encryption/Decryption
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <RadioGroup
              column
              value={operation}
              onChange={(e) => {
                setOperation(e.target.value);
                setInputText("");
                setOutputText("");
              }}
            >
              <FormControlLabel
                value="encrypt"
                control={<Radio />}
                label="Encrypt"
              />
              <FormControlLabel
                value="decrypt"
                control={<Radio />}
                label="Decrypt"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {operation === "encrypt" ? "Plain Text" : "Cipher Text"}
          </Typography>
          <TextField
            multiline
            fullWidth
            minRows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            variant="outlined"
            placeholder={
              operation === "encrypt"
                ? "Enter text to encrypt"
                : "Enter base64 encoded cipher text"
            }
          />
        </Grid>

        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={
              isProcessing ? (
                <CircularProgress size={20} color="inherit" />
              ) : operation === "encrypt" ? (
                <LockIcon />
              ) : (
                <LockOpenIcon />
              )
            }
            onClick={processOperation}
            disabled={isProcessing || !inputText}
          >
            {isProcessing
              ? "Processing..."
              : operation === "encrypt"
              ? "Encrypt"
              : "Decrypt"}
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {operation === "encrypt" ? "Cipher Text" : "Plain Text"}
          </Typography>
          <TextField
            multiline
            fullWidth
            minRows={4}
            value={outputText}
            slotProps={{input : {
                readOnly: true
            }}}
            variant="outlined"
            placeholder={`${
              operation === "encrypt" ? "Encrypted" : "Decrypted"
            } output will appear here`}
          />
          <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
            <Button
              size="small"
              startIcon={<ContentCopyIcon />}
              onClick={() => copyToClipboard(outputText, "Output")}
              disabled={!outputText}
            >
              Copy
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RSAEncryptDecrypt;
