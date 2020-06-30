// npm install express --save
// this is the express framework app
const express = require("express");
const bodyParser = require("body-parser");
const Post = require("./models/post");
const mongoose = require("mongoose");

const app = express();
mongoose
  .connect(
    "mongodb+srv://Geoff:CeY6ZOgSDrqXvJUC@cluster0-vjt73.mongodb.net/angular-mean?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, PUT, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
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

/* findOneAndUpdate, updateOne

*/
app.put("/api/post/:id", (req, res, next) => {
  const post1 = new Post({
    _id: req.body.id,
    title: req.body.title,
    message: req.body.message,
  });
  Post.updateOne(
    { _id: new mongodb.ObjectId(req.body.id) },
    { $Set: post1 }
  ).then((result) => {
    console.log(result);
    res.status(200).json({ msg: "Updated successfully!" });
  });
});

app.get("/api/posts/:id", (req, res, next) => {
  Post.findById({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({
      msg: "Post fetched successfully!",
      posts: result,
    });
  });
});

app.get("/api/posts", (req, res, next) => {
  //mongoose
  Post.find().then((result) => {
    console.log(result);
    res.status(200).json({
      msg: "Posts fetched successfully!",
      posts: result,
    });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(req.params.id);
    res.status(200).json({ msg: "Post deleted successfully!" });
  });
});

module.exports = app;
