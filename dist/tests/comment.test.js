"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
describe('Comment Endpoints', () => {
    let accessToken;
    let userId;
    let postId;
    let commentId;
    beforeEach(async () => {
        const userRes = await (0, supertest_1.default)(app_1.default)
            .post('/auth/register')
            .send({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        });
        accessToken = userRes.body.accessToken;
        userId = userRes.body.user._id;
        const postRes = await (0, supertest_1.default)(app_1.default)
            .post('/posts')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ title: 'Test Post', content: 'Test content' });
        postId = postRes.body._id;
    });
    describe('POST /comments', () => {
        it('should create a new comment', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/comments')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                postId,
                text: 'This is a test comment'
            });
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('text', 'This is a test comment');
            expect(res.body).toHaveProperty('postId', postId);
            expect(res.body).toHaveProperty('owner', userId);
            commentId = res.body._id;
        });
        it('should return 400 if postId or text is missing', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/comments')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ text: 'Only text' });
            expect(res.status).toBe(400);
        });
        it('should return 404 if post does not exist', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/comments')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                postId: '507f1f77bcf86cd799439011',
                text: 'Comment on non-existent post'
            });
            expect(res.status).toBe(404);
        });
        it('should return 401 without token', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/comments')
                .send({ postId, text: 'Test' });
            expect(res.status).toBe(401);
        });
    });
    describe('GET /comments', () => {
        beforeEach(async () => {
            const commentRes = await (0, supertest_1.default)(app_1.default)
                .post('/comments')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ postId, text: 'Test comment' });
            commentId = commentRes.body._id;
        });
        it('should get all comments', async () => {
            const res = await (0, supertest_1.default)(app_1.default).get('/comments');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
        });
    });
    describe('GET /comments/:id', () => {
        beforeEach(async () => {
            const commentRes = await (0, supertest_1.default)(app_1.default)
                .post('/comments')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ postId, text: 'Test comment' });
            commentId = commentRes.body._id;
        });
        it('should get comment by id', async () => {
            const res = await (0, supertest_1.default)(app_1.default).get(`/comments/${commentId}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('text', 'Test comment');
        });
        it('should return 404 for non-existent comment', async () => {
            const res = await (0, supertest_1.default)(app_1.default).get('/comments/507f1f77bcf86cd799439011');
            expect(res.status).toBe(404);
        });
    });
    describe('GET /comments/post/:postId', () => {
        beforeEach(async () => {
            await (0, supertest_1.default)(app_1.default)
                .post('/comments')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ postId, text: 'Comment 1' });
            await (0, supertest_1.default)(app_1.default)
                .post('/comments')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ postId, text: 'Comment 2' });
        });
        it('should get comments by post id', async () => {
            const res = await (0, supertest_1.default)(app_1.default).get(`/comments/post/${postId}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(2);
        });
    });
    describe('PUT /comments/:id', () => {
        beforeEach(async () => {
            const commentRes = await (0, supertest_1.default)(app_1.default)
                .post('/comments')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ postId, text: 'Test comment' });
            commentId = commentRes.body._id;
        });
        it('should update comment', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put(`/comments/${commentId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ text: 'Updated comment' });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('text', 'Updated comment');
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
                .put(`/comments/${commentId}`)
                .set('Authorization', `Bearer ${otherUser.body.accessToken}`)
                .send({ text: 'Hacked comment' });
            expect(res.status).toBe(403);
        });
        it('should return 404 for non-existent comment', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put('/comments/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ text: 'Updated' });
            expect(res.status).toBe(404);
        });
    });
    describe('DELETE /comments/:id', () => {
        beforeEach(async () => {
            const commentRes = await (0, supertest_1.default)(app_1.default)
                .post('/comments')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ postId, text: 'Test comment' });
            commentId = commentRes.body._id;
        });
        it('should delete comment', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .delete(`/comments/${commentId}`)
                .set('Authorization', `Bearer ${accessToken}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'Comment deleted successfully');
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
                .delete(`/comments/${commentId}`)
                .set('Authorization', `Bearer ${otherUser.body.accessToken}`);
            expect(res.status).toBe(403);
        });
    });
});
