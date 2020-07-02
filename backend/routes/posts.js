const express = required("express");
const Post = require("../models/post");
const router = express.Router();

router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    message: req.body.message,
  });
  console.log(post);
  // generates query to DB
  post.save().then((createPost) => {
    res.status(201).json({
      msg: "Post added sucessfully",
      postId: createPost._id,
    });
  });
});

/* findOneAndUpdate, updateOne */
/* Could be PUT or PATCH */
/* used for the edit form */
router.put("/:id", (req, res, next) => {
  const updatedPost = new Post({
    _id: req.body.id,
    title: req.body.title,
    message: req.body.message,
  });
  /* Using Mongoose model: post1: Post */
  var query = { _id: req.params.id };
  Post.findOneAndUpdate(query, updatedPost).then((result) => {
    console.log(result);
    res.status(200).json({ msg: "Post updated successfully!" });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById({ _id: req.params.id }).then((result) => {
    if (result) {
      console.log( 'From Server' + result);
      res.status(200).json({
        msg: "Post fetched successfully!",
        post: result,
      });
    } else {
      res.status(404).json({
        msg: "Post not found",
      });
    }
  });
});

router.get("", (req, res, next) => {
  //mongoose
  Post.find().then((result) => {
    console.log(result);
    res.status(200).json({
      msg: "Posts fetched successfully!",
      posts: result,
    });
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(req.params.id);
    res.status(200).json({ msg: "Post deleted successfully!" });
  });
});

module.exports = router;
