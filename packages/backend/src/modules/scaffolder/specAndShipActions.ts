import { createBackendModule } from '@backstage/backend-plugin-api';
import { scaffolderActionsExtensionPoint, createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { promises as fs } from 'fs';
import * as path from 'path';

const createWriteFileAction = () => {
    return createTemplateAction({
        id: 'spec-and-ship:write-file',
        description: 'Writes a file to the workspace',
        schema: {
            input: (z) => z.object({
                path: z.string().describe('Relative path to the file'),
                content: z.string().describe('Content of the file'),
            }),
        },
        async handler(ctx) {
            const { path: filePath, content } = ctx.input;
            const targetPath = path.resolve(ctx.workspacePath, filePath);

            // Security check to ensure we don't write outside the workspace
            if (!targetPath.startsWith(ctx.workspacePath)) {
                throw new Error('File path must be within the workspace');
            }

            // Ensure directory exists
            await fs.mkdir(path.dirname(targetPath), { recursive: true });
            await fs.writeFile(targetPath, content, 'utf-8');
            ctx.logger.info(`File created at ${targetPath}`);
        },
    });
};

export const specAndShipActionsModule = createBackendModule({
    pluginId: 'scaffolder',
    moduleId: 'spec-and-ship-actions',
    register(env) {
        env.registerInit({
            deps: {
                scaffolder: scaffolderActionsExtensionPoint,
            },
            async init({ scaffolder }) {
                const writeFileAction = createWriteFileAction();
                scaffolder.addActions(writeFileAction);
            },
        });
    },
});

export default specAndShipActionsModule;
