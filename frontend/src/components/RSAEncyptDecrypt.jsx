import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileUploadIcon from '@mui/icons-material/FileUpload';

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

  const [uplaodedFile , setUploadedFile] = useState()

  const handleFileUpload = () => {
    // TO DO
  }

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

      <Box width={'100%'} display={'flex'} flexDirection={"column"} gap={2}>
        <Box>
          <FormControl component="fieldset">
            <RadioGroup
              row
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
        </Box>

        <Box item xs={12}>
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
            disabled={uplaodedFile}
          />
           <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
            <Button
              size="small"
              startIcon={<FileUploadIcon />}
              onClick={() => handleFileUpload}
              disabled={inputText}
            >
              Upload File
            </Button>
          </Box>
        </Box>

        <Box item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
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
        </Box>

        <Box item xs={12}>
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
        </Box>
      </Box>
    </Box>
  );
};

export default RSAEncryptDecrypt;
