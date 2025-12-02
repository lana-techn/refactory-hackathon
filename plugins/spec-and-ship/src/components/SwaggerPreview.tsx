import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { Paper, Typography, Box, CircularProgress } from '@material-ui/core';
import SwaggerParser from '@apidevtools/swagger-parser';
import * as yaml from 'js-yaml';

type SwaggerPreviewProps = {
    yamlContent: string;
};

export const SwaggerPreview = ({ yamlContent }: SwaggerPreviewProps) => {
    const [spec, setSpec] = useState<any>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const parseAndValidate = async () => {
            if (!yamlContent) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError('');

                // Parse YAML to JSON
                const parsed = yaml.load(yamlContent) as any;

                // Validate OpenAPI spec
                await SwaggerParser.validate(parsed);

                setSpec(parsed);
            } catch (err: any) {
                console.error('Validation error:', err);
                setError(err.message || 'Invalid OpenAPI specification');
                // Still try to display even if validation fails
                try {
                    const parsed = yaml.load(yamlContent) as any;
                    setSpec(parsed);
                } catch {
                    setSpec(null);
                }
            } finally {
                setLoading(false);
            }
        };

        parseAndValidate();
    }, [yamlContent]);

    if (!yamlContent) {
        return null;
    }

    return (
        <Paper style={{ padding: 16, marginTop: 16 }}>
            <Typography variant="h6" gutterBottom>
                📋 API Preview (Swagger UI)
            </Typography>

            {error && (
                <Box mb={2} p={2} bgcolor="warning.light" borderRadius={4}>
                    <Typography variant="body2" color="error">
                        ⚠️ Validation Warning: {error}
                    </Typography>
                </Box>
            )}

            {loading ? (
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress />
                </Box>
            ) : spec ? (
                <Box mt={2}>
                    <SwaggerUI 
                        spec={spec} 
                        docExpansion="list"
                        defaultModelsExpandDepth={1}
                    />
                </Box>
            ) : (
                <Box p={2} bgcolor="grey.100" borderRadius={4}>
                    <Typography variant="body2">
                        Unable to parse OpenAPI specification
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};
