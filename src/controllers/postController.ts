import { Request, Response } from 'express';
import Post from '../models/postModel';

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, owner } = req.body;
    
    if (!title || !content || !owner) {
      res.status(400).json({ error: 'Title, content, and owner are required' });
      return;
    }

    if (!title || !content) {
      res.status(400).json({ error: 'Title and content are required' });
      return;
    }

    const post = await Post.create({ owner, title, content });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const filter: { owner?: string } = {};
    if (req.query.owner) {
      filter.owner = req.query.owner as string;
    }

    const posts = await Post.find(filter).populate('owner', 'username email');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id).populate('owner', 'username email');
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const updated = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    ).populate('owner', 'username email');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
