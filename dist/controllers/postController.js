"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.getPost = exports.getPosts = exports.createPost = void 0;
const postModel_1 = __importDefault(require("../models/postModel"));
const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const owner = req.userId;
        if (!title || !content) {
            res.status(400).json({ error: 'Title and content are required' });
            return;
        }
        const post = await postModel_1.default.create({ owner, title, content });
        res.status(201).json(post);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.createPost = createPost;
const getPosts = async (req, res) => {
    try {
        const filter = {};
        if (req.query.owner) {
            filter.owner = req.query.owner;
        }
        const posts = await postModel_1.default.find(filter).populate('owner', 'username email');
        res.json(posts);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getPosts = getPosts;
const getPost = async (req, res) => {
    try {
        const post = await postModel_1.default.findById(req.params.id).populate('owner', 'username email');
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        res.json(post);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getPost = getPost;
const updatePost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = await postModel_1.default.findById(req.params.id);
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        if (String(post.owner) !== String(req.userId)) {
            res.status(403).json({ error: 'Not authorized to update this post' });
            return;
        }
        const updated = await postModel_1.default.findByIdAndUpdate(req.params.id, { title, content }, { new: true }).populate('owner', 'username email');
        res.json(updated);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updatePost = updatePost;
const deletePost = async (req, res) => {
    try {
        const post = await postModel_1.default.findById(req.params.id);
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        if (String(post.owner) !== String(req.userId)) {
            res.status(403).json({ error: 'Not authorized to delete this post' });
            return;
        }
        await postModel_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deletePost = deletePost;
