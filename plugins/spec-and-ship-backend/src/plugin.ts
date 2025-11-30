import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';
import { AIService } from './services/AIService';

/**
 * specAndShipPlugin backend plugin
 *
 * @public
 */
export const specAndShipPlugin = createBackendPlugin({
  pluginId: 'spec-and-ship',
  register(env) {
    env.registerInit({
      deps: {
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        config: coreServices.rootConfig,
      },
      async init({ httpAuth, httpRouter, config }) {
        const apiKey = config.getOptionalString('gemini.apiKey') || process.env.GEMINI_API_KEY || '';
        const aiService = new AIService(apiKey);

        httpRouter.use(
          await createRouter({
            httpAuth,
            aiService,
          }),
        );
      },
    });
  },
});
