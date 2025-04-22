import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
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
import { rsaAPI } from "../services/api";

const GenerateKeyPair = ({ setKeyPair, keyPair }) => {
  const { showSnackbar } = useSnackbar();

  // State for key generation
  const [keySize, setKeySize] = useState(keyPair.keySize);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate Private and Public Key
  const handleGenerateKeys = async () => {
    try {
      setIsGenerating(true);
      const response = await rsaAPI.generateKeyPair({ keySize: keySize });
      const data = response.data.data;
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
    } catch (error) {
      showSnackbar(`Error generating key pair: ${error.response.data.error}`, "error");
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

  return (
    <Box>
      <Typography fontWeight={"bold"} variant="h6" gutterBottom>
        RSA Key Management
      </Typography>

      <Box display={"flex"} flexDirection={"column"} gap={2}>
        <Box>
          <FormControl>
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
        </Box>

        <Box>
          <Button
            variant="contained"
            color="primary"
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
        </Box>

        <Box display={"flex"} width={"100%"} gap={2}>
          <Box width={"50%"}>
            <Typography variant="subtitle1" gutterBottom>
              Public Key
            </Typography>
            <TextField
              multiline
              fullWidth
              minRows={4}
              maxRows={6}
              onChange={(e) =>
                setKeyPair({ ...keyPair, publicKey: e.target.value })
              }
              value={keyPair.publicKey}
              variant="outlined"
              placeholder="Paste or genreate a public key (used for encryption)"
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
              {keyPair.publicKey ? (
                <Button
                  color="secondary"
                  size="small"
                  onClick={() => setKeyPair({ ...keyPair, publicKey: "" })}
                  disabled={!keyPair.publicKey}
                >
                  Clear
                </Button>
              ) : (
                <></>
              )}
            </Box>
          </Box>

          <Box width={"50%"}>
            <Typography variant="subtitle1" gutterBottom>
              Private Key
            </Typography>
            <TextField
              multiline
              fullWidth
              minRows={4}
              maxRows={8}
              onChange={(e) =>
                setKeyPair({ ...keyPair, privateKey: e.target.value })
              }
              value={keyPair.privateKey}
              variant="outlined"
              placeholder="Paste or genreate a private key (used for decryption)"
            />
            <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
              <Button
                size="small"
                startIcon={<ContentCopyIcon />}
                onClick={() =>
                  copyToClipboard(keyPair.privateKey, "Private key")
                }
                disabled={!keyPair.privateKey}
              >
                Copy
              </Button>

              {keyPair.privateKey ? (
                <Button
                  color="secondary"
                  size="small"
                  onClick={() => setKeyPair({ ...keyPair, privateKey: "" })}
                  disabled={!keyPair.privateKey}
                >
                  Clear
                </Button>
              ) : (
                <></>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GenerateKeyPair;
