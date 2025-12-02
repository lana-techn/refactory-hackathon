
import { Paper, Typography, Box, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    message: {
        marginBottom: theme.spacing(2),
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
    },
    userMessage: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
    },
    aiMessage: {
        backgroundColor: theme.palette.grey[100],
    },
}));

export type ChatMessage = {
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
};

type ChatHistoryProps = {
    messages: ChatMessage[];
};

export const ChatHistory = ({ messages }: ChatHistoryProps) => {
    const classes = useStyles();

    if (messages.length === 0) {
        return null;
    }

    return (
        <Paper style={{ padding: 16, marginTop: 16, maxHeight: 400, overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                💬 Chat History
            </Typography>
            {messages.map((message, index) => (
                <Box
                    key={index}
                    className={`${classes.message} ${
                        message.role === 'user' ? classes.userMessage : classes.aiMessage
                    }`}
                >
                    <Box display="flex" alignItems="center" mb={1}>
                        <Chip
                            label={message.role === 'user' ? 'You' : 'AI'}
                            size="small"
                            color={message.role === 'user' ? 'primary' : 'default'}
                        />
                        <Typography variant="caption" style={{ marginLeft: 8 }}>
                            {message.timestamp.toLocaleTimeString()}
                        </Typography>
                    </Box>
                    <Typography variant="body2">{message.content}</Typography>
                </Box>
            ))}
        </Paper>
    );
};
