import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useState } from "react";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import { rsaAPI } from "../services/api";

const RSAKeyManagementForm = ({ setKeyPair, keyPair }) => {
  const { showSnackbar } = useSnackbar();

  // State for key generation
  const [keySize, setKeySize] = useState(keyPair.keySize);
  const [isGenerating, setIsGenerating] = useState(false);


  // Generate Private and Public Key
  const handleGenerateKeys = async () => {
    try {
      setIsGenerating(true);
      const response = await rsaAPI.generateKeyPair({keySize: keySize});
      const data = response.data.data
      const keyPairObj = {
        publicKey: data.public_key,
        privateKey: data.private_key,
        keySize: data.key_size,
      };
      setKeyPair(keyPairObj);
      showSnackbar(
        `Successfully generated ${keySize}-bit RSA key pair`,
        "success"
      );
      console.log(keyPair)
    } catch (error) {
      showSnackbar(`Error generating key pair: ${error.message}`, "error");
    } finally {
      setIsGenerating(false);
    }
  };

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

  // Download text as file
  const downloadAsFile = (text, filename) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        RSA Key Management
      </Typography>

      <Grid  container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="key-size-label">Key Size</InputLabel>
            <Select
              labelId="key-size-label"
              value={keySize}
              onChange={(e) => setKeySize(e.target.value)}
              label="Key Size"
            >
              <MenuItem value={1024}>1024 bits</MenuItem>
              <MenuItem value={2048}>2048 bits</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={
              isGenerating ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <VpnKeyIcon />
              )
            }
            onClick={handleGenerateKeys}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Key Pair"}
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Public Key
          </Typography>
          <TextField
            multiline
            fullWidth
            minRows={4}
            maxRows={6}
            value={keyPair.publicKey}
            slotProps={{input : {
                readOnly: true
            }}}
            variant="outlined"
            placeholder="Public key will appear here after generation"
          />
          <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
            <Button
              size="small"
              startIcon={<ContentCopyIcon />}
              onClick={() => copyToClipboard(keyPair.publicKey, "Public key")}
              disabled={!keyPair.publicKey}
            >
              Copy
            </Button>
            <Button
              size="small"
              startIcon={<DownloadIcon />}
              onClick={() =>
                downloadAsFile(keyPair.publicKey, "rsa_public_key.pem")
              }
              disabled={!keyPair.publicKey}
            >
              Download
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Private Key
          </Typography>
          <TextField
            multiline
            fullWidth
            minRows={4}
            maxRows={8}
            value={keyPair.privateKey}
            slotProps={{input : {
                readOnly: true
            }}}
            variant="outlined"
            placeholder="Private key will appear here after generation"
          />
          <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
            <Button
              size="small"
              startIcon={<ContentCopyIcon />}
              onClick={() => copyToClipboard(keyPair.privateKey, "Private key")}
              disabled={!keyPair.privateKey}
            >
              Copy
            </Button>
            <Button
              size="small"
              startIcon={<DownloadIcon />}
              onClick={() =>
                downloadAsFile(keyPair.privateKey, "rsa_private_key.pem")
              }
              disabled={!keyPair.privateKey}
            >
              Download
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RSAKeyManagementForm;
