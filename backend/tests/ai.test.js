const request = require('supertest');
const app = require('../src/app');

describe('AI Routes', () => {
  test('POST /api/ai/ask without JWT returns 401', async () => {
    const res = await request(app)
      .post('/api/ai/ask')
      .send({ question: 'Test question' });

    expect(res.status).toBe(401);
  });
});
