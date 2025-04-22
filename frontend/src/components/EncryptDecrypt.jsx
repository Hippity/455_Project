import React, { useRef, useState } from "react";
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
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import FileUploadIcon from "@mui/icons-material/FileUpload";

import { extractTextAPI, rsaAPI } from "../services/api";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useAuth } from "../contexts/AuthContext";
import SaveCiphertextDialog from "./SaveCiphertextDialog";

const EncryptDecrypt = ({ keyPair }) => {
  const { showSnackbar } = useSnackbar();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  // State for encryption/decryption
  const [operation, setOperation] = useState("encrypt");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);


  const [uploadedFile, setUploadedFile] = useState(null);
  const [isExtractingText, setIsExtractingText] = useState(false);

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showSnackbar("File is too large. Maximum size is 10MB.", "error");
        return;
      }

      // Create form data
      const formData = new FormData();
      formData.append("file", file);

      // Extract text using backend
      setIsExtractingText(true);
      const response = await extractTextAPI.extractText(formData)

      if (response.data.success) {
        setInputText(response.data.data.text);
        setUploadedFile(file);
        showSnackbar(`Text extracted from ${file.name}`, "success");
      } else {
        // Handle UTF-8 error specifically
        if (response.data.error.includes('non-UTF-8')) {
          showSnackbar('Error: File contains non-UTF-8 characters. Please use a UTF-8 encoded file.', 'error');
        } else {
          showSnackbar(`Error: ${response.data.error}`, "error");
        }
      }
    } catch (error) {
      showSnackbar(`Error: ${error.response.data.error}`, "error");
    } finally {
      setIsExtractingText(false);
      // Reset file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClearUploadedFile = () => {
    setInputText("")
    setUploadedFile(null)
  }

  const handleOpenSaveDialog = () => {
    if (!user) {
      showSnackbar("Please log in to save encrypted messages", "warning");
      return;
    }

    if (!outputText || operation !== "encrypt") {
      showSnackbar("Please encrypt a message first", "warning");
      return;
    }

    if (!keyPair.privateKey) {
      showSnackbar(
        "A private key is required to save the encrypted message",
        "warning"
      );
      return;
    }

    setSaveDialogOpen(true);
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
          showSnackbar("Please generate a private key first", "warning");
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
      console.log(error.response)
      showSnackbar(`Error: ${error.response.data.error}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box width={"100%"}>
      <Typography fontWeight={"bold"} variant="h6" gutterBottom>
        RSA Encryption/Decryption
      </Typography>

      <SaveCiphertextDialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        ciphertext={outputText}
        privateKey={keyPair.privateKey}
      />

      <Box width={"100%"} display={"flex"} flexDirection={"column"} gap={2}>
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
          />
          <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
            <Button
              size="small"
              startIcon={<FileUploadIcon />}
              onClick={() => fileInputRef.current.click()}
              disabled={isExtractingText}
            >
              Upload File
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".txt,.pdf,.docx,.doc"
              onChange={handleFileUpload}
            />

            {uploadedFile && (
              <Button
                size="small"
                color="secondary"
                onClick={handleClearUploadedFile}
              >
                Clear
              </Button>
            )}
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
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
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
            {operation === "decrypt" ? (
              <></>
            ) : (
              <Button
                size="small"
                startIcon={<BookmarkBorderIcon />}
                onClick={() => handleOpenSaveDialog()}
                disabled={!user || !outputText}
              >
                Save
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EncryptDecrypt;
