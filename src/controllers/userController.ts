import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/userModel';

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password -refreshTokens');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshTokens');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    const updateData: { username?: string; email?: string; password?: string } = {};

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password -refreshTokens');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
