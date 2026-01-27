import { Request, Response } from 'express';
import Comment from '../models/commentModel';
import Post from '../models/postModel';
import { AuthRequest } from '../types';

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId, text } = req.body;
    const owner = req.userId;

    if (!postId || !text) {
      res.status(400).json({ error: 'Post ID and text are required' });
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

export const updateComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    if (String(comment.owner) !== String(req.userId)) {
      res.status(403).json({ error: 'Not authorized to update this comment' });
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

export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    if (String(comment.owner) !== String(req.userId)) {
      res.status(403).json({ error: 'Not authorized to delete this comment' });
      return;
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
