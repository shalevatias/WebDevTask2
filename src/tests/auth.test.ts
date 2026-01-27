import request from 'supertest';
import app from '../app';

describe('Auth Endpoints', () => {
  it('POST /auth/register - should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('POST /auth/login - should login with valid credentials', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        username: 'loginuser',
        email: 'login@example.com',
        password: 'password123'
      });

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('POST /auth/logout - should logout successfully', async () => {
    const registerRes = await request(app)
      .post('/auth/register')
      .send({
        username: 'logoutuser',
        email: 'logout@example.com',
        password: 'password123'
      });

    const res = await request(app)
      .post('/auth/logout')
      .send({ refreshToken: registerRes.body.refreshToken });

    expect(res.status).toBe(200);
  });

  it('POST /auth/refresh - should refresh tokens', async () => {
    const registerRes = await request(app)
      .post('/auth/register')
      .send({
        username: 'refreshuser',
        email: 'refresh@example.com',
        password: 'password123'
      });

    const res = await request(app)
      .post('/auth/refresh')
      .send({ refreshToken: registerRes.body.refreshToken });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });
});
