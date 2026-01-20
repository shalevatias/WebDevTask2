const router = require("express").Router();
const {
  createPost,
  fetchPosts,
  fetchPost,
  modifyPost
} = require("../controllers/postController");

router.post("/", createPost);
router.get("/", fetchPosts);

router.get("/:id", fetchPost);
router.put("/:id", modifyPost);

module.exports = router;
