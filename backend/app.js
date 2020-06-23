// npm install express --save
// this is the express framework app
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencode({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Conten-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    msg: "Post added sucessfully";
  });
});

app.use("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "12345",
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
