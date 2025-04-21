import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';
import { avalancheAPI } from "../services/api";

const AvalancheEffect = () => {
    const [publicKey, setPublicKey] = useState('');
    const [plaintext, setPlaintext] = useState('');
    const [modifiedplaintext, setmodifiedPlaintext] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const response = await avalancheAPI.testEffect({ 
        publicKey: publicKey, 
        plaintext: plaintext 
      });
      setResult(response.data.data);
    } catch (error) {
      setError('Error fetching data. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Avalanche Effect Test
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Public Key (PEM)"
          multiline
          fullWidth
          rows={4}
          value={publicKey}
          onChange={(e) => setPublicKey(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Plaintext"
          multiline
          fullWidth
          rows={2}
          value={plaintext}
          onChange={(e) => setPlaintext(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Test Avalanche Effect
        </Button>
      </form>
      
      {result && (
      <Box mt={3}>
        <Typography variant="subtitle1" sx={{ wordWrap: 'break-word' }}>
            Modified plaintext: {result.modified_plaintext}
        </Typography>
        <Typography variant="subtitle1" sx={{ wordWrap: 'break-word' }}>
            Avalanche Effect: {result.avalanche_percent}% Bit Difference
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ wordWrap: 'break-word' }}>
            Original Ciphertext (Hex): {result.original_hex}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ wordWrap: 'break-word' }}>
            Modified Ciphertext (Hex): {result.modified_hex}
        </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default AvalancheEffect;