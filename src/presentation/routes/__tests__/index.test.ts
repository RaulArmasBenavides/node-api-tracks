import express, { Express } from 'express';
import request from 'supertest';

describe('Routes', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Mock routes for testing
    const mockRouter = express.Router();
    mockRouter.get('/test', (req, res) => {
      res.status(200).json({ message: 'OK' });
    });
    mockRouter.use((_req, res) => {
      res.status(404).json({ error: 'Not found' });
    });

    app.use('/api/v1', mockRouter);
  });

  describe('Route handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/v1/unknown');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Not found' });
    });

    it('should return 200 for known routes', async () => {
      const response = await request(app).get('/api/v1/test');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'OK' });
    });

    it('should handle requests with Content-Type application/json', async () => {
      const response = await request(app)
        .get('/api/v1/test')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
    });
  });
});
