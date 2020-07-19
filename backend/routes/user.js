const express = require("express");
const { createShorthandPropertyAssignment } = require("typescript");
const { route } = require("./posts");
const router = require("./posts");

router.post("/signup");

router.post("/signup", (req, res, next) => {
  
});

module.exports = router;
