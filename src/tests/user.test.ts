import request from 'supertest';
import app from '../app';

describe('User Endpoints', () => {
  it('GET /users - should get all users', async () => {
    const userRes = await request(app)
      .post('/auth/register')
      .send({ username: 'getusers', email: 'getusers@example.com', password: 'password123' });

    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${userRes.body.accessToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /users/:id - should get user by id', async () => {
    const userRes = await request(app)
      .post('/auth/register')
      .send({ username: 'getuser', email: 'getuser@example.com', password: 'password123' });

    const res = await request(app)
      .get(`/users/${userRes.body.user._id}`)
      .set('Authorization', `Bearer ${userRes.body.accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('username', 'getuser');
  });

  it('PUT /users/:id - should update user', async () => {
    const userRes = await request(app)
      .post('/auth/register')
      .send({ username: 'updateuser', email: 'updateuser@example.com', password: 'password123' });

    const res = await request(app)
      .put(`/users/${userRes.body.user._id}`)
      .set('Authorization', `Bearer ${userRes.body.accessToken}`)
      .send({ username: 'updatedname' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('username', 'updatedname');
  });

  it('DELETE /users/:id - should delete user', async () => {
    const userRes = await request(app)
      .post('/auth/register')
      .send({ username: 'deleteuser', email: 'deleteuser@example.com', password: 'password123' });

    const res = await request(app)
      .delete(`/users/${userRes.body.user._id}`)
      .set('Authorization', `Bearer ${userRes.body.accessToken}`);

    expect(res.status).toBe(200);
  });
});
