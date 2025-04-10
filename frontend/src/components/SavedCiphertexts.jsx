import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Tooltip,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useEffect, useState } from "react";
import { savedCiphertextAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import DecryptCiphertextDialog from "./DecryptCiphertextDialog";

const SavedCiphertexts = () => {
  const { showSnackbar } = useSnackbar();
  const { user, loading } = useAuth();

  const [savedCiphertexts, setSavedCiphertexts] = useState([]);
  const [ciphertextsLoading, setCiphertextsLoading] = useState(true);
  const [selectedCiphertext, setSelectedCiphertext] = useState({id: -1 , name: "", ciphertext: ""})
  const [openDecryptDialog, setOpenDecryptDialog] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      fetchSavedCiphertexts();
    }
  }, [loading, user]);

  // Function to fetch saved ciphertexts
  const fetchSavedCiphertexts = async () => {
    try {
      setCiphertextsLoading(true);
      const response = await savedCiphertextAPI.getAll();

      if (response.data.success) {
        setSavedCiphertexts(response.data.data || []);
      }
    } catch (err) {
      console.log(err.response.data.err);
      showSnackbar(
        `Error fetching saved ciphertexts: ${err.response.data.error}`,
        "error"
      );
    } finally {
      setCiphertextsLoading(false);
    }
  };

  // Function to delete a saved ciphertext
  const handleDelete = async (id) => {
    try {
      const response = await savedCiphertextAPI.delete(id);
      
      if (response.data.success) {
        setSavedCiphertexts(savedCiphertexts.filter(item => item.id !== id));
        showSnackbar('Ciphertext deleted successfully', 'success');
      } else {
        showSnackbar(`Error: ${response.data.error || 'Failed to delete'}`, 'error');
      }
    } catch (err) {
      showSnackbar('An error occurred while deleting the ciphertext', 'error');
    }
  };

  const handleOpenDecryptDialog = (item) => {
    setSelectedCiphertext(item)
    setOpenDecryptDialog(true)
  }

  // Make ciphertext more user friendly
  const fixText = (text) => {
    if (!text) return "";
    return text.length > 40 ? `${text.substring(0, 40)}...` : text;
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

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography variant="h6"> Authentication Required </Typography>
      </Box>
    );
  }

  if (ciphertextsLoading || loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography fontWeight={"bold"} variant="h6" gutterBottom>
        Saved Ciphertexts
      </Typography>

      <DecryptCiphertextDialog
        open={openDecryptDialog}
        onClose={() => setOpenDecryptDialog(false)}
        selectedCiphertext={selectedCiphertext}
      />

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography fontWeight={"bold"}>Name</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={"bold"}>Ciphertext (Base64)</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={"bold"}>Created</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight={"bold"}>Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {savedCiphertexts.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Typography variant="body1" fontWeight="medium">
                    {item.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2">
                      {fixText(item.ciphertext)}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        copyToClipboard(item.ciphertext, "Ciphertext")
                      }
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  {new Date(item.created_at).toLocaleString()}
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={<LockOpenIcon />}
                      onClick={() => handleOpenDecryptDialog(item)}
                    >
                      Decrypt
                    </Button>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SavedCiphertexts;
