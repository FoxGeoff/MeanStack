const express = require("express");
const multer = require("multer");
const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");

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
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      message: req.body.message,
      imagePath: `${url}/images/${req.file.filename}`,
      creator: req.userData.userId,
    });

    /* debug: check */
    console.log("From Server- from router.post: " + JSON.stringify(post));

    /* debug: stop save to DB
    console.log("From Server- debug: " +  JSON.stringify(req.userData) );
    return res.status(200).json({});
    */

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
  /* note we don't exe function - Express does */
  checkAuth,
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

    /* Only allow creator of post */
    var query = { _id: req.params.id, creator: req.userData.userId };
    Post.updateOne(query, updatedPost).then((result) => {
      if (result.nModified > 0) {
        res.status(200).json({
          msg: "From Server- Post updated successfully!" });
      } else {
        res.status(401).json({
          msg: "From Server- Not Authorized!" });
      }
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
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPost;
  /* debug: query params for pagination say - ?pagesize=2&page=1 */
  console.log(req.query);
  if (pageSize && currentPage) {
    /* mongoose query (not effective for a lage data set) */
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((result) => {
      fetchedPost = result;
      return Post.count();
    })
    .then((count) => {
      console.log("From Server- router.get(ALL)" + fetchedPost);
      res.status(200).json({
        msg: "Posts fetched successfully!",
        posts: fetchedPost,
        maxPosts: count,
      });
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  /* Only allow creator of post */
  var query = { _id: req.params.id, creator: req.userData.userId };
  Post.deleteOne(query).then((result) => {
    if (result.nModified > 0) {
      res.status(200).json({
        msg: `From Server- Post deleted successfully! postId: ${req.params.id}`,
      });
    } else {
      res.status(401).json({
        msg: "From Server- Not Authorized!" });
    }
  });
});

module.exports = router;
