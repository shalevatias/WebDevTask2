import request from 'supertest';
import app from '../app';

describe('Comment Endpoints', () => {
  it('POST /comments - should create a new comment', async () => {
    const userRes = await request(app)
      .post('/auth/register')
      .send({ username: 'commentcreate', email: 'commentcreate@example.com', password: 'password123' });

    const postRes = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${userRes.body.accessToken}`)
      .send({ title: 'Post', content: 'Content' });

    const res = await request(app)
      .post('/comments')
      .set('Authorization', `Bearer ${userRes.body.accessToken}`)
      .send({ postId: postRes.body._id, text: 'Test comment' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('text', 'Test comment');
  });

  it('GET /comments - should get all comments', async () => {
    const res = await request(app).get('/comments');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /comments/:id - should get comment by id', async () => {
    const userRes = await request(app)
      .post('/auth/register')
      .send({ username: 'commentget', email: 'commentget@example.com', password: 'password123' });

    const postRes = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${userRes.body.accessToken}`)
      .send({ title: 'Post', content: 'Content' });

    const commentRes = await request(app)
      .post('/comments')
      .set('Authorization', `Bearer ${userRes.body.accessToken}`)
      .send({ postId: postRes.body._id, text: 'Get comment' });

    const res = await request(app).get(`/comments/${commentRes.body._id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('text', 'Get comment');
  });

  it('GET /comments/post/:postId - should get comments by post', async () => {
    const userRes = await request(app)
      .post('/auth/register')
      .send({ username: 'commentbypost', email: 'commentbypost@example.com', password: 'password123' });

    const postRes = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${userRes.body.accessToken}`)
      .send({ title: 'Post', content: 'Content' });

    await request(app)
      .post('/comments')
      .set('Authorization', `Bearer ${userRes.body.accessToken}`)
      .send({ postId: postRes.body._id, text: 'Comment' });

    const res = await request(app).get(`/comments/post/${postRes.body._id}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('PUT /comments/:id - should update comment', async () => {
    const userRes = await request(app)
      .post('/auth/register')
      .send({ username: 'commentupdate', email: 'commentupdate@example.com', password: 'password123' });

    const postRes = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${userRes.body.accessToken}`)
      .send({ title: 'Post', content: 'Content' });

    const commentRes = await request(app)
      .post('/comments')
      .set('Authorization', `Bearer ${userRes.body.accessToken}`)
      .send({ postId: postRes.body._id, text: 'Original' });

    const res = await request(app)
      .put(`/comments/${commentRes.body._id}`)
      .set('Authorization', `Bearer ${userRes.body.accessToken}`)
      .send({ text: 'Updated comment' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('text', 'Updated comment');
  });

  it('DELETE /comments/:id - should delete comment', async () => {
    const userRes = await request(app)
      .post('/auth/register')
      .send({ username: 'commentdelete', email: 'commentdelete@example.com', password: 'password123' });

    const postRes = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${userRes.body.accessToken}`)
      .send({ title: 'Post', content: 'Content' });

    const commentRes = await request(app)
      .post('/comments')
      .set('Authorization', `Bearer ${userRes.body.accessToken}`)
      .send({ postId: postRes.body._id, text: 'Delete me' });

    const res = await request(app)
      .delete(`/comments/${commentRes.body._id}`)
      .set('Authorization', `Bearer ${userRes.body.accessToken}`);

    expect(res.status).toBe(200);
  });
});
