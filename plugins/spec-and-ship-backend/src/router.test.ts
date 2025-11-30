import { mockServices } from '@backstage/backend-test-utils';
import express from 'express';
import request from 'supertest';
import { createRouter } from './router';
import { AIService } from './services/AIService';

describe('createRouter', () => {
  let app: express.Express;
  let aiService: jest.Mocked<AIService>;

  beforeEach(async () => {
    aiService = {
      generate: jest.fn(),
    } as unknown as jest.Mocked<AIService>;

    const router = await createRouter({
      httpAuth: mockServices.httpAuth(),
      aiService,
    });
    app = express();
    app.use(router);
  });

  it('should generate content', async () => {
    aiService.generate.mockResolvedValue('Generated content');

    const response = await request(app).post('/generate').send({
      prompt: 'Test prompt',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ result: 'Generated content' });
    expect(aiService.generate).toHaveBeenCalledWith('Test prompt');
  });

  it('should return health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
