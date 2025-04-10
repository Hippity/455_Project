import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { savedCiphertextAPI } from "../services/api";
import { useSnackbar } from "../contexts/SnackbarContext";
import LockOpenIcon from "@mui/icons-material/LockOpen";

const DecryptCiphertextDialog = ({ open, onClose, selectedCiphertext }) => {
  const { showSnackbar } = useSnackbar();

  const [plaintext, setPlaintext] = useState("");
  const [decrypting, setDecrypting] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setPlaintext("");
    }
  }, [open]);

  // Handle Decrypt action
  const handleDecrypt = async () => {
    try {
      setDecrypting(true);

      const response = await savedCiphertextAPI.decrypt(selectedCiphertext.id);

      if (response.data.success) {
        showSnackbar("Decrypted message successfully", "success");
        setPlaintext(response.data.data.plaintext);
      } else {
        showSnackbar(
          response.data.error || "Failed to decrypt message",
          "error"
        );
      }
    } catch (err) {
      showSnackbar("An error occurred while decrypting your message", "error");
    } finally {
      setDecrypting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={"bold"}>
        Decrypt Message: {selectedCiphertext.name}{" "}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Ciphertext"
          fullWidth
          variant="outlined"
          multiline
          value={selectedCiphertext.ciphertext}
          disabled
          sx={{ mt: 1 }}
        />

        <TextField
          autoFocus
          margin="dense"
          label="Plaintext"
          fullWidth
          variant="outlined"
          value={plaintext}
          multiline
          disabled
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={decrypting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDecrypt}
          disabled={decrypting || plaintext.trim()}
          startIcon={
            decrypting ? <CircularProgress size={20} /> : <LockOpenIcon />
          }
        >
          {decrypting ? "Decrypting..." : "Decrypt"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DecryptCiphertextDialog;
