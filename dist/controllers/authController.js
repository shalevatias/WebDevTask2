"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const generateTokens = (userId) => {
    const accessToken = jsonwebtoken_1.default.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshToken = jsonwebtoken_1.default.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
    return { accessToken, refreshToken };
};
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({ error: 'Username, email, and password are required' });
            return;
        }
        const existingUser = await userModel_1.default.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            res.status(400).json({ error: 'User with this email or username already exists' });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await userModel_1.default.create({
            username,
            email,
            password: hashedPassword
        });
        const { accessToken, refreshToken } = generateTokens(user._id.toString());
        user.refreshTokens.push(refreshToken);
        await user.save();
        res.status(201).json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            },
            accessToken,
            refreshToken
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const { accessToken, refreshToken } = generateTokens(user._id.toString());
        user.refreshTokens.push(refreshToken);
        await user.save();
        res.json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            },
            accessToken,
            refreshToken
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({ error: 'Refresh token required' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const user = await userModel_1.default.findById(decoded.userId);
        if (user) {
            user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
            await user.save();
        }
        res.json({ message: 'Logged out successfully' });
    }
    catch {
        res.status(400).json({ error: 'Invalid refresh token' });
    }
};
exports.logout = logout;
const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({ error: 'Refresh token required' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const user = await userModel_1.default.findById(decoded.userId);
        if (!user || !user.refreshTokens.includes(refreshToken)) {
            res.status(401).json({ error: 'Invalid refresh token' });
            return;
        }
        user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
        const tokens = generateTokens(user._id.toString());
        user.refreshTokens.push(tokens.refreshToken);
        await user.save();
        res.json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });
    }
    catch {
        res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
};
exports.refresh = refresh;
