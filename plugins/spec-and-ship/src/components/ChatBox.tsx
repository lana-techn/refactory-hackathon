import React, { useState } from 'react';
import { Button, TextField, Grid, Paper, Typography } from '@material-ui/core';
import { useApi, discoveryApiRef, fetchApiRef } from '@backstage/core-plugin-api';

type ChatBoxProps = {
    onResponse: (response: string) => void;
};

export const ChatBox = ({ onResponse }: ChatBoxProps) => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const discoveryApi = useApi(discoveryApiRef);
    const fetchApi = useApi(fetchApiRef);

    const handleSend = async () => {
        if (!prompt) return;
        setLoading(true);
        try {
            const baseUrl = await discoveryApi.getBaseUrl('spec-and-ship');
            const response = await fetchApi.fetch(`${baseUrl}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate content');
            }

            const data = await response.json();
            onResponse(data.result);
        } catch (error) {
            console.error(error);
            onResponse('Error: Failed to generate content.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper style={{ padding: 16 }}>
            <Grid container spacing={2} direction="column">
                <Grid item>
                    <Typography variant="h6">Describe your software specification</Typography>
                </Grid>
                <Grid item>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        placeholder="E.g., Create a REST API for a Todo list application..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={loading}
                    />
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSend}
                        disabled={loading || !prompt}
                    >
                        {loading ? 'Generating...' : 'Generate Specification'}
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};
