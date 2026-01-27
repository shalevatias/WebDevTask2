import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: 'Username, email, and password are required' });
      return;
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(400).json({ error: 'User with this email or username already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
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
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
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
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token required' });
      return;
    }

    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (user) {
      user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
      await user.save();
    }

    res.json({ message: 'Logged out successfully' });
  } catch {
    res.status(400).json({ error: 'Invalid refresh token' });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token required' });
      return;
    }

    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId);

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
  } catch {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
};
