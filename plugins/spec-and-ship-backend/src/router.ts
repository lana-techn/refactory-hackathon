import { HttpAuthService } from '@backstage/backend-plugin-api';
import { InputError } from '@backstage/errors';
import { z } from 'zod';
import express from 'express';
import Router from 'express-promise-router';
import { AIService } from './services/AIService';

export async function createRouter({
  httpAuth: _httpAuth,
  aiService,
}: {
  httpAuth: HttpAuthService;
  aiService: AIService;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  const generateSchema = z.object({
    prompt: z.string(),
  });

  const refineSchema = z.object({
    currentSpec: z.string(),
    refinementPrompt: z.string(),
  });

  router.post('/generate', async (req, res) => {
    const parsed = generateSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new InputError(parsed.error.toString());
    }

    const { prompt } = parsed.data;
    const result = await aiService.generate(prompt);

    res.json({ result });
  });

  router.post('/refine', async (req, res) => {
    const parsed = refineSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new InputError(parsed.error.toString());
    }

    const { currentSpec, refinementPrompt } = parsed.data;
    const result = await aiService.refine(currentSpec, refinementPrompt);

    res.json({ result });
  });

  router.get('/health', (_, res) => {
    res.json({ status: 'ok' });
  });

  return router;
}
