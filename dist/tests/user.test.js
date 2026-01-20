"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
describe('User Endpoints', () => {
    let accessToken;
    let userId;
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
    describe('GET /users', () => {
        it('should get all users', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get('/users')
                .set('Authorization', `Bearer ${accessToken}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
            expect(res.body[0]).toHaveProperty('username', 'testuser');
            expect(res.body[0]).not.toHaveProperty('password');
        });
        it('should return 401 without token', async () => {
            const res = await (0, supertest_1.default)(app_1.default).get('/users');
            expect(res.status).toBe(401);
        });
    });
    describe('GET /users/:id', () => {
        it('should get user by id', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get(`/users/${userId}`)
                .set('Authorization', `Bearer ${accessToken}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('username', 'testuser');
            expect(res.body).not.toHaveProperty('password');
        });
        it('should return 404 for non-existent user', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get('/users/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${accessToken}`);
            expect(res.status).toBe(404);
        });
    });
    describe('PUT /users/:id', () => {
        it('should update user', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put(`/users/${userId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ username: 'updateduser' });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('username', 'updateduser');
        });
        it('should return 404 for non-existent user', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put('/users/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ username: 'updateduser' });
            expect(res.status).toBe(404);
        });
    });
    describe('DELETE /users/:id', () => {
        it('should delete user', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .delete(`/users/${userId}`)
                .set('Authorization', `Bearer ${accessToken}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'User deleted successfully');
        });
        it('should return 404 for non-existent user', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .delete('/users/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${accessToken}`);
            expect(res.status).toBe(404);
        });
    });
});
