import { createBackendModule } from '@backstage/backend-plugin-api';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import fs from 'fs-extra';
import path from 'path';

const createWriteFileAction = () => {
    return createTemplateAction<{ path: string; content: string }>({
        id: 'spec-and-ship:write-file',
        description: 'Writes a file to the workspace',
        schema: {
            input: {
                type: 'object',
                required: ['path', 'content'],
                properties: {
                    path: {
                        title: 'Path',
                        description: 'Relative path to the file',
                        type: 'string',
                    },
                    content: {
                        title: 'Content',
                        description: 'Content of the file',
                        type: 'string',
                    },
                },
            },
        },
        async handler(ctx) {
            const { path: filePath, content } = ctx.input;
            const targetPath = path.resolve(ctx.workspacePath, filePath);

            // Security check to ensure we don't write outside the workspace
            if (!targetPath.startsWith(ctx.workspacePath)) {
                throw new Error('File path must be within the workspace');
            }

            await fs.outputFile(targetPath, content);
            ctx.logger.info(`File created at ${targetPath}`);
        },
    });
};

export default createBackendModule({
    pluginId: 'scaffolder',
    moduleId: 'spec-and-ship-actions',
    register(env) {
        env.registerInit({
            deps: {
                scaffolder: scaffolderActionsExtensionPoint,
            },
            async init({ scaffolder }) {
                scaffolder.addActions(createWriteFileAction());
            },
        });
    },
});
