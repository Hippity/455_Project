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

const SaveCiphertextDialog = ({ open, onClose, ciphertext, privateKey }) => {
  const { showSnackbar } = useSnackbar();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setName("");
    }
  }, [open]);

  // Handle save action
  const handleSave = async () => {
    // Validate input
    if (!name.trim()) {
      showSnackbar("Please enter a name for this encrypted message", "error");
      return;
    }

    if (!ciphertext) {
      showSnackbar("Please enter a ciphertext", "error");
      return;
    }

    if (!privateKey) {
      showSnackbar("Please generate a private key", "error");
      return;
    }

    try {
      setSaving(true);

      const response = await savedCiphertextAPI.create({
        name: name.trim(),
        ciphertext: ciphertext,
        privateKey: privateKey,
      });

      if (response.data.success) {
        showSnackbar("Encrypted message saved successfully", "success");
        onClose();
      } else {
        showSnackbar(
          response.data.error || "Failed to save encrypted message",
          "error"
        );
      }
    } catch (err) {
      showSnackbar(
        "An error occurred while saving your encrypted message",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Save Encrypted Message</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name for this encrypted message"
          helperText="This name will help you identify this message later"
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={saving || !name.trim()}
          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveCiphertextDialog;
