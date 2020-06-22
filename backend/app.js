// npm install express --save
// this is the express framework app
const express = require('express');

const app = express();

app.use("/api/posts", (req, res, next) => {
  const posts = [
    {
       id: "12345",
       title: "First server-side post",
       message: "This is coming from the server"
    },
    {
      id: "12355",
      title: "Second server-side post",
      message: "This is also coming from the server"
   }
  ];
  // just by being the last in the chain it is returned.
  return res.status(200).json({
    msg: 'Posts feched succesfully!',
    posts: posts
  });
});

module.exports = app;
