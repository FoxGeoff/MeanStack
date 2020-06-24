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
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    message: req.body.message,
  });
  console.log(post);
  res.status(201).json({
    msg: "Post added sucessfully",
  });
});

app.use("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "1aSz345",
      title: "First server-side post",
      message: "This is coming from the server",
    },
    {
      id: "12355",
      title: "Second server-side post",
      message: "This is also coming from the server",
    },
  ];
  // just by being the last in the chain it is returned.
  return res.status(200).json({
    msg: "Posts feched succesfully!",
    posts: posts,
  });
});

module.exports = app;
