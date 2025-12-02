import { useState } from 'react';
import { Button, TextField, Grid, Paper, Typography, Box } from '@material-ui/core';
import { useApi, discoveryApiRef, fetchApiRef } from '@backstage/core-plugin-api';
import { ChatMessage } from './ChatHistory';

type ChatBoxProps = {
    onResponse: (response: string) => void;
    onMessageSent: (message: ChatMessage) => void;
    currentSpec?: string;
    mode: 'generate' | 'refine';
};

export const ChatBox = ({ onResponse, onMessageSent, currentSpec, mode }: ChatBoxProps) => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const discoveryApi = useApi(discoveryApiRef);
    const fetchApi = useApi(fetchApiRef);

    const handleSend = async () => {
        if (!prompt) return;
        
        // Add user message to history
        onMessageSent({
            role: 'user',
            content: prompt,
            timestamp: new Date(),
        });

        setLoading(true);
        try {
            const baseUrl = await discoveryApi.getBaseUrl('spec-and-ship');
            
            let endpoint = '/generate';
            let body: any = { prompt };

            if (mode === 'refine' && currentSpec) {
                endpoint = '/refine';
                body = {
                    currentSpec,
                    refinementPrompt: prompt,
                };
            }

            const response = await fetchApi.fetch(`${baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error('Failed to generate content');
            }

            const data = await response.json();
            
            // Add AI response to history
            onMessageSent({
                role: 'ai',
                content: mode === 'refine' ? 'Specification updated!' : 'Specification generated!',
                timestamp: new Date(),
            });

            onResponse(data.result);
            setPrompt(''); // Clear input after successful send
        } catch (error: any) {
            // eslint-disable-next-line no-console
            console.error(error);
            
            let errorMessage = 'Error: Failed to generate content.';
            
            // Check if it's an API key error
            if (error.message?.includes('403') || error.message?.includes('API Key')) {
                errorMessage = `⚠️ Gemini API Key belum dikonfigurasi!

Untuk menggunakan fitur ini, Anda perlu:

1. Dapatkan API key dari: https://makersuite.google.com/app/apikey
2. Set environment variable:
   export GEMINI_API_KEY='your-api-key-here'
3. Restart server: yarn start

Atau edit file app-config.local.yaml dan tambahkan:
gemini:
  apiKey: 'your-api-key-here'

Lihat file SETUP_GEMINI_API.md untuk detail lengkap.`;
            }
            
            onResponse(errorMessage);
            onMessageSent({
                role: 'ai',
                content: errorMessage,
                timestamp: new Date(),
            });
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleSend();
        }
    };

    return (
        <Paper style={{ padding: 16 }}>
            <Grid container spacing={2} direction="column">
                <Grid item>
                    <Typography variant="h6">
                        {mode === 'generate' 
                            ? '🤖 Describe your software specification' 
                            : '✏️ Refine your specification'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        {mode === 'generate'
                            ? 'Contoh: "Buatkan service untuk Library Management. Butuh fitur pinjam buku, kembalikan buku, dan cek denda."'
                            : 'Contoh: "Tambahkan endpoint untuk list semua buku"'}
                    </Typography>
                </Grid>
                <Grid item>
                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        maxRows={8}
                        variant="outlined"
                        placeholder={mode === 'generate' 
                            ? "Jelaskan kebutuhan bisnis Anda dalam Bahasa Indonesia..." 
                            : "Apa yang ingin Anda ubah atau tambahkan?"}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                    />
                    <Box mt={1}>
                        <Typography variant="caption" color="textSecondary">
                            Tip: Tekan Ctrl+Enter untuk kirim
                        </Typography>
                    </Box>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSend}
                        disabled={loading || !prompt}
                        size="large"
                    >
                        {loading ? '⏳ Processing...' : mode === 'generate' ? '🚀 Generate Specification' : '🔄 Update Specification'}
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};
