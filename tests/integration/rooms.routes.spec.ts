import request from 'supertest';
import app from '../../src/server'; // exporte o app sem listen()

describe('GET /api/rooms', () => {
  it('deve responder 200 e um array', async () => {
    const res = await request(app).get('/api/rooms');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});