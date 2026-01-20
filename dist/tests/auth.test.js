"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
describe('Auth Endpoints', () => {
    describe('POST /auth/register', () => {
        it('should register a new user', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/auth/register')
                .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
            expect(res.status).toBe(201);
            expect(res.body.user).toHaveProperty('username', 'testuser');
            expect(res.body.user).toHaveProperty('email', 'test@example.com');
            expect(res.body).toHaveProperty('accessToken');
            expect(res.body).toHaveProperty('refreshToken');
        });
        it('should return 400 if required fields are missing', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/auth/register')
                .send({ username: 'testuser' });
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
        it('should return 400 if user already exists', async () => {
            await (0, supertest_1.default)(app_1.default)
                .post('/auth/register')
                .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/auth/register')
                .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
            expect(res.status).toBe(400);
        });
    });
    describe('POST /auth/login', () => {
        beforeEach(async () => {
            await (0, supertest_1.default)(app_1.default)
                .post('/auth/register')
                .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
        });
        it('should login with valid credentials', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/auth/login')
                .send({
                email: 'test@example.com',
                password: 'password123'
            });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('accessToken');
            expect(res.body).toHaveProperty('refreshToken');
            expect(res.body.user).toHaveProperty('username', 'testuser');
        });
        it('should return 401 with invalid password', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/auth/login')
                .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });
            expect(res.status).toBe(401);
        });
        it('should return 401 with non-existent email', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/auth/login')
                .send({
                email: 'nonexistent@example.com',
                password: 'password123'
            });
            expect(res.status).toBe(401);
        });
    });
    describe('POST /auth/logout', () => {
        it('should logout successfully', async () => {
            const registerRes = await (0, supertest_1.default)(app_1.default)
                .post('/auth/register')
                .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/auth/logout')
                .send({ refreshToken: registerRes.body.refreshToken });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'Logged out successfully');
        });
        it('should return 400 if refresh token is missing', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/auth/logout')
                .send({});
            expect(res.status).toBe(400);
        });
    });
    describe('POST /auth/refresh', () => {
        it('should refresh tokens successfully', async () => {
            const registerRes = await (0, supertest_1.default)(app_1.default)
                .post('/auth/register')
                .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/auth/refresh')
                .send({ refreshToken: registerRes.body.refreshToken });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('accessToken');
            expect(res.body).toHaveProperty('refreshToken');
        });
        it('should return 401 with invalid refresh token', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/auth/refresh')
                .send({ refreshToken: 'invalid-token' });
            expect(res.status).toBe(401);
        });
    });
});
