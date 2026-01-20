import { Request, Response } from 'express';
import Comment from '../models/commentModel';
import Post from '../models/postModel';

export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId, text, owner } = req.body;

    if (!postId || !text || !owner) {
      res.status(400).json({ error: 'Post ID, text, and owner are required' });
      return;
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const comment = await Comment.create({ postId, owner, text });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getComments = async (_req: Request, res: Response): Promise<void> => {
  try {
    const comments = await Comment.find()
      .populate('owner', 'username email')
      .populate('postId', 'title');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate('owner', 'username email')
      .populate('postId', 'title');
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate('owner', 'username email');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const updateComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    const updated = await Comment.findByIdAndUpdate(
      req.params.id,
      { text },
      { new: true }
    ).populate('owner', 'username email');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
