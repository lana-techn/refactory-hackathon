import { Button, Grid, Typography, Paper, Box, Card, CardContent, Divider, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { jsPDF } from 'jspdf';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import GetAppIcon from '@material-ui/icons/GetApp';
import EventIcon from '@material-ui/icons/Event';
import GitHubIcon from '@material-ui/icons/GitHub';
import DescriptionIcon from '@material-ui/icons/Description';
import BuildIcon from '@material-ui/icons/Build';

const useStyles = makeStyles((theme) => ({
    successHeader: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: theme.spacing(4),
        borderRadius: theme.shape.borderRadius,
        marginBottom: theme.spacing(3),
    },
    actionCard: {
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
        },
    },
    iconLarge: {
        fontSize: 48,
        marginBottom: theme.spacing(2),
    },
}));

type SuccessPageProps = {
    content: string;
    onReset: () => void;
    serviceName?: string;
    repoUrl?: string;
    cicdUrl?: string;
    docsUrl?: string;
};

export const SuccessPage = ({ 
    content, 
    onReset, 
    serviceName = 'Your Service',
    repoUrl,
    cicdUrl,
    docsUrl 
}: SuccessPageProps) => {
    const classes = useStyles();

    const handleDownloadPdf = () => {
        // eslint-disable-next-line new-cap
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(20);
        doc.text('Architecture Contract', 20, 20);
        
        // Add service name
        doc.setFontSize(14);
        doc.text(`Service: ${serviceName}`, 20, 35);
        
        // Add date
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 45);
        
        // Add divider
        doc.line(20, 50, 190, 50);
        
        // Add content
        doc.setFontSize(9);
        const lines = doc.splitTextToSize(content, 170);
        doc.text(lines, 20, 60);
        
        // Add footer
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(
                `Page ${i} of ${pageCount}`,
                doc.internal.pageSize.getWidth() / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }
        
        doc.save(`${serviceName.toLowerCase().replace(/\s+/g, '-')}-architecture-contract.pdf`);
    };

    const handleScheduleKickoff = () => {
        const title = encodeURIComponent(`Kickoff Meeting: ${serviceName}`);
        const details = encodeURIComponent(
            `Review and discuss the architecture specification for ${serviceName}.\n\n` +
            `Agenda:\n` +
            `1. Review OpenAPI specification\n` +
            `2. Discuss implementation approach\n` +
            `3. Assign tasks and timeline\n` +
            `4. Q&A session`
        );
        
        // Schedule for tomorrow at 10 AM
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);
        
        const start = tomorrow.toISOString().replace(/-|:|\.\d\d\d/g, '');
        const end = new Date(tomorrow.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, '');
        
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${start}/${end}`;
        window.open(url, '_blank');
    };

    const handleOpenRepo = () => {
        if (repoUrl) {
            window.open(repoUrl, '_blank');
        } else {
            // Placeholder - in real implementation, this would be the actual repo URL from scaffolder
            window.open('https://github.com', '_blank');
        }
    };

    const handleOpenCICD = () => {
        if (cicdUrl) {
            window.open(cicdUrl, '_blank');
        } else {
            window.open('https://github.com/actions', '_blank');
        }
    };

    const handleOpenDocs = () => {
        if (docsUrl) {
            window.open(docsUrl, '_blank');
        } else {
            // In real implementation, this would link to TechDocs
            window.open('/docs', '_blank');
        }
    };

    return (
        <Box>
            {/* Success Header */}
            <Paper className={classes.successHeader} elevation={0}>
                <Box textAlign="center">
                    <CheckCircleIcon style={{ fontSize: 80, marginBottom: 16 }} />
                    <Typography variant="h3" gutterBottom style={{ fontWeight: 'bold' }}>
                        🎉 Service Ready for Development!
                    </Typography>
                    <Typography variant="h5" style={{ opacity: 0.9 }}>
                        {serviceName} is now ready to ship
                    </Typography>
                    <Box mt={2}>
                        <Typography variant="body1">
                            Your OpenAPI specification has been generated and validated.
                            Everything is set up for Day-1 development.
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Action Cards */}
            <Grid container spacing={3}>
                {/* Download PDF */}
                <Grid item xs={12} md={4}>
                    <Card className={classes.actionCard}>
                        <CardContent>
                            <Box textAlign="center">
                                <GetAppIcon className={classes.iconLarge} color="primary" />
                                <Typography variant="h6" gutterBottom>
                                    Architecture Contract
                                </Typography>
                                <Typography variant="body2" color="textSecondary" paragraph>
                                    Download formal specification document for stakeholders and compliance
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleDownloadPdf}
                                    startIcon={<DescriptionIcon />}
                                >
                                    Download PDF
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Schedule Kickoff */}
                <Grid item xs={12} md={4}>
                    <Card className={classes.actionCard}>
                        <CardContent>
                            <Box textAlign="center">
                                <EventIcon className={classes.iconLarge} color="secondary" />
                                <Typography variant="h6" gutterBottom>
                                    Kickoff Meeting
                                </Typography>
                                <Typography variant="body2" color="textSecondary" paragraph>
                                    Schedule a meeting with your team to review and discuss the specification
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    fullWidth
                                    onClick={handleScheduleKickoff}
                                    startIcon={<EventIcon />}
                                >
                                    Add to Calendar
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Repository Access */}
                <Grid item xs={12} md={4}>
                    <Card className={classes.actionCard}>
                        <CardContent>
                            <Box textAlign="center">
                                <GitHubIcon className={classes.iconLarge} style={{ color: '#333' }} />
                                <Typography variant="h6" gutterBottom>
                                    Repository
                                </Typography>
                                <Typography variant="body2" color="textSecondary" paragraph>
                                    Access your generated repository with OpenAPI spec and scaffolded code
                                </Typography>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={handleOpenRepo}
                                    startIcon={<GitHubIcon />}
                                >
                                    Open Repository
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Quick Links */}
            <Box mt={4}>
                <Paper style={{ padding: 24 }}>
                    <Typography variant="h6" gutterBottom>
                        🔗 Quick Access Links
                    </Typography>
                    <Divider style={{ margin: '16px 0' }} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Link
                                component="button"
                                variant="body1"
                                onClick={handleOpenCICD}
                                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                            >
                                <BuildIcon /> CI/CD Pipeline
                            </Link>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Link
                                component="button"
                                variant="body1"
                                onClick={handleOpenDocs}
                                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                            >
                                <DescriptionIcon /> TechDocs
                            </Link>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Link
                                component="button"
                                variant="body1"
                                onClick={onReset}
                                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                            >
                                🔄 Create Another Service
                            </Link>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            {/* Next Steps */}
            <Box mt={4}>
                <Paper style={{ padding: 24, backgroundColor: '#f5f5f5' }}>
                    <Typography variant="h6" gutterBottom>
                        📋 Next Steps
                    </Typography>
                    <Box component="ol" pl={2}>
                        <Typography component="li" variant="body1" paragraph>
                            Review the OpenAPI specification with your team
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            Clone the repository and set up your development environment
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            Implement the API endpoints according to the specification
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            Write tests and documentation
                        </Typography>
                        <Typography component="li" variant="body1">
                            Deploy to staging and production environments
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};
