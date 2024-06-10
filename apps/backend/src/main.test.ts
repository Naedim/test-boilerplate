import request from 'supertest';
import app from './main';

describe('GET /', () => {
  test('response', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty('actions');
    expect(response.body).toHaveProperty('queue');
  });
});
