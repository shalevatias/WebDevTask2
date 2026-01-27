import request from 'supertest';
import app from '../app';

describe('Post Endpoints', () => {
  it('POST /posts - should create a new post', async () => {
    const userRes = await request(app)
      .post('/auth/register')
      .send({ username: 'postcreate', email: 'postcreate@example.com', password: 'password123' });

    const res = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${userRes.body.accessToken}`)
      .send({ title: 'Test Post', content: 'Test content' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('title', 'Test Post');
  });

  it('GET /posts - should get all posts', async () => {
    const res = await request(app).get('/posts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /posts/:id - should get post by id', async () => {
    const userRes = await request(app)
      .post('/auth/register')
      .send({ username: 'postget', email: 'postget@example.com', password: 'password123' });

    const postRes = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${userRes.body.accessToken}`)
      .send({ title: 'Get Post', content: 'Content' });

    const res = await request(app).get(`/posts/${postRes.body._id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('title', 'Get Post');
  });

  it('PUT /posts/:id - should update post', async () => {
    const userRes = await request(app)
      .post('/auth/register')
      .send({ username: 'postupdate', email: 'postupdate@example.com', password: 'password123' });

    const postRes = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${userRes.body.accessToken}`)
      .send({ title: 'Original', content: 'Content' });

    const res = await request(app)
      .put(`/posts/${postRes.body._id}`)
      .set('Authorization', `Bearer ${userRes.body.accessToken}`)
      .send({ title: 'Updated Title' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('title', 'Updated Title');
  });

  it('DELETE /posts/:id - should delete post', async () => {
    const userRes = await request(app)
      .post('/auth/register')
      .send({ username: 'postdelete', email: 'postdelete@example.com', password: 'password123' });

    const postRes = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${userRes.body.accessToken}`)
      .send({ title: 'Delete Me', content: 'Content' });

    const res = await request(app)
      .delete(`/posts/${postRes.body._id}`)
      .set('Authorization', `Bearer ${userRes.body.accessToken}`);

    expect(res.status).toBe(200);
  });
});
