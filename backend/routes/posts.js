const express = require("express");
const multer = require("multer");
const Post = require("../models/post");
const { createShorthandPropertyAssignment } = require("typescript");

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
    console.log("file name: " + file.originalname);

    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post(
  "",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      message: req.body.message,
      imagePath: `${url}/images/${req.file.filename}`,
    });
    console.log("From Server- from router.post: " + post);
    // generates query to DB
    post.save().then((createPost) => {
      res.status(201).json({
        msg: "Post added sucessfully",
        Post: {
          id: createPost._id,
          title: createPost.title,
          message: createPost.message,
          imagePath: createPost.imagePath,
        },
        /* modern Syntax: Post: {}...createdPost, id: createdPost._id}  */
      });
    });
  }
);

/* findOneAndUpdate, updateOne */
/* Could be PUT or PATCH */
/* used for the edit form */
router.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    /* debug check - if file is string or object */
    console.log(`Image file is (from server router.put): ${req.file}`);

    /*Default - We have a file path */
    let imagePath = req.body.imagePath;

    if (req.file) {
      /* We have a file object*/
      const url = req.protocol + "://" + req.get("host");
      imagePath = `${url}/images/${req.file.filename}`;
    }

    const updatedPost = new Post({
      _id: req.body.id,
      title: req.body.title,
      message: req.body.message,
      imagePath: imagePath,
    });

    /* Debug -   */
    console.log(
      `Image updated file is (from server router.put): ${updatedPost}`
    );

    /* Using Mongoose model: post1: Post */
    var query = { _id: req.params.id };
    Post.findOneAndUpdate(query, updatedPost).then((result) => {
      console.log("From Server- router.put" + result);
      res.status(200).json({ msg: "Post updated successfully!" });
    });
  }
);

router.get("/:id", (req, res, next) => {
  Post.findById({ _id: req.params.id }).then((result) => {
    if (result) {
      console.log("From Server- router.get(ONE)" + result);
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
    console.log("From Server- router.get(ALL)" + result);
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
