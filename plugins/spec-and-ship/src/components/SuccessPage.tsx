import React from 'react';
import { Button, Grid, Typography, Paper, Box } from '@material-ui/core';
import { jsPDF } from 'jspdf';

type SuccessPageProps = {
    content: string;
    onReset: () => void;
};

export const SuccessPage = ({ content, onReset }: SuccessPageProps) => {
    const handleDownloadPdf = () => {
        const doc = new jsPDF();
        const lines = doc.splitTextToSize(content, 180);
        doc.text(lines, 10, 10);
        doc.save('specification.pdf');
    };

    const handleAddToCalendar = () => {
        const title = encodeURIComponent('Review Software Specification');
        const details = encodeURIComponent('Please review the generated software specification.');
        const now = new Date();
        const start = now.toISOString().replace(/-|:|\.\d\d\d/g, '');
        const end = new Date(now.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, '');
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${start}/${end}`;
        window.open(url, '_blank');
    };

    return (
        <Paper style={{ padding: 16 }}>
            <Box textAlign="center" mb={4}>
                <Typography variant="h4" gutterBottom>
                    🚀 Ready to Ship!
                </Typography>
                <Typography variant="body1">
                    Your specification has been generated and is ready for review.
                </Typography>
            </Box>

            <Grid container spacing={2} justify="center">
                <Grid item>
                    <Button variant="contained" color="primary" onClick={handleDownloadPdf}>
                        Download PDF
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="secondary" onClick={handleAddToCalendar}>
                        Add to Google Calendar
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="outlined" onClick={onReset}>
                        Start Over
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};
