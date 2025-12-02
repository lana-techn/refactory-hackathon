
import { Paper, Typography, Box } from '@material-ui/core';
import { MarkdownContent } from '@backstage/core-components';

type PreviewAreaProps = {
    content: string;
};

export const PreviewArea = ({ content }: PreviewAreaProps) => {
    if (!content) return null;

    return (
        <Paper style={{ padding: 16, marginTop: 16 }}>
            <Typography variant="h6" gutterBottom>
                Generated Specification
            </Typography>
            <Box border={1} borderColor="grey.300" borderRadius={4} p={2} bgcolor="background.default">
                <MarkdownContent content={`\`\`\`yaml\n${content}\n\`\`\``} />
            </Box>
        </Paper>
    );
};
