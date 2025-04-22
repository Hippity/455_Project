import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';
import { avalancheAPI } from "../services/api";
import { useSnackbar } from '../contexts/SnackbarContext';

const AvalancheEffect = () => {

     const { showSnackbar } = useSnackbar();

    const [publicKey, setPublicKey] = useState('');
    const [plaintext, setPlaintext] = useState('');
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
            showSnackbar(`Error : ${error.response.data.error}`, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography fontWeight={"bold"} variant="h6" gutterBottom>
            Avalanche Effect Test
                  </Typography>
           
            
            <Typography variant='body1' sx={{ mb: 2 }}>
                The Avalanche Effect demonstrates how a small change in input (like flipping a single bit in your plaintext)
                creates significant changes in the encrypted output.
                Enter your public key and plaintext below, and we'll only add an 's' to the beggining of the plaintext to show how dramatically
                the ciphertext changes. A strong encryption algorithm should produce ciphertexts that differ by approximately
                50% of their bits when only one input bit is changed. You can use both a 2048 and 1024 bit public key below:
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
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={loading || !publicKey || !plaintext}
                >
                    {loading ? 'Testing...' : 'Test Avalanche Effect'}
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
        </Box>
    );
};

export default AvalancheEffect;