const express = required("express");
const multer = required("multer");
const Post = require("../models/post");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    /* Path relative to server.js */
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + Date.now() + "." + ext);
  },
});

router.post("", multer(storage).single("image"), (req, res, next) => {
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
      console.log("From Server" + result);
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
