"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
describe('Post Endpoints', () => {
    let accessToken;
    let userId;
    let postId;
    beforeEach(async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/auth/register')
            .send({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        });
        accessToken = res.body.accessToken;
        userId = res.body.user._id;
    });
    describe('POST /posts', () => {
        it('should create a new post', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/posts')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                title: 'Test Post',
                content: 'This is a test post content'
            });
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('title', 'Test Post');
            expect(res.body).toHaveProperty('content', 'This is a test post content');
            expect(res.body).toHaveProperty('owner', userId);
            postId = res.body._id;
        });
        it('should return 400 if title or content is missing', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/posts')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Only Title' });
            expect(res.status).toBe(400);
        });
        it('should return 401 without token', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/posts')
                .send({ title: 'Test', content: 'Test' });
            expect(res.status).toBe(401);
        });
    });
    describe('GET /posts', () => {
        beforeEach(async () => {
            const postRes = await (0, supertest_1.default)(app_1.default)
                .post('/posts')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Test Post', content: 'Test content' });
            postId = postRes.body._id;
        });
        it('should get all posts', async () => {
            const res = await (0, supertest_1.default)(app_1.default).get('/posts');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
        });
        it('should filter posts by owner', async () => {
            const res = await (0, supertest_1.default)(app_1.default).get(`/posts?owner=${userId}`);
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
        });
    });
    describe('GET /posts/:id', () => {
        beforeEach(async () => {
            const postRes = await (0, supertest_1.default)(app_1.default)
                .post('/posts')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Test Post', content: 'Test content' });
            postId = postRes.body._id;
        });
        it('should get post by id', async () => {
            const res = await (0, supertest_1.default)(app_1.default).get(`/posts/${postId}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('title', 'Test Post');
        });
        it('should return 404 for non-existent post', async () => {
            const res = await (0, supertest_1.default)(app_1.default).get('/posts/507f1f77bcf86cd799439011');
            expect(res.status).toBe(404);
        });
    });
    describe('PUT /posts/:id', () => {
        beforeEach(async () => {
            const postRes = await (0, supertest_1.default)(app_1.default)
                .post('/posts')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Test Post', content: 'Test content' });
            postId = postRes.body._id;
        });
        it('should update post', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put(`/posts/${postId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Updated Title' });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('title', 'Updated Title');
        });
        it('should return 403 if user is not owner', async () => {
            const otherUser = await (0, supertest_1.default)(app_1.default)
                .post('/auth/register')
                .send({
                username: 'otheruser',
                email: 'other@example.com',
                password: 'password123'
            });
            const res = await (0, supertest_1.default)(app_1.default)
                .put(`/posts/${postId}`)
                .set('Authorization', `Bearer ${otherUser.body.accessToken}`)
                .send({ title: 'Hacked Title' });
            expect(res.status).toBe(403);
        });
        it('should return 404 for non-existent post', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put('/posts/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Updated' });
            expect(res.status).toBe(404);
        });
    });
    describe('DELETE /posts/:id', () => {
        beforeEach(async () => {
            const postRes = await (0, supertest_1.default)(app_1.default)
                .post('/posts')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Test Post', content: 'Test content' });
            postId = postRes.body._id;
        });
        it('should delete post', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .delete(`/posts/${postId}`)
                .set('Authorization', `Bearer ${accessToken}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'Post deleted successfully');
        });
        it('should return 403 if user is not owner', async () => {
            const otherUser = await (0, supertest_1.default)(app_1.default)
                .post('/auth/register')
                .send({
                username: 'otheruser',
                email: 'other@example.com',
                password: 'password123'
            });
            const res = await (0, supertest_1.default)(app_1.default)
                .delete(`/posts/${postId}`)
                .set('Authorization', `Bearer ${otherUser.body.accessToken}`);
            expect(res.status).toBe(403);
        });
    });
});
